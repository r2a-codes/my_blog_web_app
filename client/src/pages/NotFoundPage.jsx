import {Link } from "react-router-dom"

const NotFoundPage = () => {

	return(

		<div style={{display: "flex" , flexDirection : "column" , gap:"7px"}}>
			<h1 style={{fontSize: "1.5rem"}}> Page Not Found </h1> 
			<p>Sorry No matching page Has been found response 401  </p>
			<p>Please go Back to our Home page </p>
			<Link to="/" style={{backdrop: "invert", fontWeight:600}}>Home_Page </Link>
		</div> 
		)

}

export default NotFoundPage ;