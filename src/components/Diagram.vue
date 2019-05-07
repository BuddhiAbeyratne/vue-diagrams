<template>
  <div>
    Version 1.8
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
        v-for="(link, index) in value._model.links"
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
        v-for="(node, nodeIndex) in value._model.nodes"
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

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import DiagramModel from '../DiagramModel';
import LinkFactory from '../util/LinkFactory';
import DiagramGrid from './DiagramGrid.vue';
import DiagramLink from './DiagramLink.vue';
import DiagramNodeWrapper from './DiagramNodeWrapper.vue';

function getAbsoluteXY(element: any) {
  const viewportElement = document.documentElement;
  const box = element.getBoundingClientRect();
  const scrollLeft = viewportElement.scrollLeft;
  const scrollTop = viewportElement.scrollTop;
  const x = box.left + scrollLeft;
  const y = box.top + scrollTop;
  return { x, y };
}

function snapToGrip(val: number, gridSize: number) {
  return gridSize * Math.round(val / gridSize);
}

/*const props = Vue.extend({
  props: {
    diagramModel: {
      type: Object as () => DiagramModel,
      default: () => ({})
    },
    value: {
      type: Object as () => DiagramModel,
      default: () => ({})
    },
    test: {
      type: String,
      default: "TEST123"
    },
    width: {
      type: Number,
      default: 500
    },
    height: {
      type: Number,
      default: 500
    },
    gridSnap: {
      type: Number,
      default: 1
    }
  }
  
});

console.log("PROPS: " + props);*/

@Component({
  components: {
    DiagramNodeWrapper,
    DiagramLink,
    DiagramGrid
  },
  props: {
    diagramModel: {
      type: Object as () => DiagramModel,
      default: () => ({})
    },
    value: {
      type: Object as () => DiagramModel,
      default: () => ({})
    },
    width: {
      type: Number,
      default: 500
    },
    height: {
      type: Number,
      default: 500
    },
    gridSnap: {
      type: Number,
      default: 1
    }
  }
})
export default class Diagram extends Vue {
  value: DiagramModel;
  width!: number;
  height!: number;

  document: any;
  panEnabled = true;
  draggedItem = undefined;
  selectedItem: any = {};
  initialDragX = 0;
  initialDragY = 0;
  newLink = null;
  mouseX = 0;
  mouseY = 0;

  gridSnap!: number;

  created() {
    console.log("AT CREATION: " + JSON.stringify(this.value) + ", " + this.width);
    this.updateLinksPositions();
  }

  mounted() {
    console.log("AT MOUNTED: " + JSON.stringify(this.value) + ", " + this.width);
  }

  get model() {
    return this.value != undefined ? this.value : new DiagramModel();
  }

  convertXYtoViewPort(x: number, y: number) {
    const rootelt: any = document.getElementById('svgroot2');
    const rec: any = document.getElementById('viewport');
    const point = rootelt.createSVGPoint();
    const rooteltPosition = getAbsoluteXY(rootelt);
    point.x = x - rooteltPosition.x;
    point.y = y - rooteltPosition.y;
    const ctm = rec.getCTM().inverse();
    return point.matrixTransform(ctm);
  }

  beforePan() {
    if (this.selectedItem.type || this.draggedItem || this.newLink) {
      return false;
    }
    return true;
  }

  createPoint(x: number, y: number, linkIndex: number, pointIndex: number) {
    const coords = this.convertXYtoViewPort(x, y);
    const links = this.value._model.links;

    // @todo works well only on links created at startup
    if (links[linkIndex].points === undefined) links[linkIndex].points = [];

    const points = links[linkIndex].points;
    points.splice(pointIndex, 0, coords);
    links[linkIndex].points = points;
  }

  deleteLink(linkId: number) {
    const link = this.value.getLink(linkId);

    this.value.deleteLink(link);
    this.$emit('linkDeleted', linkId); // @todo need to standardize event naming
  }

  clearSelection() {
    this.selectedItem = {};
  }

  updateLinksPositions() {
    let links = [];

    if (this.value && this.value._model) links = this.value._model.links;

    this.$nextTick(() => {
      setTimeout(() => {
        for (let i = 0; i < links.length; i += 1) {
          let coords: any;
          coords = this.getPortHandlePosition(links[i].from);
          links[i].positionFrom = { x: coords.x, y: coords.y };
          coords = this.getPortHandlePosition(links[i].to);
          links[i].positionTo = { x: coords.x, y: coords.y };
        }
      }, 100);
    });
  }

