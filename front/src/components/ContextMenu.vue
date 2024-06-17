<template>
  <transition name="contextMenuAppear">
    <article
      ref="contextMenuArticle"
      class="contextMenu"
      v-if="contextMenu.getVisibility"
      :style="{
        left: `${contextMenu.getPosition.x}px`,
        top: `${contextMenu.getPosition.y}px`,
      }"
    >
      <div class="option" v-for="(option, index) in menu" :key="option.id">
        <div v-if="shouldShowGroupSeparator(index)" class="groupSeparator">
          <p v-text="option.group" class="groupName"></p>
          <div class="separator"></div>
        </div>
        <div
          class="optionContainer"
          v-if="!option.link"
          @click="option.link ? '' : performAction(option)"
        >
          <div class="optionInside" @mouseover="showSubMenu(option, $event)">
            <div class="iconContainer">
              <Icon :name="option.icon" />
            </div>
            <div v-text="option.name" class="name"></div>
            <div v-if="option.subMenu" class="subMenuIndicator">▶</div>
          </div>
        </div>
        <a
          class="optionContainer"
          v-else
          :href="option.link ? option.link : ''"
        >
          <div class="optionInside" @mouseover="showSubMenu(option, $event)">
            <div class="iconContainer">
              <Icon v-if="option.icon" :name="option.icon" />
              <img v-if="option.img" :src="option.img" alt="" class="iconImg" />
            </div>
            <div v-text="option.name" class="name"></div>
            <div v-if="option.subMenu" class="subMenuIndicator">▶</div>
          </div>
        </a>
        <ContextMenu
          v-if="option.subMenu && isSubMenuVisible && option === hoveredOption"
          :menu="option.subMenu"
          :style="{
            position: 'absolute',
            left: '95%',
            top: `${verticalPercentage}%`,
          }"
        />
      </div>
    </article>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useContextMenu } from "@/stores/ContextMenuStore.js";
import { onClickOutside } from "@vueuse/core";
import Icon from "./lib/Icon.vue";
import { debounce } from "lodash";

const props = defineProps({
  menu: {
    type: Array,
    required: true,
  },
});

console.log(props.menu);

const contextMenu = useContextMenu();
const contextMenuArticle = ref(null);
const isSubMenuVisible = ref(false);
const hoveredOption = ref(null);
const subMenuTimeout = ref(null);
const verticalPercentage = ref(0);

onClickOutside(contextMenuArticle, () => {
  hideSubMenu();
  contextMenu.invisible();
});

const shouldShowGroupSeparator = (index) => {
  if (index === 0) return false;
  return props.menu[index].group !== props.menu[index - 1].group;
};

const performAction = (option) => {
  if (option.handler) {
    option.handler();
  }
  contextMenu.invisible();
};

const showSubMenu = (option, event) => {
  clearTimeout(subMenuTimeout.value);
  hoveredOption.value = option;
  if (option.subMenu) {
    isSubMenuVisible.value = true;
    const menuHeight = contextMenuArticle.value.offsetHeight;
    const optionTop = event.target.offsetTop;
    verticalPercentage.value = (optionTop / menuHeight) * 100;
    verticalPercentage.value -= 7.5;
  } else {
    isSubMenuVisible.value = false;
  }
};

const hideSubMenu = () => {
  isSubMenuVisible.value = false;
};

const handleWheel = debounce((event) => {
  if (
    !contextMenuArticle.value?.contains(event.target) &&
    contextMenu.getVisibility
  ) {
    contextMenu.invisible();
  }
}, 1);

onMounted(() => {
  document.addEventListener("wheel", handleWheel);
});

onUnmounted(() => {
  document.removeEventListener("wheel", handleWheel);
});
</script>

<style scoped lang="scss">
.contextMenuAppear-enter-active {
  transition: opacity 0.2s ease-out;
}

.contextMenuAppear-leave-active {
  transition: opacity 0.1s ease-out;
}

.contextMenuAppear-enter-from,
.contextMenuAppear-leave-to {
  opacity: 0;
}

.contextMenu {
  position: absolute;
  z-index: 1000;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  background-color: #ffffff;
  padding: 0.5rem;
  border-radius: 0.2rem;
  min-width: 150px;

  .option {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    .groupSeparator {
      margin-top: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.3rem;
      .groupName {
        font-size: 10px;
        font-weight: 600;
        color: #9e9e9e;
      }
      .separator {
        height: 1px;
        background-color: #9e9e9e;
        width: 100%;
      }
    }
    .optionContainer {
      border-radius: 0.3rem;
      padding: 0.3rem 0.5rem;
      transition: all 0.1s ease-out;
      .optionInside {
        display: flex;
        gap: 0.3rem;
        width: 100%;
        height: fit-content;
        .iconContainer {
          width: 20px;
          height: 20px;
          .iconImg {
            width: 100%;
            height: 100%;
          }
        }
        .name {
          font-size: 12px;
          color: var(--vt-c-black);
          user-select: none;
        }
        .subMenuIndicator {
          margin-left: auto;
          font-size: 12px;
        }
      }

      &:hover {
        background-color: #f0f0f0;
        cursor: pointer;
      }
    }
  }
}
</style>
