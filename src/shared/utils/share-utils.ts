import {GhillieDetailDto} from "../models/ghillies/ghillie-detail.dto";
import Share from 'react-native-share';
import {ShareOptions} from "react-native-share/lib/typescript/types";
import {PostDetailDto} from "../models/posts/post-detail.dto";
import {PostFeedDto} from "../models/feed/post-feed.dto";
import {PostListingDto} from "../models/posts/post-listing.dto";
import {PostNonFeedDto} from "../models/posts/post-listing-non-feed.dto";

const shareGhillie = async (ghillie: GhillieDetailDto) => {
    const url = `https://ghilliedup.com/ghillies/invite/${ghillie.inviteCode}`;
    const message = 'Join the discussion on Ghillied Up!';

    const options: ShareOptions = {
        message,
        subject: message,
        urls: [url],
        failOnCancel: false,
    }

    await Share.open(options);
}

const sharePost = async (postId: PostDetailDto | PostFeedDto | PostListingDto | PostNonFeedDto) => {
    const url = `https://ghilliedup.com/posts/detail/${postId.id}`;
    const message = 'Check out this post on Ghillied Up!';

    const options: ShareOptions = {
        message,
        subject: message,
        urls: [url],
        failOnCancel: false,
    }

    await Share.open(options);
}

const ShareUtils = {
    shareGhillie,
    sharePost
}

export default ShareUtils;
