const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommentSchema = new Schema(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      max: 500
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', CommentSchema);
