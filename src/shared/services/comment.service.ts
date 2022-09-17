import {BaseApiResponse} from "../models/base-api-response";
import axios from "axios";
import AppConfig from "../../config/app.config";
import {CreateCommentDto} from "../models/comments/create-comment.dto";
import {CommentDetailDto} from "../models/comments/comment-detail.dto";
import {UpdateCommentDto} from "../models/comments/update-comment.dto";
import {CommentIdsInputDto} from "../models/comments/comment-ids-input.dto";
import {PageInfo} from "../models/pagination/types";

const createComment = async (commentDto: CreateCommentDto): Promise<BaseApiResponse<CommentDetailDto, never>> => {
  return await axios.post(`${AppConfig.apiUrl}/post-comments`, commentDto)
    .then(response => {
      return response.data;
    });
}

const updateComment = async (id: string, commentDto: UpdateCommentDto): Promise<BaseApiResponse<CommentDetailDto, never>> => {
  return await axios.patch(`${AppConfig.apiUrl}/post-comments/${id}`, commentDto)
    .then(response => {
      return response.data;
    });
}

const deleteComment = async (id: string): Promise<BaseApiResponse<never, never>> => {
  return await axios.delete(`${AppConfig.apiUrl}/post-comments/${id}`)
    .then(response => {
      return response.data;
    });
}

const getCommentsForPost = async (postId: string, cursor?: string, take = 25): Promise<BaseApiResponse<CommentDetailDto[], PageInfo>> => {
  const url = `${AppConfig.apiUrl}/post-comments/for-post/${postId}?take=${take}${cursor ? `&cursor=${cursor}` : ''}`;
  return await axios.get(url)
    .then(response => {
      return response.data;
    });
}

const getChildComments = async (commentIds: CommentIdsInputDto): Promise<BaseApiResponse<CommentDetailDto[], never>> => {
  return await axios.post(`${AppConfig.apiUrl}/post-comments/children`, commentIds)
    .then(response => {
      return response.data;
    });
}

const getChildCommentsForPostByLevel = async (postId: string, level: number): Promise<BaseApiResponse<CommentDetailDto[], never>> => {
  return await axios.get(`${AppConfig.apiUrl}/post-comments/${postId}/children/by-level?level=${level}`)
    .then(response => {
      return response.data;
    });
}

const commentService = {
  createComment,
  updateComment,
  deleteComment,
  getCommentsForPost,
  getChildComments,
  getChildCommentsForPostByLevel
}

export default commentService;
