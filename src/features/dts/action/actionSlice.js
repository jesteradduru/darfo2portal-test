/*
  Action taken Reducer
   This file is responsible for managing states of the management of action taken
*/
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
const apiServer = process.env.REACT_APP_API_URL;

export const addActionTaken = createAsyncThunk(
  "action/addActionTaken",
  async (formData) => {
    return await fetch(apiServer + "/dts/addActionTaken", {
      method: "post",
      headers: {
        Authorization: "Bearer " + Cookies.get("accessToken"),
      },
      body: formData,
    })
      .then((res) => res.json())
      .catch(err => console.log("Something went wrong!"));
  }
);

export const getActionTaken = createAsyncThunk(
  "action/getActionTaken",
  async (args) => {
    return await fetch(apiServer + "/dts/getActionTaken", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + Cookies.get("accessToken"),
      },
      body: JSON.stringify({
        inbox_id: args.inbox_id,
        com_id: args.com_id,
      }),
    })
      .then((res) => res.json())
      .catch("Something went wrong!");
  }
);

export const reviewActionTaken = createAsyncThunk(
  "action/reviewActionTaken",
  async (args) => {
    return await fetch(apiServer + "/dts/reviewActionTaken", {
      method: "post",
      headers: {
        // 'Content-Type': 'application/json',
        Authorization: "Bearer " + Cookies.get("accessToken"),
      },
      body: args
    })
      .then((res) => res.json())
      .catch(err => console.log("Something went wrong!"));
  }
);

export const reforwardForAction = createAsyncThunk(
  "action/reforwardForAction",
  async (args) => {
    return await fetch(apiServer + "/dts/reforwardForAction", {
      method: "post",
      headers: {
        'Content-Type': 'application/json',
        Authorization: "Bearer " + Cookies.get("accessToken"),
      },
      body: JSON.stringify(args),
    })
      .then((res) => res.json())
      .catch(err => console.log("Something went wrong!"));
  }
);

const initialState = {
  reviewActionTakenData: {},
  actor: {},
  addLoading: false,
  last_touch: {},
  rejectedBy: {},
  isLoading: false,
  errorMessage: null,
};

const actionSlice = createSlice({
  name: "action",
  initialState,
  extraReducers: {
    [getActionTaken.fulfilled]: (state, action) => {
        state.reviewActionTakenData = action.payload.action_taken
        state.actor = action.payload.user
        state.last_touch = action.payload.last_touch
        state.rejectedBy = action.payload.rejectedBy
        state.isLoading = false;
    },
    [getActionTaken.pending]: (state) => {
        state.isLoading = true;
    },
    [getActionTaken.rejected]: (state, action) => {
        state.errorMessage = action.payload
        state.isLoading = false;
    },
    [reviewActionTaken.fulfilled]: (state, action) => {
      state.addLoading = false;
      if(action.payload.act_status === 'approved') {
        console.log('okay')
      }
    },
    [reviewActionTaken.pending]: (state, action) => {
      state.addLoading = true;
    },
    [reviewActionTaken.rejected]: (state, action) => {
      state.addLoading = false;
    },
    [addActionTaken.fulfilled]: (state, action) => {
      state.addLoading = false;
      if(action.payload.act_status === 'approved') {
        console.log('okay')
      }
    },
    [addActionTaken.pending]: (state, action) => {
      state.addLoading = true;
    },
    [addActionTaken.rejected]: (state, action) => {
      state.addLoading = false;
    },
  },
});

export default actionSlice.reducer;
