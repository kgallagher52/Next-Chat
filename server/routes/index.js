const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const postController = require("../controllers/postController");

const router = express.Router();

/* Error handler for async / await functions */
const catchErrors = fn => {
  return function (req, res, next) {
    return fn(req, res, next).catch(next);
  };
};

/**
 * AUTH ROUTES: /api/auth
 */
router.post(
  "/api/auth/signup",
  authController.validateSignup,
  catchErrors(authController.signup)
);
router.post("/api/auth/signin", authController.signin);
router.get("/api/auth/signout", authController.signout);

/**
 * USER ROUTES: /api/users
 */

//router.param convinence method that allows us to get the user by id from url
router.param("userId", userController.getUserById);

router.put( // These routes need to be placed befoer the :userId so that it checks the follow and unfollow
  "/api/users/follow",
  authController.checkAuth,
  catchErrors(userController.addFollowing),
  catchErrors(userController.addFollower)
);

router.put(
  "/api/users/unfollow",
  authController.checkAuth,
  catchErrors(userController.deleteFollowing),
  catchErrors(userController.deleteFollower)
);

router// Router methods
  .route("/api/users/:userId")
  .get(userController.getAuthUser)
  .put(
    authController.checkAuth, //Check if authenticated
    userController.uploadAvatar, //Upload avatar if they provide one
    catchErrors(userController.resizeAvatar), // Resizie the img
    catchErrors(userController.updateUser) // Update user profile
  )
  .delete(authController.checkAuth, catchErrors(userController.deleteUser));

router.get("/api/users", userController.getUsers);
router.get(
  "/api/users/profile/:userId",
  userController.getUserProfile //Dont need catchErrors because we are adding to our get userProfile in getUserById
);
router.get(
  "/api/users/feed/:userId",
  authController.checkAuth,
  catchErrors(userController.getUserFeed)
);


/**
 * POST ROUTES: /api/posts
 */
router.param("postId", postController.getPostById);

router.put(
  "/api/posts/like",
  authController.checkAuth,
  catchErrors(postController.toggleLike)
);
router.put(
  "/api/posts/unlike",
  authController.checkAuth,
  catchErrors(postController.toggleLike)
);

router.put(
  "/api/posts/comment",
  authController.checkAuth,
  catchErrors(postController.toggleComment)
);
router.put(
  "/api/posts/uncomment",
  authController.checkAuth,
  catchErrors(postController.toggleComment)
);

router.delete(
  "/api/posts/:postId",
  authController.checkAuth,
  catchErrors(postController.deletePost)
);

router.post(
  "/api/posts/new/:userId",
  authController.checkAuth, // Run as middleware to check if a user is signed in
  postController.uploadImage, //Uploading image if we have one
  catchErrors(postController.resizeImage), //Resizing if we have one
  catchErrors(postController.addPost) //Update the post
);
router.get("/api/posts/by/:userId", catchErrors(postController.getPostsByUser));
router.get("/api/posts/feed/:userId", catchErrors(postController.getPostFeed));

module.exports = router;
