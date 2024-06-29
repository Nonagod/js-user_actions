export default class ServerRespondError extends Error {
    constructor(message) {
        super(message);
        this.name = "ServerRespondError";
    }
}