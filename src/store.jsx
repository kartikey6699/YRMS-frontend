import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/auth/authSlice'
import resourceReducer from "./features/resource/resourceSlice";
import baselineReducer from "./features/baseline/baselineSlice";

export const store = configureStore({
    reducer: {
        auth : authReducer,
        resource: resourceReducer,
        baseline: baselineReducer
    }
})