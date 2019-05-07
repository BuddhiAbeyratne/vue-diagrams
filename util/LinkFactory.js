const generateId = () => {
    return Math.trunc(Math.random() * 1000);
};
export default class LinkFactory {
    static createLink(inputPortId, outputPortId, points = []) {
        return {
            points,
            id: generateId(),
            from: inputPortId,
            to: outputPortId,
            positionFrom: {},
            positionTo: {},
        };
    }
}
//# sourceMappingURL=LinkFactory.js.map