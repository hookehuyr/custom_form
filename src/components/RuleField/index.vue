<!--
 * @Date: 2022-08-30 11:34:19
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-02-09 16:07:40
 * @FilePath: /data-table/src/components/RuleField/index.vue
 * @Description: 规则确认控件
-->
<template>
  <div class="rule-field-page">
    <div class="label">
      <span v-if="item.component_props.required">&nbsp;*</span>
      {{ item.component_props.label }}
    </div>
    <van-field
      :name="item.key"
      :rules="item.rules"
      :border="false"
      style="padding-bottom: 0"
    >
      <template #input>
        <van-radio-group v-model="item.value">
          <van-radio name="1">{{ item.component_props.rule_desc }}</van-radio>
        </van-radio-group>
      </template>
    </van-field>
    <div class="rule-box" @click="show = true">
      {{ item.component_props.rule_link }}&nbsp;>>
    </div>
  </div>

  <van-overlay :show="show" @click="show = false" :lock-scroll="false">
    <div class="rule-wrapper" @click.stop>
      <div class="rule-block">
        <div
          style="height: 70vh; overflow: scroll"
          v-html="item.component_props.rule_content"
        ></div>
        <div class="close-btn">
          <van-button type="primary" block @click="show = false"
            >关&nbsp;&nbsp;闭</van-button
          >
        </div>
        <div></div>
      </div>
    </div>
  </van-overlay>
</template>

<script setup>
const props = defineProps({
  item: Object,
});

const show = ref(false);
</script>

<style lang="less" scoped>
.rule-field-page {
  .label {
    padding: 1rem 1rem 0 1rem;
    font-size: 0.9rem;
    font-weight: bold;
    span {
      color: red;
    }
  }
  .rule-box {
    font-size: 0.85rem;
    margin-left: 2.7rem;
    padding-bottom: 1rem;
    color: #1989fa;
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
</style>
