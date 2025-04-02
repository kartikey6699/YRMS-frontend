import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { OPPORTUNITY_API } from "../../config/Endpoints/Endpoints";

const opportunityApiClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

opportunityApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createOpportunity = createAsyncThunk(
  "opportunity/createOpportunity",
  async (opportunityData, { rejectWithValue }) => {
    try {
      const response = await opportunityApiClient.post(OPPORTUNITY_API.CREATE, opportunityData);
      const { success, data, message } = response.data;

      if (!success) {
        throw new Error(message || "Failed to create opportunity");
      }

      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create opportunity";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchOpportunities = createAsyncThunk(
  "opportunity/fetchOpportunities",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await opportunityApiClient.get(OPPORTUNITY_API.LIST(userId));
      const { success, data } = response.data;

      if (!success) {
        throw new Error("Failed to fetch opportunities");
      }

      return data.resourceOpportunities; 
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch opportunities";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchOpportunityDetails = createAsyncThunk(
  "opportunity/fetchOpportunityDetails",
  async (publicId, { rejectWithValue }) => {
    try {
      const response = await opportunityApiClient.get(`${OPPORTUNITY_API.DETAIL}/${publicId}`);
      if (!response.data.success) {
        throw new Error("Failed to fetch opportunity details");
      }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateOpportunity = createAsyncThunk(
  "opportunity/updateOpportunity",
  async ({ id, opportunityData }, { rejectWithValue }) => {
    try {
      const response = await opportunityApiClient.patch(`${OPPORTUNITY_API.UPDATE}/${id}`, opportunityData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteOpportunity = createAsyncThunk(
  "opportunity/deleteOpportunity",
  async (id, { rejectWithValue }) => {
    try {
      await opportunityApiClient.delete(`${OPPORTUNITY_API.DELETE}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
