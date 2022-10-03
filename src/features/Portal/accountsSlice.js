/*
  Accounts Reducer
   This file manage the states of the Account module
*/

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
const apiServer = process.env.REACT_APP_API_URL;
export const getAccounts = createAsyncThunk(
  "account/getAccounts",
  async (arg, { getState }) => {
    return await fetch(apiServer + "/getUsers", {
      headers: {
        Authorization: "Bearer " + Cookies.get("accessToken"),
      },
    }).then((res) => res.json());
  }
);

export const createAccount = createAsyncThunk(
  "account/createAccount",
  async (form_data) => {
    return await fetch(apiServer + "/createAccount", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + Cookies.get("accessToken"),
      },
      body: JSON.stringify(form_data),
    })
    .then((res) => res.json())
    .then(data => alert(`${data[0].user_username} succesfully added!`));
  }
);

export const updateAccount = createAsyncThunk(
  "account/updateAccount",
  async (form_data, { getState }) => {
    return await fetch(apiServer + "/updateAccount", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + Cookies.get("accessToken"),
      },
      body: JSON.stringify(form_data),
    })
    .then((res) => res.json())
    .then(data => alert(data.user_username + "'s account was updated."))
  }
);

export const deleteAccount = createAsyncThunk(
  "account/deleteAccount",
  async (user_id, { getState }) => {
    return await fetch(apiServer + "/deleteAccount", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + Cookies.get("accessToken"),
      },
      body: JSON.stringify({ user_id: user_id }),
    })
      .then((res) => res.json())
      .then((data) => alert(data + "."));
  }
);

export const getGroups = createAsyncThunk(
  'account/getGroups',
  async() => {
    return await fetch(apiServer + '/getGroups', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + Cookies.get('accessToken')
      }
    }).then(res => res.json())
  }
)

const initialState = {
  users: [],
  isLoading: false,
  groups: [],
};

const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  extraReducers: {
    [getAccounts.pending]: (state) => {
      state.isLoading = true;
    },
    [getAccounts.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.users = action.payload;
    },
    [getAccounts.rejected]: (state) => {
      state.isLoading = false;
    },
    [getGroups.fulfilled]: (state, action) => {
      state.groups = action.payload
    }
  },
});

// export const {} = accountsSlice.actions;
export default accountsSlice.reducer;
