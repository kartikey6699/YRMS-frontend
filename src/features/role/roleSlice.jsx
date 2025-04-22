import { createSlice } from "@reduxjs/toolkit";
import {
  fetchRoles
} from "./roleAction";
import { fetchFeatures } from "./roleAction";

const initialState = {
  roles: [],
  features: [],
  roleLoading: false,
  featuresloading: false,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    size: 10
  }
};

const isResourceDetailsDifferent = (current, incoming) => {
  if (!current || !incoming) return true;
  const comparableFields = ['publicId', 'employeeName', 'employeeId', 'designation', 'status'];
  return comparableFields.some(field => current[field] !== incoming[field]);
};

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetRolesDetails: (state) => {
      if (state.resourceDetails) {
        state.resourceDetails = null;
      }
    },
    resetCreatedRoles: (state) => {
      state.createdRoles = null;
    },
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    setPageSize: (state, action) => {
      state.pagination.size = action.payload;
      state.pagination.currentPage = 1;
    }
  },
  extraReducers: (builder) => {
    builder

      // Fetch Roles (New)
      .addCase(fetchRoles.pending, (state) => {
        state.roleLoading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, { payload }) => {
        state.roleLoading = false;
        state.roles = payload.map(item => ({
          id: item?.id,
          role: item?.role,
          features: item?.permission
        }));
      })
      .addCase(fetchRoles.rejected, (state, { payload }) => {
        state.roleLoading = false;
        state.error = payload;
      })

      // Fetch Feature (New)
      .addCase(fetchFeatures.pending, (state) => {
        state.featuresloading = true;
        state.error = null;
      })
      .addCase(fetchFeatures.fulfilled, (state, { payload }) => {
        state.featuresloading = false;
        state.features = payload.map(item => ({
          id: item?.id,
          name: item?.name,
          path: item?.path,
          method: item?.method
        }));
      })
      .addCase(fetchFeatures.rejected, (state, { payload }) => {
        state.featuresloading = false;
        state.error = payload;
      });
    }
});

export const {
  clearError,
  resetRoleDetails,
  resetCreatedRole,
  setPage,
  setPageSize
} = roleSlice.actions;
export default roleSlice.reducer;