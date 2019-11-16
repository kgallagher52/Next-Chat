const mongoose = require('mongoose');
const User = mongoose.model('User'); //Using the mongoos singleten to refrence the user model
const multer = require('multer'); //For bringing in images
const jimp = require('jimp'); // For resizing and saving the image to static folder 

exports.getUsers = async (req, res) => {
    const user = await User.find().select('_id name email createdAt updatedAt')
    res.json(user);
};

exports.getAuthUser = (req, res) => {
    if (!req.isAuthUser) {
        res.status(403).json({
            message: "You are unauthenticated. Please Sign in or Sign up"
        })
        return res.redirect('/signin');
    }
    //If is true
    res.json(req.user);
};

exports.getUserById = async (req, res, next, id) => {
    const user = await User.findOne({ _id: id }) //We want to specifically find a user with the matching id passed from our controllers
    //If we find a user we want to put it on the profile property
    req.profile = user;

    //Comparing our two ObjectId's to see if the user matches the currently logged in user
    const profileId = mongoose.Types.ObjectId(req.profile._id)

    if (profileId.equals(req.user._id)) { //Currently authenticated user
        //Set the user flag to true
        req.isAuthUser = true;
        return next();
    }
    next();
};

exports.getUserProfile = (req, res) => {
    if (!req.profile) {
        return res.status(404).json({
            message: 'No user found!'
        })
    }
    res.json(req.profile)
};

exports.getUserFeed = async (req, res) => {
    //We want to only grab users that we are not following and including ourself
    const { following, _id } = req.profile;
    //Push our id onto this following so we don't get our profile in the query
    following.push(_id);
    //$nin - not in array operator
    const users = await User.find({ _id: { $nin: following } })
        .select('_id name avatar')
    res.json(users);
};

//Add a configuration options for the avatar using multer package
const avatarUploadOptions = {
    //Specify storage
    storage: multer.memoryStorage(),
    //Set a limit to size
    limits: {
        // This is in bytes and we want to make it 1mb
        fileSize: 1024 * 1024 * 1,
    },
    //File filter function check the file type
    fileFilter: (req, file, next) => {
        //If the file is an image
        if (file.mimetype.startsWith('image/')) {
            //To move on we pass in true, the null would be the message we wanted to pass to the next function
            next(null, true)
        } else {
            next(null, false)
        }
    }

}
//singe method has to match the name of the request body
exports.uploadAvatar = multer(avatarUploadOptions).single('avatar');

exports.resizeAvatar = async (req, res, next) => {
    //Multer automatically puts the file on the req.file property
    if (!req.file) {
        return next(); // Move on to update user if there is not an avatar
    }

    const extension = req.file.mimetype.split('/')[1]; // Get second element
    req.body.avatar = `/public/static/uploads/avatars/${req.user.name}-${Date.now()}.${extension}`
    //jimp package brought in
    const image = await jimp.read(req.file.buffer)
    //Resize
    await image.resize(250, jimp.AUTO)
    //Write to file using realative path
    await image.write(`./${req.body.avatar}`)
    next();
};

exports.updateUser = async (req, res) => {
    req.body.updatedAt = new Date().toISOString();
    const updatedUser = await User.findOneAndUpdate(
        { _id: req.user._id },
        //Set operator to put any data onto the body of the user we are sending
        { $set: req.body },
        //Getting updated user runValidators will re run validation so it will check and make sure
        //We are not returning incorrect data 
        { new: true, runValidators: true }
    )
    res.json(updatedUser)
};

exports.deleteUser = async (req, res) => {
    const { userId } = req.params;
    if (!req.isAuthUser) { // Which we are handling the isAuthUser under the getUserById function
        return res.status(400).json({
            message: "You are not authorized to perform this action."
        })
    }
    const deletedUser = await User.findOneAndDelete({ _id: userId });
    res.json(deletedUser);
};

exports.addFollowing = async (req, res, next) => {
    const { followId } = req.body;
    // The $push allows us to push onto an array just like what we would do with javascript
    await User.findOneAndUpdate(
        { _id: req.user._id }, //Get the current user
        {
            $push: { following: followId } // Push the follower onto the the following array of the current user
        }
    )
    next(); //Move to addFollower
};

exports.addFollower = async (req, res) => {
    const { followId } = req.body;
    const user = await User.findOneAndUpdate(
        { _id: followId }, //Getting the user following
        { $push: { followers: req.user._id } }, //Pushing onto the user being followd under the followers array
        { new: true } //Get the latest records from the DB

    )
    res.json(user)
};

exports.deleteFollowing = async (req, res, next) => {
    const { followId } = req.body;
    await User.findOneAndUpdate(
        { _id: req.user._id }, //Get the current user
        {
            $pull: { following: followId }
        }
    )
    next();

};

exports.deleteFollower = async (req, res) => {
    const { followId } = req.body;
    const user = await User.findOneAndUpdate(
        { _id: followId }, //Getting the user following
        { $pull: { followers: req.user._id } },
        { new: true } //Get the latest records from the DB

    )
    res.json(user)
};
