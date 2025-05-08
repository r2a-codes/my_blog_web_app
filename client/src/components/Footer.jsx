import "../styles/footer.css";
import {
  FaFacebook,
  FaInstagram,
  FaGoogle,
  FaTwitter,
  FaGithub,
} from "react-icons/fa";
import { darkModeSelector, activeDarkMode } from "../app/darkModeSlice";
import { useSelector } from "react-redux";

const Footer = () => {
  const dark = useSelector(darkModeSelector);

  return (
    <footer className={dark ? "dark_mode" : "light_mode"}>
      <div className="social_media_wrapper">
        <FaFacebook className="icons facebook" />
        <FaInstagram className="icons instagram" />
        <FaGoogle className="icons google" />
        <FaTwitter className="icons tweeter" />
        <FaGithub className="icons github" />
      </div>
      <div className="copy-right_wrapper">
        <span>Copy & right reserved@</span>
      </div>
    </footer>
  );
};

export default Footer;
