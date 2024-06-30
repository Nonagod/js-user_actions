export default class EmulateRequestMissingError extends Error {
    constructor(message) {
        super(message);
        this.name = "EmulateRequestMissingError";
    }
}