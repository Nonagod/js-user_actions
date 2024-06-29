import OptionResolvingError from "./Errors/OptionResolvingError";
import UnknownOptionError from "./Errors/UnknownOptionError";

function resolveOptions( user_action, options ) {

    if( !user_action || user_action === 'undefined' || typeof user_action !== "string")
        throw new OptionResolvingError( `Parameter "action" is required and must be a string` );

    if( typeof options !== "object" )
        throw new OptionResolvingError( `Parameter "options" must be an object` );


    for( let [name, value] of Object.entries( options )) {

         switch( name ) {
             case 'data':
                 if( typeof value !== "object" ) throw new OptionResolvingError( `Option "data" must be an object (including FormData)` );
                 break;
             case 'url':
                 if( typeof value !== 'string' ) throw new OptionResolvingError( `Option "url" must be valid URL (string)` );
                 /* ToDo Заменить на нормальную проверку
                 try {
                     new URL(url);
                     return true;
                 } catch (e) {
                     return false;
                 }*/
                 break;
             case 'handleSuccess':
                 if( typeof value !== "function" ) throw new OptionResolvingError( `Option "handleSuccess" must be an function` );
                 break;
             case 'handleError':
                 if( typeof value !== "function" ) throw new OptionResolvingError( `Option "handleError" must be an function` );
                 break;
             default:
                 console.warn(( new UnknownOptionError( `Option "${name}" is not used` ) ));
         }
    }


    // Преобразуем объект data в FormData
    if( options.hasOwnProperty( 'data' ) ) {
        if( Object.prototype.toString.call( options.data ) !== '[object FormData]' ) {
            let form_data = new FormData();
            for( let [key, value] of Object.entries( options.data )) {
                form_data.append(key, value);
            }
            options.data = form_data;
        }
    }else {
        options.data = new FormData();
    }

    options.data.append( 'user_action', user_action ); // добавляем к телу запроса указатель действия


    return options;
}

export default resolveOptions;