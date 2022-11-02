
export interface CreateGhillieInputDto {
  name: string;
  about?: string | null;
  readOnly: boolean;
  topicNames?: string[] | null;
}
