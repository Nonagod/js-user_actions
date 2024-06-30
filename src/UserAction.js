import resolveOptions from "./resolveOptions";
import getObjectFingerprint from "./getObjectFingerprint";
import RepeatedRequestError from "./Errors/RepeatedRequestError";
import handleSuccessDefault from "./Handlers/handleSuccessDefault";
import handleErrorDefault from "./Handlers/handleErrorDefault";
import ServerRespondError from "./Errors/ServerRespondError";
import SomethingWentWrongError from "./Errors/SomethingWentWrongError";
import Emulator from "./Emulator";
import RequestError from "./Errors/RequestError";


class UserAction {
    _options = {};
    _last_request_fingerprint = null;

    Emulator = undefined;

    handleSuccessDefault = handleSuccessDefault;
    handleErrorDefault = handleErrorDefault;

    constructor() {}


    do( action, options = {} ) {
        try {
            this._options = resolveOptions( action, options );
        }catch( Error ) {
            console.error( Error );
        }finally {
            getObjectFingerprint( this._options ).then(
                ( fingerprint ) => {
                    if( fingerprint !== this._last_request_fingerprint ) {
                        this._last_request_fingerprint = fingerprint;

                        if( this.Emulator ) this._emulateRequest() // fetch исключен из цепочки
                        else this._request();

                    }else console.warn( new RepeatedRequestError( `The same request ("${action}") is sent repeatedly` ))

                }
            );
        }
    }

    enableEmulation() {
        this.Emulator = new Emulator();
    }


    _request() {
        // ошибки самого fetch (уровня POST, CORS, net::) не отлавливаются, даже если обернуть еще в одно try...catch
        // т.е. в консоле они будут в любом случае
        fetch( this._options.url ?? window.location.href, {
            method: 'POST',
            body: this._options.data
        })
        .then( this._handleResponse.bind( this ))
        .then( this._handleData.bind( this ))
        .catch( this._handleError.bind( this ));
    }
    _emulateRequest() {
        new Promise((resolve) => {
            resolve( this.Emulator.get( this._last_request_fingerprint )) // выбросит ошибку, если нет такого запроса
        }).then( this._handleData.bind( this ))
        .catch( this._handleError.bind( this ));
    }


    _handleResponse( response ) {
        if( !response.ok ) throw new RequestError(`${response.status} ${response.statusText}`);

        return response.json();
    }
    _handleData( response_data ) {
        if( !response_data.status ) throw new ServerRespondError( response_data.result.msg, response_data.result.code, response_data.result.info );

        (this._options.handleSuccess ?? this.handleSuccessDefault)( response_data.result );
    }
    _handleError( Error ) {
        if( !Boolean(Error instanceof ServerRespondError )) Error = new SomethingWentWrongError( Error );

        (this._options.handleError ?? this.handleErrorDefault)( Error );
    }
}


export default  UserAction;