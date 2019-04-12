let generateId = () => {
  return Math.trunc(Math.random() * 1000);
};

export default class {
  static createLink(inputPortId, outputPortId, points = []) {
    return {
      id: generateId(),
      from: inputPortId,
      to: outputPortId,
      positionFrom: {},
      positionTo: {},
      points
    };
  }
}
