import esbuild from 'esbuild';
import babel from 'esbuild-plugin-babel';

// console.log( process.env.NODE_ENV );

esbuild.build({
    entryPoints: ['./index.web.js'],
    bundle: true,
    minify: true,
    sourcemap: true,
    plugins: [babel()], // берет настройки из .babelrc, preset-env учитывает target из .browserslistrc
    target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
    outfile: 'dist/user_actions.min.js',
}).catch(() => process.exit(1));

// Пришлось добавлять конфигурацию и babel т.к. esbuild давай ошибку на деструкторе (es5 синтаксис)
// esbuild src/index.web.js --bundle --minify --sourcemap --target=chrome58,firefox57,safari11,edge16 --outfile=dist/PROJECT_NAME.min.js
// Transforming destructuring to the configured target environment is not supported yet