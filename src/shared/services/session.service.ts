import {axiosInstance as axios} from './api'
import {SessionDto} from "../models/sessions/session.dto";

interface PaginationParamsDto {
    skip?: number;
    take?: number;
    cursor?: string;
}

const getAllSessions = async ({skip, take, cursor}: PaginationParamsDto): Promise<SessionDto[]> => {
    let params = {};
    if (skip) {
        params = {...params, skip};
    }
    if (take) {
        params = {...params, take};
    }
    if (cursor) {
        params = {...params, cursor};
    }

    params = {
        ...params,
        orderBy: {
            updatedDate: 'desc'
        }
    }
    return axios.post(`/sessions/all`, {
        ...params
    }).then(response => response.data);
}

const getSession = async (id: string): Promise<SessionDto> => {
    return axios.get(`/sessions/${id}`)
        .then(response => response.data);
}

const removeSession = async (id: string): Promise<SessionDto> => {
    return axios.delete(`/sessions/${id}`)
        .then(response => response.data);
}

const removeAllPastSessions = async (): Promise<void> => {
    return axios.delete(`/sessions/delete/all`)
        .then(response => response.data);
}

const sessionService = {
    getAllSessions,
    getSession,
    removeSession,
    removeAllPastSessions
}

export default sessionService;
