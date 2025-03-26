import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/auth/authSlice'
import resourceReducer from "./features/resource/resourceSlice";

export const store = configureStore({
    reducer: {
        auth : authReducer,
        resource: resourceReducer
    }
})