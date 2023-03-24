<!--
 * @Date: 2022-08-30 11:34:19
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-02-10 10:06:43
 * @FilePath: /data-table/src/components/CheckboxField/index.vue
 * @Description: 多项选择控件
-->
<template>
  <div v-if="HideShow" class="checkbox-field-page">
    <div class="label">
      <span v-if="item.component_props.required" style="color: red">&nbsp;*</span>
      {{ item.component_props.label }}
      <span v-if="item.component_props.max" style="color: gray">
        (最多可选数:&nbsp;{{ item.component_props.max }})
      </span>
    </div>
    <div v-if="item.component_props.note" class="note" v-html="item.component_props.note" />
    <van-field :rules="item.rules" :border="false">
      <template #input>
        <van-checkbox-group v-model="checkbox_value" :direction="item.component_props.direction"
          :max="item.component_props.max" style="width: 100%">
          <div v-for="x in item.component_props.options" :key="x.title" class="checkbox-wrapper">
            <van-checkbox @click="onClick(x)" :name="x.title" icon-size="1rem" shape="square"
              :checked-color="themeVars.radioColor" style="margin-bottom: 0.25rem">{{ x.title }}</van-checkbox>
            <van-field v-if="checkbox_value.includes(x.value) && x.is_input" @blur="onBlur(x)" v-model="x.affix"
              label=" " label-width="5px" :placeholder="x.input_placeholder" :rules="x.input_required ? rules : ''"
              :required="x.input_required" class="affix-input" />
          </div>
        </van-checkbox-group>
      </template>
    </van-field>
  </div>
</template>

<script setup>
import { styleColor } from "@/constant.js";

const props = defineProps({
  item: Object,
});
// TAG: 自定义主题颜色
const themeVars = {
  radioColor: styleColor.baseColor,
};
onMounted(() => {
  // 默认值为数组
  props.item.value = props.item.component_props.default;
});
// 隐藏显示
const HideShow = computed(() => {
  return !props.item.component_props.disabled
})

// TODO: 等待数据结构更新，看看怎么判断必填
// 校验函数返回 true 表示校验通过，false 表示不通过
const validator = (val) => {
  if (!val) {
    return false;
  } else {
    return true;
  }
};
// 错误提示文案
const validatorMessage = (val, rule) => {
  if (!val) {
    return "补充信息不能为空";
  }
};
const rules = [{ validator, message: validatorMessage }];

const emit = defineEmits(["active"]);
const checkbox_value = ref(props.item.component_props.default);
const affix_value = ref({});

const onClick = (item) => {
  item.checked = !item.checked;
  handleEmit(item)
}
const onBlur = (item) => {
  handleEmit(item)
}
const handleEmit = (item) => {
  // 选中状态添加属性
  if (item.checked) {
    affix_value.value[item.value] = item.affix ? `${item.title}: ${item.affix}` : '';
  } else {
    // 为选中删除属性
    delete affix_value.value[item.value]
  }
  // 发送自定义数据结构
  props.item.value = { key: props.item.key, value: checkbox_value.value, affix: affix_value.value, type: "checkbox" };
  emit("active", props.item.value);
}
onMounted(() => {
  // 发送自定义数据结构
  props.item.value = { key: props.item.key, value: checkbox_value.value, affix: affix_value.value, type: "checkbox" };
  emit("active", props.item.value);
})
</script>

<style lang="less" scoped>
.checkbox-field-page {
  .label {
    padding: 1rem 1rem 0 1rem;
    font-size: 0.9rem;
    font-weight: bold;
  }

  .note {
    font-size: 0.9rem;
    margin-left: 1rem;
    color: gray;
    padding-bottom: 0.5rem;
    white-space: pre-wrap;
  }

  .checkbox-wrapper {
    border: 1px solid #eaeaea;
    border-radius: 0.25rem;
    padding: 0.25rem 0.5rem;
    margin-bottom: 0.25rem;
  }
  .affix-input {
    border: 1px solid #eaeaea;
    border-radius: 0.25rem;
    padding: 0.25rem 0.5rem;
    margin-top: 0.5rem;
    margin-bottom: 0.25rem;
  }
}

:deep(.van-checkbox) {
  // border: 1px solid #eaeaea;
  // border-radius: 0.25rem;
  // padding: 0.25rem 0.5rem;
}
</style>
