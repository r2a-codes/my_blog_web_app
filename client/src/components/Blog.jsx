import "../styles/blogs.css";
import moment from "moment";
import { FaImage } from "react-icons/fa";
import { FiThumbsUp } from "react-icons/fi";
import { Link, Links } from "react-router-dom";
import { userDataSelector, userStateSelector } from "../app/authSlice";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import useFetchBlogHook from "../hooks/useFetchBlogHook"


const Blog = ({ data }) => {
  const {isLoading , userData , headerAuth} = useSelector(userStateSelector);
  const auth = userData?.payload?.userInfo?._id
  const {likeBlogHook } = useFetchBlogHook()

  const format = Intl.NumberFormat("en", { notation: "compact" });
  let likes = format.format(data?.likes?.length);
  const [likesArr , setLikesArr] = useState(likes)
  const [iLiked, setILiked] = useState(false); 

  
  

  useEffect(() => {
   
      let liked = data?.likes.includes(auth);

      if(liked){
      setILiked(liked);
      
    }

  }, [iLiked]);

  const handleLike = async () => {

    const id = data?._id
    await likeBlogHook(id)
    setILiked(!iLiked)

    if(iLiked){
      console.log(likesArr)
      setLikesArr(Number(likesArr) - 1)
    }
    else {
      
      setLikesArr(Number(likesArr) + 1)
    }
  }


  
  return (
    <li  className="blog_wrapper">
      <Link to={`/single_blog/${data._id}`} className="image_wrapper">
        {data.image ? (
          <img src={data.image} alt="blog_img" className="img" />
        ) : (
          <FaImage className="img" />
        )}
      </Link>
      <div className="content_wrapper">
        <div className="author_wrapper">
          <Link
            to={`/user_profile/${data.author?._id}`}
            className="link author_name"
          >

            {data.author?.username}
          </Link>
          <span>{moment(data.createdAt).from()}</span>
        </div>
        <Link to={`/single_blog/${data._id}`} className="link blog_title">
          {data.title}
        </Link>
        <p className="blog_description">
         {data?.description}
        </p>

        <div className="category_wrapper">
          {data.category.map((cat , i)=> (
              <span key={i}>#{cat}</span>

            ))}

        </div>

        { headerAuth && <div className="like_wrapper">
          <FiThumbsUp className={iLiked && " liked"}  onClick={handleLike}/>
          <span> {likesArr} likes </span>
        </div>}
      </div>
    </li>
  );
};

export default Blog;
