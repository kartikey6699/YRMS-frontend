import { createSlice } from "@reduxjs/toolkit";
import {
  upsertManager,
  fetchManagers,
  deleteManager
} from "./managerAction";

const initialState = {
  managers: [],
  loading: false,
  error: null,
};

const managerSlice = createSlice({
  name: "manager",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetManagers: (state) => {
      state.managers = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Upsert Manager
      .addCase(upsertManager.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(upsertManager.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(upsertManager.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Fetch Managers
      .addCase(fetchManagers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchManagers.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.managers = payload;
      })
      .addCase(fetchManagers.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Delete Manager
      .addCase(deleteManager.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteManager.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.managers = state.managers.filter(manager => manager.id !== payload);
      })
      .addCase(deleteManager.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  }
});

export const { clearError, resetManagers } = managerSlice.actions;
export default managerSlice.reducer;
