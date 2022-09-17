export interface CreateCommentDto {
  content: string;
  postId: string;
  parentCommentId?: string;
}
