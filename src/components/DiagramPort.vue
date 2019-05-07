<template>
  <g>
    <svg :y="y + 55" v-if="type === 'in'">
      <rect
        :fill="fill"
        ref="handle"
        x="0" y="0"
        rx="3" ry="3"
        width="10" height="10"
        @mouseenter="enter" @mouseleave="leave" @mousedown="startDragNewLink" @mouseup="mouseup">
      </rect>
      <text x="12" y="9" font-size="8pt" fill="#000000">{{name}}</text>
    </svg>
    <svg :y="y + 55" v-else>
      <rect
        :fill="fill"
        ref="handle"
        :x="nodeWidth" y="0"
        rx="3" ry="3"
        width="10" height="10"
        @mouseenter="enter" @mouseleave="leave" @mousedown="startDragNewLink" @mouseup="mouseup">
      </rect>
      <text :x="nodeWidth - 6" y="9" text-anchor="end" font-size="8pt" fill="#000000">{{name}}</text>
    </svg>
  </g>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
/*
const props = Vue.extend({
  props: {
    id: {
      type: Object as () => number,
      default: () => ({})
    },
    y: {
      type: Object as () => number,
      default: () => ({})
    },
    type: {
      type: Object as () => number,
      default: () => ({})
    },
    name: {
      type: Object as () => string,
      default: () => ({})
    },
    nodeWidth: {
      type: Object as () => number,
      default: () => ({})
    },
    nodeIndex: {
      type: Object as () => number,
      default: () => ({})
    }
  }
});
*/

@Component({
  props: {
    id: {
      type: Number,
      default: () => ({})
    },
    y: {
      type: Number,
      default: () => ({})
    },
    type: {
      type: String,
      default: () => ({})
    },
    name: {
      type: String,
      default: () => ({})
    },
    nodeWidth: {
      type: Number,
      default: () => ({})
    },
    nodeIndex: {
      type: Number,
      default: () => ({})
    }
  }
})
export default class DiagramPort extends Vue {
  fill = '#444444';
  id: number;
  y: number;
  type: string;
  name: string;
  nodeWidth: number;
  nodeIndex: number;

  mouseup() {
    this.$emit('mouseUpPort', this.id);
  }

  enter() {
    this.fill = '#888888';
  }

  leave() {
    this.fill = '#444444';
  }

  startDragNewLink() {
    this.$emit('onStartDragNewLink', this.id);
  }
}
</script>
