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
    async (_, { rejectWithValue }) => {
      try {
        const response = await analyticsApiClient.get(
          `${ANALYTICS.RESOURCE_ANALYTICS}`
        );
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
);

export const fetchTrainingAnalytics = createAsyncThunk(
  "analytics/fetchTrainingAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await analyticsApiClient.get(
        `${ANALYTICS.TRAINING_ANALYTICS}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchInternAnalytics = createAsyncThunk(
  "analytics/fetchInternAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await analyticsApiClient.get(
        `${ANALYTICS.INTERN_ANALYTICS}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);