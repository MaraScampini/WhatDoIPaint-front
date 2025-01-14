import axios from "axios";
import apiClient from "./apiClient";


// GET PROJECTS BY USER

interface Params {
    search: string,
    technique?: number,
    level?: number,
    page: number
}

export const getProjectsByUser = async (params: Params) => {
    try {
        let res = await apiClient.get(`/api/project`, {
            params: params
        });
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data;
            throw new Error(errorMessage);
        } else {
            throw new Error('Unknown error');
        }
    }
}

// TOGGLE PROJECT PRIORITY

export const togglePriority = async (userProjectId: number) => {
    try {
        let res = await apiClient.put(`/api/project/toggle/${userProjectId}`, {});
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data;
            throw new Error(errorMessage);
        } else {
            throw new Error('Unknown error');
        }
    }
}

// CREATE PROJECT

interface ProjectData {
    name: string;
    description?: string;
    level: number;
    brand: number;
    techniques?: number[];
    image?: string;
    priority: boolean;
}

export const createProject = async (projectData: ProjectData) => {
    try {
        let res = await apiClient.post(`api/project`, projectData);
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data;
            throw new Error(errorMessage);
        } else {
            throw new Error('Unknown error');
        }
    }
}

// GET PROJECT INFO BY ID

export const getProjectInfoById = async (projectId: string) => {

    let res = await apiClient.get(`/api/project/${projectId}`);
    return res.data;

}

// EDIT PROJECT

interface ProjectInfo {
    image?: string,
    name?: string,
    description?: string,
    level?: number,
    brand?: number,
    techniques?: number[]
}

export const editProject = async (projectInfo: ProjectInfo) => {
    let res = await apiClient.put(`/api/project`, projectInfo);
    return res.data;
}

// CHOOSE RANDOM PROJECT

interface RandomProjectParams {
    level?: number,
    technique?: number,
    brand?: number,
    priority?: boolean,
    banned?: string
}

export const getRandomProject = async (randomProjectParams: RandomProjectParams) => {
    try {
        let res = await apiClient.get(`/api/project/wdip`, {
            params: randomProjectParams
        });
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data;
            throw new Error(errorMessage);
        } else {
            throw new Error('Unknown error');
        }
    }
}

// GET PROJECT GALLERY PAGINATED

interface PaginationParams {
    page: number,
    limit: number
}

export const getProjectGallery = async (projectId: string, paginationParams: PaginationParams) => {
    try {
        let res = await apiClient.get(`/api/project/gallery/${projectId}`, {
            params: paginationParams
        });
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data;
            throw new Error(errorMessage);
        } else {
            throw new Error('Unknown error');
        }
    }
}

// GET PROJECT UPDATES PAGINATED

export const getProjectUpdateGallery = async (projectId: string, paginationParams: PaginationParams) => {
    try {
        let res = await apiClient.get(`/api/project/updates/${projectId}`, {
            params: paginationParams
        });
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data;
            throw new Error(errorMessage);
        } else {
            throw new Error('Unknown error');
        }
    }
}

// GET CURRENT STREAK

export const updateAndGetCurrentStreak = async () => {
    try {
        let res = await apiClient.post(`/api/streak`);
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data;
            throw new Error(errorMessage);
        } else {
            throw new Error('Unknown error');
        }
    }
}

// GET ELEMENTS AND SQUADS

export const getElementsAndSquadsByProjectId = async (projectId: string) => {
    try {
        let res = await apiClient.get(`/api/project/fullelements/${projectId}`);
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data;
            throw new Error(errorMessage);
        } else {
            throw new Error('Unknown error');
        }
    }
}

// TOGGLE ARCHIVE PROJECT

export const toggleArchivedProject = async (projectId: string) => {
    try {
        let res = await apiClient.put(`/api/project/archived/${projectId}`);
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data;
            throw new Error(errorMessage);
        } else {
            throw new Error('Unknown error');
        }
    }
}

// MARK PROJECT AS FINISHED

export const markProjectAsFinished = async (projectId: number) => {
    try {
        let res = await apiClient.put(`/api/project/finished/${projectId}`);
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data;
            throw new Error(errorMessage);
        } else {
            throw new Error('Unknown error');
        }
    }
}