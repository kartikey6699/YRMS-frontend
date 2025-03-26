import { createSlice } from "@reduxjs/toolkit";
import { createResource, fetchResources } from "./resourceAction";

const initialState = {
  resources: [],
  loading: false,
  error: null,
};

const resourceSlice = createSlice({
  name: "resource",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createResource.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createResource.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.resources.push(payload);
      })
      .addCase(createResource.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(fetchResources.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResources.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.resources = payload;
      })
      .addCase(fetchResources.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { clearError } = resourceSlice.actions;
export default resourceSlice.reducer;