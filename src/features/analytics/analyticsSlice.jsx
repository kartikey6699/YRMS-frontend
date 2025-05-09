import { createSlice } from "@reduxjs/toolkit";
import { fetchInternAnalytics, fetchResourceAnalytics, fetchTrainingAnalytics } from "./analyticsAction";

const initialState = {
  resourceData: {
    deploymentStatus: {},
    designationDistribution: [],
    experienceDeployment: {},
    locationDistribution: {},
    employmentTypeDistribution: {},
    ratingDistribution: {},
    interviewPerformance: {}
  },
  trainingData: {
    programStatus: {},
    technologyPrograms: {},
    startTrends: [],
    requesters: {}
  },
  internData: {
    statusDistribution: {},
    joiningTrends: [],
    mentorDistribution: {},
    locationDistribution: {}
  },
  loading: false,
  error: null
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchResourceAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResourceAnalytics.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.resourceData = payload.data;
      })
      .addCase(fetchResourceAnalytics.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(fetchTrainingAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrainingAnalytics.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.trainingData = payload.data;
      })
      .addCase(fetchTrainingAnalytics.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(fetchInternAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInternAnalytics.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.internData = payload.data;
      })
      .addCase(fetchInternAnalytics.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  }
});

export default analyticsSlice.reducer;