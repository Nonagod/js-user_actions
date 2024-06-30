export default class ServerRespondError extends Error {
    constructor(message, code = null, info = null) {
        super(message);
        this.name = "ServerRespondError";
        this.code = code;
        this.info = info;
    }
}