import { createSlice } from "@reduxjs/toolkit";
import {
  fetchRoles,
  createRoles,
  fetchFeatures,
  deleteRole,
  fetchCompetencyAdmins,
  updateUserRole,
  fetchAvailableAdmins,
  fetchTrainers,
  fetchUsers
} from "./roleAction";

const initialState = {
  roles: [],
  features: [],
  competencyAdmins: [],
  availableAdmins: [],
  trainers: [],
  users: [],
  roleLoading: false,
  featuresloading: false,
  createdrole: null,
  roleDetails: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    size: 10
  },
  error: null
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
      if (state.roleDetails) {
        state.roleDetails = null;
      }
    },
    resetCreatedRoles: (state) => {
      state.createdrole = null;
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
      // Create Resource
      .addCase(createRoles.pending, (state) => {
        state.roleLoading = true;
        state.error = null;
      })
      .addCase(createRoles.fulfilled, (state, { payload }) => {
        state.roleLoading = false;
        state.createdrole = payload;
        state.roles.unshift({
          id: payload.id || '',
          role: payload.role,
          features: payload.permission || []
        });
        state.pagination.totalItems += 1;
      })
      .addCase(createRoles.rejected, (state, { payload }) => {
        state.roleLoading = false;
        state.error = payload;
      })

      // Fetch Roles
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
        sessionStorage.setItem('role', JSON.stringify(state.roles));
      })
      .addCase(fetchRoles.rejected, (state, { payload }) => {
        state.roleLoading = false;
        state.error = payload;
      })

      // Delete Role
      .addCase(deleteRole.pending, (state) => {
        state.roleLoading = true;
      })
      .addCase(deleteRole.fulfilled, (state, { payload }) => {
        state.roleLoading = false;
        state.roles = state.roles.filter(data => data.id !== payload);
      })
      .addCase(deleteRole.rejected, (state, { payload }) => {
        state.roleLoading = false;
        state.error = payload;
      })

      // Fetch Features
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
      })

      // Fetch Competency Admins
      .addCase(fetchCompetencyAdmins.pending, (state) => {
        state.roleLoading = true;
        state.error = null;
      })
      .addCase(fetchCompetencyAdmins.fulfilled, (state, { payload, meta }) => {
        state.roleLoading = false;
        if (meta.arg) {
          state.competencyAdmins = payload;
        } else {
          state.availableAdmins = payload;
        }
      })
      .addCase(fetchCompetencyAdmins.rejected, (state, { payload }) => {
        state.roleLoading = false;
        state.error = payload;
      })

      // Update User Role
      .addCase(updateUserRole.pending, (state) => {
        state.roleLoading = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, { payload }) => {
        state.roleLoading = false;
        if (payload.action_type === 1) {
          state.competencyAdmins = state.competencyAdmins.concat(payload.data);
        } else if (payload.action_type === 2) {
          state.competencyAdmins = state.competencyAdmins.filter(
            admin => admin.userId !== payload.data[0]?.userId
          );
        }
      })
      .addCase(updateUserRole.rejected, (state, { payload }) => {
        state.roleLoading = false;
        state.error = payload;
      })

      // Fetch Available Admins
      .addCase(fetchAvailableAdmins.pending, (state) => {
        state.roleLoading = true;
        state.error = null;
      })
      .addCase(fetchAvailableAdmins.fulfilled, (state, { payload }) => {
        state.roleLoading = false;
        state.availableAdmins = payload;
      })
      .addCase(fetchAvailableAdmins.rejected, (state, { payload }) => {
        state.roleLoading = false;
        state.error = payload;
      })

      // Fetch Trainers
      .addCase(fetchTrainers.pending, (state) => {
        state.roleLoading = true;
        state.error = null;
      })
      .addCase(fetchTrainers.fulfilled, (state, { payload }) => {
        state.roleLoading = false;
        state.trainers = payload;
      })
      .addCase(fetchTrainers.rejected, (state, { payload }) => {
        state.roleLoading = false;
        state.error = payload;
      })

      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.roleLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, { payload }) => {
        state.roleLoading = false;
        state.users = payload;
      })
      .addCase(fetchUsers.rejected, (state, { payload }) => {
        state.roleLoading = false;
        state.error = payload;
      });
  }
});

export const {
  clearError,
  resetRolesDetails,
  resetCreatedRoles,
  setPage,
  setPageSize
} = roleSlice.actions;
export default roleSlice.reducer;