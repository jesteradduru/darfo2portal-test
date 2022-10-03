/*
  Task Reducer
   This file is responsible for managing states of the management of Task
*/
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
const apiServer = process.env.REACT_APP_API_URL;
export const getCommunication = createAsyncThunk(
    'tasks/getCommunication',
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
export const taskComplete = createAsyncThunk(
    'tasks/taskComplete',
    async(inbox_id) => {
        return await fetch(apiServer + '/dts/taskComplete/', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + Cookies.get('accessToken')
            },
            body: JSON.stringify({inbox_id: inbox_id})
            // body: JSON.stringify({inbox_id: 0})
        })
        .then(res => res.json())
    }
)

export const getInboxData = createAsyncThunk(
    'tasks/getInboxData',
    async(args) => {
        return await fetch(apiServer + '/dts/getInboxData/', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + Cookies.get('accessToken')
            },
            body: JSON.stringify(args)
        })
        .then(res => res.json())
    }
)

const initialState = {
    communicationId: '',
    tasks: [],
    taskCounter: 0,
    viewCommunicationData: {},
    isLoading: false,
    errorMessage: null,
}

const tasks = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setTasks: (state, action) => {
            state.tasks = action.payload
        },
        resetViewCommunicationData: (state) => {
            state.viewCommunicationData = {}
        },
        incrementTaskCounter: (state) => {
            if(state.taskCounter <= state.tasks.length){
                state.taskCounter = state.taskCounter + 1;
            }
        },
        decrementTaskCounter: (state) => {
            if(state.taskCounter > 0){
                state.taskCounter = state.taskCounter - 1;
            }
        },
        resetTaskCounter: (state) => {
            state.taskCounter = 0
        }
    },
    extraReducers: {
        [getCommunication.pending]: (state) => {
            state.isLoading = true
            state.errorMessage = null
        },
        [getCommunication.fulfilled]: (state, action) => {
            state.isLoading = false
            state.errorMessage = null
            state.viewCommunicationData = action.payload
        },
        [getCommunication.rejected]: (state, action) => {
            state.isLoading = false;
            state.errorMessage = "Can't load data."
        },
        [taskComplete.fulfilled]: (state) => {
            alert('Task Done');
        },
        [getInboxData.fulfilled]: (state, action) => {
            state.tasks  = action.payload
        }
    }
})

export const {setTasks, resetViewCommunicationData, incrementTaskCounter, decrementTaskCounter, resetTaskCounter} = tasks.actions;
export default tasks.reducer;