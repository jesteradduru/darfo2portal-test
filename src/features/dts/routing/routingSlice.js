/*
  Routing Reducer
   This file is responsible for managing states of the management of routing
*/
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
const apiServer = process.env.REACT_APP_API_URL;
const initialState = {
    viewRoutingData: [],
    routingRecipients: [],
    routingData: {},
    userToNotify: null,
    tasks: [],
    initialRoutingSlips: [],
    isLoading: false,
    addRoutingLoading: false,
    errorMessage: null
};

export const addInitialRouting = createAsyncThunk(
    'routing/addInitialRouting',
    async (formDataObject) => {
        return await fetch(apiServer + '/dts/addInitialRouting', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + Cookies.get('accessToken')
            },
            body: JSON.stringify(formDataObject)
        })
        .then(res => res.json())
    }
)

export const addForRouting = createAsyncThunk(
    'routing/addForRouting',
    async (formDataObject) => {
        return await fetch(apiServer + '/dts/addForRouting/', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + Cookies.get('accessToken')
            },
            body: JSON.stringify(formDataObject)
        })
        .then(res => res.json())
    }
)

export const routeCommunication = createAsyncThunk(
    'routing/routeCommunication',
    async (formDataObject) => {
        return await fetch(apiServer + '/dts/routeCommunication/', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + Cookies.get('accessToken')
            },
            body: JSON.stringify(formDataObject)
        })
        .then(res => res.json())
    }
)

export const getRouting = createAsyncThunk(
    'routing/getRouting',
    async (args) => {
        return await fetch(apiServer + '/dts/getRouting/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + Cookies.get('accessToken')
            },
            body: JSON.stringify(args)
        }).then(res => res.json())
    }
)
export const getRoutingSlips = createAsyncThunk(
    'routing/getRoutingSlips',
    async (args) => {
        return await fetch(apiServer + '/dts/getRoutingSlips/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + Cookies.get('accessToken')
            },
            body: JSON.stringify(args)
        }).then(res => res.json())
    }
)

const routing = createSlice({
    name: 'routing',
    initialState,
    reducers: {
        setRoutingRecipients: (state, action) => {
            const recipients = state.routingRecipients;
            action.payload.forEach(item => {
                recipients.push(item)
            });
            state.routingRecipients = recipients;
        },
        changeRecipient: (state, action) => {
            const { oldRecipientValue, newRecipient} = action.payload;
            const recipients = state.routingRecipients.filter(recipient => recipient.value !== oldRecipientValue);
            recipients.push(newRecipient);
            state.routingRecipients = recipients;
            console.log(state.routingRecipients)
        },
        setGroupRecipient: (state, action) => {
            const recipients = state.routingRecipients.map(recipient => {
                if(recipient.type === 'group' && action.payload.group_id === recipient.value){
                    return {...recipient, recipients: action.payload.recipients}
                }else{
                    return recipient
                }
            });
            state.routingRecipients = recipients;

        },
        closeTab: (state, action) => {
            const recipients = state.routingRecipients.filter(recipient => recipient.value !== action.payload);
            state.routingRecipients = recipients;
        },
        resetRoutingData: (state) => {
            state.routingData = {}
        }
    },
    extraReducers: {
        [addInitialRouting.fulfilled]: (state, action) => {
            const {routingData} = action.payload
            state.routingData = routingData;
            state.errorMessage = null
            state.addRoutingLoading = false;
        },
        [addInitialRouting.pending]: (state, action) => {
            state.addRoutingLoading = true;
        },
        [addInitialRouting.rejected]: (state, action) => {
            state.addRoutingLoading = false;
            console.log('Something Went Wrong.')
            console.log(action.payload)
        },
        [routeCommunication.fulfilled]: (state, action) => {
            const {routingData} = action.payload
            state.routingData = routingData;
            state.errorMessage = null
            state.addRoutingLoading = false
        },
        [routeCommunication.pending]: (state, action) => {
            state.addRoutingLoading = true;
        },
        [routeCommunication.rejected]: (state, action) => {
            state.addRoutingLoading = false;
            console.log('Something Went Wrong.')
            console.log(action.payload)
        },
        [addForRouting.fulfilled]: (state, action) => {
            const {routingData} = action.payload
            state.routingData = routingData;
            state.addRoutingLoading = false
            state.errorMessage = null
        },
        [addForRouting.pending]: (state, action) => {
            state.addRoutingLoading = true;
        },
        [addForRouting.rejected]: (state, action) => {
            state.addRoutingLoading = false;
            console.log('Something Went Wrong.')
            console.log(action.payload)
        },
        [getRoutingSlips.fulfilled]: (state, action) => {
            state.routingRecipients = action.payload
            state.isLoading = false
            state.errorMessage = null
        },
        [getRoutingSlips.pending]: (state, action) => {
            state.isLoading = true
            state.errorMessage = null
        },
        [getRouting.pending]: (state, action) => {
            state.isLoading = true
            state.errorMessage = null
        },
        [getRouting.rejected]: (state, action) => {
            state.isLoading = false
            state.errorMessage = 'Something went wrong'
        },
        [getRouting.fulfilled]: (state, action) => {
            state.viewRoutingData = action.payload
            state.isLoading = false
            state.errorMessage = null
        }
    }
})


export const {setRoutingRecipients, closeTab, changeRecipient, setGroupRecipient, resetRoutingData} = routing.actions;
export default routing.reducer;