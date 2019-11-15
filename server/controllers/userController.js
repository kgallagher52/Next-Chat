const mongoose = require('mongoose');
const User = mongoose.model('User'); //Using the mongoos singleten to refrence the user model

exports.getUsers = async (req, res) => {
    const user = await User.find().select('_id name email createdAt updatedAt')
    res.json(user);
};

exports.getAuthUser = () => { };

exports.getUserById = () => { };

exports.getUserProfile = () => { };

exports.getUserFeed = () => { };

exports.uploadAvatar = () => { };

exports.resizeAvatar = () => { };

exports.updateUser = () => { };

exports.deleteUser = () => { };

exports.addFollowing = () => { };

exports.addFollower = () => { };

exports.deleteFollowing = () => { };

exports.deleteFollower = () => { };