  getPortHandlePosition(portId: number) {
    if (this.getPortById(portId)) {
      const port = this.getPortById(portId);
      const node = this.getNodeByPortId(portId);
      let x;
      let y;
      if (port.type === 'in') {
        x = node.x + 10;
        y = node.y + port.y + 64;
      } else {
        x = node.x + node.width + 10;
        y = node.y + port.y + 64;
      }

      return { x, y };
    }

    console.warn(
      `port "${portId}" not found. you must call this method after the first render`
    );
    return 0;
  }

  mouseMove(pos: any) {
    const links = this.value._model.links;
    this.mouseX = pos.x;
    this.mouseY = pos.y;
    if (this.draggedItem) {
      const index = this.draggedItem.index;
      const type = this.draggedItem.type;
      if (type === 'points') {
        const coords = this.convertXYtoViewPort(this.mouseX, this.mouseY);

        coords.x = snapToGrip(coords.x, this.gridSnap) - this.gridSnap / 2;
        coords.y = snapToGrip(coords.y, this.gridSnap);

        links[this.draggedItem.linkIndex].points[this.draggedItem.pointIndex].x = coords.x;
        links[this.draggedItem.linkIndex].points[this.draggedItem.pointIndex].y = coords.y;
        this.updateLinksPositions();
      } else {
        const coords = this.convertXYtoViewPort(this.mouseX, this.mouseY);

        coords.x = snapToGrip(coords.x, this.gridSnap) - this.gridSnap / 2;
        coords.y = snapToGrip(coords.y, this.gridSnap);

        this.value._model[type][index].x = coords.x - 30;
        this.value._model[type][index].y = coords.y - 30;
        this.updateLinksPositions();
      }
    }
  }

  mouseUp() {
    this.draggedItem = undefined;
    this.newLink = undefined;
  }

  startDragPoint(pointInfo: any) {
    this.draggedItem = pointInfo;
  }

  onMouseUpPort(portId: number) {
    const links = this.value._model.links;

    if (this.draggedItem && this.draggedItem.type === 'points') {
      const pointIndex = this.draggedItem.pointIndex;
      const linkIndex = this.draggedItem.linkIndex;

      if (this.getPortById(portId).type === 'in') {
        const l = links[linkIndex].points.length;
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
  }

  getPortById(portId: number) {
    const node = this.value._model.nodes.find(
      node => node.ports.find(port => port.id === portId) !== undefined
    );
    return node != undefined
      ? node.ports.find(port => port.id === portId)
      : undefined;
  }

  getNodeIndexById(portId: number) {
    return this.value._model.nodes.findIndex(
      node => node.ports.find(port => port.id === portId) !== undefined
    );
  }

  getNodeByPortId(portId: number) {
    return this.value._model.nodes.find(
      node => node.ports.find(port => port.id === portId) !== undefined
    );
  }

  createLink(portId: number) {
    const links = this.value._model.links;

    const port1Id = this.newLink.startPortId;
    const port2Id = portId;
    const port1 = this.getPortById(port1Id);
    const port2 = this.getPortById(port2Id);

    let createdLink = null;
    if (port1.type === 'in' && port2.type === 'out') {
      createdLink = LinkFactory.createLink(port2.id, port1.id);
    } else if (port2.type === 'in' && port1.type === 'out') {
      createdLink = LinkFactory.createLink(port1.id, port2.id);
    } else {
      console.warn('You must link one out port and one in port');
    }

    if (createdLink !== null) {
      links.push(createdLink);
      this.value._model.links = links;
      this.updateLinksPositions();
      this.$emit(
        'linkCreated',
        createdLink.id,
        this.getNodeByPortId(port1Id).id,
        this.getNodeByPortId(port2Id).id,
        port1Id
      );
    }
  }

  onSelectNode(node: any) {
    this.selectedItem = node;
  }

  onStartDragNode({ item, x, y }: any) {
    this.panEnabled = false;
    this.initialDragX = x;
    this.initialDragY = y;
    this.draggedItem = item;
  }

  startDragNewLink(startPortId: number) {
    this.panEnabled = false;
    this.newLink = {
      startPortId
    };
  }

  handleClick(nodeId: number) {
    this.$emit('click', nodeId);
  }

  handleDelete(nodeId: number) {
    this.$emit('delete', nodeId);
  }

  startDragItem(item: any, x: number, y: number) {
    this.panEnabled = false;
    this.draggedItem = item;
    this.selectedItem = item;
    this.initialDragX = x;
    this.initialDragY = y;
  }

  get querySelector() {
    return document.querySelector('#viewport');
  }

  /*@Watch('model._model.links')
  onModelLinksChange() {
    this.updateLinksPositions();
  }*/
}
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
