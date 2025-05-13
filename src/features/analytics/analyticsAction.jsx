import axios from "axios";
import { ANALYTICS } from "../../config/Endpoints/Endpoints";
import { createAsyncThunk } from "@reduxjs/toolkit";

const analyticsApiClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

analyticsApiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

analyticsApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      sessionStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const fetchResourceAnalytics = createAsyncThunk(
  "analytics/fetchResourceAnalytics",
  async (competencyId, { rejectWithValue }) => {
    try {
      const url = competencyId
        ? `${ANALYTICS.RESOURCE_ANALYTICS}?competency_public_id=${competencyId}`
        : ANALYTICS.RESOURCE_ANALYTICS;

      const response = await analyticsApiClient.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchTrainingAnalytics = createAsyncThunk(
  "analytics/fetchTrainingAnalytics",
  async (competencyId, { rejectWithValue }) => {
    try {
      const url = competencyId
        ? `${ANALYTICS.TRAINING_ANALYTICS}?competency_public_id=${competencyId}`
        : ANALYTICS.TRAINING_ANALYTICS;

      const response = await analyticsApiClient.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchInternAnalytics = createAsyncThunk(
  "analytics/fetchInternAnalytics",
  async (competencyId, { rejectWithValue }) => {
    try {
      const url = competencyId
        ? `${ANALYTICS.INTERN_ANALYTICS}?competency_public_id=${competencyId}`
        : ANALYTICS.INTERN_ANALYTICS;

      const response = await analyticsApiClient.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);