const express = require("express")
const {
    getAllBlogs,
    getBlog,
    createBlog,
    updateBlog,
    deleteBlog,
    likeBlog,
    commentBlog,
    saveBlog
  }= require("../Controllers/blogs")

const { verifyToken } = require("../Middlewares/jwt")

const router = express.Router()


router.get("/" , getAllBlogs)
    .get("/:id" , getBlog )
    .post("/" , verifyToken ,createBlog)
    .patch("/:id" , verifyToken , updateBlog)
    .delete("/:id" , verifyToken , deleteBlog)
    .patch("/like/:id" , verifyToken , likeBlog)
    .patch("/comment/:id" , verifyToken , commentBlog)
    .patch("/save/:id" , verifyToken , saveBlog )

    

module.exports = router