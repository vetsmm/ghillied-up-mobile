export interface UpdateGhillieDto {
  name?: string;
  about?: string | null;
  readOnly: boolean;
  topicNames: string[];
}
