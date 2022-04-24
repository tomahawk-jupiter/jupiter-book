const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { cloudinary } = require('../cloudinarySetup');

/// GET A USER ///
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json('User not found');
    }
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

/// GET SUGGESTED USERS - return limited amount ///
// Filter out friends and sent & received friend requests
router.get('/suggested/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const users = await User.find({}, '-password -updatedAt').limit(10);
    const filteredUsers = users.filter((u) => {
      return (
        u._id != userId &&
        !u.friends.includes(userId) &&
        !u.receivedRequests.includes(userId) &&
        !u.sentRequests.includes(userId)
      );
    });
    res.status(200).json(filteredUsers);
  } catch (err) {
    res.status(500).json(err);
  }
});

/// UPDATE USER ///
router.put('/:id', async (req, res) => {
  if (req.params.id === req.body.userId || req.body.idAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        res.status(500).json(err);
      }
    }
    try {
      /// Setup the newUser object here and use it to update the user ///
      const newData = req.body;
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json('This user does not exist');
      }

      /// ***** DEAL WITH BASE64 IMAGE FILE UPLOADS ***** ///

      /// PROFILE PICTURE ///
      if (req.body.profileBase64) {
        // Delete old cloudinary files if any //
        if (user.profilePicture.publicId) {
          const folderAndPublicId =
            'social_app/' + user.profilePicture.publicId;
          const cloudResult = await cloudinary.uploader.destroy(
            folderAndPublicId
          );
          if (cloudResult.result !== 'ok') {
            return res
              .status(500)
              .json(
                'Could not remove profile image from storage so stopped the update'
              );
          }
        }
        const uploadResponse = await cloudinary.uploader.upload(
          req.body.profileBase64,
          {
            upload_preset: 'social_app',
            width: 200,
            height: 200,
            crop: 'limit'
          }
        );
        // Use cloud response to add fields to newData for the DB update //
        newData.profilePicture = {
          url: uploadResponse.url,
          publicId: uploadResponse.public_id
        };
      }

      // BACKGROUND PICTURE - do all that again for bg image //
      if (req.body.backgroundBase64) {
        // Delete old cloudinary files if any //
        if (user.coverPicture.publicId) {
          const folderAndPublicId = 'social_app/' + user.coverPicture.publicId;
          const cloudResult = await cloudinary.uploader.destroy(
            folderAndPublicId
          );
          if (cloudResult.result !== 'ok') {
            return res
              .status(500)
              .json(
                'Could not remove cover image from storage so stopped the update'
              );
          }
        }
        const uploadResponse = await cloudinary.uploader.upload(
          req.body.backgroundBase64,
          {
            upload_preset: 'social_app',
            width: 1000,
            height: 1000,
            crop: 'limit'
          }
        );
        // Use cloud response to add fields to newData for the DB update //
        newData.coverPicture = {
          url: uploadResponse.url,
          publicId: uploadResponse.public_id
        };
      }

      // const updatedUser = await user.updateOne(newData, { new: true });
      const updatedUser = await User.findByIdAndUpdate(req.params.id, newData, {
        new: true
      });
      const { password, updatedAt, ...other } = updatedUser._doc;
      return res.status(200).json(other);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json('Account not found!');
  }
});

/// GET friends ///
router.get('/:id/friends', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const friends = await Promise.all(
      user.friends.map((friendId) => {
        return User.findById(friendId, '_id username location profilePicture');
      })
    );
    res.status(200).json(friends);
  } catch (err) {
    res.status(500).json(err);
  }
});

/// DELETE USER ///
router.delete('/:id', async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json('Account has been deleted');
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json('Account not found!');
  }
});

module.exports = router;
