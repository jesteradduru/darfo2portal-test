/*
  Reports Reducer
   This file is responsible for managing states of Reports
*/
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
    reports: [],
    analytics: [],
    isLoading: false,
    errorMessage: null
};
const apiServer = process.env.REACT_APP_API_URL;
export const getReport = createAsyncThunk(
    'reports/getReport',
    async () => {
        return await fetch(apiServer + '/dts/getReports', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + Cookies.get('accessToken')
            },
        })
        .then(res => res.json())
    }
)
export const getAnalytics = createAsyncThunk(
    'reports/getAnalytics',
    async () => {
        return await fetch(apiServer + '/dts/getAnalytics', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + Cookies.get('accessToken')
            },
        })
        .then(res => res.json())
    }
)

const reports = createSlice({
    name: 'reports',
    initialState,
    reducers: {
    },
    extraReducers: {
        [getReport.pending]: (state, action) => {
            state.isLoading = true
            state.errorMessage = null
        },
        [getReport.rejected]: (state, action) => {
            state.isLoading = false
            state.errorMessage = 'Something went wrong'
        },
        [getReport.fulfilled]: (state, action) => {
            state.reports = action.payload
            state.isLoading = false
            state.errorMessage = null
        },
        [getAnalytics.pending]: (state, action) => {
            state.isLoading = true
            state.errorMessage = null
        },
        [getAnalytics.rejected]: (state, action) => {
            state.isLoading = false
            state.errorMessage = 'Something went wrong'
        },
        [getAnalytics.fulfilled]: (state, action) => {
            state.analytics = action.payload
            state.isLoading = false
            state.errorMessage = null
        }
    }
})


// export const {setRoutingRecipients, closeTab, changeRecipient, setGroupRecipient, resetRoutingData} = routing.actions;
export default reports.reducer;