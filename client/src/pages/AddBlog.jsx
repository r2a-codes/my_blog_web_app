import axios from "axios";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import "../styles/addBlog.css";
import { FaImage, FaUpload } from "react-icons/fa";
import  useFetchBlogHook from "../hooks/useFetchBlogHook"
import {toast}  from "react-toastify";


const initial = { title: "", description: "", category: [] };

const AddBlog = () => {
  
  const [formInputs, setFormInputs] = useState(initial);
  const  [clicked , setClicked] = useState(false)
  const { createBlogHook }  = useFetchBlogHook()



  const handleUpload = async () => {
    const cloud_name = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const formdata = new FormData()

    formdata.append('file' , acceptedFiles[0])
    formdata.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
    
    const {data} = await axios.post(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload` , formdata )

    return data?.url
   

  }; 


  const handleSubmit = async (e) => {

    e.preventDefault()

    setClicked(true)

    
    if(!acceptedFiles[0]  && !formInputs.title && !formInputs.description ) {
      setClicked(false)
      toast.error("please fill all field")

        return
        
      }


     const image = await handleUpload()


     const data = {...formInputs}

     if(image) {

      data.image = image
    }
    
    setClicked(false)
    await createBlogHook(data)


  }



  const onDrop = useCallback((acceptedFiled) => {}, []);

  const { acceptedFiles, getRootProps, getInputProps } =
    useDropzone(onDrop);

  return (
    <div className="add_blog_container">
      <div className="img_wrapper" {...getRootProps()}>
        {acceptedFiles.length ? (
          <img src={URL.createObjectURL(acceptedFiles[0])} alt="" />
        ) : (
          <FaImage className="fa_image" />
        )}
        <input
          type="file"
          id="file"
          {...getInputProps()}
        />

        <label>
          <FaUpload className="fa_upload" />
        </label>
      </div>


      <div className="input_wrapper">
        <form >
          <input
            className="title"
            type="text"
            placeholder="Title ..."
            onChange={(e) =>
              setFormInputs({ ...formInputs, title: e.target.value })
            }
            required
          />
          <textarea
            placeholder="Description"
            onChange={(e) =>
              setFormInputs({ ...formInputs, description: e.target.value })
            }
            required
          ></textarea>
          <div className="cat_wrapper">
            <input
              className="cat"
              type="text"
              placeholder="Category"
              onChange={(e) =>
                setFormInputs({
                  ...formInputs,
                  category: e.target.value.split(" "),
                })
              }
            

            />
            <select
              title="category"
              onChange={(e) =>
                setFormInputs({
                  ...formInputs,
                  category: e.currentTarget.value.split(" "),
                })
              }
            >
              <option>Suggested Category</option>
              <option value="music">music</option>
              <option value="food">food</option>
              <option value="sport">sport</option>
              <option value="science">science</option>
              <option value="technology">technology</option>
              <option value="travel">travel</option>
              <option value="travel">fashion</option>
              <option value="travel">shopping</option>
            </select>
          </div>

          <button type="submit"   disabled={clicked}  onClick={handleSubmit}>Create_blog</button>
        </form>
      </div>
    </div>
  );
};

export default AddBlog;
