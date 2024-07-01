import getObjectFingerprint from "./getObjectFingerprint";
import resolveOptions from "./resolveOptions";
import EmulateRequestMissingError from "./Errors/EmulateRequestMissingError";


export default class RequestsEmulator {
    _emulated_requests = {};

    constructor() {}

    emulate( fingerprinting ) {
        if( !this._emulated_requests.hasOwnProperty( fingerprinting )) throw new EmulateRequestMissingError( `There is no request with this fingerprint` );

        new Promise((resolve) => {
            resolve( this._emulated_requests[fingerprinting] )
        });
    }

    add( user_action, request_options, response_data ) {
        let _request_fingerprint = undefined;

        try {
            this._options = resolveOptions( user_action, request_options );
        }catch( Error ) {
            console.error( Error );
        }finally {
            getObjectFingerprint( request_options ).then(
                ( fingerprint ) => {
                    this._emulated_requests[ fingerprint ] = response_data;
                    _request_fingerprint = fingerprint;
                }
            );
        }

        return _request_fingerprint;
    }
}