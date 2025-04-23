import { createSlice } from "@reduxjs/toolkit";
import { adminLogin } from "./authAction";

const initialState = {
  isAuthenticated: false,
  loading: false,
  error: null,
  userData: null,
  token: null,
};

const resetAuthState = (state) => {
  state.isAuthenticated = false;
  state.token = null;
  state.userData = null;
  state.error = null;
  localStorage.removeItem("token");
  localStorage.removeItem("isAdmin");
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userLogout: (state) => {
      resetAuthState(state);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = payload.token;
        state.userData = payload.data || {};
        
        // Store all relevant data in sessionStorage
        sessionStorage.setItem("token", payload.token);
        sessionStorage.setItem("userName", payload.data.userName);
        sessionStorage.setItem("roleName", payload.data.rolesName);
      })
      .addCase(adminLogin.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        resetAuthState(state);
      });
  },
});

export const { userLogout, clearError } = authSlice.actions;
export default authSlice.reducer;