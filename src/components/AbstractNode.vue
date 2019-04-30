<template>
  <span>
  </span>
</template>

<script>
export default {
  name: "AbstractNode",

  props: {
    title: {
      type: String,
      required: true
    },
    index: Number,
    id: Number,
    ports: {
      type: Array,
      default: () => {
        return [];
      }
    },
    x: Number,
    y: Number,
    width: {
      type: Number,
      default: 72
    },
    height: {
      type: Number,
      default: 100
    },
    color: {
      type: String,
      default: "#66cc00"
    },
    deletable: {
      type: Boolean,
      default: true
    },
    selected: Boolean
  },

  data() {
    return {
      nodeStrokeWidth: 0,
      titleFillOpacity: 0.25
    };
  },

  methods: {
    deleteNode: function() {
      this.$emit("delete", this.id);
    },

    mouseDown: function(event) {
      this.$emit(
        "onStartDrag",
        { type: "nodes", index: this.index },
        event.x - this.x,
        event.y - this.y
      );
    },

    mouseenter() {
      this.titleFillOpacity = 0.5;
    },

    mouseleave() {
      this.titleFillOpacity = 0.25;
    },

    handleClick() {
      this.$emit("click", this.id);
    }
  }
};
</script>
