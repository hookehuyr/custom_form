<!--
 * @Date: 2022-08-30 11:34:19
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-02-10 14:41:52
 * @FilePath: /data-table/src/components/MultiRuleField/index.vue
 * @Description: 多选规则确认控件
-->
<template>
  <div v-if="HideShow" class="multi-rule-field-page">
    <div class="label">
      <span v-if="item.component_props.required" class="required">&nbsp;*</span>
      {{ item.component_props.label }}
    <span v-if="item.component_props.min_count" style="color: #999; font-size: 0.85rem;">（最少选{{ item.component_props.min_count }}项）</span>
    </div>
    <van-field :name="item.key" :rules="rules" :border="false" style="padding-bottom: 0">
      <template #input>
        <van-checkbox-group v-model="item.value" style="width: 100%">
          <template v-for="(rule, idx) in item.component_props.options" :key="idx">
            <div class="multi-rule-field-box">
              <van-checkbox
                :name="rule.value"
                shape="square"
                :checked-color="themeVars.radioColor"
                >{{ rule.title }}</van-checkbox
              >
              <div class="van-multi-ellipsis--l3 rule-desc-text">{{ rule.desc_text }}</div>
              <div v-if="rule.desc_type === 'text'" class="rule-box" @click="showRule(rule)">
                {{ rule.desc_btn_name }}&nbsp;>>
              </div>
              <div v-if="rule.desc_type === 'url'" class="rule-box" @click="showUrl(rule)">
                {{ rule.desc_btn_name }}&nbsp;<van-icon name="link-o" />
              </div>
            </div>
          </template>
        </van-checkbox-group>
      </template>
    </van-field>
  </div>

  <van-overlay :show="show" :lock-scroll="false">
    <div class="rule-wrapper" @click.stop>
      <div class="rule-block">
        <div style="height: 70vh; min-height: 70vh; overflow: scroll; white-space: pre-wrap; line-height: 1.5;" v-html="rule_content"></div>
        <div class="close-btn">
          <van-button type="primary" block @click="closeRule"
            >关&nbsp;&nbsp;闭</van-button
          >
        </div>
        <div></div>
      </div>
    </div>
  </van-overlay>
</template>

<script setup>
import { styleColor } from "@/constant.js";
import $ from "jquery";

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
const show = ref(false);
const checked = ref([]);
const showRule = (rule) => {
  show.value = true;
  rule.desc_text = rule.desc_text.replace(/\\n/g, "<br>")
  rule_content.value = rule.desc_text;
};
const closeRule = () => {
  show.value = false;
  rule_content.value = "";
};
const showUrl = (rule) => {
  location.href = rule.desc_url
}
const rule_content = ref("");
const required = props.item.component_props.required;
const min_count = props.item.component_props.min_count;
const max_count = props.item.component_props.max_count;
const validator = (val) => {
  if (required && !val.length) {
    return false;
  } else if (min_count && props.item.value.length < min_count) {
    return false;
  } else if (max_count && props.item.value.length > max_count) {
    return false;
  } else {
    return true;
  }
};
// 错误提示文案
const validatorMessage = (val, rule) => {
  if (required && !val.length) {
    return "选择项不能为空";
  } else if (min_count && props.item.value.length < min_count) {
    return `最少选择${min_count}项`;
  } else if (max_count && props.item.value.length > max_count) {
    return `最多选择${max_count}项`;
  }
};
const rules = [{ validator, message: validatorMessage }];
</script>

<style lang="less" scoped>
.multi-rule-field-page {
  .label {
    padding: 1rem 1rem 0 1rem;
    font-size: 0.9rem;
    font-weight: bold;
    span.required {
      color: red;
    }
  }
  .rule-desc-text {
    margin: 0.35rem 0.5rem 0.5rem 1.75rem;
    font-size: 0.8rem;
    color: #808080;
  }
  .rule-box {
    font-size: 0.85rem;
    margin-left: 1.8rem;
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
  padding: 1rem 0.5rem 0 0.5rem;
  // width: 100vw;
  margin-bottom: 0.5rem;
}
</style>
