import DiagramNode from './DiagramNode';
import LinkFactory from './util/LinkFactory';
/**
 * @class DiagramModel
 */
class DiagramModel {
    /**
     */
    constructor() {
        this._model = {
            nodes: [],
            links: []
        };
    }
    /**
     * Adds a node to the diagram
     * @param {String} title  The title of the node
     * @param {Integer} x      X coordinate
     * @param {Integer} y      Y Coordinate
     * @param {Integer} width  Width
     * @param {Integer} height Height
     * @return {Node} The node created
     */
    addNode({ id, title, x, y, width, height }) {
        const newNode = new DiagramNode(id, title, x, y, width, height);
        this._model.nodes.push(newNode);
        return newNode;
    }
    clear() {
        this._model.nodes.splice(0, this._model.nodes.length);
        const numNodes = this._model.nodes.length;
        for (let i = 0; i < numNodes; i += 1) {
            this.deleteNode(this._model.nodes[0]);
        }
        const numLinks = this._model.links.length;
        for (let i = 0; i < numLinks; i += 1) {
            this.deleteLink(this._model.links[0]);
        }
    }
    deleteNode(node) {
        const index = this._model.nodes.indexOf(node);
        for (let j = 0; j < this._model.links.length; j += 1) {
            const currentLink = this._model.links[j];
            for (let i = 0; i < node.ports.length; i += 1) {
                const currentPort = node.ports[i];
                if (currentLink.from === currentPort.id ||
                    currentLink.to === currentPort.id) {
                    this.deleteLink(currentLink);
                    j -= 1;
                }
            }
        }
        this._model.nodes.splice(index, 1);
    }
    getLink(linkId) {
        return this._model.links.find((link) => link.id === linkId);
    }
    deleteLink(link) {
        const index = this._model.links.indexOf(link);
        this._model.links.splice(index, 1);
    }
    /**
     * Adds a link between two ports
     * @param {Integer} from   Port id. Must be an out port
     * @param {Integer} to     Port id. Must be an in port
     * @param {Array}  points  Optional. Array of points to make the link represented as a segmented line
     */
    addLink(from, to, points = []) {
        const newLink = LinkFactory.createLink(from, to, points);
        this._model.links.push(newLink);
        return newLink.id;
    }
    /**
     * Serializes the diagram model into a JSON object
     * @return {Object} The diagram model
     */
    serialize() {
        return JSON.stringify(this._model);
    }
    /**
     * Load into the diagram model a serialized diagram
     * @param  {Object} serializedModel
     */
    deserialize(serializedModel) {
        this._model = JSON.parse(serializedModel);
    }
}
export default DiagramModel;
//# sourceMappingURL=DiagramModel.js.map