
import { ADMIN_API_BASE_URL, DESIGNATION_API_BASE_URL, COMPETENCY_API_BASE_URL, OPPORTUNITY_API_BASE_URL, CERTIFICATION_AUTHORITY_API_BASE_URL, BASELINE_API_BASE_URL , CATEGORY_API_BASE_URL , TECHNOLOGY_API_BASE_URL, INTERN_API_BASE_URL, API_BASE_URL, ATTENDANCE_API_BASE_URL, PROGRAM_API_BASE_URL} from "./BaseEndpoints";

export const AUTH_API = {
    // ADMIN_LOGIN: `${ADMIN_API_BASE_URL}/user/login`,
    ADMIN_LOGIN: `${ADMIN_API_BASE_URL}/login`,
    FORGOT_PASSWORD: `${ADMIN_API_BASE_URL}/forgot-password`,
}

export const RESOURCE_API = {
    CREATE_RESOURCE: `${ADMIN_API_BASE_URL}/register-user`,
    LIST_RESOURCES: `${ADMIN_API_BASE_URL}/user-list`,
    USER_DETAIL: `${ADMIN_API_BASE_URL}/user-detail`,
    UPDATE_RESOURCE: `${ADMIN_API_BASE_URL}/user-update`,
    DELETE_RESOURCE: `${ADMIN_API_BASE_URL}/user-delete`,

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

export const OPPORTUNITY_API = {
    CREATE: `${OPPORTUNITY_API_BASE_URL}/opportunity-create`,
    // LIST: `${OPPORTUNITY_API_BASE_URL}/opportunity-list`,
    LIST: (userId) => `${ADMIN_API_BASE_URL}/${userId}/opportunity-list`,
    DETAIL: `${OPPORTUNITY_API_BASE_URL}/opportunity-detail`,
    UPDATE: `${OPPORTUNITY_API_BASE_URL}/opportunity-update`,
    DELETE: `${OPPORTUNITY_API_BASE_URL}/opportunity-delete`
};

export const BASELINE = {
    LIST: `${CERTIFICATION_AUTHORITY_API_BASE_URL}/certification-authority-list`,
    CREATE: `${CERTIFICATION_AUTHORITY_API_BASE_URL}/certification-authority-create`,
    UPDATE: `${CERTIFICATION_AUTHORITY_API_BASE_URL}/certification-authority-update`,
    DELETE: `${CERTIFICATION_AUTHORITY_API_BASE_URL}/certification-authority-delete`,
    BASELINE_LIST: `${BASELINE_API_BASE_URL}`,
    BASELINE_CREATE: `${BASELINE_API_BASE_URL}/baseline-create`,
    CATEGORY_LIST: `${CATEGORY_API_BASE_URL}/allCategories`,
    CATEGORY_LIST_TECHNOLOGY: `${CATEGORY_API_BASE_URL}/allCategoriesWithTechnology`,
    CATEGORY_CREATE: `${CATEGORY_API_BASE_URL}/addCategory`,
    CATEGORY_UPDATE: `${CATEGORY_API_BASE_URL}/updateCategory`,
    CATEGORY_DELETE: `${CATEGORY_API_BASE_URL}/deleteCategory`,
    TECHNOLOGY_LIST: `${TECHNOLOGY_API_BASE_URL}/allTechnology`,
    TECHNOLOGY_CREATE: `${TECHNOLOGY_API_BASE_URL}/createTechnology`,
    TECHNOLOGY_UPDATE: `${TECHNOLOGY_API_BASE_URL}/updateTechnology`,
    TECHNOLOGY_DELETE: `${TECHNOLOGY_API_BASE_URL}/deleteTechnology`
};

export const RESUME_API = {
    UPLOAD_RESUME: (publicId) => `${ADMIN_API_BASE_URL}/user-resume-upload/?public_id=${publicId}`,
    DOWNLOAD_RESUME: (publicId) => `${ADMIN_API_BASE_URL}/user-resume-download/?public_id=${publicId}`,
};

export const INTERN_API = {
    DETAIL: `${INTERN_API_BASE_URL}/Intern`,
    LIST: `${INTERN_API_BASE_URL}/allIntern`,
    CREATE: `${INTERN_API_BASE_URL}/createIntern`,
    UPDATE: `${INTERN_API_BASE_URL}/updateIntern`,
    DELETE: `${INTERN_API_BASE_URL}/deleteIntern`
};

export const FEEDBACK_API = {
    LIST: `${ADMIN_API_BASE_URL}/feedback-list`,
    ADD: `${ADMIN_API_BASE_URL}/add-feedback`,
    UPDATE: (publicId) => `${ADMIN_API_BASE_URL}/update-training-feedback/${publicId}`,
    DELETE: (publicId) => `${ADMIN_API_BASE_URL}/delete-feedback/${publicId}`
};

export const ATTENDANCE_API = {
    PROGRAM: (programId) => `${ATTENDANCE_API_BASE_URL}/program/${programId}`,
    CREATE: `${ATTENDANCE_API_BASE_URL}/create`,
    USERS_ABSENT: (programId) => `${ATTENDANCE_API_BASE_URL}/users/absent/${programId}`
};

export const PARTICIPANT_TASKS_API = {
    POST: `${API_BASE_URL}participant-tasks`,
    GET: `${API_BASE_URL}participant-tasks`,
    UPDATE: (taskId) => `${API_BASE_URL}participant-tasks/${taskId}`,
    DELETE: (taskId) => `${API_BASE_URL}participant-tasks/${taskId}`

};

export const PARTICIPANT_DETAIL_API = {
    GET: `${API_BASE_URL}programs/`
};


export const PROGRAM_API = {
    CREATE: `${PROGRAM_API_BASE_URL}add-program/`,
    LIST: `${PROGRAM_API_BASE_URL}program-list/`,
    UPDATE_STATUS: `${PROGRAM_API_BASE_URL}program/`,
    DETAILS: `${PROGRAM_API_BASE_URL}program-detail/`
};

export const TRAINING_TECHNOLOGY_API = {
    POST: `${API_BASE_URL}training-technology/addTechnology`,
    GET: `${API_BASE_URL}training-technology/allTechnologies`,
    UPDATE: `${API_BASE_URL}training-technology/updateTechnology/`,
    DELETE: `${API_BASE_URL}training-technology/deleteTechnology/`
};

export const TECHNOLOGY_BASELINE_API = {
    GET: `${API_BASE_URL}technology/allTechnology`
};