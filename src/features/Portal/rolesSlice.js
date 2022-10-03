/*
  Roles Reducer
   This file is responsible for managing states of the roles and permission module.
*/
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
const apiServer = process.env.REACT_APP_API_URL;

export const getRoles = createAsyncThunk("roles/getRoles", async () => {
  return await fetch(apiServer + "/getRoles", {
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + Cookies.get("accessToken"),
    },
  }).then((res) => res.json());
});

export const getPermissions = createAsyncThunk(
  "roles/getPermissions",
  async () => {
    return await fetch(apiServer + "/getPermissions", {
      method: "get",
      headers: {
        Authorization: "Bearer " + Cookies.get("accessToken"),
      },
    }).then((res) => res.json());
  }
);

export const addRole = createAsyncThunk(
  "roles/addRole",
  async (role_permissions_data) => {
    return await fetch(apiServer + "/addRole", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + Cookies.get("accessToken"),
      },
      body: JSON.stringify(role_permissions_data),
    }).then((res) => res.json());
  }
);

export const getRolePermissions = createAsyncThunk(
  "roles/getRolePermissions",
  async (role_id) => {
    return await fetch(apiServer + "/getRolePermissions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + Cookies.get("accessToken"),
      },
      body: JSON.stringify({ role_id: role_id }),
    }).then((res) => res.json());
  }
);

export const deleteRole = createAsyncThunk(
  "roles/deleteRole",
  async (role_id, { getState }) => {
    return await fetch(apiServer + "/deleteRole", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + Cookies.get("accessToken"),
      },
      body: JSON.stringify({ role_id: role_id }),
    }).then((res) => res.json());
  }
);

export const updateRole = createAsyncThunk(
  "roles/updateRole",
  async (role_data) => {
    return await fetch(apiServer + "/updateRole", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + Cookies.get("accessToken"),
      },
      body: JSON.stringify(role_data),
    }).then((res) => res.json());
  }
);

export const getUserRolePermission = createAsyncThunk(
  "roles/getUserRolePermission",
  async () => {
    return await fetch(apiServer + "/getUserRolePermission", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + Cookies.get("accessToken"),
      },
    }).then((res) => res.json());
  }
);

const initialState = {
  roles: [],
  permissions: [],
  userPermissions: [],
  isLoading: false,
};
const rolesSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    setPermissions: (state, action) => {
      state.permissions = action.payload;
    },
  },
  extraReducers: {
    [getRoles.fulfilled]: (state, action) => {
      state.roles = action.payload;
      state.isLoading = false;
    },
    [getRoles.pending]: (state, action) => {
      state.isLoading = true;
    },
    [getPermissions.fulfilled]: (state, action) => {
      const permissions = action.payload.map((permission) => {
        return {
          perm_id: permission.perm_id,
          perm_name: permission.perm_name,
          isChecked: false,
        };
      });

      state.permissions = permissions;
    },
    [addRole.fulfilled]: (state, action) => {
      state.isLoading = false;
      alert("Succesfully Added!");
    },
    [addRole.rejected]: (state) => {
      state.isLoading = false;
    },
    [addRole.pending]: (state) => {
      state.isLoading = true;
    },
    [getRolePermissions.fulfilled]: (state, action) => {
      const samp = state.permissions.map((permission) => {
        if (action.payload.includes(permission.perm_name)) {
          return {
            perm_name: permission.perm_name,
            perm_id: permission.perm_id,
            isChecked: true,
          };
        } else {
          return {
            perm_name: permission.perm_name,
            perm_id: permission.perm_id,
            isChecked: false,
          };
        }
      });
      state.permissions = samp;
    },
    [updateRole.fulfilled]: (state, action) => {
      alert("Succesfully Updated");
    },
    [getUserRolePermission.fulfilled]: (state, action) => {
      state.userPermissions = action.payload
    }
  },
});

export const { setPermissions } = rolesSlice.actions;
export default rolesSlice.reducer;
