<!--
 * @Date: 2022-08-30 11:34:19
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-02-22 11:02:05
 * @FilePath: /data-table/src/components/RadioField/index.vue
 * @Description: 单项选择控件
-->
<template>
  <div v-if="HideShow" class="radio-field-page">
    <div class="label">
      <span v-if="item.component_props.required">&nbsp;*</span>
      {{ item.component_props.label }}
    </div>
    <div v-if="item.component_props.note" class="note" v-html="item.component_props.note" />
    <van-field :rules="item.rules">
      <template #input>
        <van-radio-group @change="onChange(item)" v-model="radio_value" :direction="item.component_props.direction"
          style="width: 100%">
          <div v-for="x in item.component_props.options" :key="x.value" class="radio-wrapper">
            <van-radio :name="x.value" icon-size="1rem" :checked-color="themeVars.radioColor"
              style="margin-bottom: 0.25rem">{{ x.title }}</van-radio>
            <div v-if="x.desc_text" class="van-multi-ellipsis--l3 rule-desc-text">{{ x.desc_text }}</div>
            <div v-if="x.desc_type === 'text'" class="rule-box" @click="showRule(x)">
              {{ x.desc_btn_name }}&nbsp;>>
            </div>
            <div v-if="x.desc_type === 'url'" class="rule-box" @click="showUrl(x)">
              {{ x.desc_btn_name }}&nbsp;<van-icon name="link-o" />
            </div>
            <van-field v-if="radio_value === x.value && x.is_input" @blur="onBlur(x)" v-model="x.affix" label=" " label-width="5px"
              :placeholder="x.input_placeholder" :rules="x.input_required ? rules : ''" :required="x.input_required"
              class="affix-input" />
          </div>
        </van-radio-group>
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

// TAG: 自定义主题颜色
const themeVars = {
  radioColor: styleColor.baseColor,
};
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
const clearAffix = () => {
  const options = props.item.component_props.options;
  // 为选中项目的补充清空
  options.forEach(element => {
    if (element.value !== radio_value.value) {
      element.affix = ''
    }
  });
}
onMounted(() => {
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
const showUrl = (rule) => {
  location.href = rule.desc_url
}
const rule_content = ref("");
</script>

<style lang="less" scoped>
.radio-field-page {
  .label {
    padding: 1rem 1rem 0 1rem;
    font-size: 0.9rem;
    font-weight: bold;

    span {
      color: red;
    }
  }

  .note {
    font-size: 0.9rem;
    margin-left: 1rem;
    color: gray;
    padding-bottom: 0.5rem;
    white-space: pre-wrap;
  }

  .radio-wrapper {
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

:deep(.van-radio) {
  // border: 1px solid #eaeaea;
  // border-radius: 0.25rem;
  // padding: 0.25rem 0.5rem;
}
</style>
