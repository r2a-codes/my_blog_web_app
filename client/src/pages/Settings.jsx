import "../styles/settings.css";
import { useSelector } from "react-redux";
import {useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import {  FaUpload, FaUser } from "react-icons/fa";
import { userDataSelector } from "../app/authSlice";
import useAxiosPrivateHook from "../hooks/useAxiosPrivateHook";
import useFetchUserHook from "../hooks/useFetchUserHook";
import axios from "axios";




const initials = {
  username: "",
  email: "",
  password: "",
  newPassword: "",
  confirm: "",
  bios: "",
  career: "",
  birthday: "",
};

const Settings = () => {
  const navigate = useNavigate()
  const privateAxios = useAxiosPrivateHook()
  const {updateUserHook} = useFetchUserHook()
  const [formInputs, setFormInputs] = useState(initials);
  const user = useSelector(userDataSelector)
  const  [userInfo , setUserInfo ] = useState()
  const  [profile , setProfile] = useState()
  const  [cover , setCover ] = useState()
  const  [clicked , setClicked] = useState(false)


  useEffect(() => {
    const fetchUser = async () => {
      
      const id = user?.payload?.userInfo._id
      const {data} = await privateAxios.get(`user/${id}`)
     
      setUserInfo(data?.user)
    }
    fetchUser()
  },[])

  



  const handleChange = (e) => {
    setFormInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpload = async (image) => {
    const cloud_name = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const formdata = new FormData()

    formdata.append('file' , image)
    formdata.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
    
    
    const {data} = await axios.post(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload` , formdata )

    return data?.url
   

  }; 



  const handleSubmit = async (e) => {
    e.preventDefault();

    setClicked(true)

    if(profileImage?.acceptedFiles[0] ){
      const img = await handleUpload( profileImage.acceptedFiles[0])
      setProfile(img)
    }
    
    if(coverImage.acceptedFiles[0]){
      const img = await handleUpload(coverImage.acceptedFiles[0])
      setCover(img)
      
     }
  

    let data = {
      ...(profile && { profile }),
      ...(cover && { cover }),
      ...(formInputs.username && { username: formInputs.username }),
      ...(formInputs.email && { email: formInputs.email }),
      ...(formInputs.career && { career: formInputs.career }),
      ...(formInputs.bios && { bios: formInputs.bios }),
      ...(formInputs.birthday && { birthday: formInputs.birthday }),
      ...(formInputs.password && { password: formInputs.password }),
      ...(formInputs.newPassword && { newPassword: formInputs.newPassword }),
    }

    
    if(Object.keys(data).length === 0){
      setClicked(false)
      return
    }


    await updateUserHook(data)

    setFormInputs(initials)
    data = {}

    setClicked(false)

    navigate("/")
    
  }



const time = () => {
  const timeVal = userInfo?.birthday?.split("T")[0]
  return timeVal
}

const onDrop = useCallback((acceptedFiled) => {}, []);


const coverImage = useDropzone(onDrop)

const profileImage = useDropzone(onDrop);


  return (
    <div className="setting_container">
    
      <div className="setting_imgs_wrapper">
        <div className="setting_profile_wrapper" {...profileImage.getRootProps()}>
          {profileImage.acceptedFiles.length ? (
            <img src={URL.createObjectURL(profileImage.acceptedFiles[0])} alt="" />
          ) : userInfo?.profile ? (
            
            <img src={userInfo?.profile} alt="user_Cover_image" />
          ):(
            <FaUser className="user_icon" />
          )}
          <label className="profilers">
            <FaUpload className="fa_upload" />
          </label>
          <input type="file" id="profile" {...profileImage.getInputProps()} />
        </div>


        <div className="setting_cover_wrapper" {...coverImage.getRootProps()}>
          {coverImage.acceptedFiles.length ? (
            <img src={URL.createObjectURL(coverImage.acceptedFiles[0])} alt="" />
          ) :
            userInfo?.cover ? (
            
            <img src={userInfo?.cover} alt="user_Cover_image" />
          ) :
          (
            <p>No Cover image please select one </p>
          )}
          <label className="profilers">
            <FaUpload className="fa_upload" />
          </label>
          <input type="file" id="file" {...coverImage.getInputProps()} />
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={`${
            userInfo ? userInfo.username : "Please enter your Username"
          }`}
          name="username"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder={`${
            userInfo ? userInfo.email : "Please enter your Email"
          }`}
          name="email"
          onChange={handleChange}
        />

        <div className="more_info">
          <div>
          
           
         
          <label htmlFor="birthday" >
          Birth :
          <input 
            id="birthday"
            className="birthday"
            type="date"
            name="birthday"
            value={formInputs.birthday ? formInputs.birthday : userInfo?.birthday && time() !== "1970-01-01"   ? time() : ""}
            onChange={handleChange}
          /> 
          </label>
          </div>

          <input
            type="text"
            placeholder={`${
              userInfo?.career ? userInfo?.career : "Please enter your Carrier"
            }`}
            name="career"
            onChange={handleChange}
          />
        </div>

        <textarea
          name="bios"
          onChange={handleChange}
          placeholder={
            userInfo?.bios ? userInfo.bios : "Please tell us more about your self"
          }
        ></textarea>
        <input
          type="password"
          placeholder="Current Password"
          name="password"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="New Password"
          name="newPassword"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          name="confirm"
          onChange={handleChange}
        />
        <button type="submit" disabled={clicked}>Update</button>
      </form>
    </div>
  );
};

export default Settings;
