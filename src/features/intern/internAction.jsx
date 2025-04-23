import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { INTERN_API } from "../../config/Endpoints/Endpoints";

const internApiClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

internApiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createIntern = createAsyncThunk(
  "intern/createIntern",
  async (internData, { rejectWithValue }) => {
    try {
      const response = await internApiClient.post(INTERN_API.CREATE, internData);
      const { success, data, message } = response.data;

      if (!success) {
        throw new Error(message || "Failed to create intern");
      }

      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create intern";
      return rejectWithValue(errorMessage);
    }
  }
);


export const fetchInterns = createAsyncThunk(
  "mentor/fetchInterns",
  async (
    {
      mentor,
      startDate,
      endDate,
      page = 1, // Added page parameter
      size = 1000 // Added pageSize parameter
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams({
        ...(mentor && { mentor }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        page, // Include page in the request
        size // Include pageSize in the request
      });

      const response = await internApiClient.get(
        `${INTERN_API.LIST}?${params.toString()}`
      );
      const { success, data } = response.data;

      if (!success) {
        throw new Error("Failed to fetch interns");
      }

      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch interns";
      return rejectWithValue(errorMessage);
    }
  }
);


export const fetchInternDetails = createAsyncThunk(
  "intern/fetchInternDetails",
  async (publicId, { rejectWithValue }) => {
    try {
      const response = await internApiClient.get(`${INTERN_API.DETAIL}/${publicId}`);
      if (!response.data.success) {
        throw new Error("Failed to fetch intern details");
      }
      return response.data.data.interns;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateIntern = createAsyncThunk(
  "intern/updateIntern",
  async ({ publicId, internData }, { rejectWithValue }) => {
    try {
      const response = await internApiClient.patch(`${INTERN_API.UPDATE}/${publicId}`, internData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteIntern = createAsyncThunk(
  "intern/deleteIntern",
  async (id, { rejectWithValue }) => {
    try {
      await internApiClient.delete(`${INTERN_API.DELETE}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
