const mongoose = require('mongoose');
const Post = mongoose.model('Post'); //Using the mongoos singleten to refrence the Post model
const multer = require('multer'); //For bringing in images
const jimp = require('jimp'); // For resizing and saving the image to static folder 


//Add a configuration options for the image using multer package
const imageUploadOptions = {
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

exports.uploadImage = multer(imageUploadOptions).single('image');

exports.resizeImage = async (req, res, next) => {
    //Multer automatically puts the file on the req.file property
    if (!req.file) {
        return next(); // Move on to update user if there is not an avatar
    }

    const extension = req.file.mimetype.split('/')[1]; // Get second element
    req.body.image = `/public/static/uploads/${req.user.name}-${Date.now()}.${extension}`
    //jimp package brought in
    const image = await jimp.read(req.file.buffer)
    //Resize
    await image.resize(750, jimp.AUTO)
    //Write to file using realative path
    await image.write(`./${req.body.image}`)
    next();
};

exports.addPost = async (req, res) => {
    req.body.postedBy = req.user._id;
    //Call .save to persist it to the DB
    const post = await new Post(req.body).save();
    await Post.populate(post, { //Populate grabs the post and makes it show on the ux almost as if you where using websockets
        path: 'postedBy',
        select: '_id name avatar' //What we want it to return
    })
    res.json(post);
};

exports.deletePost = async (req, res, next) => {

};

exports.getPostById = async (req, res, next) => {

};

exports.getPostsByUser = async (req, res) => {
    //Sort if they have multiple doing most recent posts first
    const posts = await Post.find({ postedBy: req.profile._id }).sort({
        createdAt: "desc"
    });
    res.json(posts);
};

exports.getPostFeed = async (req, res) => {
    const { following, _id } = req.profile;
    //Refer to userFeed if you are confused
    following.push(_id);
    const posts = await Post.find({ postedBy: { $in: following } }).sort({
        createdAt: "desc"
    })
    res.json(posts);
};

exports.toggleLike = async (req, res) => {
    const { postId } = req.body;

    const post = await Post.findOne({ _id: postId }); // Get post
    const likedIds = post.likes.map(id => id.toString()); //Get liked posts and convert to string
    const authUserId = req.user._id.toString();  //Get othe user posts to string

    if (likedIds.includes(authUserId)) {
        await post.likes.pull(authUserId);
    } else {
        await post.likes.push(authUserId);
    }
    await post.save();
    res.json(post);
};

exports.toggleComment = async (req, res, next) => {

};
