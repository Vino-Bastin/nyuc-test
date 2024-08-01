const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: true,
      unique: true,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

const Gallery = mongoose.model("Gallery", gallerySchema);
module.exports = Gallery;
