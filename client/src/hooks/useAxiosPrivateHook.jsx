import { useEffect } from "react";
import { useSelector } from "react-redux";
import axios   from "./axiosApi";
import useAuthHook from "./useAuthHook";
import { userDataSelector } from "../app/authSlice";



const useAxiosPrivateHook = () => {
  const auth = useSelector(userDataSelector);
  const { refresh } = useAuthHook();

  const privateAxios = axios

  useEffect(() => {
    const reqInterceptors = privateAxios.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const resInterceptors = privateAxios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;

          const newToken = await refresh();

          prevRequest.headers["Authorization"] = `Bearer ${newToken.token}`;

          return privateAxios(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      privateAxios.interceptors.request.eject(reqInterceptors);

      privateAxios.interceptors.response.eject(resInterceptors);
    };
  }, [refresh, auth?.token]);

  return privateAxios;
};

export default useAxiosPrivateHook;
