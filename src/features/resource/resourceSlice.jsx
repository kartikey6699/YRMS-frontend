import { createSlice } from "@reduxjs/toolkit";
import {
  createResource,
  fetchResources,
  fetchResourceDetails,
  fetchDesignations,
  createDesignation,
  updateDesignation,
  deleteDesignation,
  fetchCompetencies,
  createCompetency,
  updateCompetency,
  deleteCompetency,
  updateResource,
  fetchTrainingTechnologies,
  createTrainingTechnology,
  updateTrainingTechnology,
  deleteTrainingTechnology
} from "./resourceAction";

const initialState = {
  resources: [],
  resourceDetails: null,
  loading: false,
  error: null,
  designations: [],
  competencies: [],
  trainingTechnologies: [],
  designationLoading: false,
  competencyLoading: false,
  trainingTechnologyLoading: false,
  createdResource: null,
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

const resourceSlice = createSlice({
  name: "resource",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetResourceDetails: (state) => {
      if (state.resourceDetails) {
        state.resourceDetails = null;
      }
    },
    resetCreatedResource: (state) => {
      state.createdResource = null;
    },
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    setPageSize: (state, action) => {
      state.pagination.size = action.payload;
      state.pagination.currentPage = 1; // Reset to first page when page size changes
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Resource
      .addCase(createResource.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createResource.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.createdResource = payload;
        // Add the new resource to the beginning of the list
        state.resources.unshift({
          publicId: payload.publicId,
          employeeName: payload.employeeName,
          joiningDate: payload.joiningDate,
          designation: payload.designation,
          status: payload.status || "pool",
          email: payload.email,
          phoneNumber: payload.phoneNumber,
          gender: payload.gender,
          location: payload.location,
          businessGroup: payload.businessGroup,
          businessUnit: payload.businessUnit,
          competency: payload.competency,
          profileImage: payload.profileImage // Added profileImage
        });
        // Update total items count
        state.pagination.totalItems += 1;
      })
      .addCase(createResource.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Fetch Resources
      .addCase(fetchResources.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResources.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.resources = payload.users.map(user => ({
          publicId: user.publicId,
          employeeName: user.employeeName,
          joiningDate: user.joiningDate,
          designation: user.designation,
          status: user.status || "pool",
          email: user.email,
          phoneNumber: user.phoneNumber,
          gender: user.gender,
          location: user.location,
          businessGroup: user.businessGroup,
          businessUnit: user.businessUnit,
          competency: user.competency,
          technologies: user.technologies ? user.technologies.split(',') : [],
          experience: user.experience || 0,
          certifications: user.certification || "",
          communication: user.communication || "",
          profileImage: user.profileImage // Added profileImage
        }));
        
        // Update pagination info from API response
        if (payload.pagination) {
          state.pagination = {
            currentPage: payload.pagination.currentPage || 1,
            totalPages: payload.pagination.totalPages || 1,
            totalItems: payload.pagination.totalItems || 0,
            size: payload.pagination.size || 10
          };
        }
      })
      .addCase(fetchResources.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Update Resource
      .addCase(updateResource.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateResource.fulfilled, (state, { payload }) => {
        state.loading = false;

        // Update resource details if it's the current one being viewed
        if (state.resourceDetails?.publicId === payload.publicId) {
          state.resourceDetails = {
            ...state.resourceDetails,
            employeeId: payload.employeeId,
            designation: payload.designation,
            grade: payload.grade,
            joiningDate: payload.joiningDate,
            experience: payload.experience,
            status: payload.status,
            profileImage: payload.profileImage // Added profileImage
          };
        }

        // Update the resource in the list
        const index = state.resources.findIndex(r => r.publicId === payload.publicId);
        if (index !== -1) {
          state.resources[index] = {
            ...state.resources[index],
            employeeId: payload.employeeId,
            designation: payload.designation,
            joiningDate: payload.joiningDate,
            status: payload.status,
            profileImage: payload.profileImage // Added profileImage
          };
        }
      })
      .addCase(updateResource.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Fetch Resource Details
      .addCase(fetchResourceDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResourceDetails.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (isResourceDetailsDifferent(state.resourceDetails, payload)) {
          state.resourceDetails = {
            publicId: payload.publicId,
            employeeName: payload.employeeName,
            employeeId: payload.employeeId,
            designation: payload.designation,
            businessGroup: payload.businessGroup,
            businessUnit: payload.businessUnit,
            location: payload.location,
            phoneNumber: payload.phoneNumber,
            email: payload.email,
            joiningDate: payload.joiningDate,
            status: payload.status || "pool",
            grade: payload.grade,
            experience: payload.experience || 0,
            competency: payload.competency,
            technologies: payload.technologies ? payload.technologies.split(',') : [],
            certifications: payload.certification || "",
            communication: payload.communication || "",
            profileImage: payload.profileImage // Added profileImage
          };
        }
      })
      .addCase(fetchResourceDetails.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Designations
      .addCase(fetchDesignations.pending, (state) => {
        state.designationLoading = true;
      })
      .addCase(fetchDesignations.fulfilled, (state, { payload }) => {
        state.designationLoading = false;
        state.designations = payload.data?.designations?.map(item => ({
          publicId: item.publicId,
          name: item.name
        })) || [];
      })
      .addCase(fetchDesignations.rejected, (state, { payload }) => {
        state.designationLoading = false;
        state.error = payload;
      })

      .addCase(createDesignation.pending, (state) => {
        state.designationLoading = true;
      })
      .addCase(createDesignation.fulfilled, (state, { payload }) => {
        state.designationLoading = false;
        state.designations.push({
          publicId: payload.publicId,
          name: payload.name
        });
      })
      .addCase(createDesignation.rejected, (state, { payload }) => {
        state.designationLoading = false;
        state.error = payload;
      })

      .addCase(updateDesignation.pending, (state) => {
        state.designationLoading = true;
      })
      .addCase(updateDesignation.fulfilled, (state, { payload }) => {
        state.designationLoading = false;
        const index = state.designations.findIndex(d => d.publicId === payload.publicId);
        if (index !== -1) {
          state.designations[index].name = payload.name;
        }
      })
      .addCase(updateDesignation.rejected, (state, { payload }) => {
        state.designationLoading = false;
        state.error = payload;
      })

      .addCase(deleteDesignation.pending, (state) => {
        state.designationLoading = true;
      })
      .addCase(deleteDesignation.fulfilled, (state, { payload }) => {
        state.designationLoading = false;
        state.designations = state.designations.filter(d => d.publicId !== payload.publicId);
      })
      .addCase(deleteDesignation.rejected, (state, { payload }) => {
        state.designationLoading = false;
        state.error = payload;
      })

      // Competencies
      .addCase(fetchCompetencies.pending, (state) => {
        state.competencyLoading = true;
      })
      .addCase(fetchCompetencies.fulfilled, (state, { payload }) => {
        state.competencyLoading = false;
        state.competencies = payload.data?.competencies?.map(item => ({
          publicId: item.publicId,
          name: item.name
        })) || [];
      })
      .addCase(fetchCompetencies.rejected, (state, { payload }) => {
        state.competencyLoading = false;
        state.error = payload;
      })

      .addCase(createCompetency.pending, (state) => {
        state.competencyLoading = true;
      })
      .addCase(createCompetency.fulfilled, (state, { payload }) => {
        state.competencyLoading = false;
        state.competencies.push({
          publicId: payload.publicId,
          name: payload.name
        });
      })
      .addCase(createCompetency.rejected, (state, { payload }) => {
        state.competencyLoading = false;
        state.error = payload;
      })

      .addCase(updateCompetency.pending, (state) => {
        state.competencyLoading = true;
      })
      .addCase(updateCompetency.fulfilled, (state, { payload }) => {
        state.competencyLoading = false;
        const index = state.competencies.findIndex(c => c.publicId === payload.publicId);
        if (index !== -1) {
          state.competencies[index].name = payload.name;
        }
      })
      .addCase(updateCompetency.rejected, (state, { payload }) => {
        state.competencyLoading = false;
        state.error = payload;
      })

      .addCase(deleteCompetency.pending, (state) => {
        state.competencyLoading = true;
      })
      .addCase(deleteCompetency.fulfilled, (state, { payload }) => {
        state.competencyLoading = false;
        state.competencies = state.competencies.filter(c => c.publicId !== payload.publicId);
      })
      .addCase(deleteCompetency.rejected, (state, { payload }) => {
        state.competencyLoading = false;
        state.error = payload;
      })
      // Training Technologies
      .addCase(fetchTrainingTechnologies.pending, (state) => {
        state.trainingTechnologyLoading = true;
      })
      .addCase(fetchTrainingTechnologies.fulfilled, (state, { payload }) => {
        state.trainingTechnologyLoading = false;
        state.trainingTechnologies = payload.Technologies.map((item) => ({
          publicId: item.publicId,
          name: item.name,
          technologyCategoryId: item.technologyCategoryId,
          technologyCategoryName: item.technologyCategoryName,
        }));
      })
      .addCase(fetchTrainingTechnologies.rejected, (state, { payload }) => {
        state.trainingTechnologyLoading = false;
        state.error = payload;
      })

      .addCase(createTrainingTechnology.pending, (state) => {
        state.trainingTechnologyLoading = true;
      })
      .addCase(createTrainingTechnology.fulfilled, (state, { payload }) => {
        state.trainingTechnologyLoading = false;
        state.trainingTechnologies.push({
          publicId: payload.publicId,
          name: payload.name,
          technologyCategoryId: payload.technologyCategoryId,
          technologyCategoryName: payload.technologyCategoryName,
        });
      })
      .addCase(createTrainingTechnology.rejected, (state, { payload }) => {
        state.trainingTechnologyLoading = false;
        state.error = payload;
      })

      .addCase(updateTrainingTechnology.pending, (state) => {
        state.trainingTechnologyLoading = true;
      })
      .addCase(updateTrainingTechnology.fulfilled, (state, { payload }) => {
        state.trainingTechnologyLoading = false;
        const index = state.trainingTechnologies.findIndex((t) => t.publicId === payload.publicId);
        if (index !== -1) {
          state.trainingTechnologies[index] = {
            publicId: payload.publicId,
            name: payload.name,
            technologyCategoryId: payload.technologyCategoryId,
            technologyCategoryName: payload.technologyCategoryName,
          };
        }
      })
      .addCase(updateTrainingTechnology.rejected, (state, { payload }) => {
        state.trainingTechnologyLoading = false;
        state.error = payload;
      })

      .addCase(deleteTrainingTechnology.pending, (state) => {
        state.trainingTechnologyLoading = true;
      })
      .addCase(deleteTrainingTechnology.fulfilled, (state, { payload }) => {
        state.trainingTechnologyLoading = false;
        state.trainingTechnologies = state.trainingTechnologies.filter((t) => t.publicId !== payload);
      })
      .addCase(deleteTrainingTechnology.rejected, (state, { payload }) => {
        state.trainingTechnologyLoading = false;
        state.error = payload;
      });
  }
});

export const { 
  clearError, 
  resetResourceDetails, 
  resetCreatedResource,
  setPage,
  setPageSize
} = resourceSlice.actions;
export default resourceSlice.reducer;