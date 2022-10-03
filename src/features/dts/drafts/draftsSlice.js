/*
  Drafts Reducer
   This file is responsible for managing states of the management of drafts
*/
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
const apiServer = process.env.REACT_APP_API_URL;
export const getDrafts = createAsyncThunk(
    "drafts/getDrafts",
    async(args, {getState}) => {
        return await fetch(apiServer + '/dts/getDrafts/'+ getState().user.user.user_id, {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + Cookies.get('accessToken')
            }
        }).then(res => res.json())
    }
)
export const discardDraft = createAsyncThunk(
    "drafts/discardDraft",
    async(com_id) => {
        return await fetch(apiServer + '/dts/deleteCommunication', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + Cookies.get('accessToken')
            },
            body: JSON.stringify({com_id: com_id})
        }).then(res => res.json())
    }
)

export const addDraft = createAsyncThunk(
    'drafts/addDraft',
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
export const updateDraft = createAsyncThunk(
    'drafts/saveDraft',
    async(formData) => {
        return await fetch(apiServer + '/dts/saveDraft', {
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
    drafts: [],
    isLoading: false,
    newAddedCommunication: 0,
    userToNotify: null
}
const draftsSlice = createSlice({
    name: "drafts",
    initialState,
    reducers: {
        resetNewAddedCommunication: (state) => {
            state.newAddedCommunication = 0;
        }
    },
    extraReducers: {
        [getDrafts.fulfilled]: (state, action) => {
            state.drafts = action.payload
            state.isLoading = false
        },
        [getDrafts.pending] : state => {
            state.isLoading = true
        },
        [addDraft.fulfilled] :(state, action) => {
            alert('Succesfully saved as draft!')
        },
        [updateDraft.fulfilled] :(state, action) => {
            if(action.payload === 'draft_saved'){
                alert('Draft Updated!')
            }else{
                state.newAddedCommunication = action.payload.communication
                state.userToNotify = action.payload.userToNotify
                alert('Added Succesfully!')
            }
        },
        [discardDraft.fulfilled] :() => {
            alert('Succesfully deleted!')
        },
    }
})

export const {resetNewAddedCommunication} = draftsSlice.actions;
export default draftsSlice.reducer;