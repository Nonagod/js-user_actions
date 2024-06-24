import module from './index.js';

(function( root ) {
    if( !root.hasOwnProperty('NG') ) root.NG = {};
    root.NG.UserAction = module;
}(
    !!(
        typeof window !== "undefined"
        && window.document
        && window.document.createElement
    )
    ? window
    : this
));