
import { ADMIN_API_BASE_URL } from "./BaseEndpoints";

export const AUTH_API = {
    ADMIN_LOGIN: `${ADMIN_API_BASE_URL}/login`,
    FORGOT_PASSWORD: `${ADMIN_API_BASE_URL}/forgot-password`,
}

export const RESOURCE_API = {
    CREATE_RESOURCE: `${ADMIN_API_BASE_URL}/register-user`,
    LIST_RESOURCES: `${ADMIN_API_BASE_URL}/user-list`,
    USER_DETAIL: `${ADMIN_API_BASE_URL}/user-update`,

};