export default class OptionResolvingError extends Error {
    constructor(message) {
        super(message);
        this.name = "OptionResolvingError";
    }
}