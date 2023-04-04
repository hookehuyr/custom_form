<!--
 * @Date: 2022-08-30 11:34:19
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-04-04 15:11:44
 * @FilePath: /custom_form/src/components/RadioField/index.vue
 * @Description: 单项选择控件
-->
<template>
  <div v-if="HideShow" class="radio-field-page">
    <div class="label">
      <text v-if="item.component_props.required">&nbsp;*</text>
      {{ item.component_props.label }}
    </div>
    <div v-if="item.component_props.note" class="note" v-html="item.component_props.note" />
    <nut-radio-group @change="onChange(item)" v-model="radio_value" :direction="item.component_props.direction"
      style="width: 100%">
      <div v-for="x in item.component_props.options" :key="x.value" class="radio-wrapper">
        <nut-radio :label="x.value" icon-size="16" style="margin-bottom: 0.25rem">{{ x.title }}</nut-radio>
        <div v-if="x.desc_text" class="multi-ellipsis--l3 rule-desc-text">{{ x.desc_text }}</div>
        <div v-if="x.desc_type === 'text'" class="rule-box" @click="showRule(x)">
          {{ x.desc_btn_name }}&nbsp;>>
        </div>
        <div v-if="x.desc_type === 'url' && h5" class="rule-box" @click="showUrl(x)">
          {{ x.desc_btn_name }}&nbsp;<Link size="12" />
        </div>
        <nut-input v-if="radio_value === x.value && x.is_input" @blur="onBlur(x)" v-model="x.affix" label=" " label-width="5px"
          :placeholder="x.input_placeholder" :required="x.input_required" :border="false" class="affix-input" />
        <div
          v-if="x.show_error"
          style="padding: 5px 20px; color: red; font-size: 12px;"
        >
          {{ x.error_msg }}
        </div>
      </div>
    </nut-radio-group>
    <nut-overlay v-model:visible="show" :lock-scroll="true">
      <div class="rule-wrapper">
        <div class="rule-block">
          <div style="height: 70vh; min-height: 70vh; overflow: scroll; white-space: pre-wrap; line-height: 1.5;font-size: 15px;" v-html="rule_content"></div>
          <div class="close-btn">
            <nut-button type="primary" block @click="closeRule"
              >关&nbsp;&nbsp;闭</nut-button
            >
          </div>
          <div></div>
        </div>
      </div>
    </nut-overlay>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, reactive } from "vue";
import { styleColor } from "@/constant.js";
import { $ } from '@tarojs/extend';
import { Link } from '@nutui/icons-vue-taro';

const props = defineProps({
  item: Object,
});

// TAG: 自定义主题颜色
const themeVars = {
  radioColor: styleColor.baseColor,
};
// 隐藏显示
const HideShow = computed(() => {
  return !props.item.component_props.disabled
})

const emit = defineEmits(["active"]);
const radio_value = ref(props.item.component_props.default);
const affix_value = ref('');

const onChange = (item) => {
  clearAffix()
  // 发送自定义数据结构
  props.item.value = { key: props.item.key, value: radio_value.value, affix: affix_value.value, type: "radio" };
  emit("active", props.item.value);
}
const onBlur = (item) => {
  clearAffix()
  affix_value.value = item.affix ? `${item.title}: ${item.affix}` : '';
  // 发送自定义数据结构
  props.item.value = { key: props.item.key, value: radio_value.value, affix: affix_value.value, type: "radio" };
  emit("active", props.item.value);
}
const options = props.item.component_props.options;
const clearAffix = () => {
  // 为选中项目的补充清空
  options.forEach(element => {
    if (element.value !== radio_value.value) {
      element.affix = ''
    }
    element.show_error = false;
    element.error_msg = '';
  });
}
onMounted(() => {
  // 新增错误提示标识
  options.forEach(element => {
    element.show_error = false;
    element.error_msg = '';
  });
  //
  radio_value.value = props.item.component_props.default ? props.item.component_props.default : '';
  // 发送自定义数据结构
  props.item.value = { key: props.item.key, value: radio_value.value, affix: affix_value.value, type: "radio" };
  emit("active", props.item.value);
  //
  $(".rule-box").css("color", themeVars.radioColor);
})

// 补充信息弹框
const show = ref(false);
const showRule = (rule) => {
  show.value = true;
  rule.desc_text = rule.desc_text.replace(/\\n/g, "<br>")
  rule_content.value = rule.desc_text;
};
const closeRule = () => {
  show.value = false;
  rule_content.value = "";
};
const h5 = computed(() => {
  if (process.env.TARO_ENV === 'h5') {
    return true
  } else {
    return false;
  }
})
const showUrl = (rule) => { // 跳转设置链接
  if (process.env.TARO_ENV === 'h5') {
    location.href = rule.desc_url
  }
  // 小程序需要配置制定域名内网页，功能无法实现。
}
const rule_content = ref("");
const show_error = ref(false);

// 校验模块
const validRadio = () => {
  // 必填项
  props.item.component_props.options.some(item => {
    if (radio_value.value === item.value && item.is_input && item.input_required && !item.affix) {
      show_error.value = true;
      item.show_error = true;
      item.error_msg = '补充信息不能为空';
      return true;
    } else {
      show_error.value = false;
      item.show_error = false;
      item.error_msg = '';
    }
  });
  return !show_error.value;
};

defineExpose({ validRadio, id: props.item.key });
</script>

<style lang="less">
.radio-field-page {
  .label {
    padding: 30px 30px 0 30px;
    font-size: 26px;
    font-weight: bold;
    text {
      color: red;
    }
  }

  .note {
    font-size: 30px;
    margin-left: 1rem;
    color: gray;
    padding-bottom: 0.5rem;
    white-space: pre-wrap;
  }

  .radio-wrapper {
    border: 1px solid #eaeaea;
    border-radius: 0.25rem;
    padding: 25px;
    margin: 25px;
  }
  .affix-input {
    border: 1px solid #eaeaea;
    border-radius: 0.25rem;
    padding: 0.25rem 0.5rem;
    margin-top: 0.5rem;
    margin-bottom: 0.25rem;
  }
  .rule-desc-text {
    margin: 0.35rem 0.5rem 0.5rem 60px;
    font-size: 28px;
    color: #808080;
  }
  .rule-box {
    font-size: 28px;
    margin-left: 60px;
    padding-bottom: 0.5rem;
    width: fit-content;
  }
}

.rule-wrapper {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
}

.rule-block {
  // position: relative;
  width: 80vw;
  height: 80vh;
  background-color: #fff;
  overflow: scroll;
  padding: 1rem;
  display: flex;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  .close-btn {
    position: absolute;
    bottom: 1rem;
    // transform: translateX(100%);
    width: calc(100% - 2rem);
  }
}
.multi-rule-field-box {
  border: 1px solid #eaeaea;
  border-radius: 0.25rem;
  padding: 1rem 0.5rem 0 0.5rem;
  // width: 100vw;
  margin-bottom: 0.5rem;
}

:deep(.van-radio) {
  // border: 1px solid #eaeaea;
  // border-radius: 0.25rem;
  // padding: 0.25rem 0.5rem;
}

.nut-radio__label {
  margin-left: 25px;
}
</style>
