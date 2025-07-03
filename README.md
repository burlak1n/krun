## Project setup

```
git clone git@github.com:Marmar421/hse_run_front.git
```

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## Formatter and linter setup

We are using [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/) for code formatting and static analysis, respectively.

#### VSCode extentions

It is reccomend to use [official ESLint extention](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [official Prettier extention](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) for VSCode editor.

With this extentions you can create `.vscode/setting.json` file and paste the settings into it like this:

```
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnPaste": false,
  "editor.formatOnType": false,
  "editor.formatOnSave": true,
  "editor.formatOnSaveMode": "file",
  "files.autoSave": "onFocusChange",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

After such settings, the formatting by **Prettier** will be automatic.

### Pre-commit hook

We are using [husky](https://www.npmjs.com/package/husky) for automatically lint your code on commiting. You can run

```
npx eslint . --ext .js,.vue
```

by yourself and explore the issues.

Запуск фронта на 80 порту. От имени админа!
```
sudo npm run serve -- --port 80
```