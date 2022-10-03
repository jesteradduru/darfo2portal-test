/*
  Offices Reducer
   This file is responsible for fetching offices data from the backend api.
*/
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
const apiServer = process.env.REACT_APP_API_URL;
export const getOffices = createAsyncThunk(
    "offices/getOffices",
    async () => {
        return await fetch(apiServer + "/getOffices", {
            method: "get",
            headers: {
                "Content-Type" : "application/json",
                "Authorization": 'Bearer ' + Cookies.get("accessToken")
            },
        })
        .then(res => res.json())
    }
)


const officesSlice = createSlice({
    name: "offices",
    initialState: {offices: []},
    extraReducers: {
        [getOffices.fulfilled]: (state, action) => {
            state.offices = action.payload
        }
    }
});

export default officesSlice.reducer;