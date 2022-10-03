/*
  Logs Reducer
   This file is responsible for managing states of logs
*/
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
const apiServer = process.env.REACT_APP_API_URL;
const initialState = {
    logs: [],
    isLoading: false,
    errorMessage: null
};

export const getLogs = createAsyncThunk(
    'reports/getLogs',
    async () => {
        return await fetch(apiServer + '/dts/getLogs', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + Cookies.get('accessToken')
            },
        })
        .then(res => res.json())
    }
)

const logs = createSlice({
    name: 'logs',
    initialState,
    reducers: {
    },
    extraReducers: {
        [getLogs.pending]: (state, action) => {
            state.isLoading = true
            state.errorMessage = null
        },
        [getLogs.rejected]: (state, action) => {
            state.isLoading = false
            state.errorMessage = 'Something went wrong'
        },
        [getLogs.fulfilled]: (state, action) => {
            state.logs = action.payload
            state.isLoading = false
            state.errorMessage = null
        }
    }
})


export default logs.reducer;