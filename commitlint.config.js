
module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'header-max-length': [2, 'always', 72],

        'scope-case': [2, 'always', 'lower-case'],
        // под проект
        /*"scope-enum": [
            2,
            "always",
            [
                "build",
            ]
        ],*/

        'body-max-line-length': [2, 'always', 72],

        'footer-max-line-length': [2, 'always', 72],
    },
    prompt: {
        questions: {
            type: {
                description: "Какой специфики изменения вносились?",
                enum: {
                    feat: {
                        description: 'Добавление нового функционала',
                        title: 'Функции',
                    },
                    fix: {
                        description: 'Исправление ошибок',
                        title: 'Исправления',
                    },
                    docs: {
                        description: 'Изменения в файлах документации',
                        title: 'Документация',
                    },
                    style: {
                        description: 'Стилистическое форматирование кода (отступы, переносы, знаки и т.п.)',
                        title: 'Стиль кода',
                    },
                    refactor: {
                        description: 'Изменения кода не влияющие на логику (не исправление, не функция)',
                        title: 'Рефакторинг',
                    },
                    perf: {
                        description: 'Улучшение производительности кода',
                        title: 'Производительность',
                    },
                    test: {
                        description: 'Добавление / изменения тестов',
                        title: 'Тесты',
                    },
                    build: {
                        description: 'Работа с внешними зависимостями и/или системой сборки',
                        title: 'Сборка',
                    },
                    ci: {
                        description: 'Изменение в конфигурациях интеграционных сценариев',
                        title: 'Интеграции',
                    },
                    chore: {
                        description: "Прочие изменения в файлах (не в src и tests)",
                        title: 'Прочее',
                    },
                    revert: {
                        description: 'Отмена ранее внесенных изменений',
                        title: 'Откаты',
                    },
                },
            },
            scope: {
                description: 'К какой области относятся изменения?',
            },
            subject: {
                description: 'Коротко, что сделано (в изъявительном наклонении)?',
            },
            body: {
                description: 'Подробнее, что конкретно было сделано и почему/зачем (причина изменений, решаемая проблема)',
            },
            isBreaking: {
                description: 'Присутствуют критические изменения (затрагивающие обратную совместимость, публично)?',
            },
            breakingBody: {
                description: 'Обязательно (для критических изменений) - Подробнее, что конкретно сделано и почему/зачем?',
            },
            breaking: {
                description: 'Подробно, что изменилось для пользователей (было - стало)?',
            },
            isIssueAffected: {
                description: 'Изменения связаны с какой-либо задачей?',
            },
            issuesBody: {
                description: 'Если задача закрыта, требуется подробное описание',
            },
            issues: {
                description: 'Какие задачи решались (ссылки)',
            },
        }
    }
};
