<template>
  <DiagramNode
    :ref="'node-' + nodeIndex"
    :title="node.title"
    :x="node.x"
    :y="node.y"
    :width="node.width"
    :height="node.height"
    :color="node.color"
    :deletable="node.deletable"
    :ports="node.ports"
    :selected="isSelected"
    :id="node.id"
    :index="nodeIndex"
    @onStartDrag="startDragItem"
    @delete="handleDelete"
    @click="handleClick"
  >
    <DiagramPort
      v-for="(port, portIndex) in node.ports"
      :ref="'port-' + port.id"
      :id="port.id"
      :nodeIndex="nodeIndex"
      :y="portIndex * 20"
      :nodeWidth="node.width"
      :type="port.type"
      :name="port.name"
      @onStartDragNewLink="startDragNewLink"
      @mouseUpPort="mouseUpPort"
    ></DiagramPort>
  </DiagramNode>
</template>
<script>
import SvgPanZoom from "vue-svg-pan-zoom";
import DiagramModel from "./../DiagramModel";
import DiagramNode from "./DiagramNode";
import DiagramLink from "./DiagramLink";
import DiagramPort from "./DiagramPort";
import LinkFactory from "../util/LinkFactory";

export default {
  name: "DiagramNodeWrapper",
  components: {
    DiagramNode,
    DiagramLink,
    DiagramPort
  },

  props: {
    node: {
      required: true
    },
    nodeIndex: {
      required: true
    },
    isSelected: {
      default: false
    }
  },

  data() {
    return {
      nodeComponentType: DiagramNode
    };
  },

  created() {
    this.node.ports.forEach((port, portIndex) => {
      port.y = portIndex * 20;
    });
  },

  methods: {
    handleClick(nodeId) {
      this.$emit("click", nodeId);
    },

    handleDelete(nodeId) {
      this.$emit("delete", nodeId);
    },

    startDragNewLink(startPortId) {
      this.$emit("startDragNewLink", startPortId);
    },

    mouseUpPort(portId) {
      this.$emit("mouseUpPort", portId);
    },

    startDragItem(item, x, y) {
      this.$emit("startDragNode", { item, x, y });
      this.$emit("selectNode", item);
    },

    getNodeComponentType(nodeType) {
      return DiagramNode;
    }
  }
};
</script>
