export interface UpdateGhillieDto {
  name?: string;
  about?: string | null;
  readOnly: boolean;
  imageUrl: string | null;
  topicNames: string[];
}
