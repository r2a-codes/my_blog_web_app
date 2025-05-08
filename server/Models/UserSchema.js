const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const Users = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile: {
      type: String,
      default: "",
    },
    cover: {
      type: String,
      default: "",
    },
    bios: {
      type: String ,
      default: "",
    },
    followers: {
      type: [String],
      default: [],
    },
    follows: {
      type: [String],
      default: [],
    },
    savedBlogs : {
      type : Array ,
      default : []
    },
    career : {
      type: String ,
      default: ""
    },
    birthday : {
      type: Date ,
      default: ""
    },
   
  },

  {
    timestamp: true,
  }
);

module.exports = model("Users", Users);
