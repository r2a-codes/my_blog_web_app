import "../styles/userProfile.css";
import profile from "../assets/profile.jpg";
import cover from "../assets/cover.jpg";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Blog } from "../components/";
import { useSelector } from "react-redux";
import { userDataSelector } from "../app/authSlice";
import useFetchUserHook from "../hooks/useFetchUserHook";
import Follower from "../components/Follower";
import moment from "moment"
import { toast } from "react-toastify";


const UserProfile = () => {
  const {getUserHook , followUserHook} = useFetchUserHook()
  const user = useSelector(userDataSelector)
  const me = user.payload.userInfo._id
  const [userData, setUserData] = useState();
  const [blogsData, setBlogsData] = useState([]);
  const [savedBlogsData, setSavedBlogsData] = useState([]);
  const [followersData, setFollowersData] = useState([]);
  const [element, setElement] = useState("my_blogs");
  const [follow, setFollow] = useState(false);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [loading, setLoading] = useState(false)

  const checkFollowFunc = (myId , followersList) => {
    const alreadyFollowed = followersList.includes(myId)

    if( alreadyFollowed){
      setFollow(true)
    }
  }



  useEffect(() => {

    setLoading(true)

    const fetchUser = async () => {
      try {
        const data  = await getUserHook(id);

        setUserData(data?.user);
        checkFollowFunc(me , data.user.followers)
        setBlogsData(data?.blogs);
        setSavedBlogsData(data?.savedBlogs)
        setFollowersData(data?.followers)
        setLoading(false)
      } catch (err) {
        toast.error(err.response.data.message)
      }
    };

    fetchUser();
  }, [id]);



  const handleChangeSections = (e) => {
    const headerName = e.target.name
    setElement(headerName)
  }

  const handleFollow = async ()=> {
    await followUserHook(id)
    setFollow(!follow)
  }

  return (
    <>{ loading ? <div><h2>loading ...</h2></div> : 
    <div className="user_profile_container">
      <div className="user_profile_wrapper">
        <div className="img_wrapper">
          <img src={cover} alt="user_cover" />

          <img src={profile} alt="user_profile" />
        </div>

        <div className="user_details">
          <div className="upper_details">

            <h4>Username : {userData?.username}</h4>
            <h4>Email : {userData?.email}</h4>
            {userData?.birthday && <h5> Birthday : {moment(userData.birthday).format("LL")}</h5>}
            {userData?.career  && <h5>Career : {userData.career  } </h5>}
            {userData?.birthday && <div>
              <h6>Bios</h6> : <p>{userData.bios} </p>
            </div>}

          </div>
          <div className="follower_wrapper">
            {userData?.followers && <h6>{userData.followers.length} followers</h6>}
            {me !== userData?._id && <button onClick={handleFollow}>{follow ? "unfollow":"follow"}</button>}
          </div>
        </div>
      </div>
      <div className="user_blogs_header_wrapper">
       

        <button name="my_blogs" 
          className={element == "my_blogs" ? "activeHeader" : ""} 
         onClick={handleChangeSections}>My_Blogs</button>


        {me == userData?._id &&( <>
        <button name="saved_blogs"
        className={element == "saved_blogs" ? "activeHeader" : ""}
        onClick={handleChangeSections}>Saved_Blogs</button>
        <button name="followers"
        className={element == "followers" ? "activeHeader" : ""}
        onClick={handleChangeSections}>Followers</button>
        </>)
        }
      </div>
      
      {element == "my_blogs" ? 
        <div className="user_blogs_wrapper">
          {blogsData.length ? (
            blogsData.map((blog) => <Blog key={blog._id} data={blog} />)
          ) : (
            <p>Sorry No content to display ...</p>
          )}

      </div> : 
      
      element == "saved_blogs" && me == userData?._id  ?
        <div className="user_blogs_wrapper" >
          {savedBlogsData.length > 0 && savedBlogsData.map(blog => (
            <Blog key={blog._id} data={blog} />
          ))
        }
        </div> : 
        element == "followers" && me == userData?._id ?
        <div className="user_blogs_wrapper">
         { followersData.length > 0 && followersData.map(fol => (
            <Follower key={fol._id} data={fol} />
         ))}
        </div> : ""
      }
    </div>}
    </>
  );
};

export default UserProfile;
