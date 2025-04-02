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
    deleteTechnologyStack
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
    technologyStackLoading: false
};

const resourceSlice = createSlice({
    name: "baseline",
    initialState,
    reducers: {},
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
                state.technologyCategories.push({
                    publicId: payload.publicId,
                    name: payload.name
                });
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
                state.technologyStacks.push({
                    publicId: payload.publicId,
                    name: payload.name
                });
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
                const index = state.technologyStacks.findIndex(
                    (ts) => ts.publicId === payload.publicId
                );
                if (index !== -1) {
                    state.technologyStacks[index] = {
                        publicId: payload.publicId,
                        name: payload.name
                    };
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
                state.technologyStacks = state.technologyStacks.filter(
                    (ts) => ts.publicId !== payload
                );
            })
            .addCase(deleteTechnologyStack.rejected, (state, { payload }) => {
                state.technologyStackLoading = false;
                state.error = payload;
            });
    }
});

export default resourceSlice.reducer;