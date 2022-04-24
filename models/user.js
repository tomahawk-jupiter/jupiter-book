const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      min: 3,
      max: 20,
      unique: true
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true
    },
    password: {
      type: String,
      required: true,
      min: 1
    },
    profilePicture: {
      url: { type: String, default: null },
      publicId: { type: String, default: null }
    },
    coverPicture: {
      url: { type: String, default: null },
      publicId: { type: String, default: null }
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    location: {
      type: String,
      max: 20
    },
    friends: {
      type: Array,
      default: []
    },
    sentRequests: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    receivedRequests: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
