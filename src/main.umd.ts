import Vue from 'vue';
import LibraryModule, * as LibraryComponents from './main';

// Automatically register components if Vue is available globally
if (typeof window !== 'undefined' && Vue) {
  Vue.use(LibraryModule);
}

export default LibraryComponents;
