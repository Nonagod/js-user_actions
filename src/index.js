/**
 * TODO:
 *  - Подумать над необходимостью добавления коллбэк-функций к промису запроса (final, init);
 *  - Подумать, стоит ли переписать _resolveOptions. Используя другой класс (like OptionResolver);
 *  - Переделать с испльзованием выброса ошибок.
 *  - Продумать над разбиением по файлам (избавиться от зависимости от window);
 *  - Подумать над избавления от зависимости от window (w).
 *  - Переписать README в более удобный формат.
 */

(function (w){

    if( w ) {
        if( !w.hasOwnProperty('NG') ) w.NG = {};

        class UAMError extends Error {
            static COMMON_ERROR_CODE = 'SOMETHING_WENT_WRONG';

            constructor(msg = "", error_info = {code: UAMError.COMMON_ERROR_CODE}, SystemError = undefined) {
                super(msg);
                this.error_info = typeof error_info === 'string' ? {code: error_info} : error_info;
                this.SystemError = SystemError;
            }
        }

        class UserActionManager {
            _options = {};

            _last_data = null;
            _is_debugging = false;
            _is_emulating = false;

            _is_request_blocking = false;

            constructor() {
                this._is_debugging = Boolean( -1 < w.location.href.indexOf( "_ng_debug" ));
            }


            request( options = {} ) {
                this._is_request_blocking = false;

                this._resolveOptions( options );

                if( !this._is_request_blocking ) {
                    this._printDebugMsg(`request data for user action "${this._options.FormData.get('user_action')}"`, this._options);

                    if( !this._is_emulating ) {
                        fetch( this._options.url, {
                                method: 'POST',
                                body: this._options.FormData
                            })
                            .then( this._handleResponse.bind( this ))
                            .then( this._handleResponseResult.bind( this ))
                            .catch( this._handleResponseError.bind( this ));

                    }else this._handleResponseResult( this._options.emulation( options ));
                }
            }


            //todo: мб сделать через OptionResolver
            _resolveOptions( options ) {
                this._options.FormData = this._resolveDataOption( options.data );
                this._options.handlers = this._resolveHandlersOption( options.handlers );
                this._options.url = this._resolveURLOption( options.url );
                this._options.emulation = this._resolveEmulationOption( options.emulation );
            }

            _resolveDataOption( data ) {
                if( typeof data === "object" ){
                    if( Object.prototype.toString.call( data ) !== '[object FormData]' ) {
                        let form_data = new FormData();
                        for( let [key, value] of Object.entries(data) ) {
                            form_data.append(key, value);
                        }
                        data = form_data;
                    }

                    let user_action = data.get('user_action');
                    if( !user_action || user_action === 'undefined' || typeof user_action !== "string") this._printErrorMsg('"Data" option must contain "user_action" parameter, of type string.')

                }else this._printErrorMsg( 'Data option must be a object.', data );

                return data;
            }
            _resolveHandlersOption( handlers ) {
                if( typeof handlers !== 'object') {
                    handlers = {}
                }

                if( !handlers.success && typeof handlers.success !== "function") { handlers.success = ( d ) => { console.log('UAM: default success handler', d); }; }
                if( !handlers.error && typeof handlers.error !== "function") { handlers.error = ( d ) => { console.log('UAM: default error handler', d); }; }

                return handlers;
            }
            _resolveURLOption( url ) {
                url = url ?? window.location.href;

                if( typeof url !== 'string' ) this._printErrorMsg( '"URL" option must be string type.' )

                return url;
            }
            _resolveEmulationOption( emulation ) {
                if( emulation && typeof emulation !== "function") this._printErrorMsg( '"Emulation" option must be type of function.' );
                return emulation;
            }


            _handleResponse( response ) {
                if( !response.ok ) throw new UAMError(`${response.status} ${response.statusText}`);
                return response.json();
            }
            _handleResponseResult( result ) {
                if( !result.status ) throw new UAMError('', result.data);
                this._printDebugMsg('request result is', result)
                this._options.handlers.success( result.data );
            }
            _handleResponseError( Error ) {
                debugger;
                if( !Boolean(Error instanceof UAMError )) Error = new UAMError( undefined, undefined, Error )
                this._printDebugMsg('an error occurred', Error)
                this._options.handlers.error( Error );
            }


            _printDebugMsg( msg, data = undefined ) { if( this._is_debugging ) console.log( 'UAM: ' + msg, data ); }
            _printErrorMsg( msg, data = undefined ) {
                this._is_request_blocking = true;
                console.warn('UAM: ' + msg, data );
            }

        }

        w.NG.UAM = new UserActionManager();
    }

})( typeof window !== 'undefined' ? window : null );