import {GhillieDetailDto} from "../models/ghillies/ghillie-detail.dto";
import {axiosInstance as axios} from './api'
import AppConfig from "../../config/app.config";
import {BaseApiResponse} from "../models/base-api-response";
import {GhillieSearchCriteria} from "../models/ghillies/ghillie-search.criteria";
import {PageInfo} from "../models/pagination/types";

const getGhillies = async (criteria: GhillieSearchCriteria): Promise<BaseApiResponse<Array<GhillieDetailDto>, PageInfo>> => {
  return await axios.post(`${AppConfig.apiUrl}/ghillies/all`, criteria)
    .then(response => {
      return response.data;
    });
}

const getCurrentUserGhillies = async (take: number, cursor?: string): Promise<BaseApiResponse<Array<GhillieDetailDto>, never>> => {
  return await axios.get(`${AppConfig.apiUrl}/ghillies/my/all?take=${take}${cursor ? `&cursor=${cursor}` : ''}`)
    .then(response => {
      return response.data;
    });
}

const joinGhillie = async (id: string): Promise<BaseApiResponse<void, any>> => {
  return await axios.put(`${AppConfig.apiUrl}/ghillies/${id}/join`);
}

const leaveGhillie = async (id: string): Promise<BaseApiResponse<void, any>> => {
  return await axios.put(`${AppConfig.apiUrl}/ghillies/${id}/leave`);
}

const getGhillie = async (id: string): Promise<BaseApiResponse<GhillieDetailDto, any>> => {
  return await axios.get(`${AppConfig.apiUrl}/ghillies/${id}`)
    .then(response => {
      return response.data;
    });
}

const createGhillie = async (ghillie: FormData): Promise<BaseApiResponse<GhillieDetailDto, never>> => {
  return await axios.post(`${AppConfig.apiUrl}/ghillies`, ghillie, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
    .then(response => {
      return response.data;
    });
}

const updateGhillie = async (id: string, ghillie: FormData): Promise<BaseApiResponse<GhillieDetailDto, never>> => {
  return await axios.put(`${AppConfig.apiUrl}/ghillies/${id}`, ghillie, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
    .then(response => {
      return response.data;
    });
}

const getMyGhillies = async (): Promise<BaseApiResponse<Array<GhillieDetailDto>, any>> => {
  return await axios.get(`${AppConfig.apiUrl}/ghillies/my/all`)
    .then(response => {
      return response.data;
    });
}

const ghillieService = {
  getGhillies,
  joinGhillie,
  leaveGhillie,
  getGhillie,
  createGhillie,
  updateGhillie,
  getMyGhillies,
  getCurrentUserGhillies
}

export default ghillieService;
