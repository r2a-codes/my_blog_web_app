import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: null,
  isLoading: false,
  isError: false,
  errorMsg: null,
  headerAuth: JSON.parse(localStorage.getItem("Trust")) || false,
  trustDevice: JSON.parse(localStorage.getItem("Trust")) || false,
};

export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    loadingAction: (state) => {
      state.isLoading = true;
    },

    errorAction: (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMsg = action.payload;
    },

    loginAction: (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.userData = action.payload;
    },

    logoutAction: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.userData = null;
      state.headerAuth = false ;

      localStorage.removeItem("Trust");
    },

    refreshAction: (state, action) => {
      const payload = action.payload
      state.userData = {...state.userData , payload } 
      state.isLoading = false ;
      state.isError = false;
    },

    updateUserInfoAction: (state, action) => {
      state.isLoading = false;
      state.isError = false;
      const userInfo = action.payload;
      state.userData.userInfo = userInfo;
      
    },

    trustActions: (state, action) => {
      const value = action.payload
      state.headerAuth = true ;

      state.trustDevice = true;

      
      if (value == true ){
        localStorage.setItem("Trust", JSON.stringify(value));
      }
    },

    
  },
});

export const userDataSelector = (state) => state.authSlice.userData;
export const userStateSelector = (state) => state.authSlice;

export const {
  loadingAction,
  errorAction,
  loginAction,
  logoutAction,
  refreshAction,
  updateUserInfoAction,
  trustActions,
  headerAuthAction
} = authSlice.actions;

export default authSlice.reducer;
