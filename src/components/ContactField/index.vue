<!--
 * @Date: 2022-11-23 14:41:53
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-04-13 18:19:36
 * @FilePath: /custom_form/src/components/ContactField/index.vue
 * @Description: 联系我们控件
-->
<template>
  <div v-if="HideShow" class="contact-field-page">
    <!-- <van-popover v-model:show="showPopover" placement="left">
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
    </van-popover> -->

    <div class="wrapper">
      <Service size="25" :color="styleColor.baseColor" @click="onClick" />
      <div class="triangle"></div>
      <div v-if="showPopover" class="contact-content">
        <div class="text-tel">电话联系</div>
        <div @click="onTel">
          <a
            :style="{ color: styleColor.baseColor }"
            :href="`tel:${item.component_props.tel}`"
          >
            {{ item.component_props.tel }}
          </a>
        </div>
        <div v-if="item.component_props.image_url">
          <div class="text-qr_code">微信联系</div>
          <image id="qr_code" :src="item.component_props.image_url" style="width: 80px; height: 80px;" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { styleColor } from "@/constant.js";
import { Service } from '@nutui/icons-vue-taro';
import Taro from '@tarojs/taro'
import { $ } from '@tarojs/extend'

const props = defineProps({
  item: Object,
});
// 隐藏显示
const HideShow = computed(() => {
  return !props.item.component_props.disabled
})
const showPopover = ref(false);

const onClick = () => {
  showPopover.value = !showPopover.value;

  // 给每张图片添加查看事件
  nextTick(() => {
    var img = $('#qr_code');
    console.warn(img);
    $(img).on('longpress', function (e) {
      Taro.previewImage({
        // 需要预览的图片链接列表
        urls: [$(img).attr('src')],
        // 为当前显示图片的链接/索引值
        current: $(img).attr('src'),
        // 图片指示器样式
        indicator: 'default',
        // 是否可循环预览
        loop: false,
        // 长按图片显示操作菜单，如不填默认为保存相册
        // longPressActions:{
        // 	itemList:[this.l('发送给朋友'),this.l]
        // },
        success: res => {
          console.warn('res', res);
        },
        fail: err => {
          console.error('err', err);
        }
      })
    })
  })
}
const onTel = () => {
  if (process.env.TARO_ENV === 'weapp') {
    Taro.makePhoneCall({
      phoneNumber: props.item.component_props.tel,
      success () {},
      fail () {}
    })
  }
}

onMounted(async () => {
})
</script>

<style lang="less">
.contact-field-page {
  position: fixed;
  bottom: 10rem;
  right: 0.5rem;
  // height: 100%;
  z-index: 9;
  .wrapper {
    position: relative;
    background: white;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    text-align: center;
    box-shadow: 0rem -0.17rem 0.67rem 0.08rem rgba(0, 0, 0, 0.05);
    :deep(.van-icon) {
      line-height: 1.5;
    }
  }
}

.contact-content {
  background-color: white;
  box-shadow: 0 2px 12px rgba(50,50,51,.12);
  position: absolute;
  right: 115px;
  padding: 1rem 0.85rem;
  font-size: 20px;
  text-align: center;
  border-radius: 10px;
  .text-tel {
    color: gray;

    margin-bottom: 0.5rem;
  }
  .text-qr_code {
    color: gray;
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
  }
}
.triangle {
  width: 0;
  height: 0;
  border-left: 20px solid white;
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent;
  position: absolute;
  top: 40%;
  right: 100%;
  z-index: 999;
}
</style>
