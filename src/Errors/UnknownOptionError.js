export default class UnknownOptionError extends Error {
    constructor(message) {
        super(message);
        this.name = "UnknownOptionError";
    }
}