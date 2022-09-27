import { axiosInstance as axios } from './api'
import AppConfig from "../../config/app.config";
import {BaseApiResponse} from "../models/base-api-response";
import {ReactionType} from "../models/reactions/reaction-type";
import {PostDetailDto} from "../models/posts/post-detail.dto";
import {PostReactionSubsetDto} from "../models/posts/post-reaction-subset.dto";

const reactToPost = async (
  reactionType: ReactionType | null,
  postId: string
): Promise<BaseApiResponse<PostDetailDto, unknown>> => {
  return axios.post(`${AppConfig.apiUrl}/post-reactions/`, {reactionType, postId})
    .then(response => {
      return response.data
    });
}

const getPostReactionsCount = async (
  postId: string
): Promise<BaseApiResponse<PostReactionSubsetDto, unknown>> => {
  return axios.get(`${AppConfig.apiUrl}/post-reactions/${postId}/reactions`)
    .then(response => {
      return response.data;
    });
}

const postReactionService = {
  reactToPost,
  getPostReactionsCount
}

export default postReactionService;
