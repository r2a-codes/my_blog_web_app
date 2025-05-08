const express = require("express")

const { getUser, updateUser, deleteUser, followUser } = require("../Controllers/user")

const {  verifyToken } = require("../Middlewares/jwt")

const router = express.Router()


router.get("/:id", verifyToken , getUser)
    .patch("/" , verifyToken ,updateUser)
    .delete("/" , verifyToken ,deleteUser)
    .patch("/:id" ,  verifyToken ,followUser)


module.exports = router