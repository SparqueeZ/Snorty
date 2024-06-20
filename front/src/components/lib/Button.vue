<template>
  <div
    class="button"
    :class="!text ? 'iconOnly' : ''"
    :title="title"
    @click="handleClick"
    v-bind="$attrs"
  >
    <div v-if="showIcon('left')" class="iconContainer">
      <Icon :name="icon" />
    </div>
    <p v-if="text">{{ text }}</p>
    <div v-if="showIcon('right')" class="iconContainer">
      <Icon :name="icon" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Icon from "./Icon.vue";
const props = defineProps({
  icon: String,
  text: String,
  title: String,
  type: {
    type: String,
    default: "button",
  },
  leftIcon: Boolean,
  rightIcon: Boolean,
});
const emit = defineEmits(["click"]);

const handleClick = (event) => {
  emit("click", event);
};

const showIcon = (side) => {
  if (side === "right") {
    if (props.rightIcon === true) return true;
  } else if (side === "left") {
    if (props.icon && props.leftIcon === "false") return false;
    else if (props.icon) return true;
  }
};
</script>

<style lang="scss" scoped>
.button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.2rem 0.7rem;
  width: fit-content;
  background-color: #ffffff;
  border-radius: 0.3rem;
  transition: all 0.1s ease-out;
  user-select: none;
  .iconContainer {
    width: 20px;
    height: 20px;
    display: block;
    .icon {
      transition: all 0.1s ease-out;
    }
  }
  &.iconOnly {
    padding: 0.2rem 0.2rem;
  }
  &:hover {
    background-color: #f0f2fd;
    cursor: pointer;
    .icon {
      fill: #5f4bb6;
    }
  }
  &.nobg {
    background-color: transparent;
    &:hover {
      background-color: #f0f2fd;
      cursor: pointer;
    }
  }
}
</style>
