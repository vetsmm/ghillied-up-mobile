import {PostStatus} from "./post-status";

export interface CreatePostInput {
  title: string;
  content: string;
  status?: PostStatus;
  postTagNames?: string[];
  ghillieId: string;
}

export class CreatePostInputDto {
  title: string

  content: string

  status?: PostStatus

  ghillieId: string

  postTagNames?: string[];


  constructor(
    title: string,
    content: string,
    ghillieId: string,
    status?: PostStatus,
    postTagNames?: string[]
  ) {
    this.title = title;
    this.content = content;
    this.status = status || PostStatus.ACTIVE;
    this.ghillieId = ghillieId;
    this.postTagNames = postTagNames || [];
  }

  static create(input: CreatePostInput): CreatePostInputDto {
    return new CreatePostInputDto(
      input.title,
      input.content,
      input.ghillieId,
      input.status,
      input.postTagNames,
    );
  }
}
