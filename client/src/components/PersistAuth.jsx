import { Outlet} from "react-router-dom";
import { headerAuthAction, userDataSelector, userStateSelector } from "../app/authSlice";
import useAuthHook from "../hooks/useAuthHook";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";


const PersistAuth = () => {

  const { refresh } = useAuthHook();
  const { trustDevice } = useSelector(userStateSelector);
  const [loading, setLoading] = useState(true);
  const user = useSelector(userDataSelector);
  const dispatch = useDispatch()


  useEffect(() => {
    
    const persistFunc = async () => {

      try{
       await refresh() 
      }catch(err){
          console.log(err)
      }finally{
        setLoading(false)
      }
    }

   trustDevice  ? persistFunc() : setLoading(false) 
   
  }, []);
  

  
    
  return  loading  ? (<p>loading ....</p>)  : (<Outlet/> )
  
};

export default PersistAuth;
