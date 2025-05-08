const { error } = require("../Middlewares/errors");
const Blogs = require("../Models/BlogSchema");
const Users = require("../Models/UserSchema");

const getAllBlogs = async (req, res, next) => {

  const { title , category } = req.query
  

  const rTitle = RegExp(title, "i")
  const rCat = RegExp(category, "i")
  
  try {

    if( title || category ){

      const blogs = await Blogs.find({ title : rTitle , category: rCat})
        .sort({ updatedAt: -1 })
        .populate("author", ["profile", "username"]);
 
        res.status(200).json(blogs);

      }else {

        const blogs = await Blogs.find()
          .sort({ updatedAt: -1 })
          .populate("author", ["profile", "username"]);

        res.status(200).json(blogs);
    }
  } catch (err) {
      next(err);
  }
};

//* Get a single Blog is Complete
const getBlog = async (req, res, next) => {
  try {
    const blog = await Blogs.findById(req.params.id).populate("author", [
      "profile",
      "username",
    ]);

    if (!blog) return next(error(404, "sorry blog not found"));

    res.status(200).json(blog);
  } catch (err) {
    next(err);
  }
};

//* Create Blog is Complete
const createBlog = async (req, res, next) => {
  const { title, description, image, category } = req.body;
  const { id } = req.user;
  try {
    if (!req.user)
      return next(error(401, "please try to signIn to create a blog"));

    const newBlog = await Blogs.create({
      author: id,
      title,
      description,
      image,
      category,
    });

    res.status(201).json(newBlog);
  } catch (err) {
    next(err);
  }
};

//* Update Blog is Complete
const updateBlog = async (req, res, next) => {
  const { id } = req.params;
  const ownerId = req.user.id;

  try {
    const blog = await Blogs.findById(id);
    if (!blog) return next(error(404, "sorry blog not found"));

    if (blog.author.toString() !== ownerId)
      return next(
        error(403, "your not authorize to do any Update to this blog")
      );

    await blog.updateOne({ $set: req.body }, {new: true});

    res.status(200).json("blog updated with success");
  } catch (err) {
    next(err);
  }
};

//* Delete Blog is complete
const deleteBlog = async (req, res, next) => {
  const { id } = req.params;
  const ownerId = req.user.id;
  try {
    const blog = await Blogs.findById(id);

    if (!blog) return next(error(404, " sorry blog not found "));

    if (ownerId !== blog.author.toString())
      return next(error(403, "your not authorize to delete this Blog"));

    await blog.deleteOne();

    res.status(200).json("blog delete with success");
  } catch (err) {
    next(err);
  }
};

//* Like Blog is complete

const likeBlog = async (req, res, next) => {
  const { id } = req.params;
  const likerId = req.user.id;

  try {
    const blog = await Blogs.findById(id);
    if (!blog) return next(error(404, " sorry blog not found "));

    const alreadyLiked = blog.likes.findIndex((p) => p == likerId);

    if (alreadyLiked < 0 && alreadyLiked == -1) {
      blog.likes.push(likerId);
    } else {
      const unLiked = blog.likes.filter((p) => p !== likerId);
      blog.likes = unLiked;
    }

    const blogNewIntance = await Blogs.findByIdAndUpdate(
      id,
      { $set: { likes: blog.likes } },
      { new: true , timestamps:false }
    );
    
    res.status(200).json(blogNewIntance);
  } catch (err) {
    next(err);
  }
};

//* Comment Blog is complete

const commentBlog = async (req, res, next) => {
  const { id } = req.params;
  const { comment , _id } = req.body;
  const committerId = req.user.id;

  try {
    const blog = await Blogs.findById(id);
    const me = await Users.findById(committerId);
    if (!blog) return next(error(404, " sorry blog not found "));

    const newComments = {
      comment,
      committerId: me._id,
      profile: me.profile,
      _id
    };

    const blogNewIntance = await Blogs.findByIdAndUpdate(
      id,
      { $push: { comments: newComments } },
      { new: true , timestamps:false}
    );

    res.status(200).json(blogNewIntance);
  } catch (err) {
    next(err);
  }
};

//! to see later

/*const deleteComment = async (req, res, next) => {
  const { id } = req.params;
  const { comment } = req.body;
  const committerId = req.user.id;

  try {
    const blog = await Blogs.findById(id);
    const me = await Users.findById(committerId);
    if (!blog) return next(error(404, " sorry blog not found "));

    const newComments = {
      comment,
      committerId: me._id,
      profile: me.profile,
    };

    const blogNewIntance = await Blogs.findByIdAndUpdate(
      id,
      { $push: { comments: newComments } },
      { new: true }
    );

    res.status(200).json(blogNewIntance);
  } catch (err) {
    next(err);
  }
};*/





//* Save blog in progress  
const saveBlog = async (req , res , next) => {

  const id = req.params.id
  const myId = req.user.id


  try {
    const blog = await Blogs.findById(id);
    const user = await Users.findById(myId)

    if (!blog) return next(error(404, " sorry blog not found "));
    if (!user) return next(error(404, " sorry user not found "));

    const myBlog = blog.author._id.toString() === myId
    console.log(myBlog)

    if (myBlog) return next(error(404, " sorry you can not add a safe on you own blog "));



    const alreadySaved = user?.savedBlogs.findIndex((p) => p == id);

    if (alreadySaved < 0 && alreadySaved == -1 ) {
      user?.savedBlogs.push(id);
      blog?.savedBy.push(myId);

    } 
    else {
      const unSaveUser = user?.savedBlogs.filter((p) => p !== id);
      const unSaveBlog = blog?.savedBy.filter((p) => p !== myId);
      user.savedBlogs = unSaveUser ;
      blog.savedBy = unSaveBlog ;
    }

    const userNewIntance = await Users.findByIdAndUpdate(
      {_id : myId},
      { $set: { savedBlogs: user.savedBlogs } },
      { new: true , timestamps:false }
    );

    const blogNewIntance = await Blogs.findByIdAndUpdate(
      {_id: id},
      { $set: { savedBy: blog.savedBy } },
      { new: true , timestamps:false }
    );
    
    res.status(200).json({user:userNewIntance  , blog: blogNewIntance});

    
  } catch (err) {
    next(err)
  }


}

module.exports = {
  getAllBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  commentBlog,
  saveBlog
};
