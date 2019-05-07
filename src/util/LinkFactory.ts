const generateId = () => {
  return Math.trunc(Math.random() * 1000);
};

export default class LinkFactory {
  static createLink(inputPortId: number, outputPortId: number, points = []) {
    return {
      points,
      id: generateId(),
      from: inputPortId,
      to: outputPortId,
      positionFrom: {},
      positionTo: {},
    } as any;
  }
}
