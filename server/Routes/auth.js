const express = require("express")
const { register, login, logout, refresh } = require("../Controllers/auth")
const { verifyRefreshToken } = require("../Middlewares/jwt")

const router = express.Router()


router.post("/register" , register)
    .post("/login" , login)
    .post("/logout" , logout)
    .get("/refresh" , verifyRefreshToken , refresh)


module.exports = router