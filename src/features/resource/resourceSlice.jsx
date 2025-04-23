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
  deleteTrainingTechnology,
  fetchTechnologies,
  deleteResource
} from "./resourceAction";

const initialState = {
  resources: [],
  trainers: [],
  participants: [],
  resourceDetails: null,
  loading: false,
  error: null,
  designations: [],
  competencies: [],
  trainingTechnologies: [],
  technologies: [],
  designationLoading: false,
  competencyLoading: false,
  trainingTechnologyLoading: false,
  technologyLoading: false,
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
      state.pagination.currentPage = 1;
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
          profileImage: payload.profileImage
        });
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

        // Store all resources (if needed)
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
          techSkill: user.techSkill || [],
          experience: user.experience || 0,
          certifications: user.certification || "",
          communication: user.communication || "",
          profileImage: user.profileImage,
          programs: user.programs || [],
          roleIds: user.roleIds || []
        }));

        // Separate trainers (role_id=4)
        state.trainers = payload.users
          .filter(user => user.roleIds?.includes(4))
          .map(user => ({
            publicId: user.publicId,
            employeeName: user.employeeName,
            roleIds: user.roleIds
          }));

        // Store participants (role_id=3) - include even if they're also trainers
        state.participants = payload.users
          .filter(user => user.roleIds?.includes(3))
          .map(user => ({
            publicId: user.publicId,
            employeeName: user.employeeName,
            roleIds: user.roleIds
          }));

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

        if (state.resourceDetails?.publicId === payload.publicId) {
          state.resourceDetails = {
            ...state.resourceDetails,
            employeeId: payload.employeeId,
            designation: payload.designation,
            grade: payload.grade,
            joiningDate: payload.joiningDate,
            experience: payload.experience,
            status: payload.status,
            profileImage: payload.profileImage
          };
        }

        const index = state.resources.findIndex(r => r.publicId === payload.publicId);
        if (index !== -1) {
          state.resources[index | 0] = {
            ...state.resources[index | 0],
            employeeId: payload.employeeId,
            designation: payload.designation,
            joiningDate: payload.joiningDate,
            status: payload.status,
            profileImage: payload.profileImage
          };
        }
      })
      .addCase(updateResource.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      .addCase(deleteResource.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteResource.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.resources = state.resources.filter(
          (resource) => resource.publicId !== payload
        );
        state.pagination.totalItems -= 1;

        // Clear resource details if viewing the deleted resource
        if (state.resourceDetails?.publicId === payload) {
          state.resourceDetails = null;
        }
      })
      .addCase(deleteResource.rejected, (state, { payload }) => {
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
            gender: payload.gender,
            joiningDate: payload.joiningDate,
            status: payload.status || "pool",
            grade: payload.grade,
            experience: payload.experience || 0,
            competency: payload.competency,
            techSkill: payload.techSkill || [],
            certifications: payload.certification || "",
            communication: payload.communication || "",
            profileImage: payload.profileImage,
            resumeFile: payload.resumeFile,
            roleIds: payload.roleIds || []
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
          state.designations[index | 0].name = payload.name;
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
        state.designations = state.designations.filter(d => d.publicId !== payload);
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
          state.competencies[index | 0].name = payload.name;
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
        state.competencies = state.competencies.filter(c => c.publicId !== payload);
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
        state.trainingTechnologies = payload.technologies.map((item) => ({
          publicId: item.publicId,
          name: item.name
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
          name: payload.name
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
          state.trainingTechnologies[index | 0] = {
            publicId: payload.publicId,
            name: payload.name
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
      })

      // Fetch Technologies (New)
      .addCase(fetchTechnologies.pending, (state) => {
        state.technologyLoading = true;
        state.error = null;
      })
      .addCase(fetchTechnologies.fulfilled, (state, { payload }) => {
        state.technologyLoading = false;
        state.technologies = payload.Technologies.map((item) => ({
          publicId: item.publicId,
          name: item.name
        }));
      })
      .addCase(fetchTechnologies.rejected, (state, { payload }) => {
        state.technologyLoading = false;
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