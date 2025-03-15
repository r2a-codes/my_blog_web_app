import {useDispatch} from "react-redux";
import useAxiosPrivateHook from "./useAxiosPrivateHook";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";







const useFetchUserHook = () => {

  const navigate = useNavigate()

  const dispatch = useDispatch()


  const privateAxios = useAxiosPrivateHook()





  const getUserHook = async (id) => {

    try{
        const {data} = await privateAxios.get(`user/${id}`, {withCredentials:true})
        return data
    }catch(err) {
      const error = err.response.data
      toast.error(error.message)
    }


  }

  const followUserHook = async(id) => {
     await privateAxios.patch(`user/${id}`, {withCredentials:true})
}

const deleteUserHook = async(id) => {
    await privateAxios.delete(`user/` ,{withCredentials:true})
    navigate("/")
}



const updateUserHook = async( data) => {
    
    await privateAxios.patch(`user/`, data ,{withCredentials:true})
    
  }





  return {getUserHook , followUserHook ,deleteUserHook ,updateUserHook }

};

export default useFetchUserHook;
