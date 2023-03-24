<!--
 * @Date: 2022-11-23 14:41:53
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-01-06 19:04:00
 * @FilePath: /data-table/src/components/ContactField/index.vue
 * @Description: 联系我们控件
-->
<template>
  <div v-if="HideShow" class="contact-field-page">
    <van-popover v-model:show="showPopover" placement="left">
      <div class="contact-content">
        <div class="text-tel">电话联系</div>
        <div>
          <a
            :style="{ color: styleColor.baseColor }"
            :href="`tel:${item.component_props.tel}`"
          >
            {{ item.component_props.tel }}
          </a>
        </div>
        <div v-if="item.component_props.image_url">
          <div class="text-qr_code">微信联系</div>
          <van-image width="100" height="100" :src="item.component_props.image_url" />
        </div>
      </div>
      <template #reference>
        <div class="wrapper">
          <van-icon name="phone-o" size="2rem" :color="styleColor.baseColor" />
        </div>
      </template>
    </van-popover>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { styleColor } from "@/constant.js";

const props = defineProps({
  item: Object,
});
// 隐藏显示
const HideShow = computed(() => {
  return !props.item.component_props.disabled
})
const showPopover = ref(false);
</script>

<style lang="less" scoped>
.contact-field-page {
  position: fixed;
  bottom: 10rem;
  right: 0.5rem;
  // height: 100%;
  z-index: 9;
  .wrapper {
    background: white;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    text-align: center;
    box-shadow: 0rem -0.17rem 0.67rem 0.08rem rgba(0, 0, 0, 0.05);
    :deep(.van-icon) {
      line-height: 1.5;
    }
  }
}

.contact-content {
  padding: 1rem 0.85rem;
  text-align: center;
  .text-tel {
    color: gray;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
  .text-qr_code {
    color: gray;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
  }
}
</style>
