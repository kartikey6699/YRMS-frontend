import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RESOURCE_API } from "../../config/Endpoints/Endpoints";

const resourceApiClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

export const createResource = createAsyncThunk(
  "resource/createResource",
  async (resourceData, { rejectWithValue }) => {
    try {
      const response = await resourceApiClient.post(
        RESOURCE_API.CREATE_RESOURCE,
        resourceData
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create resource";
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch list of resources
export const fetchResources = createAsyncThunk(
  "resource/fetchResources",
  async (_, { rejectWithValue }) => {
    try {
      const response = await resourceApiClient.get(RESOURCE_API.LIST_RESOURCES);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch resources";
      return rejectWithValue(errorMessage);
    }
  }
);