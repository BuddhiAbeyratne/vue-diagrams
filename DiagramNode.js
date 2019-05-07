const generateId = () => {
    return Math.trunc(Math.random() * 1000);
};
/**
 * @class DiagramNode
 */
export default class DiagramNode {
    /**
     *  This should not be called directly. Use the "addNode" method from the DiagramModel class
     * @param  {Integer} id
     * @param  {String} title  [description]
     * @param  {Integer} x      [description]
     * @param  {Integer} y      [description]
     * @param  {Integer} width  [description]
     * @param  {Integer} height [description]
     * @param  {Integer} id [description]
     */
    constructor(id, title, x, y, width, height) {
        this.id = id;
        this.title = title;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.ports = [];
        this.componentType = undefined;
    }
    /**
     * Adds a new "in" port into the node.
     * @param {String} name
     * @return {Integer} The port id
     */
    addInPort(name) {
        const newPort = {
            name,
            id: generateId(),
            type: 'in',
            x: 0,
            y: 0
        };
        this.ports.push(newPort);
        newPort.y = (this.ports.length - 1) * 20;
        return newPort.id;
    }
    /**
     * Adds a new "out" port into the node.
     * @param {String} name
     * @return {Integer} The port id
     */
    addOutPort(name) {
        const newPort = {
            name,
            id: generateId(),
            type: 'out',
            x: 0,
            y: 0
        };
        this.ports.push(newPort);
        newPort.y = (this.ports.length - 1) * 20;
        return newPort.id;
    }
}
//# sourceMappingURL=DiagramNode.js.map