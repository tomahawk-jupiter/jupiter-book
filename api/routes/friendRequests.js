const router = require('express').Router();
const User = require('../models/user');

/// Make a friend request to a USER ///
router.put('/:id/friend-request', async (req, res) => {
  if (req.params.id !== req.body.userId) {
    try {
      const friendUser = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (
        friendUser.receivedRequests.includes(req.body.userId) ||
        friendUser.sentRequests.includes(req.body.userId)
      ) {
        return res
          .status(403)
          .json('Either you or this user already sent a request to the other!');
      }

      await friendUser.updateOne({
        $push: { receivedRequests: req.body.userId }
      });
      await currentUser.updateOne({
        $push: { sentRequests: req.params.id }
      });
      res
        .status(200)
        .json(`Your friend request to ${friendUser.username} was successful`);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json('You cannot send a friend request to yourself!');
  }
});

/// GET all recieved requests for a user ///
router.get('/:userId/received-requests', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const requests = await Promise.all(
      user.receivedRequests.map((friendId) => {
        return User.findById(friendId, '_id username location profilePicture');
      })
    );
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json(err);
  }
});

/// GET all sent requests for a user ///
router.get('/:userId/sent-requests', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const sentRequests = await Promise.all(
      user.sentRequests.map((friendId) => {
        return User.findById(friendId, '_id username location profilePicture');
      })
    );
    res.status(200).json(sentRequests);
  } catch (err) {
    res.status(500).json(err);
  }
});

/// Accept a friend request from a USER ///
router.put('/:id/accept', async (req, res) => {
  if (req.params.id === req.body.userId) {
    return res.status(403).json('You cannot accept a request from yourself');
  }
  try {
    const friendUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.userId);

    if (!currentUser.receivedRequests.includes(req.params.id)) {
      return res
        .status(403)
        .json('Friend request not found, the other user may have cancelled it');
    }
    await friendUser.updateOne({
      $pull: { sentRequests: req.body.userId },
      $push: { friends: req.body.userId }
    });
    await currentUser.updateOne({
      $pull: { receivedRequests: req.params.id },
      $push: { friends: req.params.id }
    });
    res
      .status(200)
      .json(`You have accepted a friend request from ${friendUser.username}`);
  } catch (err) {
    res.status(500).json(err);
  }
});

/// Cancel a sent (and received) friend request ///
router.put('/:id/cancel', async (req, res) => {
  try {
    const friendUser = await User.findByIdAndUpdate(req.params.id, {
      $pull: { receivedRequests: req.body.userId }
    });
    await User.findByIdAndUpdate(req.body.userId, {
      $pull: { sentRequests: req.params.id }
    });
    res
      .status(200)
      .json(`You cancelled a friend request to ${friendUser.username}`);
  } catch (err) {
    res.status(500).json(err);
  }
});

/// Un-friend a USER ///
router.put('/:id/unfriend', async (req, res) => {
  try {
    const friendUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.userId);

    if (
      !friendUser.friends.includes(req.body.userId) &&
      !currentUser.friends.includes(req.params.id)
    ) {
      return res
        .status(200)
        .json('This user is not in your friend list nor you in theirs');
    }
    await friendUser.updateOne({
      $pull: { friends: req.body.userId }
    });
    await currentUser.updateOne({
      $pull: { friends: req.params.id }
    });
    res.status(200).json(`You unfriended ${friendUser.username}`);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
