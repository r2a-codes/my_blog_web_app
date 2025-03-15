import React from 'react'
import { FaUser } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Follower = ({data , setElement}) => {
  return (
    <Link to={`/user_profile/${data._id}`} className='follow_wrapper' onClick={() => {setElement("my_blogs")}}>
        <div className='follow_left_section'>
            <div className='follow_img_wrapper' >
                {data.profile ? 
                    <img src={data.profile}/> :
                    <FaUser className='img'/>
                }
            </div>
            <div className='follow_info_wrapper'>
                <span>{data.username}</span>
                <span>{data.email}</span>
            </div>
        </div>

        <div className='unfollowBtn_wrapper'><button className='unfollowBtn'>unfollow</button></div>
    </Link>
  )
}

export default Follower
