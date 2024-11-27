export default interface ApiResponse {
    message?: string;
    data?: object | object[] | null;
}

export interface JsonReponse extends ApiResponse {
    status: number;
}
