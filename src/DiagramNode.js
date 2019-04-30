var generateId = function() {
  return Math.trunc(Math.random() * 1000);
};

/**
 * @class DiagramNode
 */
class DiagramNode {
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
    let newPort = {
      id: generateId(),
      type: "in",
      name,
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
    let newPort = {
      id: generateId(),
      type: "out",
      name,
      x: 0,
      y: 0
    };

    this.ports.push(newPort);

    newPort.y = (this.ports.length - 1) * 20;

    return newPort.id;
  }
}

export default DiagramNode;
