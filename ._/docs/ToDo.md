# TODO
 - Подумать над необходимостью добавления коллбэк-функций к промису запроса (final, init);
 - Подумать, стоит ли переписать _resolveOptions. Используя другой класс (like OptionResolver);
 - Переделать с испльзованием выброса ошибок.
 - Продумать над разбиением по файлам (избавиться от зависимости от window);
 - Подумать над избавления от зависимости от window (w).
 - Переписать README в более удобный формат.
 - Переделать указание опций в более удобный формат (action || part, success_handler, error_handler, common_handler, url ... подумать)
 - Продумать добавление доп параметров в хэндлеры, нужно ли
 - Исправить неявное поведение обработки ошибок (ошибка на сервере без ответа - что-то не так, ошибка в js хэндлере не отлавливается)

// ToDo: Перевести под адаптированую концепцию под код (HTTP, нужно ли) ответа
// протестировать с сервером