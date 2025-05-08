import { useDispatch } from "react-redux"
import axios from "../hooks/axiosApi"
import "../styles/searchBar.css"
import {useState , UseEffect, useEffect} from "react"
import { blogErrorAction, blogLoadingAction, fetchBlogsAction } from "../app/blogSlice"
import { Link } from "react-router-dom"


const initialState = { title:"" , category:""}

const SearchBar = () => {
	const dispatch = useDispatch()

	const [search, setSearch] = useState(initialState)
	const [searchResult, setSearchResult] = useState([])
	const [timer , setTimer] = useState(false)

	const handleSearch = e => {
		setSearch({...search , [e.target.name]: e.target.value})

		if(timer){
			clearTimeout(timer)
		}


		const timeOut = setTimeout(() => {
			fetchBlogsBySearch()
			
		}, 1000);

		setTimer(timeOut)
		
	}


	



	
	const fetchBlogsBySearch  =  async () => {
		dispatch(blogLoadingAction())

		try{
			const { data } = await axios.get(`/blog?${search.title && "title=" +search.title}&${search.category && "title=" +search.category}` );
				dispatch(fetchBlogsAction(data))
				// console.log(data)
		
			}catch(err) {
				  const error = err.response.data
				  dispatch(blogErrorAction(error))
		}
}

		// const handleOnchanger = () => {
		// 	fetchBlogsBySearch()
		// }


	

	return (

		<div className="search_wrapper">
			
			<input type="text" name="title" onChange={handleSearch} placeholder="Search By Title"/>
			<input type="text" name="category" onChange={handleSearch} placeholder="Search By category"/>

			{searchResult.length > 0 && 
			<div className="search_content_wrapper">
				{
					searchResult?.map(res => {
						<Link to={`/single_blog/${res._id}`} key={res._id}>
							<span> {res._title}</span>
							<span> {res._cat}</span>
							
						</Link>
					})
				}
			</div>
			}
		</div>
		)

}


export default SearchBar ;