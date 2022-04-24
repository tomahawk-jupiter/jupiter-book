const router = require('express').Router();
const Post = require('../models/post');
const User = require('../models/user');
const { cloudinary } = require('../cloudinarySetup');

/// CREATE A NEW POST - with or without an image file ///
router.post('/', async (req, res) => {
  try {
    if (req.body.base64Img) {
      /// Image included ///
      // const { base64Img, ...other } = req.body;
      const { authorId, text, base64Img } = req.body;

      // Upload image to cloudinary //
      const uploadResponse = await cloudinary.uploader.upload(base64Img, {
        upload_preset: 'social_app',
        width: 1000,
        height: 1000,
        crop: 'limit'
      });
      // Use the cloudinary url in DB //
      const newPost = new Post({
        authorId,
        text,
        img: { url: uploadResponse.url, publicId: uploadResponse.public_id }
      });
      const savedPost = await newPost.save();
      return res.status(200).json(savedPost);
    }
    // Add post to db without image url //
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

/// GET A SINGLE POST ///
router.get('/:postId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

/// **** NOT CURRENTLY USED BY CLIENT ///
/// EDIT A POST ///
// router.put('/:postId', async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.postId);

//     /// Does the post belong to the user? ///
//     if (post.authorId == req.body.authorId) {
//       await post.updateOne({ $set: req.body });
//       res.status(200).json('The post was updated');
//     } else {
//       res.status(403).json('You can only update your own posts');
//     }
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

/// LIKE A POST ///
router.put('/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    /// Has the user already liked this post? ///
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json('The post was liked');
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json('The post was unliked');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

/// GET ALL POSTS FOR A SINGLE USER ///
router.get('/author/:authorId', async (req, res) => {
  try {
    const posts = await Post.find({ authorId: req.params.authorId });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

/// GET ALL POSTS FOR A USER AND ALL THEIR FRIENDS ///
router.get('/timeline/:userId', async (req, res) => {
  try {
    const userPosts = await Post.find({ authorId: req.params.userId });
    const user = await User.findById(req.params.userId);
    const friendPosts = await Promise.all(
      user.friends.map((friendId) => {
        return Post.find({ authorId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).json(err);
  }
});

/// DELETE A POST ///
/**
 * All comments must also be removed from DB
 * for the post being deleted.
 * Also image must be removed from cloudinary
 * before removing post from DB.
 * Delete the post from DB last.
 */
router.delete('/:postId', async (req, res) => {
  try {
    console.log(req.params.postId);
    console.log(req.body.userId);
    const post = await Post.findById(req.params.postId);
    console.log(post);

    if (post.authorId == req.body.userId) {
      // If no public id, no image in cloudinary
      // so delete comments and post then return res.
      if (!post.img.publicId) {
        await post.comments.forEach((comment) => {
          Comment.findByIdAndDelete(comment._id);
        });
        await post.deleteOne();
        return res.status(200).json('The post was deleted');
      }

      // If it gets this far, there is an image in cloudinary //
      const cloudResult = await cloudinary.uploader.destroy(post.img.publicId);
      if (cloudResult.result === 'ok') {
        await post.comments.forEach((comment) => {
          Comment.findByIdAndDelete(comment._id);
        });
        await post.deleteOne();
        return res.status(200).json('The post was deleted');
      }
      return res
        .status(500)
        .json(
          'The image was not removed from storage so the post was not deleted'
        );
    } else {
      res.status(403).json('You can only delete your own posts');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
