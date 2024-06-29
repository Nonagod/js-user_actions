// ToDo: вынести в ToolKit
export default async function getObjectFingerprint( object ) {
    let fingerprint = getSortedString( object ); // преобразуем объект в строку

    fingerprint = new TextEncoder().encode( fingerprint ); // преобразуем строку в байты

    fingerprint = await crypto.subtle.digest('SHA-256', fingerprint); // вычисляем SHA-256 хеш

    // Преобразуем массив байт в шестнадцатеричную строку
    fingerprint = ( Array.from( new Uint8Array( fingerprint ))).map(b => b.toString(16).padStart(2, '0')).join('');

    return fingerprint;
}

function getSortedString( object ) {
    let keys = Object.keys( object ).sort(),
        sorted_object = {};

    keys.forEach(key => {
        sorted_object[key] = object[key];
    });

    return JSON.stringify( sorted_object );
}