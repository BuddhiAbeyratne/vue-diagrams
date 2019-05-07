import Diagram from './components/Diagram.vue';
import DiagramModel from './DiagramModel';
import Vue from 'vue';

const LibraryModule = {
  Diagram,

  install(Vue: any) {
    // Register components with vue
    Vue.component('diagram', Diagram);
  }
};

if (typeof window !== 'undefined' && Vue) {
  Vue.use(LibraryModule);
}

// Export library
export default LibraryModule;

// Export components
export { Diagram };
export { DiagramModel };
