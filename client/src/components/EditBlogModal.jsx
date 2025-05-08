import "../styles/editBlogModal.css"

import {  useCallback , useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaImage, FaUpload } from "react-icons/fa";
import { useSelector } from "react-redux";

import { darkModeSelector } from "../app/darkModeSlice";

import useFetchBlogHook from "../hooks/useFetchBlogHook"
import { useNavigate } from "react-router-dom";



const EditBlogModal = ({ blog , setOpenDialog }) => {


	if(!blog) return 

	const id = blog?._id

	
	const onDrop = useCallback((acceptedFiled) => {}, []);
  	const dark = useSelector(darkModeSelector);

  

  	const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    	useDropzone(onDrop);


	const titleRef = useRef(null)
	const descRef = useRef(null)
	const catRef = useRef(null)
	const {updateBlogHook} = useFetchBlogHook()
	const navigate = useNavigate()

    
	const handleDblClick = (e) => {
		setRead(false)
		e.target.readOnly = false
	}


	const handleClicked = async() => {
		const id = blog._id
		const title = titleRef.current.textContent
		const description = descRef.current.textContent
		const bTitle = blog.title

		let data = {}

		

		if(blog.description != description ){
			data.description = descRef.current.textContent
		}

		if(title !=  bTitle) {
			data.title = title 
		}

		const isEmpty = (data) => JSON.stringify(data) === '{}'
		
		if (isEmpty(data)) return 
		


		

		await updateBlogHook(id , data)
		window.location.reload()
	}
	
	
	return (

			<div className={`edit_container ${dark ? "main_dark" : "main_light"}` } >
				<button onClick={() => setOpenDialog(false)} 
					className="modalCloseBtn">X</button>
			

				<h1>Edit Blog</h1>

				<div className="img_wrapper" {...getRootProps()}>
			        {acceptedFiles.length ? (
			          <img src={URL.createObjectURL(acceptedFiles[0])} alt="" />
			        ) :  blog?.image && !acceptedFiles.length ?     
			        	(<img src={blog?.image} alt="" />) :
			        (
			          <FaImage className="fa_image" />
			        )}
			        <input
			          type="file"
			          id="file"
			          {...getInputProps()}
			        />

			        <label className="upload_btn">
			          <FaUpload className="fa_upload" />
			        </label>
     		 	</div>

				<p className="title" name="title"
					ref={titleRef} 
					onClick={(e) => e.target.contentEditable = true}
					onBlur={(e) => e.target.contentEditable = false}
				>{blog?.title} </p>

				<p type="text" className="description" name="description" 
					ref={descRef} 
					onClick={(e) => e.target.contentEditable = true}
					onBlur={(e) => e.target.contentEditable = false}
					>{blog?.description}</p>
					
				<div>
					{blog.category.map((cat , i) =>
					 (<span key={cat + i} className="category"  
						ref={catRef} 
						onClick={(e) => e.target.contentEditable = true}
						onBlur={(e) => e.target.contentEditable = false}
					>{cat}</span>))}

				</div>
				

				<button className="editBtn" onClick={handleClicked} > Edit </button>

			</div>

	)

}


export default EditBlogModal ;