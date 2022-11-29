import { axiosInstance as axios } from './api'
import AppConfig from "../../config/app.config";
import {CreateCommentDto} from "../models/comments/create-comment.dto";
import {UpdateCommentDto} from "../models/comments/update-comment.dto";
import {ParentCommentDto} from '../models/comments/parent-comment.dto';
import {ChildCommentDto} from '../models/comments/child-comment.dto';

const getParentById = async (id: string): Promise<ParentCommentDto> => {
  return await axios.get(`${AppConfig.apiUrl}/parent-comments/${id}`)
    .then(response => {
      return response.data;
    });
}
const createParentComment = async (commentDto: CreateCommentDto): Promise<ParentCommentDto> => {
  return await axios.post(`${AppConfig.apiUrl}/parent-comments`, commentDto)
    .then(response => {
      return response.data;
    });
}

const updateParentComment = async (id: string, commentDto: UpdateCommentDto): Promise<ParentCommentDto> => {
  return await axios.patch(`${AppConfig.apiUrl}/parent-comments/${id}`, commentDto)
    .then(response => {
      return response.data;
    });
}

const deleteParentComment = async (id: string): Promise<void> => {
  await axios.delete(`${AppConfig.apiUrl}/parent-comments/${id}`);
}

const getParentCommentsForPost = async (postId: string, page = 1, take = 25): Promise<ParentCommentDto[]> => {
  const url = `${AppConfig.apiUrl}/parent-comments/feed/${postId}?take=${take}${take ? `&page=${page}` : ''}`;
  return await axios.get(url)
    .then(response => {
      return response.data;
    });
}

const createReplyComment = async (parentId: string, content: string): Promise<ChildCommentDto> => {
  return await axios.post(`${AppConfig.apiUrl}/comment-replies/${parentId}`, {
    content
  })
    .then(response => {
      return response.data;
    });
}

const updateReplyComment = async (id: string, commentDto: UpdateCommentDto): Promise<ChildCommentDto> => {
  return await axios.patch(`${AppConfig.apiUrl}/comment-replies/${id}`, commentDto)
    .then(response => {
      return response.data;
    });
}

const deleteReplyComment = async (id: string): Promise<void> => {
  await axios.delete(`${AppConfig.apiUrl}/comment-replies/${id}`);
}

const getReplyComments = async (parentCommentId: string, page = 1, take = 25): Promise<ChildCommentDto[]> => {
  const url = `${AppConfig.apiUrl}/comment-replies/feed/${parentCommentId}?take=${take}${page ? `&page=${page}` : ''}`;
  return await axios.get(url)
    .then(response => {
      return response.data;
    });
}


const commentService = {
  getParentById,
  createParentComment,
  updateParentComment,
  deleteParentComment,
  getParentCommentsForPost,
  createReplyComment,
  updateReplyComment,
  deleteReplyComment,
  getReplyComments,
}

export default commentService;
