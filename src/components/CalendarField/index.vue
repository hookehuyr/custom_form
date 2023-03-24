<!--
 * @Date: 2022-09-14 11:00:01
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-02-10 10:06:27
 * @FilePath: /data-table/src/components/CalendarField/index.vue
 * @Description: 日历选择控件
-->
<template>
  <div class="calendar-page">
    <div class="label">
      <span v-if="item.component_props.required">&nbsp;*</span>
      {{ item.component_props.label }}
    </div>
    <van-field
      v-model="item.value"
      is-link
      readonly
      :name="item.key"
      :required="item.component_props.required"
      :placeholder="item.component_props.placeholder"
      :rules="item.rules"
      @click="show = true"
    />
    <van-calendar
      v-model:show="show"
      :type="item.component_props.type"
      :max-range="item.component_props.max_range"
      :min-date="item.component_props.min_date"
      :max-date="item.component_props.max_date"
      :formatter="formatter"
      first-day-of-week="1"
      @month-show="onMonthShow"
      @confirm="onConfirm"
      allow-same-day
    />
  </div>
</template>

<script setup>
const props = defineProps({
  item: Object,
});

const show = ref(false);

const formatDate = (date) =>
  `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
const onConfirm = (value) => {
  console.warn(props.item.component_props.type);
  show.value = false;
  if (props.item.component_props.type === "range") {
    // 日期区间
    const [start, end] = value;
    props.item.value = `${formatDate(start)} ~ ${formatDate(end)}`;
  } else if (props.item.component_props.type === "multiple") {
    // 多个日期
    const arr = [];
    value.forEach((element) => {
      arr.push(formatDate(element));
    });
    props.item.value = arr.join(",");
  } else {
    props.item.value = formatDate(value);
  }
};

// 每一格内容格式化
const formatter = (day) => {
  const month = day.date.getMonth() + 1;
  const date = day.date.getDate();
  const year = day.date.getFullYear();

  if (month === 5) {
    if (date === 1) {
      day.topInfo = "劳动节";
    } else if (date === 4) {
      day.topInfo = "青年节";
    } else if (date === 11) {
      day.text = "今天";
    }
  }

  if (month === 10) {
    if (date === 1) {
      day.topInfo = "国庆节";
      day.type = "disabled";
    }
  }

  if (day.type === "start") {
    day.bottomInfo = "开始";
  } else if (day.type === "end") {
    day.bottomInfo = "结束";
  }

  return day;
};

const onMonthShow = ({ date, title }) => {
  // console.warn(date);
  // console.warn(title);
  if (title === "2022年12月") {
  }
};
</script>

<style lang="less" scoped>
.calendar-page {
  .label {
    padding: 1rem 1rem 0 1rem;
    font-size: 0.9rem;
    font-weight: bold;

    span {
      color: red;
    }
  }
}
</style>
