import {GhillieDetailDto} from "../models/ghillies/ghillie-detail.dto";
import Share, {ShareSingleOptions} from 'react-native-share';
import {ShareOptions} from "react-native-share/lib/typescript/types";
import {PostDetailDto} from "../models/posts/post-detail.dto";
import {PostFeedDto} from "../models/feed/post-feed.dto";
import {PostListingDto} from "../models/posts/post-listing.dto";
import {PostNonFeedDto} from "../models/posts/post-listing-non-feed.dto";
import AppConfig from "../../config/app.config";
import {UserOutput} from "../models/users/user-output.dto";

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

const requestGhillieOwnershipEmail = async (user: UserOutput, ghillie: GhillieDetailDto) => {
    const options: ShareSingleOptions = {
        social: Share.Social.EMAIL,
        subject: `[Ghillie Ownership Request] for ${ghillie.name} (Ref: ${ghillie.id})`,
        email: AppConfig.links.ghillieOwnershipEmail,
        message: `
            Hello,\n
            I would like to request ownership of the following ghillie.
            
            Ghillie Name: ${ghillie.name}
            Ghillie Ref: ${ghillie.id}
            User Account Email: ${user.email}
            Request Date: ${new Date().toLocaleString()}
            
            I would like to request this ownership of this ghillie because:
        `,
    }

    await Share.shareSingle(options);
}

const ShareUtils = {
    shareGhillie,
    sharePost,
    requestGhillieOwnershipEmail
}

export default ShareUtils;
