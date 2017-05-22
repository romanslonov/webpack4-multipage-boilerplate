# webpack2-multipage-boilerplate

This is a simple boilerplate for using [webpack 2](https://webpack.js.org) with [pug](https://pugjs.org) and [POSTCSS](https://github.com/postcss/postcss) to build multi-page website.

## Why?

Time to time you need to build a not SPA web application but triditional multiple page website. But you still need toolkit such as Webpack, Babel (to use js advanced goodies like ES6/ES7) and so on. So I build this boilerplate that helps to kick off a new project for anyone 🎉

## Features

1. [**webpack 2**](https://webpack.js.org): JavaScript module bundler
2. [**babel**](https://babeljs.io/): Use next generation JavaScript today
4. [**postcss**](https://github.com/postcss/postcss): A tool for transforming styles
5. [**pug**](https://pugjs.org): A high performance template engine
6. [**eslint**](http://eslint.org/): The pluggable linting utility for JavaScript and JSX

### Boilerplate structure

```
build/                codes related to building and dev-server
src/
|- assets/            assets (optional)
|- pages/             folder contains pages for the project
|  |- index.pug       page that turns to html
|  |- index.js        entry point for this page
|- partials/          partials used in the pages (optional)
```
