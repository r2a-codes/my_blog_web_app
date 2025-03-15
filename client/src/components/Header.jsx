import "../styles/header.css";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import {
  IoMdMenu,
  IoIosMoon,
  IoIosSunny,
  IoIosLogOut,
  IoIosLogIn,
} from "react-icons/io";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { darkModeSelector, activeDarkMode } from "../app/darkModeSlice";
import { userStateSelector } from "../app/authSlice";
import useAuthHook from "../hooks/useAuthHook";

const Header = () => {
  const [nav, setNav] = useState(false);
  const [auth, setAuth] = useState(false);
  const dispatch = useDispatch();
  const dark = useSelector(darkModeSelector);
  const path = useLocation();
  const navigate = useNavigate()
  const { logout } = useAuthHook();
  const {userData  , headerAuth } = useSelector(userStateSelector);

  const handleDarkMode = () => {
    dispatch(activeDarkMode());
  };

  useEffect(() => {
    if(headerAuth) return setAuth(true)

  },[userData])

  useEffect(() => {
    setNav(false);
  }, [path.pathname]);


  const handleLogout = async () => {
    await logout();
    setAuth(false)
    navigate("/")
  }

  
  
  return (
    <header className={dark ? "dark_mode" : "light_mode"}>
      <div className="logo_wrapper">
        <Link className="link" to="/">
          R2A_Blog
        </Link>
          {"  "}
        
      </div>
      
        <div className="nav_wrapper">
          <nav className={`nav ${nav && "active_nav"}`}>
            <NavLink className="link" to="/">
              Home
            </NavLink>
            {auth && <NavLink className="link" to="/add_blog">
                          New_Blog
                        </NavLink>}
            <NavLink className="link" to="/about">
              About
            </NavLink>
            {auth && <NavLink className="link" to="/settings">
                          Settings
                        </NavLink>}

            {auth ? ( <button
                className="btn"
                onClick={handleLogout}
              >
              <IoIosLogOut /> logout
            </button>) : 
            ( <div className="nav_log">
          <Link className="link" to="/auth">
            <IoIosLogIn />
            Login
          </Link>
        </div>)
          }
          </nav>
          <div onClick={handleDarkMode}>
            {dark ? (
              <IoIosSunny className="icon" />
            ) : (
              <IoIosMoon className="icon" />
            )}
          </div>

            <div
              className="menu_wrapper"
              onClick={() => setNav((prev) => !prev)}
            >
              <IoMdMenu />
            </div>
          
        </div>
             
      
    </header>
  );
};

export default Header;



