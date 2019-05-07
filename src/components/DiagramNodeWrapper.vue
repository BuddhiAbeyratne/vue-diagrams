<template>
  <component
    v-bind:is="nodeComponentType"
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
      :key="port.id"
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
  </component>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import DiagramLink from './DiagramLink.vue';
import DiagramNode from './DiagramNode.vue';
import DiagramPort from './DiagramPort.vue';
/*
const props = Vue.extend({
  props: {
    node: {
      type: Object as () => string,
      default: () => ({})
    },
    nodeIndex: {
      type: Object as () => string,
      default: () => ({})
    },
    isSelected: {
      type: Object as () => string,
      default: () => ({})
    }
  }
});*/

@Component({
  components: {
    DiagramNode,
    DiagramLink,
    DiagramPort
  },
  props: {
    node: {
      type: Object as () => any,
      default: () => ({})
    },
    nodeIndex: {
      type: Number,
      default: () => ({})
    },
    isSelected: {
      type: Boolean,
      default: () => ({})
    }
  }
})
export default class DiagramNodeWrapper extends Vue {
  node: any;
  nodeIndex: number;
  isSelected: boolean;

  get nodeComponentType() {
    return this.getNodeComponentType(this.node.componentType);
  }

  handleClick(nodeId: number) {
    this.$emit('click', nodeId);
  }

  handleDelete(nodeId: number) {
    this.$emit('delete', nodeId);
  }

  startDragNewLink(startPortId: number) {
    this.$emit('startDragNewLink', startPortId);
  }

  mouseUpPort(portId: number) {
    this.$emit('mouseUpPort', portId);
  }

  startDragItem(item: any, x: number, y: number) {
    this.$emit('startDragNode', { item, x, y });
    this.$emit('selectNode', item);
  }

  getNodeComponentType(componentType: any) {
    return componentType ? componentType : 'DiagramNode';
  }
}
</script>
