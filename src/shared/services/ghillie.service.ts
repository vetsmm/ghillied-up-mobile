import {GhillieDetailDto} from "../models/ghillies/ghillie-detail.dto";
import {axiosInstance as axios} from './api'
import AppConfig from "../../config/app.config";
import {BaseApiResponse} from "../models/base-api-response";
import {GhillieSearchCriteria} from "../models/ghillies/ghillie-search.criteria";
import {PageInfo} from "../models/pagination/types";
import {UpdateGhillieDto} from '../models/ghillies/update-ghillie.dto';
import {Platform} from 'react-native';
import {CreateGhillieInputDto} from '../models/ghillies/create-ghillie-input.dto';

const getGhillies = async (criteria: GhillieSearchCriteria): Promise<BaseApiResponse<Array<GhillieDetailDto>, PageInfo>> => {
  return await axios.post(`${AppConfig.apiUrl}/ghillies/all`, criteria)
    .then(response => {
      return response.data;
    });
}

const getPopularGhilliesByMembers = async (limit = 10): Promise<Array<GhillieDetailDto>> => {
  return await axios.get(`${AppConfig.apiUrl}/ghillies/metrics/members?limit=${limit}`)
    .then(response => {
      return response.data;
    });
}

const getPopularGhilliesByTrendingPosts = async (limit = 10): Promise<Array<GhillieDetailDto>> => {
  return await axios.get(`${AppConfig.apiUrl}/ghillies/metrics/trending-posts?limit=${limit}`)
    .then(response => {
      return response.data;
    });
}

const getNewestGhillies = async (limit = 10): Promise<Array<GhillieDetailDto>> => {
  return await axios.get(`${AppConfig.apiUrl}/ghillies/metrics/newest?limit=${limit}`)
    .then(response => {
      return response.data;
    });
}

const searchGhillies = async (criteria: GhillieSearchCriteria): Promise<BaseApiResponse<Array<GhillieDetailDto>, PageInfo>> => {
return await axios.post(`${AppConfig.apiUrl}/ghillies/filter`, criteria)
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

const createGhillie = async (ghillie: CreateGhillieInputDto): Promise<BaseApiResponse<GhillieDetailDto, never>> => {
  return await axios.post(`${AppConfig.apiUrl}/ghillies`, ghillie)
    .then(response => {
      return response.data;
    });
}

const updateGhillie = async (id: string, ghillie: UpdateGhillieDto): Promise<BaseApiResponse<GhillieDetailDto, never>> => {
  return await axios.put(`${AppConfig.apiUrl}/ghillies/${id}`, ghillie)
    .then(response => {
      return response.data;
    });
}

const updateGhillieImage = async (id: string, imageUri: string): Promise<GhillieDetailDto> => {
  const data = new FormData();
  
  data.append('image', {
    name: new Date() + "_logo",
    type: `image/jpg`,
    uri: Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri
  });
  
  return await axios.put(`${AppConfig.apiUrl}/ghillies/${id}/logo`, data, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
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
  getCurrentUserGhillies,
  updateGhillieImage,
  searchGhillies,
  getPopularGhilliesByMembers,
  getPopularGhilliesByTrendingPosts,
  getNewestGhillies
}

export default ghillieService;
