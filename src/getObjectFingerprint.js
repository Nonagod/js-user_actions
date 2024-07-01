// ToDo: вынести в ToolKit
import cloneDeep from 'lodash.cloneDeep';

export default async function getObjectFingerprint( object ) {
    object = cloneDeep( object ); // Object.assign( {}, object ) - не подходит (выполняет поверхностное клонирование), если копии будут не полные можно рассмотреть clonedeepwith

    // преобразуем FormData в строку
    if( object.data ) {
        // Собрать все поля и файлы из FormData
        const entries = [];
        for (let entry of object.data.entries()) {
            entries.push( entry );
        }

        // Сортировать по ключам для предсказуемости хеша
        entries.sort((a, b) => a[0].localeCompare(b[0]));

        // Конвертировать в строку
        object.data = await entriesToString(entries);
    }

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

async function entriesToString( entries ) {
    const parts = [];
    for (let [key, value] of entries) {
        if (value instanceof File) {
            const fileContent = await fileToBase64(value);
            parts.push(`${key}=${fileContent}`);
        } else {
            parts.push(`${key}=${value}`);
        }
    }
    return parts.join('&');
}
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}