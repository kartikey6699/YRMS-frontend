import { createSlice } from "@reduxjs/toolkit";
import { adminLogin } from "./authAction";

const initialState = {
  isAuthenticated: false,
  loading: false,
  error: null,
  userData: null,
  token: null,
  competencyName: null, // Add competencyName to the initial state
};

const resetAuthState = (state) => {
  state.isAuthenticated = false;
  state.token = null;
  state.userData = null;
  state.competencyName = null; // Reset competencyName
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
        state.competencyName = payload.data.competencyName; // Set competency name in the store
        
        // Store all relevant data in sessionStorage
        sessionStorage.setItem("token", payload.token);
        sessionStorage.setItem("userName", payload.data.userName);
        sessionStorage.setItem("roleName", payload.data.rolesName);
        sessionStorage.setItem("competencyName", payload.data.competencyName);
        sessionStorage.setItem("userId", payload.data.publicId);
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