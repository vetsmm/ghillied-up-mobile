import { axiosInstance as axios } from './api'
import AppConfig from "../../config/app.config";
import {BaseApiResponse} from "../models/base-api-response";
import {FlagPostInputDto} from "../models/flags/flag-post-input.dto";
import {FlagGhillieInputDto} from "../models/flags/flag-ghillie-input.dto";
import {FlagPostCommentInputDto} from "../models/flags/flag-post-comment-input.dto";

const flagComment = async (flagInput: FlagPostCommentInputDto): Promise<BaseApiResponse<void, unknown>> => {
  return axios.post(`${AppConfig.apiUrl}/flags/comment`, flagInput)
    .then(response => {
      return response.data;
    });
}

const flagPost = async (flagInput: FlagPostInputDto): Promise<BaseApiResponse<void, unknown>> => {
  return axios.post(`${AppConfig.apiUrl}/flags/post`, flagInput)
    .then(response => {
      return response.data;
    });
}

const flagGhillie = async (flagInput: FlagGhillieInputDto): Promise<BaseApiResponse<void, unknown>> => {
  return axios.post(`${AppConfig.apiUrl}/flags/ghillie`, flagInput)
    .then(response => {
      return response.data;
    });
}

const flagService = {
  flagComment,
  flagPost,
  flagGhillie
}

export default flagService;
