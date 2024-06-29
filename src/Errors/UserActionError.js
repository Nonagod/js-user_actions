class UAMError extends Error {
    static COMMON_ERROR_CODE = 'SOMETHING_WENT_WRONG';

    constructor(msg = "", info = {code: UAMError.COMMON_ERROR_CODE}, SystemError = undefined) {
        super(msg);
        this.info = typeof info === 'string' ? {code: info} : info;
        this.SystemError = SystemError;
    }
}