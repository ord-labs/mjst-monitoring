import ApiResponse from "./ApiResponse";

export default interface ErrorResponse extends ApiResponse {
    error?: object | string | null;
}
