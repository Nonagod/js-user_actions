import Module from './index.js';

(function( root ) {
    let module_name = 'UserAction'
    if( !root.hasOwnProperty( module_name )) root[module_name] = new Module;
    else console.error( `Module "${module_name}" already exists. The name is already taken or the script connection is duplicated.` );
}(
    !!(
        typeof window !== "undefined"
        && window.document
        && window.document.createElement
    )
    ? window
    : this
));