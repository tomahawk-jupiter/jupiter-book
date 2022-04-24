const router = require('express').Router();
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

/// POST a comment ///
router.put('/:postId/comment', async (req, res) => {
  try {
    const comment = new Comment({
      authorId: req.body.authorId,
      text: req.body.text
    });
    const savedComment = await comment.save();
    const post = await Post.findById(req.params.postId);
    await post.updateOne({ $push: { comments: savedComment._id } });
    res.status(200).json(savedComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

/// GET comments for a post ///
router.get('/:postId/comments', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    const comments = await Promise.all(
      post.comments.map((commentId) => {
        return Comment.findById(commentId);
      })
    );
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json(err);
  }
});

/// DELETE a comment ///
router.delete('/comments/:commentId', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (comment.authorId == req.body.authorId) {
      const post = await Post.findOne({
        $in: { comments: req.params.commentId }
      });

      await post.updateOne({ $pull: { comments: req.params.commentId } });
      await comment.deleteOne();
      res.status(200).json('Comment was deleted');
    } else {
      res.status(403).json('You can only delete your own comments');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
