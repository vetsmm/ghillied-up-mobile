export interface BaseApiException {
    localizedMessage: Record<string, string>;
    details: string | Record<string, any>;
    category: string;
    subCategory: string;
    context: Record<string, string>;
    response: string | Record<string, any>;
    status: number;
    cause: Error;
}
