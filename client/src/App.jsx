import {  lazy, useState } from "react";

import { Routes, Route, Navigate, useLocation, Router } from "react-router-dom";
import {Home  } from "./pages";
import { Header, Footer, RequireAuth, PersistAuth } from "./components";
import "./App.css";
import { darkModeSelector } from "./app/darkModeSlice";
import { userDataSelector } from "./app/authSlice";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import Suspenser from "./components/Suspenser";


const AddBlog = lazy(() => import("./pages/AddBlog"))
const SingleBlog = lazy(() => import("./pages/SingleBlog"))
const Settings = lazy(() => import("./pages/Settings"))
const UserProfile = lazy(() => import("./pages/UserProfile"))
const About = lazy(() => import("./pages/About"))
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"))
const Auth = lazy(() => import("./pages/Auth"))



function App() {
  const dark = useSelector(darkModeSelector);
  const userData = useSelector(userDataSelector);
  const location = useLocation();



  return (
    <div className="app">
          <Header />
          <div className={`main_container ${dark ? "main_dark" : "main_light"}`}>
          <ToastContainer position="top-right"
           autoClose={1000}theme="light"/>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route element={<Suspenser/>} >
                  <Route element={<PersistAuth />}>

                  <Route path="/*" element={<NotFoundPage />} />

                  {!userData && <Route path="/auth" element={<Auth />} />}

                  <Route element={<RequireAuth />}>
                    <Route path="/add_blog" element={<AddBlog />} />
                    <Route path="/single_blog/:id" element={<SingleBlog />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/user_profile/:id" element={<UserProfile />} />
                  </Route>
                </Route>
                <Route path="/about" element={<About />} />
              </Route>
            </Routes>
          </div>
          <Footer />
       
    </div>
  );
}

export default App;
