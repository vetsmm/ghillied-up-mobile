import { axiosInstance as axios } from './api'
import AppConfig from "../../config/app.config";
import {BaseApiResponse} from "../models/base-api-response";
import {ReactionType} from "../models/reactions/reaction-type";
import {CommentReactionSubsetDto} from "../models/comments/comment-reaction-subset.dto";

const reactToParentComment = async (
  reactionType: ReactionType | null,
  commentId: string
): Promise<BaseApiResponse<void, unknown>> => {
  return axios.post(`${AppConfig.apiUrl}/comment-reactions/parent`, {reactionType, commentId})
    .then(response => {
      return response.data
    });
}

const reactToChildComment = async (
  reactionType: ReactionType | null,
  commentId: string
): Promise<BaseApiResponse<void, unknown>> => {
  return axios.post(`${AppConfig.apiUrl}/comment-reactions/child`, {reactionType, commentId})
    .then(response => {
      return response.data
    });
}

const getCommentReactionsCount = async (
  commentId: string
): Promise<BaseApiResponse<CommentReactionSubsetDto, unknown>> => {
  return axios.get(`${AppConfig.apiUrl}/comment-reactions/${commentId}/reactions`)
    .then(response => {
      return response.data;
    });
}

const postCommentReactionService = {
  reactToParentComment,
  getCommentReactionsCount,
  reactToChildComment
}

export default postCommentReactionService;
