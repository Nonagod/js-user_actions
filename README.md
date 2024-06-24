# Менеджер действий пользователя.
Пакет описывает реализацию абстракции - `User Actions`, на стороне клиента. Немного упрощает организацию взаимодействия
по AJAX (формирование запросов и обработка ответов). 



## Установка & подключение
**С использованием систем сборки**
1. Добавить пакет в проект - ```npm i uam-client```
2. Подключить к проекту (в главный файл js) - ```require("swipe_detector")```
3. Можно обращаться в коде проекта через - ```window.NG.UAM```

**Как библиотеку**
1. Клонировать проект с GitHub и перейти в папку - ```git clone git@github.com:Nonagod/uam-client.git```
2. Установить зависимости - ```npm i```
3. Собрать проект - ```gulp```
4. Копировать код библиотеки из - ```./build/libs.min.js```

## Описание методов

### .request( options ) 
Отправляет запрос на сервер (для отправки использует метод ```fetch```). В качестве параметра, принимает объект 
настроек следующего содержания:
1. ```data``` - **обязательный**, объект данных запроса. Можно передавать в формате ```FormData```.
> ВАЖНО: Обязательно должен содержать ключ `user_action` со строковым значением.
2. ```handlers``` - объект содержащий функции обработчики результатов запроса
   1. ```success``` - функция-обработчик успешного выполнения. На вход получает один параметр содержащий результаты 
      запроса.
   2. ```error``` - функция-обработчик неудачного выполнения запроса. На вход получает объект ошибки ```UAMError``` 
      (значимые свойства `e.info` - данные ошибки, `e.SystemError` - системная ошибка).
3. ```url``` - адрес на который сделать запрос (по умол. текущая страница)
4. ```emulation``` - функция эмуляции запроса, на вход принимает объект опций. должна возвращать объект согласно 
   абстракции

## ToDo

[] Ошибки в обработчиках не должны вызываться как системная от UAM
___
- [Описание абстракция "Действия пользователя"](#)
- [Решение для серверной стороны (php)](#)
