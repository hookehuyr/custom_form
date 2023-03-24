<!--
 * @Author: hookehuyr hookehuyr@gmail.com
 * @Date: 2022-05-23 13:42:35
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2022-11-22 17:12:52
 * @FilePath: /data-table/src/components/VideoField/index.vue
 * @Description:
-->
<template>
  <div class="video-wrapper">
    <div class="label">
      {{ item.component_props.label }}
    </div>
    <div id="mui-player" class="video-div" />
  </div>
</template>

<script setup>
/**
 * 视频组件通用模块
 */
import "mui-player/dist/mui-player.min.css";
import MuiPlayer from "mui-player";
import { onMounted } from "vue";
import { useEventListener } from "@/composables";

// 视频基础属性
const props = defineProps({
  item: Object,
});
// 视频播放事件回调
const emit = defineEmits(["active"]);
let video = null;
onMounted(() => {
  const mp = new MuiPlayer({
    container: "#mui-player",
    // title: props.item.component_props.title,
    src: props.item.component_props.src,
    poster: props.item.component_props.cover,
    autoFit: false,
    videoAttribute: [
      // 声明启用同层播放, 不让会自动全屏播放
      { attrKey: "webkit-playsinline", attrValue: "webkit-playsinline" },
      { attrKey: "playsinline", attrValue: "playsinline" },
      { attrKey: "x5-video-player-type", attrValue: "h5-page" },
    ],
  });
  video = mp.video();
  //视频播放事件监听
  video.addEventListener("play", function () {
    props.item.value = { key: "video", value: "play" };
    emit("active", props.item.value);
  });
  // 配置16:9高度比
  const width = document.getElementById("mui-player").clientWidth;
  const height = (width * 9) / 16;
  document.getElementById("mui-player").height = height;
});

onUnmounted(() => {
  video.removeEventListener("play", function () {});
});
</script>

<style lang="less" scoped>
.video-wrapper {
  position: relative;
  margin: 1rem 0;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.13);

  .video-div {
    // border-top-left-radius: 5px;
    // border-top-right-radius: 5px;
    border-radius: 5px;
  }

  .video-bar {
    color: #713610;
    padding: 1rem;
    padding-bottom: 0.5rem;
  }
}

:deep(.back-button) {
  display: none !important;
}
</style>
