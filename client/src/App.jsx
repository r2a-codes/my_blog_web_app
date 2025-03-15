import { Routes, Route, Navigate } from "react-router-dom";
import {Home, Auth , NotFoundPage ,AddBlog,SingleBlog,Settings,UserProfile,About} from "./pages";
import { Header, Footer, RequireAuth, PersistAuth } from "./components";
import "./App.css";
import { darkModeSelector } from "./app/darkModeSlice";
import { userDataSelector } from "./app/authSlice";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";



function App() {
  const dark = useSelector(darkModeSelector);
  const userData = useSelector(userDataSelector);



  return (
    <div className="app">
      
        
          <Header />
          <div className={`main_container ${dark ? "main_dark" : "main_light"}`}>
          <ToastContainer position="top-right"
           autoClose={1000}theme="light"/>
            <Routes>
              <Route element={<PersistAuth />}>

                <Route path="/" element={<Home />} />
                <Route path="/*" element={<NotFoundPage />} />

                <Route path="/auth" element={userData ? <Navigate to="/" /> : <Auth />} />

                <Route element={<RequireAuth />}>
                  <Route path="/add_blog" element={<AddBlog />} />
                  <Route path="/single_blog/:id" element={<SingleBlog />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/user_profile/:id" element={<UserProfile />} />
                </Route>
              </Route>
              <Route path="/about" element={<About />} />
            </Routes>
          </div>
          <Footer />
       
    </div>
  );
}

export default App;
