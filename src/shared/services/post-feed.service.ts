import axios from "axios";
import AppConfig from "../../config/app.config";
import {BaseApiResponse} from "../models/base-api-response";
import {PostListingDto} from "../models/posts/post-listing.dto";
import {FeedInputDto} from "../models/feed/feed-input.dto";
import {PageInfo} from "../models/pagination/types";

const getFeed = async (queryBody?: FeedInputDto): Promise<BaseApiResponse<PostListingDto[], PageInfo>> => {
  return axios.post(`${AppConfig.apiUrl}/post-feed/`, queryBody)
    .then(response => {
      return response.data;
    });
}

const postFeedService = {
  getFeed
}

export default postFeedService;
