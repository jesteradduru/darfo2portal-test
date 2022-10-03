/*
  Document Trail Reducer
   This file is responsible for managing states of the Document Trail
*/
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
const apiServer = process.env.REACT_APP_API_URL;
export const getTrail = createAsyncThunk(
    'trail/getTrail',
    async(com_id) => {
        return await fetch(apiServer + '/dts/getTrail', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + Cookies.get('accessToken')
            },
            body: JSON.stringify({com_id: com_id})
        })
        .then(res => res.json())
    }
)

const initialState = {
    trails: [],
    isLoading: false,
    errorMessage: null,
}

const trail = createSlice({
    name: 'trail',
    initialState,
    reducers: {
    },
    extraReducers: {
        [getTrail.pending]: (state) => {
            state.isLoading = true
            state.errorMessage = null
        },
        [getTrail.fulfilled]: (state, action) => {
            state.trails = action.payload
            state.isLoading = false
            state.errorMessage = null
        },
        [getTrail.rejected]: (state) => {
            state.isLoading = false
            state.errorMessage = 'Something went wrong!'
        }
    }
})

export default trail.reducer;