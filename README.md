# vue-diagrams

![Rollup badge](https://img.shields.io/badge/Rollup-^0.53.3-ff69b4.svg)
![Jest](https://img.shields.io/badge/Jest-^22.0.4-blue.svg)
![Vue](https://img.shields.io/badge/Vue-^2.5.13-brightgreen.svg)
![Storybook](https://img.shields.io/badge/Storybook-^3.3.3-ff70a3.svg)
![Commitizen](https://img.shields.io/badge/Commitizen-enabled-brightgreen.svg)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
![Npm badge](https://img.shields.io/npm/v/vue-diagrams.svg)
[![Build Status](https://travis-ci.org/gwenaelp/vue-diagrams.svg?branch=master)](https://travis-ci.org/gwenaelp/vue-diagrams)

> Diagram component for vue.js, inspired by react-diagrams

> Generated using [vue-cli-template-library](https://github.com/julon/vue-cli-template-library).

## Installation
```
npm install vue-diagrams
```
vue-diagrams can be used as a module in both CommonJS and ES modular environments.

When in non-modular environment, vue-diagrams will register all the components to vue by itself.</p>

### ES6
```js
//
// You can register a component manually
//
import { HelloWorld } from 'vue-diagrams';

export default {
  ...
  components: {
    HelloWorld
  },
  ...
};

//
// or register the whole module with vue
//
import ModuleLibrary from 'vue-diagrams';

// Install this library
Vue.use(ModuleLibrary);
```

### CommonJS
```js
//
// You can register a component manually
//
var Vue = require('vue');
var ModuleLibrary = require('vue-diagrams');

var YourComponent = Vue.extend({
  ...
  components: {
    'hello-world': ModuleLibrary.HelloWorld
  },
  ...
});

//
// or register the whole module with vue
//
var Vue = require('vue');
var ModuleLibrary = require('vue-diagrams');

// Install this library
Vue.use(ModuleLibrary);
```

### Browser

```html
<script src="path/to/vue/vue.min.js"></script>
<script src="path/to/vue-diagrams/dist/vue-diagrams.min.js"></script>
<!-- Components are registered globally -->
```

### After that, you can use it in your templates:

```html
<hello-world></hello-world>
```

## Changelog

See the GitHub [release history](https://github.com/gwenaelp/vue-diagrams/releases).

## Contributing

See [CONTRIBUTING.md](.github/CONTRIBUTING.md).