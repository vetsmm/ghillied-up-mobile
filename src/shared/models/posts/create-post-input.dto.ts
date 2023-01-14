import {PostStatus} from "./post-status";

export interface CreatePostInput {
  title: string;
  content: string;
  status?: PostStatus;
  postTagNames?: string[];
  ghillieId: string;
}
