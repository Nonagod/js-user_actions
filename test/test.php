<?php
header('Access-Control-Allow-Origin: *');

$is_error = filter_input( INPUT_POST, 'error', FILTER_VALIDATE_INT);

sleep(2);

if( $is_error ) $this->succeed( 'Не ошибка' );
else $this->failed('ERROR', 'Заложенная ошибка');