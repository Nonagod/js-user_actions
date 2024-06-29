import resolveOptions from "./resolveOptions";
import getObjectFingerprint from "./getObjectFingerprint";
import RepeatedRequestError from "./Errors/RepeatedRequestError";
import handleSuccessDefault from "./Handlers/handleSuccessDefault";
import handleErrorDefault from "./Handlers/handleErrorDefault";
import ServerRespondError from "./Errors/ServerRespondError";
import SomethingWentWrongError from "./Errors/SomethingWentWrongError";


class UserAction {
    _options = {};
    _last_request_fingerprint = null;

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
                        this._request();
                    }else console.warn( new RepeatedRequestError( `The same request ("${action}") is sent repeatedly` ))

                }
            );
        }
    }


    async _request() {
        fetch( this._options.url ?? window.location.href, { // ошибки самого fetch (уровня POST, CORS, net::) не отлавливаются, даже если обернуть еще в одно try...catch
            method: 'POST',
            body: this._options.data
        })
            .then( this._handleResponse.bind( this ))
            .then( this._handleData.bind( this ))
            .catch( this._handleError.bind( this ));
    }

    // ToDo: Перевести под адаптированую концепцию под код ответа
    _handleResponse( response ) {
        console.log( response );
        if( !response.ok ) throw new UAMError(`${response.status} ${response.statusText}`);

        // ToDo: Добавить Emulation Emulator
        return response.json();
    }
    _handleData( response_data ) {
        console.log( response_data );
        if( !response_data.status ) throw new ServerRespondError('', response_data.result);

        (this._options.handleSuccess ?? this.handleSuccessDefault)( response_data.result );
    }
    _handleError( Error ) {
        if( !Boolean(Error instanceof ServerRespondError )) Error = new SomethingWentWrongError( Error );

        (this._options.handleError ?? this.handleErrorDefault)( Error );
    }
}


export default  UserAction;