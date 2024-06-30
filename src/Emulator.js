import getObjectFingerprint from "./getObjectFingerprint";
import resolveOptions from "./resolveOptions";
import EmulateRequestMissingError from "./Errors/EmulateRequestMissingError";


export default class Emulator {
    _emulated_requests = {};

    constructor() {}

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
    get( fingerprinting ) {
        if( !this._emulated_requests.hasOwnProperty( fingerprinting )) throw new EmulateRequestMissingError( `There is no request with this fingerprint` );

        return this._emulated_requests[ fingerprinting ];
    }
}