const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const Blogs = new Schema(
  {
    author: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "Users",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: "",
    },
    likes: {
      type: [String],
      default: [],
    },
    comments: {
      type: Array,
      default: [],
    },
    savedBy: {
      type: Array,
      default: [],
    },
   
  },
  {
    timestamps: true,
  }
);

module.exports = model("Blogs", Blogs);
