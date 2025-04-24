import { createSlice } from "@reduxjs/toolkit";
import {
    fetchCertificationAuthorities,
    createCertificationAuthority,
    updateCertificationAuthority,
    deleteCertificationAuthority,
    fetchTechnologyCategories,
    createTechnologyCategory,
    updateTechnologyCategory,
    deleteTechnologyCategory,
    fetchTechnologyStacks,
    createTechnologyStack,
    updateTechnologyStack,
    deleteTechnologyStack,
    createBaseline,
    updateBaseline,
    fetchBaselineHistories,
    fetchTechnologyCategoriesStack
} from "./baselineAction";

const initialState = {
    resources: [],
    resourceDetails: null,
    loading: false,
    error: null,
    designations: [],
    certificationAuthorities: [],
    technologyCategories: [],
    technologyStacks: [],
    designationLoading: false,
    certificationAuthorityLoading: false,
    technologyCategoryLoading: false,
    technologyStackLoading: false,
    baselineHistories: [],
    baselineLoading: false,
    technologyCategoriesStack: [],
    technologyCategoriesStackLoading: false,
    technologyCategoriesWithTech: []
};

const baselineSlice = createSlice({
    name: "baseline",
    initialState,
    reducers: {
        clearBaselineHistories: (state) => {
            state.baselineHistories = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Certification Authority
            .addCase(fetchCertificationAuthorities.pending, (state) => {
                state.certificationAuthorityLoading = true;
            })
            .addCase(fetchCertificationAuthorities.fulfilled, (state, { payload }) => {
                state.certificationAuthorityLoading = false;
                state.certificationAuthorities = payload.data?.certificationAuthorities?.map(item => ({
                    publicId: item.publicId,
                    name: item.name
                })) || payload;
            })
            .addCase(fetchCertificationAuthorities.rejected, (state, { payload }) => {
                state.certificationAuthorityLoading = false;
                state.error = payload;
            })

            .addCase(createCertificationAuthority.pending, (state) => {
                state.certificationAuthorityLoading = true;
            })
            .addCase(createCertificationAuthority.fulfilled, (state, { payload }) => {
                state.certificationAuthorityLoading = false;
                state.certificationAuthorities.push({
                    publicId: payload.publicId,
                    name: payload.name
                });
            })
            .addCase(createCertificationAuthority.rejected, (state, { payload }) => {
                state.certificationAuthorityLoading = false;
                state.error = payload;
            })

            .addCase(updateCertificationAuthority.pending, (state) => {
                state.certificationAuthorityLoading = true;
            })
            .addCase(updateCertificationAuthority.fulfilled, (state, { payload }) => {
                state.certificationAuthorityLoading = false;
                const index = state.certificationAuthorities.findIndex(
                    (ca) => ca.publicId === payload.publicId
                );
                if (index !== -1) {
                    state.certificationAuthorities[index] = {
                        publicId: payload.publicId,
                        name: payload.name
                    };
                }
            })
            .addCase(updateCertificationAuthority.rejected, (state, { payload }) => {
                state.certificationAuthorityLoading = false;
                state.error = payload;
            })

            .addCase(deleteCertificationAuthority.pending, (state) => {
                state.certificationAuthorityLoading = true;
            })
            .addCase(deleteCertificationAuthority.fulfilled, (state, { payload }) => {
                state.certificationAuthorityLoading = false;
                state.certificationAuthorities = state.certificationAuthorities.filter(
                    (ca) => ca.publicId !== payload
                );
            })
            .addCase(deleteCertificationAuthority.rejected, (state, { payload }) => {
                state.certificationAuthorityLoading = false;
                state.error = payload;
            })

            // Technology Category
            .addCase(fetchTechnologyCategories.pending, (state) => {
                state.technologyCategoryLoading = true;
            })
            .addCase(fetchTechnologyCategories.fulfilled, (state, { payload }) => {
                state.technologyCategoryLoading = false;
                state.technologyCategories = payload.data?.certificationAuthorities?.map(item => ({
                    publicId: item.publicId,
                    name: item.name
                })) || payload;
            })
            .addCase(fetchTechnologyCategories.rejected, (state, { payload }) => {
                state.technologyCategoryLoading = false;
                state.error = payload;
            })

            .addCase(createTechnologyCategory.pending, (state) => {
                state.technologyCategoryLoading = true;
            })
            .addCase(createTechnologyCategory.fulfilled, (state, { payload }) => {
                state.technologyCategoryLoading = false;
                if (payload.data) {
                    state.technologyCategoriesWithTech.push({
                        publicId: payload.data.publicId,
                        name: payload.data.name,
                        technologies: []
                    });
                }
            })
            .addCase(createTechnologyCategory.rejected, (state, { payload }) => {
                state.technologyCategoryLoading = false;
                state.error = payload;
            })

            .addCase(updateTechnologyCategory.pending, (state) => {
                state.technologyCategoryLoading = true;
            })
            .addCase(updateTechnologyCategory.fulfilled, (state, { payload }) => {
                state.technologyCategoryLoading = false;
                const index = state.technologyCategories.findIndex(
                    (tc) => tc.publicId === payload.publicId
                );
                if (index !== -1) {
                    state.technologyCategories[index] = {
                        publicId: payload.publicId,
                        name: payload.name
                    };
                }
            })
            .addCase(updateTechnologyCategory.rejected, (state, { payload }) => {
                state.technologyCategoryLoading = false;
                state.error = payload;
            })

            .addCase(deleteTechnologyCategory.pending, (state) => {
                state.technologyCategoryLoading = true;
            })
            .addCase(deleteTechnologyCategory.fulfilled, (state, { payload }) => {
                state.technologyCategoryLoading = false;
                state.technologyCategories = state.technologyCategories.filter(
                    (tc) => tc.publicId !== payload
                );
            })
            .addCase(deleteTechnologyCategory.rejected, (state, { payload }) => {
                state.technologyCategoryLoading = false;
                state.error = payload;
            })

            // Technology Stack
            .addCase(fetchTechnologyStacks.pending, (state) => {
                state.technologyStackLoading = true;
            })
            .addCase(fetchTechnologyStacks.fulfilled, (state, { payload }) => {
                state.technologyStackLoading = false;
                state.technologyStacks = payload.data?.certificationAuthorities?.map(item => ({
                    publicId: item.publicId,
                    name: item.name
                })) || payload;
            })
            .addCase(fetchTechnologyStacks.rejected, (state, { payload }) => {
                state.technologyStackLoading = false;
                state.error = payload;
            })

            .addCase(createTechnologyStack.pending, (state) => {
                state.technologyStackLoading = true;
            })
            .addCase(createTechnologyStack.fulfilled, (state, { payload }) => {
                state.technologyStackLoading = false;
                if (payload.data) {
                    const categoryIndex = state.technologyCategoriesWithTech.findIndex(
                        cat => cat.publicId === payload.data.technologyCategoryId
                    );
                    if (categoryIndex !== -1) {
                        state.technologyCategoriesWithTech[categoryIndex].technologies.push({
                            publicId: payload.data.publicId,
                            name: payload.data.name
                        });
                    }
                }
            })
            .addCase(createTechnologyStack.rejected, (state, { payload }) => {
                state.technologyStackLoading = false;
                state.error = payload;
            })

            .addCase(updateTechnologyStack.pending, (state) => {
                state.technologyStackLoading = true;
            })
            .addCase(updateTechnologyStack.fulfilled, (state, { payload }) => {
                state.technologyStackLoading = false;
                if (payload.data) {
                    state.technologyCategoriesWithTech = state.technologyCategoriesWithTech.map(category => {
                        const updatedTechs = category.technologies.map(tech =>
                            tech.publicId === payload.data.publicId
                                ? { ...tech, name: payload.data.name }
                                : tech
                        );
                        return { ...category, technologies: updatedTechs };
                    });
                }
            })
            .addCase(updateTechnologyStack.rejected, (state, { payload }) => {
                state.technologyStackLoading = false;
                state.error = payload;
            })

            .addCase(deleteTechnologyStack.pending, (state) => {
                state.technologyStackLoading = true;
            })
            .addCase(deleteTechnologyStack.fulfilled, (state, { payload }) => {
                state.technologyStackLoading = false;
                state.technologyCategoriesWithTech = state.technologyCategoriesWithTech.map(category => ({
                    ...category,
                    technologies: category.technologies.filter(tech => tech.publicId !== payload)
                }));
            })
            .addCase(deleteTechnologyStack.rejected, (state, { payload }) => {
                state.technologyStackLoading = false;
                state.error = payload;
            })
            .addCase(fetchBaselineHistories.pending, (state) => {
                state.baselineLoading = true;
            })
            .addCase(fetchBaselineHistories.fulfilled, (state, { payload }) => {
                state.baselineLoading = false;
                if (payload.success && payload.data) {
                    state.baselineHistories = payload.data.resourceBaselines.map(baseline => ({
                        publicId: baseline.publicId,
                        technologyExperience: baseline.technologyExperience,
                        certification: baseline.certification,
                        totalExperience: baseline.totalExperience,
                        communication: baseline.communication,
                        technicalSkills: baseline.technicalSkills,
                        rating: baseline.rating,
                        feedback: baseline.feedback,
                        upskillSuggestion: baseline.upskillSuggestion,
                        professionalism: baseline.professionalism,
                        timestamp: new Date().toISOString() // Add timestamp if not provided by API
                    }));
                }
            })
            .addCase(fetchBaselineHistories.rejected, (state, { payload }) => {
                state.baselineLoading = false;
                state.error = payload;
            })

            .addCase(createBaseline.pending, (state) => {
                state.baselineLoading = true;
            })
            .addCase(createBaseline.fulfilled, (state, { payload }) => {
                state.baselineLoading = false;
                if (payload.success && payload.data) {
                    const newBaseline = {
                        publicId: payload.data.publicId,
                        technologyExperience: payload.data.technologyExperience,
                        certification: payload.data.certification,
                        totalExperience: payload.data.totalExperience,
                        communication: payload.data.communication,
                        technicalSkills: payload.data.technicalSkills,
                        rating: payload.data.rating,
                        feedback: payload.data.feedback,
                        upskillSuggestion: payload.data.upskillSuggestion,
                        professionalism: payload.data.professionalism,
                        timestamp: new Date().toISOString()
                    };
                    state.baselineHistories.unshift(newBaseline);
                }
            })
            .addCase(createBaseline.rejected, (state, { payload }) => {
                state.baselineLoading = false;
                state.error = payload;
            })
            .addCase(updateBaseline.pending, (state) => {
                state.baselineLoading = true;
            })
            .addCase(updateBaseline.fulfilled, (state, { payload }) => {
                state.baselineLoading = false;
                if (payload.success && payload.data) {
                    const index = state.baselineHistories.findIndex(baseline => baseline.publicId === payload.data.publicId);
                    if (index !== -1) {
                        state.baselineHistories[index] = {
                            ...state.baselineHistories[index],
                            ...payload.data
                        };
                    }
                }
            })
            .addCase(updateBaseline.rejected, (state, { payload }) => {
                state.baselineLoading = false;
                state.error = payload;
            })
            .addCase(fetchTechnologyCategoriesStack.pending, (state) => {
                state.technologyCategoriesStackLoading = true;
            })
            .addCase(fetchTechnologyCategoriesStack.fulfilled, (state, { payload }) => {
                state.technologyCategoriesStackLoading = false;
                if (payload.success) {
                    state.technologyCategoriesWithTech = payload.data.categories.map(category => ({
                        publicId: category.publicId,
                        name: category.name,
                        technologies: category.technology || []
                    }));
                }
            })
            .addCase(fetchTechnologyCategoriesStack.rejected, (state, { payload }) => {
                state.technologyCategoriesStackLoading = false;
                state.error = payload;
            })

    }
});

export const { clearBaselineHistories } = baselineSlice.actions;
export default baselineSlice.reducer;