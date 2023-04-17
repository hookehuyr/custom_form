<!--
 * @Date: 2022-08-30 11:34:19
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-04-17 14:49:50
 * @FilePath: /custom_form/src/components/MultiRuleField/index.vue
 * @Description: 多选规则确认控件
-->
<template>
  <div v-if="HideShow" class="multi-rule-field-page">
    <div class="label">
      <text v-if="item.component_props.required" class="required">&nbsp;*</text>
      {{ item.component_props.label }}
    <text v-if="item.component_props.min_count" style="color: #999; font-size: 13px;">（最少选{{ item.component_props.min_count }}项）</text>
    </div>
    <nut-checkbox-group v-model="checkbox_value" style="width: 100%">
      <template v-for="(rule, idx) in item.component_props.options" :key="idx">
        <div class="multi-rule-field-box">
          <nut-checkbox @click="onClick(rule)" :label="rule.title">{{ rule.title }}</nut-checkbox>
          <div class="multi-ellipsis--l3 rule-desc-text">{{ rule.desc_text }}</div>
          <div v-if="rule.desc_type === 'text'" class="rule-box" @click="showRule(rule)">
            {{ rule.desc_btn_name }}&nbsp;>>
          </div>
          <div v-if="rule.desc_type === 'url' && h5" class="rule-box" @click="showUrl(rule)">
            {{ rule.desc_btn_name }}&nbsp;<Link size="12" />
          </div>
        </div>
      </template>
    </nut-checkbox-group>
    <div
      v-if="show_error"
      style="padding: 5px 20px; color: red; font-size: 12px;"
    >
      {{ error_msg }}
    </div>
    <nut-overlay v-model:visible="show" :lock-scroll="true">
      <div class="rule-wrapper">
        <div class="rule-block">
          <div style="height: 70vh; min-height: 70vh; overflow: scroll; white-space: pre-wrap; line-height: 1.5;font-size: 15px;" v-html="rule_content"></div>
          <div class="close-btn">
            <nut-button type="primary" block @click="closeRule">关&nbsp;&nbsp;闭</nut-button>
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
// 隐藏显示
const HideShow = computed(() => {
  return !props.item.component_props.disabled
})
// TAG: 自定义主题颜色
const themeVars = {
  radioColor: styleColor.baseColor,
};
onMounted(() => {
  $(".rule-box").css("color", themeVars.radioColor);
});

const emit = defineEmits(["active"]);
const show = ref(false);
const checkbox_value = ref([]);
const options = props.item.component_props.options;

const onClick = (item) => {
  item.checked = !item.checked;
  // 校验输入项数据
  validMultiRule();
  // 发送自定义数据结构
  props.item.value = { key: props.item.key, value: checkbox_value.value, type: "multi_rule" };
  emit("active", props.item.value);
}

onMounted(() => {
  // 发送自定义数据结构
  props.item.value = { key: props.item.key, value: checkbox_value.value, type: "multi_rule" };
  emit("active", props.item.value);
});

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
const required = props.item.component_props.required;
const min_count = props.item.component_props.min_count;
const max_count = props.item.component_props.max_count;

const show_error = ref(false);
const error_msg = ref('');
// 校验模块
const validMultiRule= () => {
  // 必填项
  if (required && !checkbox_value.value.length) {
    show_error.value = true;
    error_msg.value = '选择项不能为空';
  } else if (min_count && checkbox_value.value.length < min_count) {
    show_error.value = true;
    error_msg.value = `最少选择 ${min_count} 项`;
  } else if (max_count && checkbox_value.value.length > max_count) {
    show_error.value = true;
    error_msg.value = `最多选择 ${max_count} 项`;
  } else {
    show_error.value = false;
    error_msg.value = '';
  }
  return !show_error.value;
};

defineExpose({ validMultiRule, id: props.item.key });
</script>

<style lang="less">
.multi-rule-field-page {
  .label {
    padding: 30px 30px 0 30px;
    font-size: 26px;
    font-weight: bold;
    text.required {
      color: red;
    }
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
  align-items: center;
  justify-content: center;
  height: 100%;
}

.rule-block {
  position: relative;
  width: 80vw;
  height: 80vh;
  background-color: #fff;
  overflow: scroll;
  padding: 1rem;
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
  padding: 25px;
  margin: 25px;
}

.nut-checkbox__label  {
  margin-left: 20px;
}
</style>
