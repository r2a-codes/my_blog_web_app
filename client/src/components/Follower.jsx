import React from 'react'
import { FaUser } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Follower = ({data}) => {
  return (
    <Link to={`/user_profile/${data._id}`} className='follow_wrapper'>
        {data.profile ? 
            <div className='follow_img_wrapper' >
                <img src={data.profile}/> 
            </div>  :
            <div className='follow_img_wrapper' >
                <FaUser className='img'/>
            </div>
        }
        <div className='follow_info_wrapper'>
            <span>{data.username}</span>
            <span>{data.email}</span>
        </div>
    </Link>
  )
}

export default Follower
