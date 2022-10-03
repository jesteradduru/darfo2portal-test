/*
  Inbox Reducer
   This file is responsible for managing states of the management of inbox
*/
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from 'js-cookie';
const apiServer = process.env.REACT_APP_API_URL;
export const getInbox = createAsyncThunk(
    'inbox/getInbox',
    async() => {
        return await fetch(apiServer + '/dts/getInbox', {
            headers: {
                'Authorization': 'Bearer ' + Cookies.get('accessToken')
            }
        })
        .then(res => res.json())
    }
)

export const seenCommunication = createAsyncThunk(
    'inbox/seenCommunication',
    async(inbox_id) => {
        return await fetch(apiServer + '/dts/seenCommunication', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + Cookies.get('accessToken')
            },
            body: JSON.stringify({inbox_id})
        })
        .then(res => res.json())
    }
)

export const editCommunication = createAsyncThunk(
    'inbox/editCommunication',
    async(formData) => {
        return await fetch(apiServer + '/dts/editCommunication', {
            method: 'post',
            headers: {
                'Authorization': 'Bearer ' + Cookies.get('accessToken')
            },
            body: formData
        })
        .then(res => res.json())
    }
)

const initialState = {
    inbox: [],
    newInboxCount: 0,
    isLoading: false,
}

const inbox = createSlice({
    name: 'inbox',
    initialState,
    reducers: {
        decrementNewInboxCount: (state) => {
            state.newInboxCount > 0 && (state.newInboxCount = state.newInboxCount - 1);
        }
    },
    extraReducers: {
        [getInbox.pending]: (state) => {
            state.isLoading = true
        },
        [getInbox.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.inbox=action.payload
            state.newInboxCount =action.payload.filter(data => {
                return data.inbox_date_seen === null;
            }).length
        },
        [editCommunication.fulfilled]: (state, action) => {
            console.log(action.payload)
        }
    }
})

export const {decrementNewInboxCount} = inbox.actions;
export default inbox.reducer;