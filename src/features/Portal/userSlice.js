/*
  Users Reducer
   This file monitors states of the Login module
*/
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const apiServer = process.env.REACT_APP_API_URL;

export const authUser = createAsyncThunk(
  "user/authUser",
  async (userCredentials) => {
    console.log(apiServer)
    return await fetch(apiServer + "/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userCredentials),
    }).then((res) => res.json());
  }
);

export const getUser = createAsyncThunk(
  "account/getUser",
  async () => {
    return await fetch(apiServer + "/getUser", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + Cookies.get("accessToken"),
      },
      body: JSON.stringify({accessToken: Cookies.get("accessToken")})
    }).then((res) => res.json());
  }
);

const initialState = {
  user: {},
  accessToken: "",
  isLoading: false,
  errorMessage: "",
  loginAttempts: 0,
  lockMessage: "",
  rememberMe: false,
  isLogin: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setRememberMe: (state) => {
      state.rememberMe = !state.rememberMe;
    },
    logout: (state) => {
      state.isLogin = !state.isLogin;
      state.loginAttempts = 0;
      state.lockMessage = "";
      state.errorMessage = "";
      Cookies.remove("accessToken");

      window.location.href = "./";
    },
  },
  extraReducers: {
    [authUser.pending]: (state) => {
      state.isLoading = true;
    },
    [authUser.fulfilled]: (state, action) => {
      state.isLoading = false;
      const { type, message, payload } = action.payload;
      switch (type) {
        case "login_success":
          state.isLogin = true;
          state.user = payload.user;
          state.accessToken = payload.accessToken;
          Cookies.set("accessToken", payload.accessToken);

          window.location.href = "./";
          break;
        case "login_wrong_username":
          state.errorMessage = message;
          break;
        case "login_deactivated":
          state.errorMessage = message;
          break;
        case "login_wrong_password":
          state.errorMessage = message;
          state.loginAttempts = payload;
          break;
        case "login_locked":
          state.errorMessage = message;
          state.loginAttempts = 0;
          break;
        default:
          break;
      }
    },
    [authUser.rejected]: (state) => {
      state.isLoading = false;
    },
    [getUser.fulfilled]: (state, action) => {
      state.user = action.payload[0]
      if(action.payload.length <= 0){
        Cookies.remove("accessToken");
        alert("Your account was deleted.")
        window.location.href = './login'
      }
    }
  },
});

export const { setRememberMe, logout} = userSlice.actions;
export default userSlice.reducer;
