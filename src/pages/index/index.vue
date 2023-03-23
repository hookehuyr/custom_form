<template>
  <view class="index">
    <nut-row>
      <nut-col :span="is_pc ? 22 : 24" :offset="is_pc ? 1 : 0">
        <div style="background-color: red; color: white;">span:24</div>
      </nut-col>
    </nut-row>
  </view>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { mainStore } from '@/stores'
import { wxInfo, getUrlParams } from "@/utils/tools";
import { computed, watchEffect, onMounted } from "vue";

// web端判断
const is_pc = computed(() => process.env.TARO_ENV === 'h5' && wxInfo().isPC);

const store = mainStore();
const { formInfo } = storeToRefs(store);

console.warn(is_pc.value);

</script>

<style lang="less">
</style>
