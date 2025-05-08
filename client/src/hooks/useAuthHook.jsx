import axios from "./axiosApi";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  loadingAction,
  errorAction,
  loginAction,
  logoutAction,
  refreshAction,
  trustActions,
  headerAuthAction
} from "../app/authSlice";
import { toast } from "react-toastify";

const useAuthHook = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const register = async (credentials) => {
    dispatch(loadingAction());
    try {
      await axios.post("auth/register", credentials);
    } catch (err) {
      const msg = err.response.data;
      dispatch(errorAction(msg));
      toast.error(msg.message)
    }
  };

  const login = async (credentials, trust) => {
    dispatch(loadingAction());
    try {
      const { data } = await axios.post("auth/login", credentials);

      
      dispatch(loginAction(data));
      dispatch(trustActions(trust));
      

      navigate(from , { replace: true });
      
    } catch (err) {
      const msg = err.response.data;
      dispatch(errorAction(msg));
    }
  };

  const logout = async () => {
    dispatch(loadingAction());
    try {
      await axios.post("auth/logout");
      dispatch(logoutAction());
      navigate("/");
    } catch (err) {
      const msg = err.response.data;
      dispatch(errorAction(msg));
    }
  };

  const refresh = async () => {
    dispatch(loadingAction());
    try {
      const { data } = await axios.get("auth/refresh", {
        withCredentials: true,
      });

      
      await dispatch(refreshAction(data));

      return data ;
    } catch (err) {
      navigate("/auth");
    }
  };

  return { register, login, logout, refresh };
};

export default useAuthHook;
