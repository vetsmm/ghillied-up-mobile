import {axiosInstance as axios} from './api'
import AppConfig from "../../config/app.config";
import {BaseApiResponse} from "../models/base-api-response";
import {PostFeedDto} from "../models/feed/post-feed.dto";

const getFeed = async (page = 1, take = 25): Promise<BaseApiResponse<PostFeedDto[], never>> => {
    return axios.get(`${AppConfig.apiUrl}/feeds/user?page=${page}&take=${take}`)
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

const postFeedService = {
    getFeed,
    getGhillieFeed
}

export default postFeedService;
