/*
  Communications Reducer
   This file is responsible for managing states of the management of Communications
*/
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from 'js-cookie';
const apiServer = process.env.REACT_APP_API_URL;
export const addCommunication = createAsyncThunk(
    'communication/addCommunication',
    async(formData) => {
        return await fetch(apiServer + '/dts/addCommunication', {
            method: 'post',
            headers: {
                'Authorization': 'Bearer ' + Cookies.get('accessToken')
            },
            body: formData
        })
        .then(res => res.json())
    }
)

export const getCommunication = createAsyncThunk(
    'communication/getCommunication',
    async(com_id) => {
        return await fetch(apiServer + '/dts/getCommunication', {
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

export const verifyControlNo = createAsyncThunk(
    'communication/verifyControlNo',
    async(args) => {
        return await fetch(apiServer + '/dts/verifyControlNo/' + args, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + Cookies.get('accessToken')
            },
        })
        .then(res => res.json())
    }
)

export const getCommunications = createAsyncThunk(
    'communication/getCommunications',
    async() => {
        return await fetch(apiServer + '/dts/getCommunications', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + Cookies.get('accessToken')
            }
        })
        .then(res => res.json())
    }
)

const initialState = {
    newAddedCommunication: 0,
    viewCommunicationData: {},
    receiverTask: [],
    isLoading: false,
    addLoading: false,
    errorMessage: null,
    isControlNoExist: false,
    userToNotify: null,
    communications: []
}

const communicationSlice = createSlice({
    name: "communication",
    initialState,
    reducers: {
        clearErrorMessage: (state) => {
            state.errorMessage = null;
        },
        resetViewCommunicationData: (state) => {
            state.viewCommunicationData = {}
            state.newAddedCommunication = 0
        }
    },
    extraReducers: {
        [addCommunication.fulfilled]: (state, action) => {
            if(action.payload === 'control_no_exist'){
                alert('Duplicate entry: Communication Control Number already exist!')
            }else{
                state.newAddedCommunication = action.payload.communication
                state.userToNotify = action.payload.userToNotify
                state.receiverTask = action.payload.inbox_task
            }
            state.addLoading = false
        },
        [addCommunication.rejected]: (state, action) => {
            state.addLoading = false;
            state.errorMessage = "Can't Add communication"
        },
        [addCommunication.pending] : state => {
            state.addLoading = true
        },
        [getCommunication.pending]: (state) => {
            state.isLoading = true
            state.errorMessage = null
        },
        [getCommunication.fulfilled]: (state, action) => {
            // console.log(action.payload)
            state.viewCommunicationData = action.payload
            state.isLoading = false
            state.errorMessage = null
        },
        [getCommunication.rejected]: (state, action) => {
            state.isLoading = false;
            state.errorMessage = "Can't load data."
        },
        [verifyControlNo.fulfilled]: (state, action) => {
            state.isControlNoExist = action.payload
        },
        [getCommunications.fulfilled]: (state, action) => {
            state.communications = action.payload
            state.isLoading = false
        },
        [getCommunications.pending]: (state) => {
            state.isLoading = true
        },
        [getCommunications.rejected]: (state, action) => {
            state.isLoading = false
            // console.log(action.payload)
        },
    }
})
 
export const {clearErrorMessage, resetViewCommunicationData} = communicationSlice.actions;
export default communicationSlice.reducer;