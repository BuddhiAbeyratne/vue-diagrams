import Diagram from './components/Diagram.vue';
import DiagramModel from './DiagramModel';
const LibraryModule = {
    Diagram,
    install(Vue) {
        console.log("REGISTERING!");
        // Register components with vue
        Vue.component('diagram', Diagram);
    }
};
// Export library
export default LibraryModule;
// Export components
export { Diagram };
export { DiagramModel };
//# sourceMappingURL=main.js.map