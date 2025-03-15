import { useState, useEffect, useRef } from "react";
import { IoIosEyeOff, IoIosEye } from "react-icons/io";
import "../styles/auth.css";
import useAuthHook from "../hooks/useAuthHook";
import { errorAction, userStateSelector } from "../app/authSlice";
import { useDispatch, useSelector } from "react-redux";
import {toast} from "react-toastify"

const initials = {
  email: "",
  username: "",
  pass: "",
  confirm: "",
};


const Auth = () => {
  const checkRef = useRef();
  const [signUp, setSignUp] = useState(false);
  const [password, setPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [credentials, setCredentials] = useState(initials);
  const { register, login } = useAuthHook();
  const dispatch = useDispatch();
  const { isError, errorMsg } = useSelector(userStateSelector);

  

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, confirm, pass } = credentials;

    signUp
      ? confirm && pass && confirm === pass
        ? register(credentials) && !isError  && setSignUp(false)
        : toast.error("error : it seem's that password and confirmPass don't match") 
          
      : login(
          { email, pass },
          checkRef.current.checked && checkRef.current.checked
        );
  };

  const handleShowPass = () => {
    setPassword((prev) => !prev);
  };
  const handleShowConfirmPass = () => {
    setConfirmPassword((prev) => !prev);
  };

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  return (
    <div className="form_container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">
          <input
            type="text"
            id="email"
            placeholder="Email field"
            onChange={handleChange}
          />
        </label>
        {signUp && (
          <label htmlFor="username">
            <input
              type="text"
              id="username"
              placeholder="Username field "
              onChange={handleChange}
            />
          </label>
        )}
        <label htmlFor="password" className="password">
          <input
            type={password ? "text" : "password"}
            id="pass"
            placeholder="Password field"
            onChange={handleChange}
          />
          {!password ? (
            <IoIosEye className="icons" onClick={handleShowPass} />
          ) : (
            <IoIosEyeOff className="icons" onClick={handleShowPass} />
          )}
        </label>
        {signUp && (
          <label htmlFor="confirm-password" className="confirm-password">
            <input
              type={confirmPassword ? "text" : "password"}
              id="confirm"
              placeholder="confirm-password field"
              onChange={handleChange}
            />
            {!confirmPassword ? (
              <IoIosEye className="icons" onClick={handleShowConfirmPass} />
            ) : (
              <IoIosEyeOff className="icons" onClick={handleShowConfirmPass} />
            )}
          </label>
        )}
        <label htmlFor="check" className="check">
          <input type="checkbox" id="check" ref={checkRef} />
          do you trust this device ?
        </label>

        <button type="submit">Submit</button>
        <p>
          {!signUp
            ? "first time with us please try to "
            : "already registered please try to "}
          <span onClick={() => setSignUp((prev) => !prev)}>
            {!signUp ? "Register" : "login"}
          </span>
        </p>

        
        
      </form>
    </div>
  );
};

export default Auth;
