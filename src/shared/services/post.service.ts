import { axiosInstance as axios } from './api'
import AppConfig from "../../config/app.config";
import {CreatePostInputDto} from "../models/posts/create-post-input.dto";
import {UpdatePostInputDto} from "../models/posts/update-post-input.dto";
import {BaseApiResponse} from "../models/base-api-response";
import {PostDetailDto} from "../models/posts/post-detail.dto";
import {PostListingDto} from "../models/posts/post-listing.dto";
import {PageInfo} from "../models/pagination/types";
import {PostNonFeedDto} from "../models/posts/post-listing-non-feed.dto";

const createPost = async (post: CreatePostInputDto): Promise<BaseApiResponse<PostDetailDto, any>> => {
    return axios.post(`${AppConfig.apiUrl}/posts`, post)
        .then(response => {
            return response.data;
        });
}

const getPost = async (id: string): Promise<BaseApiResponse<PostDetailDto, any>> => {
    return axios.get(`${AppConfig.apiUrl}/posts/${id}`)
        .then(response => {
            return response.data;
        });
}

const getPostsForGhillie = async (id: string, take: number, cursor?: string | null): Promise<BaseApiResponse<PostListingDto[], PageInfo>> => {
    return axios.get(`${AppConfig.apiUrl}/posts/for-ghillie/${id}?take=${take}${cursor ? `&cursor=${cursor}` : ''}`)
        .then(response => {
            return response.data;
        });
}

const getPostsForCurrentUser = async (take: number, cursor?: string | null): Promise<BaseApiResponse<PostListingDto[], PageInfo>> => {
    return axios.get(`${AppConfig.apiUrl}/posts/my/all?take=${take}${cursor ? `&cursor=${cursor}` : ''}`)
        .then(response => {
            return response.data;
        });
}

const updatePost = async (id: string, post: UpdatePostInputDto): Promise<BaseApiResponse<PostDetailDto, any>> => {
    return axios.patch(`${AppConfig.apiUrl}/posts/${id}`, post)
        .then(response => {
            return response.data;
        });
}

const bookmarkPost = async (id: string): Promise<void> => {
    return axios.put(`${AppConfig.apiUrl}/posts/${id}/bookmark`)
        .then(response => {
            return response.data;
        });
}

const unBookmarkPost = async (id: string): Promise<void> => {
    return axios.put(`${AppConfig.apiUrl}/posts/${id}/unbookmark`)
        .then(response => {
            return response.data;
        });
}

const deletePost = async (id: string): Promise<BaseApiResponse<void, any>> => {
    return axios.delete(`${AppConfig.apiUrl}/posts/${id}`)
        .then(response => {
            return response.data;
        });
}

const pinPost = async (id: string): Promise<void> => {
    return axios.put(`${AppConfig.apiUrl}/posts/${id}/pin`)
        .then(response => {
            return response.data;
        });
}

const unpinPost = async (id: string): Promise<void> => {
    return axios.put(`${AppConfig.apiUrl}/posts/${id}/unpin`)
        .then(response => {
            return response.data;
        });
}

const getPinnedPostsForGhillie = async (ghillieId: string): Promise<PostNonFeedDto[]> => {
    return axios.get(`${AppConfig.apiUrl}/posts/pinned/${ghillieId}`)
        .then(response => {
            return response.data;
        });
}

const postService = {
    createPost,
    getPost,
    updatePost,
    deletePost,
    getPostsForGhillie,
    getPostsForCurrentUser,
    bookmarkPost,
    unBookmarkPost,
    pinPost,
    unpinPost,
    getPinnedPostsForGhillie
}

export default postService;
