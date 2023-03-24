<!--
 * @Date: 2022-08-29 14:31:20
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2022-11-23 10:49:41
 * @FilePath: /data-table/src/components/MarqueeField/index.vue
 * @Description: 跑马灯控件
-->
<template>
  <div class="marquee-field-page">
    <div class="title">- {{ item.component_props.title }} -</div>
    <div class="scroll-wrap">
      <div class="scroll-content" :style="{ top }">
        <p v-for="x in marqueeList">
          <van-row>
            <van-col span="8">{{ x.name }}</van-col>
            <van-col span="8">{{ x.tel }}</van-col>
            <van-col span="8">{{ x.time }}</van-col>
          </van-row>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  item: Object,
});

onMounted(() => {
  getList();
  ScrollUp();
});

const top = computed(() => {
  return -activeIndex.value * 30 + "px";
});

const activeIndex = ref(0);
const intNum = ref(0);
const marqueeList = ref([]);
// 查询名单
// TODO: 数据从哪里来？
const getList = () => {
  const arr = [];
  for (let index = 0; index < 100; index++) {
    arr.push({
      name: `abc${index}`,
      tel: "137***3456",
      time: `${index}分钟前`,
    });
  }
  console.warn(arr);
  marqueeList.value = arr;
};
//滚动播报方法
const ScrollUp = () => {
  intNum.value = setInterval(() => {
    if (activeIndex.value < marqueeList.value.length) {
      activeIndex.value += 1;
    } else {
      activeIndex.value = 0;
    }
  }, 1000);
};
</script>

<style lang="less" scoped>
.marquee-field-page {
  padding-bottom: 1rem;
  .title {
    font-weight: bold;
    text-align: center;
    width: 100%;
    font-size: 1rem;
    padding: 1rem 0;
  }
  .scroll-wrap {
    position: relative;
    z-index: 2;
    overflow: hidden;
    .scroll-content {
      position: relative;
      transition: top 0.5s;
      height: 10rem;
    }
    .scroll-content p {
      /* 每行信息间隔高度 */
      line-height: 2;
      font-size: 1rem;
      text-align: center;
    }
  }
}
</style>
