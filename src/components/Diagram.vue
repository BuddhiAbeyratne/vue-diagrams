<template>
  <div>
    Version 1.4
    <DiagramGrid
      :beforePan="beforePan"
      :panEnabled="panEnabled"
      :width="width"
      :height="height"
      @mousemove="mouseMove"
      @mouseup="mouseUp"
      @mousedown="clearSelection"
    >
      <DiagramLink
        v-for="(link, index) in model._model.links"
        :ref="'link-' + index"
        :positionFrom="link.positionFrom"
        :positionTo="link.positionTo"
        :points="link.points"
        :id="link.id"
        :index="index"
        :key="link.id"
        @onStartDrag="startDragPoint"
        @onDeleteLink="deleteLink"
      />
      <line
        v-if="newLink"
        class="new-link-line"
        :x1="getPortHandlePosition(newLink.startPortId).x"
        :y1="getPortHandlePosition(newLink.startPortId).y"
        :x2="convertXYtoViewPort(mouseX, 0).x"
        :y2="convertXYtoViewPort(0, mouseY).y"
      />
      <DiagramNodeWrapper
        v-for="(node, nodeIndex) in model._model.nodes"
        :key="nodeIndex"
        :node="node"
        :nodeIndex="nodeIndex"
        :isSelected="selectedItem.type === 'nodes' && selectedItem.index === nodeIndex"
        @selectNode="onSelectNode"
        @startDragNode="onStartDragNode"
        @mouseUpPort="onMouseUpPort"
        @click="handleClick"
        @delete="handleDelete"
        @startDragNewLink="startDragNewLink"
      ></DiagramNodeWrapper>
    </DiagramGrid>
  </div>
</template>
<script>
import SvgPanZoom from "vue-svg-pan-zoom";
import DiagramNodeWrapper from "./DiagramNodeWrapper";
import DiagramNode from "./DiagramNode";
import DiagramGrid from "./DiagramGrid";
import DiagramModel from "./../DiagramModel";
import DiagramLink from "./DiagramLink";
import LinkFactory from "../util/LinkFactory";

function getAbsoluteXY(element) {
  var viewportElement = document.documentElement;
  var box = element.getBoundingClientRect();
  var scrollLeft = viewportElement.scrollLeft;
  var scrollTop = viewportElement.scrollTop;
  var x = box.left + scrollLeft;
  var y = box.top + scrollTop;
  return { x: x, y: y };
}

function snapToGrip(val, gridSize) {
  return gridSize * Math.round(val / gridSize);
}

