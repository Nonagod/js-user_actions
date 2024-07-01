import RequestError from "./Errors/RequestError";
import getObjectFingerprint from "./getObjectFingerprint";

export default class Request {
    options = undefined;
    fingerprint = undefined;

    constructor( options ) {
        this.options = options;
    }

    async getFingerprint() {
        if( !this.fingerprint ) this.fingerprint = await getObjectFingerprint( this.options );

        return this.fingerprint;
    }

    async send() {
        // ошибки самого fetch (уровня POST, CORS, net::) не отлавливаются, даже если обернуть еще в одно try...catch
        // т.е. в консоле они будут в любом случае
        return fetch( this.options.url ?? window.location.href, {
            method: 'POST',
            //mode: 'no-cors',
            body: this.options.data
        })
            .then( this._handleResponse.bind( this ));
    }

    _handleResponse( response ) {
        if( !response.ok ) throw new RequestError(`${response.status} ${response.statusText}`);
        return response.json();
    }
}