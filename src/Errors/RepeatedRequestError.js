export default class RepeatedRequestError extends Error {
    constructor(message) {
        super(message);
        this.name = "RepeatedRequestError";
    }
}