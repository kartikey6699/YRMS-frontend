import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { CERTIFICATION_AUTHORITY } from "../../config/Endpoints/Endpoints";

const baselineApiClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

baselineApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Certification Authority CRUD Operations
export const fetchCertificationAuthorities = createAsyncThunk(
  "baseline/fetchCertificationAuthorities",
  async (_, { rejectWithValue }) => {
    try {
      const response = await baselineApiClient.get(CERTIFICATION_AUTHORITY.LIST);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createCertificationAuthority = createAsyncThunk(
  "baseline/createCertificationAuthority",
  async (name, { rejectWithValue }) => {
    try {
      const response = await baselineApiClient.post(
        CERTIFICATION_AUTHORITY.CREATE,
        { name }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateCertificationAuthority = createAsyncThunk(
  "baseline/updateCertificationAuthority",
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const response = await baselineApiClient.patch(
        `${CERTIFICATION_AUTHORITY.UPDATE}/${id}`,
        { name }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteCertificationAuthority = createAsyncThunk(
  "baseline/deleteCertificationAuthority",
  async (id, { rejectWithValue }) => {
    try {
      await baselineApiClient.delete(`${CERTIFICATION_AUTHORITY.DELETE}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Technology Category CRUD Operations
export const fetchTechnologyCategories = createAsyncThunk(
  "baseline/fetchTechnologyCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await baselineApiClient.get(CERTIFICATION_AUTHORITY.LIST);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createTechnologyCategory = createAsyncThunk(
  "baseline/createTechnologyCategory",
  async (name, { rejectWithValue }) => {
    try {
      const response = await baselineApiClient.post(
        CERTIFICATION_AUTHORITY.CREATE,
        { name }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateTechnologyCategory = createAsyncThunk(
  "baseline/updateTechnologyCategory",
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const response = await baselineApiClient.patch(
        `${CERTIFICATION_AUTHORITY.UPDATE}/${id}`,
        { name }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteTechnologyCategory = createAsyncThunk(
  "baseline/deleteTechnologyCategory",
  async (id, { rejectWithValue }) => {
    try {
      await baselineApiClient.delete(`${CERTIFICATION_AUTHORITY.DELETE}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Technology Stack CRUD Operations
export const fetchTechnologyStacks = createAsyncThunk(
  "baseline/fetchTechnologyStacks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await baselineApiClient.get(CERTIFICATION_AUTHORITY.LIST);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createTechnologyStack = createAsyncThunk(
  "baseline/createTechnologyStack",
  async (name, { rejectWithValue }) => {
    try {
      const response = await baselineApiClient.post(
        CERTIFICATION_AUTHORITY.CREATE,
        { name }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateTechnologyStack = createAsyncThunk(
  "baseline/updateTechnologyStack",
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const response = await baselineApiClient.patch(
        `${CERTIFICATION_AUTHORITY.UPDATE}/${id}`,
        { name }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteTechnologyStack = createAsyncThunk(
  "baseline/deleteTechnologyStack",
  async (id, { rejectWithValue }) => {
    try {
      await baselineApiClient.delete(`${CERTIFICATION_AUTHORITY.DELETE}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);