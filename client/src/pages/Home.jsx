import "../styles/home.css";
import { useEffect } from "react";
import { Blog , SearchBar} from "../components";
import {  useSelector } from "react-redux";
import {

  blogSelector,
  blogDataSelector,
} from "../app/blogSlice";

import useFetchBlogHook from "../hooks/useFetchBlogHook"



const Home = () => {

useFetchBlogHook()

  const { isLoading, isError, errorMsg } = useSelector(blogSelector);
  const blogData = useSelector(blogDataSelector);

  

  const content =
    blogData  ? (
      blogData.map((blog) => <Blog key={blog._id} data={blog} />)
    ) : isLoading ? (
      <p>Loading ...</p>
    ) : (
      <>
        <p>Sorry no blogs to display ...</p>
        {isError && <p className="error">{errorMsg}</p>}
      </>
    );

  return( 
    <div className="home_container">

        <SearchBar/> 
        
        
        <div className="blog_container">
          {content}
        </div>

  
    </div>);
};

export default Home;
