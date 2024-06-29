export default class SomethingWentWrongError extends Error {
    constructor( OriginalError = undefined, message = undefined) {
        message = message ?? 'Something went wrong, try again later or contact to administrator';

        super(message);

        this.name = "SomethingWentWrongError";
        if (OriginalError) {
            this.originalError = OriginalError;
            this.stack = `${this.stack}\nCaused by: ${OriginalError.stack}`;
        }
    }
}