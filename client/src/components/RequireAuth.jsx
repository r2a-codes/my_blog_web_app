import { Outlet, Navigate } from "react-router-dom";
import {  useSelector } from "react-redux";
import { userDataSelector } from "../app/authSlice";



const RequireAuth = () => {
  const userData = useSelector(userDataSelector);
  
  return userData ? (
    
    <Outlet />
  ) : (
    <Navigate to="/auth"  />
  );
};


export default RequireAuth;
