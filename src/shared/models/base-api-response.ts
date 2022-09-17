export interface BaseApiResponse<T, META> {
  data: T;
  meta: META;
}
