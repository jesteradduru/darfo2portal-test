/*
  Classifications Reducer
   This file is responsible for managing states of the management of classifications
*/
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
const apiServer = process.env.REACT_APP_API_URL;
export const getClassifications = createAsyncThunk(
  "classifications/getClassifications",
  async () => {
    return await fetch(apiServer + "/dts/getClassifications", {
      method: "get",
      headers: {
        Authorization: "Bearer " + Cookies.get("accessToken"),
      },
    })
      .then((res) => res.json())
      .catch("Something went wrong!");
  }
);

export const getCategories = createAsyncThunk(
  "classifications/getCategories",
  async () => {
    return await fetch(apiServer + "/dts/getCategories", {
      method: "get",
      headers: {
        Authorization: "Bearer " + Cookies.get("accessToken"),
      },
    })
      .then((res) => res.json())
      .catch("Something went wrong!");
  }
);

export const addCategory = createAsyncThunk(
  "classifications/addCategory",
  async (formData) => {
    return await fetch(apiServer + "/dts/addCategory", {
      method: "post",
      headers: {
        "Authorization": "Bearer " + Cookies.get("accessToken"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData)
    })
      .then((res) => res.json())
      .catch(err => console.log(err));
  }
);

export const deleteCategory = createAsyncThunk(
  "classifications/deleteCategory",
  async (cat_id) => {
    return await fetch(apiServer + "/dts/deleteCategory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + Cookies.get("accessToken"),
      },
      body: JSON.stringify({ cat_id: cat_id }),
    }).then((res) => res.json());
  }
);

export const updateCategory = createAsyncThunk(
  "classifications/updateCategory",
  async (category_data) => {
    return await fetch(apiServer + "/dts/updateCategory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + Cookies.get("accessToken"),
      },
      body: JSON.stringify(category_data),
    }).then((res) => res.json());
  }
);

export const addClassification = createAsyncThunk(
  "classifications/addClassification",
  async (classification) => {
    return await fetch(apiServer + "/dts/addClassification", {
      method: "post",
      headers: {
        "Authorization": "Bearer " + Cookies.get("accessToken"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(classification)
    })
      .then((res) => res.json())
      .catch(err => console.log(err));
  }
);

export const updateClassification = createAsyncThunk(
  "classifications/updateClassification",
  async (classification) => {
    return await fetch(apiServer + "/dts/updateClassification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + Cookies.get("accessToken"),
      },
      body: JSON.stringify(classification),
    }).then((res) => res.json());
  }
);

export const deleteClassification = createAsyncThunk(
  "classifications/deleteClassification",
  async (class_id) => {
    return await fetch(apiServer + "/dts/deleteClassification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + Cookies.get("accessToken"),
      },
      body: JSON.stringify({ class_id: class_id }),
    }).then((res) => res.json());
  }
);


const initialState = {
  classifications: [],
  categories: [],
  isLoading: false,
};

const classifications = createSlice({
  name: "classifications",
  initialState,
  extraReducers: {
    [getClassifications.pending]: (state) => {
      state.isLoading = true;
    },
    [getClassifications.fulfilled]: (state, action) => {
      state.classifications = action.payload;
      state.isLoading = false;
    },
    [getClassifications.rejected]: (state) => {
      state.isLoading = false;
    },
    [getCategories.pending]: (state) => {
      state.isLoading = true;
    },
    [getCategories.fulfilled]: (state, action) => {
      state.categories = action.payload;
      state.isLoading = false;
    },
    [getCategories.rejected]: (state) => {
      state.isLoading = false;
    },
  },
});

export default classifications.reducer;
