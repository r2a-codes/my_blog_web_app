import {createSlice} from '@reduxjs/toolkit'


// const userBrowser = window.matchMedia("(prefers-color-schema:dark)")
function detectUserTheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return true;
  } else {
    
    return false ;
  }
}



const initialState = {
  darkMode :  detectUserTheme()
}

export const darkModeSlice = createSlice({
  name :'darkModeSlice',
  initialState,
  reducers : {
    activeDarkMode : (state) => {
      state.darkMode = !state.darkMode
    }
  }
})

export const darkModeSelector = (state) => state.darkModeSlice.darkMode

export const {activeDarkMode} = darkModeSlice.actions;

export default darkModeSlice.reducer