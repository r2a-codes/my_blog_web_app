const cryptoJs = require("crypto-js");
const { error } = require("../Middlewares/errors");
const Blogs = require("../Models/BlogSchema");
const Users = require("../Models/UserSchema");

//* Get a User is Complete
const getUser = async (req, res, next) => {
  const { id } = req.params;
  const myId = req.user.id
  try {

    const myProfile = myId === id 

    const user = await Users.findById(id, ["-password"])
    const followedUser=  user.followers.map(id => (
      Users.findById(id, ["username", "profile" , "email"])
    ));

    const followers = await  Promise.all(followedUser)



    const allBlogs = await Blogs.find();

    const blogs = allBlogs.filter(blog => blog.author._id.toString() == id )
    const savedBlogs = allBlogs.filter(blog => {
      const inside = blog.savedBy.includes(id) 
      if(inside){
        return blog
      }})

    if (!user) return next(error(404, "sorry user not found"));
    
    myProfile  ? 
      res.status(200).json({ user, blogs, savedBlogs , followers}) :
      res.status(200).json({ user, blogs });
  } catch (err) {
    next(err);
  }
};

//* Update a User is Complete
const updateUser = async (req, res, next) => {
  const { password, newPassword, ...others } = req.body;
  const myId = req.user.id;
  try {
    const user = await Users.findById(myId);

    if (!user) return next(error(404, "sorry user not found "));

    if (password && password.trim() && newPassword && newPassword.trim()) {
      const decryptedPass = cryptoJs.AES.decrypt(
        user.password,
        process.env.CRYPTO_JS_SECRET
      ).toString(cryptoJs.enc.Utf8);

      const matchingPass = decryptedPass === password.trim();

      if (!matchingPass) return next(error(401, "sorry wrong credentials"));

      const hashedPass = cryptoJs.AES.encrypt(
        newPassword,
        process.env.CRYPTO_JS_SECRET
      ).toString();

      others.password = hashedPass;
    }

    await user.updateOne(others);

    res.status(200).json("user info update with success");
  } catch (err) {
    next(err);
  }
};

//* Delete a User is Complete
const deleteUser = async (req, res, next) => {
  const ownerId = req.user.id;

  try {
    await Users.findByIdAndDelete(ownerId);
    await Blogs.deleteMany({ author: ownerId });

    res.status(204).json("user delete with success");
  } catch (err) {
    next(err);
  }
};

//* Follow a User is Complete
const followUser = async (req, res, next) => {
  const { id } = req.params;
  const myId = req.user.id;

  try {
    const userToFollow = await Users.findById(id);
    const me = await Users.findById(myId);
    if (!userToFollow) return next(error(404, " sorry user not found "));

    const alreadyFollowed = userToFollow.followers.findIndex((p) => p == myId);
    const alreadyFollowing = me.follows.findIndex((p) => p == id);

    if (
      alreadyFollowed < 0 &&
      alreadyFollowed == -1 &&
      alreadyFollowing < 0 &&
      alreadyFollowing == -1
    ) {
      userToFollow.followers.push(myId);
      me.follows.push(id);
    } else {
      const unFollows = userToFollow.followers.filter((p) => p !== myId);
      const deFollows = me.follows.filter((p) => p !== id);

      userToFollow.followers = unFollows;
      me.follows = deFollows;
    }

    const userNewIntanceOfFollowers = await Users.findByIdAndUpdate(
      id,
      { $set: { followers: userToFollow.followers } },
      { new: true }
    );

    const userNewIntance = await Users.findByIdAndUpdate(
      myId,
      { $set: { follows: me.follows } },
      { new: true }
    );

    res.status(200).json({ userNewIntanceOfFollowers, userNewIntance });
  } catch (err) {
    next(err);
  }
};

module.exports = { getUser, updateUser, deleteUser, followUser };
