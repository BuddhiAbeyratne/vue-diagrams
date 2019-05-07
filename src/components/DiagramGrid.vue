<template>
  <SvgPanZoom
    xmlns="http://www.w3.org/2000/svg"
    id="svgroot"
    viewportSelector="#svgroot2"
    class="diagram-grid"
    :style="{ width: width + 'px', height: height + 'px' }"
    :zoomEnabled="zoomEnabled"
    :panEnabled="panEnabled"
    :controlIconsEnabled="true"
    :fit="false"
    :center="true"
    :preventMouseEventsDefault="false"
    :beforePan="beforePan"
  >
    <svg
      id="svgroot2"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMinYMin meet"
      class="svg-content"
      ref="dragramRoot"
      :viewBox="'0 0 ' + width + ' ' + height"
      :width="width"
      :height="height"
      @mousemove="mouseMove"
      @mouseup="mouseUp"
    >
      <defs>
        <pattern id="smallGrid" width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M 16 0 L 0 0 0 16" fill="none" stroke="gray" stroke-width="0.5"/>
        </pattern>
        <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
          <rect width="80" height="80" fill="url(#smallGrid)"/>
          <path d="M 80 0 L 0 0 0 80" fill="none" stroke="gray" stroke-width="1"/>
        </pattern>
      </defs>

      <rect x="-5000px" y="-5000px" width="10000px" height="10000px" fill="url(#grid)" @mousedown="mouseDown" ref="grid" class="svg-pan-zoom_viewport"/>
      <g ref="viewPort" id="viewport" x="50" y="50">
        <slot>
        </slot>
      </g>
    </svg>
  </SvgPanZoom>
</template>

<script lang="ts">
import SvgPanZoom from 'vue-svg-pan-zoom';

export default {
  name: 'DiagramGrid',

  components: {
    SvgPanZoom
  },

  data() {
    return {
      zoomEnabled: true
    };
  },

  props: {
    width: {
      default: 500
    },
    height: {
      default: 500
    },
    beforePan: {
      default: () => undefined
    },
    panEnabled: {
      default: true
    }
  },

  methods: {
    mouseMove(pos: any) {
      this.$emit('mousemove', pos);
    },

    mouseUp() {
      this.$emit('mouseup');
    },

    mouseDown() {
      this.$emit('clearselection');
    }
  }
};
</script>
<style scoped>

.diagram-grid {
  border: 1px solid black;
}
</style>
