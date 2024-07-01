import resolveOptions from "./resolveOptions";
import RepeatedRequestError from "./Errors/RepeatedRequestError";
import handleSuccessDefault from "./Handlers/handleSuccessDefault";
import handleErrorDefault from "./Handlers/handleErrorDefault";
import ServerRespondError from "./Errors/ServerRespondError";
import SomethingWentWrongError from "./Errors/SomethingWentWrongError";
import RequestsEmulator from "./RequestsEmulator";
import Request from "./Request";


class UserAction {
    _active_requests = [];

    Emulator = undefined;

    handleSuccessDefault = handleSuccessDefault;
    handleErrorDefault = handleErrorDefault;

    constructor() {}


    do( action, options = {} ) {
        try {
            options = resolveOptions( action, options );
        }catch( Error ) {
            console.error( Error );
        }finally {
            let UserRequest = new Request( options );

            UserRequest
                .getFingerprint()
                .then(( fingerprint ) => {
                    if( this._active_requests.indexOf( fingerprint ) === -1 ) {

                        this._active_requests.push( fingerprint );

                            (
                                this.Emulator // исключаем fetch из цепочки
                                    ? this.Emulator.emulate.bind( this.Emulator, fingerprint )
                                    : UserRequest.send.bind( UserRequest )
                            )()
                            .then( this._handleData.bind( this, UserRequest ))
                            .catch( this._handleError.bind( this, UserRequest ))
                            .finally(() => {
                                let index = this._active_requests.indexOf( fingerprint ); // ищем подпись запроса
                                if( index !== -1 ) this._active_requests.splice(index, 1); // удаляем ее если есть
                            })

                    }else console.warn( new RepeatedRequestError( `The same request ("${action}") is sent repeatedly` ))

                });
        }
    }

    enableEmulation() {
        if( !this.Emulator ) this.Emulator = new RequestsEmulator();
    }


    _handleData( UserRequest, response_data ) {
        if( !response_data.status ) throw new ServerRespondError( response_data.result.msg, response_data.result.code, response_data.result.info );

        (UserRequest.options.handleSuccess ?? this.handleSuccessDefault)( response_data.result );
    }
    _handleError( UserRequest, Error ) {
        if( !Boolean(Error instanceof ServerRespondError )) Error = new SomethingWentWrongError( Error );

        (UserRequest.options.handleError ?? this.handleErrorDefault)( Error );
    }
}


export default  UserAction;