
import { ADMIN_API_BASE_URL , DESIGNATION_API_BASE_URL , COMPETENCY_API_BASE_URL } from "./BaseEndpoints";

export const AUTH_API = {
    ADMIN_LOGIN: `${ADMIN_API_BASE_URL}/login`,
    FORGOT_PASSWORD: `${ADMIN_API_BASE_URL}/forgot-password`,
}

export const RESOURCE_API = {
    CREATE_RESOURCE: `${ADMIN_API_BASE_URL}/register-user`,
    LIST_RESOURCES: `${ADMIN_API_BASE_URL}/user-list`,
    USER_DETAIL: `${ADMIN_API_BASE_URL}/user-detail`,

};

export const DESIGNATION_API = {
    LIST: `${DESIGNATION_API_BASE_URL}/designation-list`,
    CREATE: `${DESIGNATION_API_BASE_URL}/designation-create`,
    UPDATE: `${DESIGNATION_API_BASE_URL}/designation-update`,
    DELETE: `${DESIGNATION_API_BASE_URL}/designation-delete`
};

export const COMPETENCY_API = {
    LIST: `${COMPETENCY_API_BASE_URL}/competency-list`,
    CREATE: `${COMPETENCY_API_BASE_URL}/competency-create`,
    UPDATE: `${COMPETENCY_API_BASE_URL}/competency-update`,
    DELETE: `${COMPETENCY_API_BASE_URL}/competency-delete`
};