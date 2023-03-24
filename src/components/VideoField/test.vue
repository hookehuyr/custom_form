<!--
 * @Author: hookehuyr hookehuyr@gmail.com
 * @Date: 2022-05-23 18:00:39
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2022-06-02 17:41:38
 * @FilePath: /tswj/src/components/MuiVideo/test.vue
 * @Description: 视频播放通用组件演示组件
 * @Description: type: video 为纯视频播放框，bookDetail为定制模式
-->
<template>
  <mui-video
    v-for="(item, index) in mock"
    :key="index"
    :item="item"
    type="video"
    @on-play="onPlay"
  />
</template>

<script setup>
  import mock from '@/components/MuiVideo/mock';
  import MuiVideo from '@/components/MuiVideo/index';
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  import {
    Cookies,
    $,
    _,
    axios,
    storeToRefs,
    mainStore,
    Toast,
    useTitle,
  } from '@/utils/generatePackage.js';
  //import { } from '@/utils/generateModules.js'
  //import { } from '@/utils/generateIcons.js'
  //import { } from '@/composables'
  const $route = useRoute();
  const $router = useRouter();
  useTitle($route.meta.title);

  const onPlay = ({ event, props }) => {
    console.warn(event);
    console.warn(props);
  };
</script>

<style
  lang="less"
  scoped></style>
