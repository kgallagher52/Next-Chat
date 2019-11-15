const mongoose = require('mongoose');
const User = mongoose.model('User'); //Using the mongoos singleten to refrence the user model

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

exports.getUserProfile = () => { };

exports.getUserFeed = () => { };

exports.uploadAvatar = () => { };

exports.resizeAvatar = () => { };

exports.updateUser = () => { };

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

exports.addFollowing = () => { };

exports.addFollower = () => { };

exports.deleteFollowing = () => { };

exports.deleteFollower = () => { };
