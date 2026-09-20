# Library App: система управління бібліотекою

Клієнтський застосунок для управління бібліотекою (книги та користувачі) на **TypeScript**. Увесь інтерфейс генерується через DOM API, а `index.html` містить лише `<div id="app"></div>`. Лабораторна робота №2 з курсу «Інженерія клієнтських веб систем».

## Демо

- webpack-версія: https://smilezevil.github.io/library-app/
- Vite-версія: https://smilezevil.github.io/library-app/vite/

## Можливості

- Додавання та видалення книг і користувачів, валідація форм (обов'язкові поля, ID користувача лише з цифр, рік за регулярним виразом).
- Позичання книги за ID користувача (модальне вікно). Ліміт: не більше 3 книг на користувача, при спробі взяти четверту показується модальне повідомлення.
- Повернення книг, пошук за автором і назвою, пагінація (5 елементів на сторінку).
- Збереження даних у `LocalStorage`, тому після перезавантаження сторінки все залишається.
- Система сповіщень без `alert`: Bootstrap-модалки.

## Стек

TypeScript 5 (класи, інтерфейси, узагальнення `Library<T>`, модулі, `namespace Validation`), Bootstrap 5 + Sass, webpack 5 (гілка `main`), Vite (гілка `vite-migration`), ESLint + Prettier, Mocha + Chai, Husky, gh-pages.

## Запуск

```bash
npm install
npm start          # dev-сервер на http://localhost:9000
npm run build      # production-збірка в dist/
npm test           # unit-тести (Mocha + Chai)
npm run lint       # ESLint
npm run format     # Prettier
npm run deploy     # збірка + публікація в гілку gh-pages
```

## Структура проєкту

```
src/
  models/      Book, User та інтерфейси IBook / IUser
  services/    Library<T>, Storage, NotificationService, LibraryManager
  utils/       validators (namespace Validation), idGenerator, pagination
  ui/          dom-хелпери, компоненти (форми, списки, модалки, пагінація), render
  types/       спільні типи та enum
  styles/      main.scss
tests/         unit-тести Library та Validation
```

## Робочий процес

- Feature-branch workflow: кожна частина роботи в окремій гілці (`feature/...`) з Pull Request у `main`.
- Повідомлення комітів за специфікацією Conventional Commits (`feat:`, `fix:`, `build:`, `docs:`, `test:` тощо).
- Husky pre-commit: перед кожним комітом запускаються `npm run lint` і `npm test`. Якщо є помилка, коміт блокується.
- Гілка `vite-migration` містить міграцію зі webpack на Vite. Pull Request у `main` навмисно не змерджений, щоб `main` лишався на webpack.

## Порівняння webpack і Vite

Виміри зроблені на одному ноутбуці (Node v25.9, webpack 5.111, Vite 8.3) на одному й тому самому коді.

| Критерій | webpack 5 | Vite 8 |
|---|---|---|
| Старт dev-сервера | 2070 мс | 237 мс |
| Production-збірка | 1994 мс | 309 мс (+ окремий `tsc --noEmit`) |
| Розмір без стиснення | 326 KiB (один JS, CSS усередині) | 98,28 kB JS + 230,16 kB CSS |
| Розмір після gzip | 61,3 kB | 30,34 kB JS + 30,77 kB CSS = 61,1 kB |
| Конфігурація | `webpack.config.js`: entry, output, loaders, plugins, devServer | `vite.config.ts`: 3 рядки (`base`, `server`, `build`) |
| Завантаження стилів | style-loader вставляє CSS через JS | окремий CSS-файл, підключений у `index.html` |

### Швидкість запуску та HMR

Vite стартує майже миттєво, бо не збирає весь бандл наперед: залежності попередньо оптимізуються, а власні модулі віддаються браузеру як native ES modules на вимогу. Webpack при старті збирає повний бандл, тому на цьому невеликому проєкті це вже ~2 секунди, а на великому різниця буде помітнішою. Оновлення після змін у коді (HMR) у Vite точкове й майже непомітне, у webpack воно потребує перезбирання графа модулів.

### Конфігурація

Для webpack довелося описати `entry`, `output` (із `clean` і `contenthash`), `resolve.extensions`, набір правил для `ts-loader`, `css-loader`, `style-loader`, `sass-loader`, `HtmlWebpackPlugin` і `devServer`. Vite потрібен лише короткий `vite.config.ts`: TypeScript, CSS та Sass підтримуються з коробки (Sass потребує лише пакета `sass`). Окрема складність Vite: потрібен Node ≥ 20.19, а для завантаження конфігу довелося використати `--configLoader runner` і налаштувати `moduleResolution: "Bundler"` у `tsconfig.json`.

### Розмір і швидкість збірки

Розмір збірки майже однаковий (різниця в межах ~2%), а після gzip обидва варіанти дають ~61 kB, тому що обидва мінімізують код і включають одні й ті самі Bootstrap та код застосунку. Збірка у Vite швидша приблизно у 6,5 раза. Важливо, що `vite build` не перевіряє типи, тому у скрипті `build` перед ним запускається `tsc --noEmit`, а у webpack перевірку типів виконує `ts-loader`. Webpack також видає попередження про перевищення 244 KiB, бо CSS Bootstrap потрапляє в один JS-файл. У Vite CSS винесений в окремий файл.

### Підтримка TypeScript та UI-фреймворків

Webpack потребує `ts-loader` (або `babel-loader`) і його потрібно сумісно версіонувати з TypeScript (з найновішим TS `ts-loader` у нас ламався, довелося закріпити TS 5). Vite обробляє `.ts` самостійно через esbuild/Rolldown без додаткових loader-ів. Для React, Vue та інших фреймворків у Vite є офіційні плагіни (`@vitejs/plugin-react`, `@vitejs/plugin-vue`), а у webpack потрібно вручну налаштовувати loader-и та plugin-и.

### Екосистема плагінів

Webpack має найбільшу й найзрілішу екосистему loader-ів і plugin-ів, що дає гнучкість у складних кейсах (Module Federation, нестандартні формати файлів, тонке керування чанками). Екосистема Vite менша, але сучасніша, і для типових завдань її достатньо. До того ж Vite сумісний із Rollup-плагінами.

### Суб'єктивна оцінка

Для нового невеликого чи середнього проєкту Vite зручніший: майже нульова конфігурація, миттєвий dev-сервер і зрозумілі повідомлення. Webpack виправданий у великих legacy-проєктах і там, де потрібні його специфічні можливості (наприклад, Module Federation). У цій лабораторній міграція зайняла один коміт, а результат за розміром збірки еквівалентний.