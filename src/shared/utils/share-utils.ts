import {GhillieDetailDto} from "../models/ghillies/ghillie-detail.dto";
import Share from 'react-native-share';
import {ShareOptions} from "react-native-share/lib/typescript/types";
import {PostDetailDto} from "../models/posts/post-detail.dto";
import {PostFeedDto} from "../models/feed/post-feed.dto";

const shareGhillie = async (ghillie: GhillieDetailDto) => {
    const url = `https://ghilliedup.com/ghillies/invite/${ghillie.inviteCode}`;
    const title = 'Ghillied Up';
    const message = 'Join the discussion on Ghillied Up!';

    const options: ShareOptions = {
        title,
        message,
        subject: message,
        urls: [url],
        failOnCancel: false,
    }

    await Share.open(options);
}

const sharePost = async (postId: PostDetailDto | PostFeedDto) => {
    const url = `https://ghilliedup.com/posts/detail/${postId.id}`;
    const title = 'Ghillied Up';
    const message = 'Check out this post on Ghillied Up!';

    const options: ShareOptions = {
        title,
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
