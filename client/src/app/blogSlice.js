import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  blogData: null,
  isLoading: false,
  isError: false,
  errorMsg: "",
};

export const blogSlice = createSlice({
  name: "blogSlice",
  initialState,
  reducers: {
    blogLoadingAction: (state) => {
      state.isLoading = true;
      state.isError = false;
    },
    
    fetchBlogsAction: (state, action) => {
      state.isLoading = false;
      state.isError = false;
      const data = action.payload;
      state.blogData = data;
    },

    blogErrorAction: (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMsg = action.payload;
    },

    likeBlogAction : (state , action) => {
      const data = action.payload;
      // state.blogData = {...state.blogData , }

      console.log("from blogSlice :::" , data)

    }
  },
});

export const blogSelector = (state) => state.blogSlice;
export const blogDataSelector = (state) => state.blogSlice.blogData;

export const { blogLoadingAction, fetchBlogsAction, blogErrorAction , likeBlogAction} =
  blogSlice.actions;

export default blogSlice.reducer;
