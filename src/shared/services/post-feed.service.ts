import {axiosInstance as axios} from './api'
import AppConfig from "../../config/app.config";
import {BaseApiResponse} from "../models/base-api-response";
import {PostFeedDto} from "../models/feed/post-feed.dto";
import {BookmarkPostFeedDto} from "../models/feed/bookmarked-post-feed.dto";

const getFeed = async (page = 1, take = 25): Promise<BaseApiResponse<PostFeedDto[], never>> => {
  return axios.get(`${AppConfig.apiUrl}/feeds/user?page=${page}&take=${take}`)
    .then(response => {
      return response.data;
    });
}

const getHashTagFeed = async (tagName: string, page = 1, take = 25): Promise<PostFeedDto[]> => {
  return axios.get(`${AppConfig.apiUrl}/feeds/hashtag/${tagName}?page=${page}&take=${take}`)
    .then(response => {
      return response.data;
    });
}

const getGhillieFeed = async (ghillieId: string, page = 1, take = 25): Promise<BaseApiResponse<PostFeedDto[], never>> => {
  return axios.get(`${AppConfig.apiUrl}/feeds/ghillie/${ghillieId}?page=${page}&take=${take}`)
    .then(response => {
      return response.data;
    });
}

const getUsersPosts = async (page = 1, take = 25): Promise<BaseApiResponse<PostFeedDto[], never>> => {
  return axios.get(`${AppConfig.apiUrl}/feeds/user/personal?page=${page}&take=${take}`)
    .then(response => {
      return response.data;
    });
}

const getBookmarkedPosts = async (page = 1, take = 25): Promise<BaseApiResponse<BookmarkPostFeedDto[], never>> => {
  return axios.get(`${AppConfig.apiUrl}/feeds/user/bookmarks?page=${page}&take=${take}`)
    .then(response => {
      return response.data;
    });
}

const postFeedService = {
  getFeed,
  getGhillieFeed,
  getUsersPosts,
  getBookmarkedPosts,
  getHashTagFeed
}

export default postFeedService;
