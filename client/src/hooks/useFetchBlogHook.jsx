import { useEffect, useState } from "react";
import {useDispatch} from "react-redux";
import useAxiosPrivateHook from "./useAxiosPrivateHook";
import axios from "./axiosApi";
import { blogLoadingAction, fetchBlogsAction, blogErrorAction , likeBlogAction } from "../app/blogSlice"
import { useNavigate } from "react-router-dom";
import {toast } from "react-toastify"





const useFetchBlogHook = () => {

  const navigate = useNavigate()

  const dispatch = useDispatch()


  const privateAxios = useAxiosPrivateHook()


  useEffect (() => {
    const getAllBlogsHook = async () => {
      dispatch(blogLoadingAction())

        try{
          
          const { data } = await axios.get("blog/");
          
          dispatch(fetchBlogsAction(data)); 

        }catch(err) {
          const error = err.response.data
          dispatch(blogErrorAction(error))
         
        }

  }

getAllBlogsHook()

  } , [])



  const getBlogHook = async(id) => {
    dispatch(blogLoadingAction())

    try{
      const { data } = await axios.get(`blog/${id}`);
      
      return data

    }catch(err) {
      const error = err.response.data
      dispatch(blogErrorAction(error))
    }


  }

  const createBlogHook = async(blogData) => {
    const {data} = await privateAxios.post("blog" , blogData , {withCredentials:true})
    toast.success("created with success")

    navigate(`/single_blog/${data._id}`)
    
  }

  const deleteBlogHook = async(id) => {
    await privateAxios.delete(`/blog/${id}` ,{withCredentials:true})
    navigate("/")
  }
  
  const likeBlogHook = async(id) => {
  
        try{
  
          await privateAxios.patch(`blog/like/${id.toString()}` , {withCredentials:true})
  
        }catch(err) {
          const error = err.response.data
          console.log("like Error" ,error)
          dispatch(blogErrorAction(error))
        }
    }
  const saveBlogHook = async(id) => {
  
        try{
  
          await privateAxios.patch(`blog/save/${id.toString()}` , {withCredentials:true})
  
        }catch(err) {
          const error = err.response.data
          console.log("like Error" ,error)
          dispatch(blogErrorAction(error))
        }
    }


const updateBlogHook = async(id , data) => {

    await privateAxios.patch(`blog/${id.toString()}`, data ,{withCredentials:true})
    
    navigate(`/single_blog/${id}`)

  }



const CommentBlogHook = async(id , commentValue ) => {

  const comment = commentValue
  const _id = new Date()
    

  const {data} = await privateAxios.patch(`blog/comment/${id.toString()}` , {comment , _id } , {withCredentials:true}  )
    
    
    return data

  }

  return {getBlogHook , createBlogHook , deleteBlogHook ,updateBlogHook,likeBlogHook,CommentBlogHook  , saveBlogHook}

};

export default useFetchBlogHook;
