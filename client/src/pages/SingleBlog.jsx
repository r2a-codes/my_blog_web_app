import "../styles/singleBlog.css";
import Picker from "emoji-picker-react";
import { BiImage } from "react-icons/bi";
import { useEffect, useRef ,useState } from "react";
import { Link, useLocation,useNavigate } from "react-router-dom";
import {  useSelector} from "react-redux";
import {Comment , EditBlogModal} from "../components/";
import { FiEdit, FiThumbsUp, FiTrash , FiSave } from "react-icons/fi";
import useFetchBlogHook from "../hooks/useFetchBlogHook"
import {userDataSelector} from "../app/authSlice" 







const SingleBlog = () => {
  
  const id = useLocation().pathname.split("/")[2];
  const [blog, setBlog] = useState(null);
  const [liked , setLiked ] = useState(false);
  const [comments , setComments] = useState([]);
  const [commentValue, setCommentvalue] = useState("");
  const commentRef = useRef()
  const [openImoji, setOpenImoji] = useState(false);
  const {getBlogHook , likeBlogHook , deleteBlogHook , CommentBlogHook , saveBlogHook } = useFetchBlogHook() 
  const auth = useSelector(userDataSelector)
  const [saved , setSaved] = useState()
  const userInfo = auth?.payload?.userInfo
  const [openDialog , setOpenDialog ] = useState(false)


  const AllReadyLiked = (data, userId) => {
    
    const didLiked = data.includes( userId )

    if (didLiked){
      setLiked(true)
    }
  }
  const AllReadySaved = (data, userId) => {
    
    const didSaved = data?.includes( userId )

    console.log("from saved :::" , didSaved)

    if (didSaved){
      
      setSaved(true)
    }
  }




  useEffect(()=> {
    commentRef.current.scrollTop = commentRef.current.scrollHeight
  },[comments])

  useEffect(() => {

    const fetchSingleBlog = async () => {
      const data = await getBlogHook(id)


      setBlog(data)
      setComments(data?.comments)

      const userId = userInfo?._id  

      if(!userId)  return

      AllReadyLiked(data?.likes, userId )
      AllReadySaved(data?.savedBy , userId )
    };
    fetchSingleBlog();

  }, [id]);

  const onEmojiClick = (emojiObject , event) => {

    setCommentvalue(prev => prev + emojiObject.emoji )
    setOpenImoji(false)


  }
  
  
  const handleLike = async () => {
    await likeBlogHook(id)
    setLiked(!liked)
    
  }

  const handleSaved = async () => {
    await saveBlogHook(id)
    setSaved(!saved)
    
  }
  
  const handleDelete = async () => {
    await deleteBlogHook(id)

  }

  const handleComment = async() => {
    if(!commentValue) return 
    const userId = userInfo?._id 
    const _id = new Date()
    const newComment = {
      userId ,
      userProfile: userInfo?.profile,
      comment: commentValue,
      _id
    }

    await CommentBlogHook(id , commentValue )
    
    setComments([...comments ,newComment ])
    setCommentvalue("")

  }


  const handleOpenEditModal = () => {
    setOpenDialog(true)
   }


  
  return (

    <> 

    {openDialog && 
     <dialog >
      <EditBlogModal  blog={blog} setOpenDialog={setOpenDialog}/>
    </dialog>}
    
    
    <div className="single_blog_container">
       
      <div className="img_wrapper">
        {blog?.image ? (
          <img className="img" src={blog?.image} alt="" />
        ) : (
          <BiImage className="img" />
        )}
      </div>
      <div className="content_wrapper">
        <h3>
          Title : {"  "}
          <span>
            {blog?.title }
          </span>
        </h3>
        <h4>
          Author : {"  "}
          <Link to={`/user_profile/${blog?.author?._id}`} className="link singleBlog_user">
            {blog?.author?.username}
          </Link>
        </h4>
        <p className="desc">{blog?.description}</p>
        <fieldset>
          <legend>Comments</legend>
          <div className="comments" ref={commentRef}>
            {comments?.map((c, i) => (
              <Comment key={c._id + i} comment={c} />
            ))}
          </div>

          <div className="comment_input_wrapper">
            <input type="text" placeholder="Comment ..." value={commentValue} onChange={(e) => setCommentvalue(e.target.value)} />

            <button
              className="emoji_btn"
              onClick={(e) => setOpenImoji((prev) => !prev)}
            >
              😊
            </button>
            {openImoji && <div className="emoji_wrapper" >
                <Picker
                 open={openImoji} id="emojis" 
                //  reactionsDefaultOpen={true}
                onEmojiClick={onEmojiClick}
                 height={"100%"}
                 width = {"100%"} 
                 />
              </div>}
            <button className="sendBtn"  onClick={handleComment}>
              Send
            </button>
          </div>
        </fieldset>
        <div className="single_blog_Btns">
          <FiThumbsUp
            onClick={handleLike}
            className={`likeBtn ${liked ? "liked" : ""}`} />
          <div>
            { userInfo?._id === blog?.author?._id ?
             (<>
              <FiEdit className="editBtn" 
                onClick={handleOpenEditModal} />

              <FiTrash className="trashBtn" 
               onClick={handleDelete}
               />
                </>) :
                (<FiSave 
                  className={`saveBtn ${saved ? "saved" : ""}`}
                  onClick={handleSaved}
                  />) }
          </div>
        </div>
      </div>
    </div>
    </>

  );
};

export default SingleBlog;
