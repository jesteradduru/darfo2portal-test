/*
  Uploads Reducer
   This file is responsible for managing states of the management of uploads
*/
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
const apiServer = process.env.REACT_APP_API_URL;

export const getComUploads = createAsyncThunk(
  "uploads/getComUploads",
  async (args) => {
    return await fetch(apiServer + "/dts/getComUploads", {
      method: "post",
      headers: {
        "Content-Type": 'application/json',
        Authorization: "Bearer " + Cookies.get("accessToken"),
      },
      body: JSON.stringify(args),
    })
      .then((res) => res.json())
      .catch(err => console.log("Something went wrong!"));
  }
);


const initialState = {
  isLoading: false,
  errorMessage: null,
  scanned: [],
  attachments: []
};

const uploadsSlice = createSlice({
  name: "uploads",
  initialState,
  extraReducers: {
    [getComUploads.fulfilled]: (state, action) => {
        state.scanned = action.payload.scanned
        state.attachments = action.payload.attachments
        state.isLoading = false;
    },
    [getComUploads.pending]: (state) => {
        state.isLoading = true;
    },
    [getComUploads.rejected]: (state, action) => {
        state.errorMessage = action.payload
        state.isLoading = false;
    }
  },
});

export default uploadsSlice.reducer;