export default {
  name: "Diagram",
  Model: DiagramModel,

  props: {
    model: {
      required: true
    },
    width: {
      default: 500
    },
    height: {
      default: 500
    },
    gridSnap: {
      default: 1
    }
  },

  data() {
    this.updateLinksPositions();

    return {
      document,
      zoomEnabled: true,
      panEnabled: true,
      draggedItem: undefined,
      selectedItem: {},
      initialDragX: 0,
      initialDragY: 0,
      newLink: undefined,
      mouseX: 0,
      mouseY: 0
    };
  },
  components: {
    DiagramNodeWrapper,
    DiagramLink,
    DiagramNode,
    DiagramGrid
  },

  methods: {
    convertXYtoViewPort(x, y) {
      let rootelt = document.getElementById("svgroot2");
      let rec = document.getElementById("viewport");
      let point = rootelt.createSVGPoint();
      let rooteltPosition = getAbsoluteXY(rootelt);
      point.x = x - rooteltPosition.x;
      point.y = y - rooteltPosition.y;
      let ctm = rec.getCTM().inverse();
      return point.matrixTransform(ctm);
    },

    beforePan() {
      if (this.selectedItem.type || this.draggedItem || this.newLink)
        return false;
      else return true;
    },

    createPoint(x, y, linkIndex, pointIndex) {
      let coords = this.convertXYtoViewPort(x, y);
      let links = this.model._model.links;

      //FIXME works well only on links created at startup
      if (links[linkIndex].points === undefined) links[linkIndex].points = [];

      var points = links[linkIndex].points;
      points.splice(pointIndex, 0, coords);
      links[linkIndex].points = points;
    },

    deleteLink(linkId) {
      const link = this.model.getLink(linkId);

      this.model.deleteLink(link);
      this.$emit("linkDeleted", linkId); // @todo need to standardize event naming
    },

    clearSelection() {
      this.selectedItem = {};
    },

    updateLinksPositions() {
      var links = [];

      if (this.model && this.model._model) links = this.model._model.links;

      this.$nextTick(() => {
        setTimeout(() => {
          for (var i = 0; i < links.length; i++) {
            var coords;
            coords = this.getPortHandlePosition(links[i].from);
            links[i].positionFrom = { x: coords.x, y: coords.y };
            coords = this.getPortHandlePosition(links[i].to);
            links[i].positionTo = { x: coords.x, y: coords.y };
          }
        }, 100);
      });
    },

    getPortHandlePosition(portId) {
      if (this.getPortById(portId)) {
        var port = this.getPortById(portId);
        var node = this.getNodeByPortId(portId);
        var x;
        var y;
        if (port.type === "in") {
          x = node.x + 10;
          y = node.y + port.y + 64;
        } else {
          x = node.x + node.width + 10;
          y = node.y + port.y + 64;
        }

        return { x, y };
      } else {
        console.warn(
          `port "${portId}" not found. you must call this method after the first render`
        );
        return 0;
      }
    },

    mouseMove(pos) {
      var links = this.model._model.links;
      this.mouseX = pos.x;
      this.mouseY = pos.y;
      if (this.draggedItem) {
        var index = this.draggedItem.index;
        var type = this.draggedItem.type;
        if (type === "points") {
          let coords = this.convertXYtoViewPort(this.mouseX, this.mouseY);

          coords.x = snapToGrip(coords.x, this.gridSnap) - this.gridSnap / 2;
          coords.y = snapToGrip(coords.y, this.gridSnap);

          links[this.draggedItem.linkIndex].points[
            this.draggedItem.pointIndex
          ].x =
            coords.x;
          links[this.draggedItem.linkIndex].points[
            this.draggedItem.pointIndex
          ].y =
            coords.y;
          this.updateLinksPositions();
        } else {
          let coords = this.convertXYtoViewPort(this.mouseX, this.mouseY);

          coords.x = snapToGrip(coords.x, this.gridSnap) - this.gridSnap / 2;
          coords.y = snapToGrip(coords.y, this.gridSnap);

          this.model._model[type][index].x = coords.x - 30;
          this.model._model[type][index].y = coords.y - 30;
          this.updateLinksPositions();
        }
      }
    },

    mouseUp() {
      this.draggedItem = undefined;
      this.newLink = undefined;
    },

    startDragPoint(pointInfo) {
      this.draggedItem = pointInfo;
    },

    onMouseUpPort(portId) {
      let links = this.model._model.links;

      if (this.draggedItem && this.draggedItem.type === "points") {
        let pointIndex = this.draggedItem.pointIndex;
        let linkIndex = this.draggedItem.linkIndex;

        if (this.getPortById(portId).type === "in") {
          let l = links[linkIndex].points.length;
          links[linkIndex].points.splice(
            pointIndex,
            l - this.draggedItem.pointIndex
          );
        } else {
          links[linkIndex].points.splice(0, pointIndex + 1);
        }
        this.updateLinksPositions();
      }

      if (this.newLink !== undefined) {
        this.createLink(portId);
      }
    },

    getPortById(portId) {
      const node = this.model._model.nodes.find(
        node => node.ports.find(port => port.id === portId) !== undefined
      );
      return node != undefined
        ? node.ports.find(port => port.id === portId)
        : undefined;
    },

    getNodeIndexById(portId) {
      return this.model._model.nodes.findIndex(
        node => node.ports.find(port => port.id === portId) !== undefined
      );
    },

    getNodeByPortId(portId) {
      return this.model._model.nodes.find(
        node => node.ports.find(port => port.id === portId) !== undefined
      );
    },

    createLink(portId) {
      let links = this.model._model.links;

      let port1Id = this.newLink.startPortId;
      let port2Id = portId;
      let port1 = this.getPortById(port1Id);
      let port2 = this.getPortById(port2Id);

      let createdLink = null;
      if (port1.type === "in" && port2.type === "out") {
        createdLink = LinkFactory.createLink(port2.id, port1.id);
      } else if (port2.type === "in" && port1.type === "out") {
        createdLink = LinkFactory.createLink(port1.id, port2.id);
      } else {
        console.warn("You must link one out port and one in port");
      }

      if (createdLink !== null) {
        links.push(createdLink);
        this.model._model.links = links;
        this.updateLinksPositions();
        this.$emit(
          "linkCreated",
          createdLink.id,
          this.getNodeByPortId(port1Id).id,
          this.getNodeByPortId(port2Id).id,
          port1Id
        );
      }
    },

    onSelectNode(node) {
      this.selectedItem = node;
    },

    onStartDragNode({ item, x, y }) {
      this.panEnabled = false;
      this.initialDragX = x;
      this.initialDragY = y;
      this.draggedItem = item;
    },

    startDragNewLink(startPortId) {
      this.panEnabled = false;
      this.newLink = {
        startPortId
      };
    },

    handleClick(nodeId) {
      this.$emit("click", nodeId);
    },

    handleDelete(nodeId) {
      this.$emit("delete", nodeId);
    },

    startDragPoint(pointInfo) {
      this.draggedItem = pointInfo;
    },

    startDragItem(item, x, y) {
      this.panEnabled = false;
      this.draggedItem = item;
      this.selectedItem = item;
      this.initialDragX = x;
      this.initialDragY = y;
    }
  },
  computed: {
    querySelector: function() {
      return document.querySelector("#viewport");
    }
  },

  watch: {
    "model._model.links": function() {
      this.updateLinksPositions();
    }
  }
};
</script>
<style scoped>

svg {
  user-select: none;
  font-family: Helvetica;
}

.new-link-line {
  stroke: rgb(255,0,0);
  stroke-width: 2
}
</style>
