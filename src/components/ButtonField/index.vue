<!--
 * @Date: 2022-08-29 14:31:20
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2022-11-22 14:23:49
 * @FilePath: /data-table/src/components/DividerField/index.vue
 * @Description: 按钮组件
-->
<template>
  <div class="button-field-page">
    <van-row justify="center" gutter="20">
      <van-col v-for="item in props.item.component_props.config" key="index">
        <van-button
          @click="handleButton(item)"
          :icon="iconType(item)"
          :color="item.background ? item.background : backgroundColor"
          >{{ item.text }}
        </van-button>
      </van-col>
    </van-row>
  </div>
  <van-overlay :show="show" @click="onClose">
    <div class="wrapper">
      <div class="block">
        <van-image width="100%" fit="cover" :src="qr_url" />
      </div>
    </div>
  </van-overlay>
</template>

<script setup>
import { styleColor } from "@/constant.js";

const props = defineProps({
  item: Object,
});

const show = ref(false);
const backgroundColor = styleColor.baseColor;

const iconType = (item) => {
  if (item.type === "tel") return "phone-o";
  if (item.type === "link") return "link-o";
  if (item.type === "qr") return "qr";
};

const qr_url = ref("");
const handleButton = ({ type, content }) => {
  if (type === "tel") {
    location.href = "tel://" + content;
  }
  if (type === "link") {
    location.href = content;
  }
  if (type === "qr") {
    show.value = true;
    qr_url.value = content;
  }
};

const onClose = () => {
  show.value = false;
};

onMounted(() => {});
</script>

<style lang="less" scoped>
.button-field-page {
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  width: 10rem;
  height: 10rem;
  background-color: #fff;
}
</style>
