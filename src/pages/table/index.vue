<!--
 * @Date: 2023-03-24 09:19:27
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-04-07 17:26:07
 * @FilePath: /custom_form/src/pages/table/index.vue
 * @Description: 文件描述
-->
<template>
  <div class="table-page">
    <nut-noticebar v-if="formSetting.sjsj_is_count_down" :text="notice_text" :scrollable="true"
    :closeMode="true"  right-icon="circle-close" />
    <div class="table-box" :style="{ margin: is_pc ? '1rem 0' : '1rem', overflow: 'auto' }">
      <template v-if="PHeader.visible">
        <image v-if="PHeader.type === 'image'" :src="PHeader.cover" mode="widthFix" style="width: 100%;" />
        <template v-if="PHeader.type === 'carousel'">
          <nut-swiper class="my-swipe" pagination-color="#fff" auto-play="3000">
            <nut-swiper-item v-for="(image, index) in PHeader.cover" :key="index">
              <img :src="image" style="height: 12rem; width: 100%; object-fit: cover" />
            </nut-swiper-item>
          </nut-swiper>
        </template>
        <div v-if="PHeader.type === 'text'" class="PHeader-Text taro_html" v-html="PHeader.banner" />
      </template>
      <view v-if="PHeader.label" class="table-title taro_html" v-html="PHeader.label" />
      <div v-if="PHeader.description" class="table-desc taro_html" v-html="PHeader.description" />
      <nut-config-provider :theme-vars="themeVars">
        <nut-form ref="ruleForm">
          <component v-for="(item, index) in formData"
            :id="item.key"
            :ref="(el) => setRefMap(el, item)"
            :key="index"
            :is="{...item.component}"
            :item="item"
            @active="onActive" />
          <!-- <template v-for="(item, index) in formData" :id="item.key">
            <nut-form-item v-if="index === 0" :prop="item.name" :required="item.required" :rules="item.rules">
              <nut-input v-model="item.value" :type="item.type"
                :placeholder="item.component_props.placeholder ? item.component_props.placeholder : '请输入'"
                :readonly="item.component_props.readonly || (item.component_props.is_camera_scan && !item.component_props.is_edit_camera_scan_result)"
                :disabled="item.component_props.disabled" :input-align="item.component_props.align">
                </nut-input>
            </nut-form-item>
          </template> -->
          <div v-if="formData.length && PCommit.visible" style="margin: 16px">
          <!-- <nut-button round block type="primary" onclick="onSubmit"> -->
          <nut-button round block type="primary" @click="onSubmit">
            {{ PCommit.text ? PCommit.text : '提交' }}
          </nut-button>
        </div>
        </nut-form>
      </nut-config-provider>
    </div>
  </div>
</template>

<script setup>
import Taro, { useLoad } from '@tarojs/taro'
import { $ } from '@tarojs/extend'
import { createComponentType } from "@/hooks/useComponentType";
import { ref, computed, watchEffect, onMounted, reactive } from "vue";
import _ from "@/utils/lodash";
import { storeToRefs } from 'pinia'
import { mainStore } from '@/stores'
import { queryFormAPI, postVerifyPasswordAPI } from "@/api/form.js";
import { addFormDataAPI } from "@/api/data.js";
import { wxInfo, getUrlParams, deepClone } from "@/utils/tools";
import { styleColor } from "@/constant.js";
import { sharePage } from '@/composables/useShare.js'
// 初始化WX环境
import wx from 'weixin-js-sdk'

const ruleForm = ref(null);

// // 获取表单设置
const store = mainStore();
const { formSetting, formInfo, callIndex } = storeToRefs(store);

// web端判断封面图片高度
const is_pc = computed(() => process.env.TARO_ENV === 'h5' && wxInfo().isPC);

const PHeaderHeight = computed(() => {
  if (is_pc.value) {
    return "35vh";
  } else {
    return "20vh";
  }
});
// TAG: 自定义主题颜色
const themeVars = {
  // buttonPrimaryBackground: styleColor.baseColor,
  // buttonPrimaryBorderColor: styleColor.baseColor,
  primaryColor: styleColor.baseColor,
};

const PHeader = ref({});
const PCommit = ref({});
const PHeader_cover = ref("");
const PHeader_title = ref("");
const mockData = ref([]);
const formData = ref([]);
const postData = ref({});

const form_code = getUrlParams(location.href) ? getUrlParams(location.href).code : '';
// 编辑模式不能提交操作
const model = getUrlParams(location.href) ? getUrlParams(location.href).model : '';
// 模仿金数据的扩展参数
const x_field_1 = getUrlParams(location.href) ? getUrlParams(location.href).x_field_1 : null;
// 周期ID标识
const x_cycle = getUrlParams(location.href) ? getUrlParams(location.href).x_cycle : null;

// 格式化表单数据结构
const formatData = (data) => {
  const arr = [];
  data.forEach((field) => {
    const { interaction_type, data_type, field_id, field_name, ...component_props } = field;
    // 生成组件属性
    const temp = {
      key: field_name,
      value: component_props.default ? component_props.default : "",
      component_props,
    };
    arr.push(temp);
  });
  return arr;
};

// 处理没有绑定值的组件的赋值
// 省市区选择，图片上传，文件上传，电子签名，评分组件
const input = ref([]);
const textarea = ref([]);
const radio = ref([]);
const checkbox = ref([]);
const multi_rule = ref([]);
const picker = ref([]);
const number = ref([]);
const phone = ref([]);
const email = ref([]);
const address = ref([]);
const date = ref([]);
const time = ref([]);
const datetime = ref([]);
const area_picker = ref([]);
const image_uploader = ref([]);
const file_uploader = ref([]);
const sign = ref([]);
const rate_picker = ref([]);
// 动态绑定ref数据
const setRefMap = (el, item) => {
  if (el) {
    if (item.component_props.tag === "input") {
      input.value.push(el);
    }
    if (item.component_props.tag === "textarea") {
      textarea.value.push(el);
    }
    if (item.component_props.tag === "radio") {
      radio.value.push(el);
    }
    if (item.component_props.tag === "checkbox") {
      checkbox.value.push(el);
    }
    if (item.component_props.tag === "multi_rule") {
      multi_rule.value.push(el);
    }
    if (item.component_props.tag === "select") {
      picker.value.push(el);
    }
    if (item.component_props.tag === "number") {
      number.value.push(el);
    }
    if (item.component_props.tag === "phone") {
      phone.value.push(el);
    }
    if (item.component_props.tag === "email") {
      email.value.push(el);
    }
    if (item.component_props.tag === "address") {
      address.value.push(el);
    }
    if (item.component_props.tag === "date") {
      date.value.push(el);
    }
    if (item.component_props.tag === "time") {
      time.value.push(el);
    }
    if (item.component_props.tag === "datetime") {
      datetime.value.push(el);
    }
    if (item.component_props.tag === "area_picker") {
      area_picker.value.push(el);
    }
    if (item.component_props.tag === "image_uploader") {
      image_uploader.value.push(el);
    }
    if (item.component_props.tag === "file_uploader") {
      file_uploader.value.push(el);
    }
    if (item.component_props.tag === "sign") {
      sign.value.push(el);
    }
    if (item.component_props.tag === "rate_picker") {
      rate_picker.value.push(el);
    }
  }
};

const notice_text = ref("");
const show = ref(false);
const qr_url = ref("");
const pwd_show = ref(false);
const mmtx_password = ref('');
const form_name = ref('')

// 提交表单密码
const onSubmitPwd = async () => {
  const { code } = await postVerifyPasswordAPI({ form_code, mmtx_password: mmtx_password.value });
  if (code) {
    pwd_show.value = false;
  }
}

onMounted(async () => {
  // 检查是否从首页跳转
  if (!callIndex.value) {
    // 翻状态
    store.changeCallIndex(true);
    // 跳转index页面
    Taro.redirectTo({
      url: `../index/index?code=${form_code}&model=${model}`
    })
  }
  // TAG: 全局背景色
  // $('body').css('background-color', styleColor.backgroundColor)
  const { data } = await queryFormAPI({ form_code });

  const form_data = data;
  // 动态修改标题
  Taro.setNavigationBarTitle({
    title: form_data.name ? form_data.name : ''
  });
  form_name.value = form_data.name;
  // 重构数据结构
  let page_header = {};
  let page_commit = {};
  let page_form = [];
  form_data.field_list.forEach((element) => {
    if (element.tag === "page_header") {
      // 页眉组件
      page_header = element;
    } else if (element.tag === "page_commit") {
      // 提交按钮
      page_commit = element;
    } else {
      page_form.push(element);
    }
  });
  /** 页眉属性
   * @param label 表单标题
   * @param banner_type 页眉类型：["文字", "单张图", "轮播图"] text=文字，image=单张图，carousel=轮播图
   * @param banner_url 页眉图片地址
   * @param description 描述内容
   * @param invisible 页眉展示
   */
  if (page_header) {
    PHeader.value = {
      label: page_header.label,
      description: page_header.description,
      type: page_header.banner_type,
      cover: page_header.banner_url,
      banner: page_header.banner,
      visible: !page_header.invisible,
    };
  }
  if (page_commit) {
    PCommit.value = {
      text: page_commit.text,
      visible: !page_commit.invisible,
    };
  }
  formData.value = formatData(page_form);
  mockData.value = [
    {
      key: "111",
      value: "",
      component: "",
      component_props: {
        name: "name",
        tag: "name",
        label: "姓名",
        required: true,
      },
    },
    {
      key: "222",
      value: "",
      component: "",
      component_props: {
        name: "gender",
        tag: "gender",
        label: "性别",
        default: '男',
        required: true,
      },
    },
  ];
  // 生成自定义组件
  createComponentType(mockData.value);
  createComponentType(formData.value);
  // 过期时间显示
  notice_text.value = `表单报名将在 ${formSetting.value.sjsj_end_time} 后结束`;
  // 判断是否需要关注公众号, 弹出二维码识别
  if (formSetting.value.wxzq_must_follow && !formSetting.value.x_field_weixin_subscribe) {
    show.value = true;
    qr_url.value = formSetting.value.wxzq_mp_qrcode;
    // 标记用户还未关注
    localStorage.setItem('weixin_subscribe', 0);
  }
  // 判断是否弹出密码输入框
  checkUserPassword();
  // 启用分享功能，非预览模式
  if (formSetting.value.wxzq_is_share && model !== 'preview') {
    wx.ready(() => {
      /**
       * 微信分享卡片标题模式
       * form_name=使用表单名称作为分享标题，customize=自定义分享标题
       */
      const title = formSetting.value.wxzq_share_title_mode === 'form_name' ? form_name.value : formSetting.value.wxzq_share_custom_title;
      // 自定义分享内容
      sharePage({ title, desc: formSetting.value.wxzq_share_slogan, imgUrl: formSetting.value.wxzq_share_logo });
    });
  }
});

// 打开轮询用户是否关注
const onTap = () => {
  if (localStorage.getItem('weixin_subscribe') === '0') {
    setInterval(() => {
      checkUserSubscribe()
    }, 1000);
  }
}

// 检查数据收集设置
const checkUserSubscribe = () => {
  // 判断是否需要关注公众号, 弹出二维码识别
  if (formSetting.value.wxzq_must_follow && formSetting.value.x_field_weixin_subscribe) {
    // 标记用户已关注
    localStorage.setItem('weixin_subscribe', 1);
    show.value = false;
  }
  // 凭密码填写设置
  if (formSetting.value.mmtx_enable) {
    pwd_show.value = true;
  } else {
    pwd_show.value = false;
  }
}

// 检查密码验证功能
const checkUserPassword = () => {
  // 凭密码填写设置
  if (formSetting.value.mmtx_enable) {
    pwd_show.value = true;
  } else {
    pwd_show.value = false;
  }
}

// 根据规则隐藏相应字段
const checkRules = () => {
  const rule_list = formInfo.value['rule_list'] ? [...formInfo.value['rule_list']] : [];
  formData.value.forEach(item => {
    // 给受作用的字段绑定判断规则
    // 规则失效需要踢出
    rule_list.forEach(rule => {
      if (rule.field_names?.includes(item.key) && !rule.is_invalid) {
        item.field_rules = {
          mode: rule.mode,
          logical_op: rule.logical_op,
          expr_list: rule.expr_list,
        }
      }
    });
    // 只检查存在规则的字段
    if (item.field_rules) {
      let condition = '';
      // 多个规则的满足条件，为全且或者全或
      const op = item.field_rules?.logical_op === 'AND' ? '&&' : '||';
      item.field_rules?.expr_list.forEach(expr => {
        if (typeof postData.value[expr['field_name']] === 'string') { // 表单值为字符串（单选，下拉）
          const k = !!expr['values'].includes(postData.value[expr['field_name']])
          condition += `${k}${op}`
        }
        if (typeof postData.value[expr['field_name']] === 'object') { // 表单值为数组（多选）
          const k = !!(_.intersection(expr['values'], postData.value[expr['field_name']])).length;
          condition += `${k}${op}`
        }
      });
      // 把结果转换为布尔值
      if (item.field_rules?.logical_op === 'AND') {
        if (condition.indexOf('false') >= 0) {
          condition = false;
        } else {
          condition = true;
        }
      }
      if (item.field_rules?.logical_op === 'OR') {
        if (condition.indexOf('true') >= 0) {
          condition = true;
        } else {
          condition = false;
        }
      }
      item['component_props']['disabled'] = item.field_rules?.mode === 'SHOW' ? !condition : condition;
    }
  })
}

// 操作绑定自定义字段回调
const onActive = (item) => {
  if (item.key === "input") {
    postData.value[item.filed_name] = item.value;
  }
  if (item.key === "textarea") {
    postData.value[item.filed_name] = item.value;
  }
  if (item.type === "radio") { // 单选控件
    postData.value = Object.assign(postData.value, { [item.key]: item.affix ? item.affix : item.value });
  }
  if (item.type === "checkbox") { // 多选控件
    const checkbox_value = deepClone(item.value)
    checkbox_value.forEach((element, index) => {
      for (const key in item.affix) {
        if (item.affix[key] && element === key) {
          checkbox_value[index] = item.affix[key]
        }
      }
    });
    postData.value = Object.assign(postData.value, { [item.key]: checkbox_value });
  }
  if (item.type === "multi_rule") {
    const checkbox_value = deepClone(item.value)
    postData.value = Object.assign(postData.value, { [item.key]: checkbox_value });
  }
  if (item.key === "area_picker") {
    postData.value[item.filed_name] = item.value;
  }
  if (item.key === "number") {
    postData.value[item.filed_name] = item.value;
  }
  if (item.key === "phone") {
    postData.value[item.filed_name] = item.value;
  }
  if (item.key === "email") {
    postData.value[item.filed_name] = item.value;
  }
  if (item.key === "address") {
    postData.value[item.filed_name] = item.value;
  }
  if (item.key === "date") {
    postData.value[item.filed_name] = item.value;
  }
  if (item.key === "time") {
    postData.value[item.filed_name] = item.value;
  }
  if (item.key === "datetime") {
    postData.value[item.filed_name] = item.value;
  }
  if (item.key === "image_uploader") {
    postData.value[item.filed_name] = item.value;
  }
  if (item.key === "file_uploader") {
    postData.value[item.filed_name] = item.value;
  }
  if (item.key === "sign") {
    postData.value[item.filed_name] = item.value;
  }
  if (item.type === "rate") {
    postData.value = _.assign(postData.value, { [item.key]: item.value });
  }
  if (item.key === "picker") { // 下拉框控件
    postData.value = Object.assign(postData.value, { [item.filed_name]: item.value });
  }
  // 检查规则，会影响字段显示
  checkRules();
};

// 检验输入项控件的Rules
const validOther = () => {
  let valid = {
    status: true,
    key: "",
    id: ''
  };
  if (input.value) {
    // 单行文本
    input.value.forEach((item, index) => {
      if (!input.value[index].validInput()) {
        valid = {
          status: input.value[index].validInput(),
          key: "input",
          id: input.value[index]?.id
        };
        return false;
      }
    });
  }
  if (textarea.value) {
    // 多行文本
    textarea.value.forEach((item, index) => {
      if (!textarea.value[index].validTextarea()) {
        valid = {
          status: textarea.value[index].validTextarea(),
          key: "textarea",
          id: textarea.value[index]?.id
        };
        return false;
      }
    });
  }
  if (radio.value) {
    // 单选框
    radio.value.forEach((item, index) => {
      if (!radio.value[index].validRadio()) {
        valid = {
          status: radio.value[index].validRadio(),
          key: "radio",
          id: radio.value[index]?.id
        };
        return false;
      }
    });
  }
  if (checkbox.value) {
    // 单选框
    checkbox.value.forEach((item, index) => {
      if (!checkbox.value[index].validCheckbox()) {
        valid = {
          status: checkbox.value[index].validCheckbox(),
          key: "checkbox",
          id: checkbox.value[index]?.id
        };
        return false;
      }
    });
  }
  if (multi_rule.value) {
    // 多选规则控件
    multi_rule.value.forEach((item, index) => {
      if (!multi_rule.value[index].validMultiRule()) {
        valid = {
          status: multi_rule.value[index].validMultiRule(),
          key: "multi_rule",
          id: multi_rule.value[index]?.id
        };
        return false;
      }
    });
  }
  if (picker.value) {
    // 下拉框
    picker.value.forEach((item, index) => {
      if (!picker.value[index].validPicker()) {
        valid = {
          status: picker.value[index].validPicker(),
          key: "picker",
          id: picker.value[index]?.id
        };
        return false;
      }
    });
  }
  if (number.value) {
    // 下拉框
    number.value.forEach((item, index) => {
      if (!number.value[index].validNumber()) {
        valid = {
          status: number.value[index].validNumber(),
          key: "number",
          id: number.value[index]?.id
        };
        return false;
      }
    });
  }
  if (phone.value) {
    // 手机号
    phone.value.forEach((item, index) => {
      if (!phone.value[index].validPhone()) {
        valid = {
          status: phone.value[index].validPhone(),
          key: "phone",
          id: phone.value[index]?.id
        };
        return false;
      }
    });
  }
  if (email.value) {
    // 邮箱
    email.value.forEach((item, index) => {
      if (!email.value[index].validEmail()) {
        valid = {
          status: email.value[index].validEmail(),
          key: "email",
          id: email.value[index]?.id
        };
        return false;
      }
    });
  }
  if (address.value) {
    // 地址选择器
    address.value.forEach((item, index) => {
      if (!address.value[index].validAreaPicker()) {
        valid = {
          status: address.value[index].validAreaPicker(),
          key: "address",
          id: address.value[index]?.id
        };
        return false;
      }
    });
  }
  if (date.value) {
    // 日期选择器
    date.value.forEach((item, index) => {
      if (!date.value[index].validDate()) {
        valid = {
          status: date.value[index].validDate(),
          key: "date",
          id: date.value[index]?.id
        };
        return false;
      }
    });
  }
  if (time.value) {
    // 日期选择器
    time.value.forEach((item, index) => {
      if (!time.value[index].validTime()) {
        valid = {
          status: time.value[index].validTime(),
          key: "time",
          id: time.value[index]?.id
        };
        return false;
      }
    });
  }
  if (datetime.value) {
    // 日期时间选择器
    datetime.value.forEach((item, index) => {
      if (!datetime.value[index].validDateTime()) {
        valid = {
          status: datetime.value[index].validDateTime(),
          key: "datetime",
          id: datetime.value[index]?.id
        };
        return false;
      }
    });
  }
  if (area_picker.value) {
    // 省市区地址
    area_picker.value.forEach((item, index) => {
      if (!area_picker.value[index].validAreaPicker()) {
        valid = {
          status: area_picker.value[index].validAreaPicker(),
          key: "area_picker",
        };
        return false;
      }
    });
  }
  if (image_uploader.value) {
    // 图片上传
    image_uploader.value.forEach((item, index) => {
      if (!image_uploader.value[index].validImageUploader()) {
        valid = {
          status: image_uploader.value[index].validImageUploader(),
          key: "image_uploader",
        };
        return false;
      }
    });
  }
  if (file_uploader.value) {
    // 文件上传
    file_uploader.value.forEach((item, index) => {
      if (!file_uploader.value[index].validFileUploader()) {
        valid = {
          status: file_uploader.value[index].validFileUploader(),
          key: "file_uploader",
        };
        return false;
      }
    });
  }
  if (sign.value) {
    // 电子签名
    sign.value.forEach((item, index) => {
      if (!sign.value[index].validSign()) {
        valid = {
          status: sign.value[index].validSign(),
          key: "sign",
        };
        return false;
      }
    });
  }
  if (rate_picker.value) {
    // 评分组件
    rate_picker.value.forEach((item, index) => {
      if (!rate_picker.value[index].validRate()) {
        valid = {
          status: rate_picker.value[index].validRate(),
          key: "rate_picker",
        };
        return false;
      }
    });
  }
  return valid;
};

// 预处理表单数据
const preValidData = (values) => {
  // 过滤掉标识为 ignore，undefined 的字段数据
  let { ignore, undefined, ...rest_data } = values;
  // 合并自定义字段到提交表单字段
  return _.assign(postData.value, rest_data);
}

const onSubmit = async (values) => {
  // 表单数据处理
  // postData.value = preValidData(values);
  // 合并扩展字段
  postData.value = { ...postData.value, x_field_1, x_cycle };
  // 检查非表单输入项
  if (validOther().status) {
    // 编辑模式不能提交数据
    if (model === 'edit') {
      console.warn(postData.value);
    }
    if (model === 'edit' || model === 'preview') return false;
    // 通过验证
    const result = await addFormDataAPI({
      form_code,
      data: postData.value,
    });
    if (result.code) {
      showSuccessToast("提交成功");
      // 缓存表单返回值
      store.changeSuccessInfo(result.data);
      // 如果类型为跳转网页
      if (result.data.commit_action === 'url') {
        window.location.href = result.data.commit_url;
      } else {
        // 跳转成功页面
        Taro.navigateTo({
          url: '../success/index'
        })
      }
    }
  } else {
    console.warn(validOther().id + ' ' + validOther().key + "不通过验证");
    // 校验错误滚动到相应输入项
    if (validOther().id) {
      Taro.pageScrollTo({
        selector: `#${validOther().id}`,
        duration: 300
      })
    }
    // // 图片上传控件报错提示
    // if (validOther().key === "image_uploader") {
    //   showFailToast("图片上传为空");
    // }
    // // 文件上传控件报错提示
    // if (validOther().key === "file_uploader") {
    //   showFailToast("文件上传为空");
    // }
  }
};
</script>

<style lang="less">
.table-page {
  background-color: #FAF9DC;
  min-height: calc(100vh);
  position: relative;
  overflow: auto;
}
.table-title {
  padding: 30px;
  font-size: 30px;
  text-align: center;
  white-space: pre-wrap;
}

.table-desc {
  padding: 0rem 30px;
  color: #666;
  font-size: 26px;
  white-space: pre-wrap;

  img {
    width: 100%;
  }
}

.table-box {
  background-color: #ffffff;
  padding-bottom: 30px;
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  width: 300px;
  // height: 10rem;
  background-color: #fff;
}

.pwd-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  .block {
    width: 80vw;
    background-color: #fff;
    padding: 30px;
    border-radius: 5px;
  }
}

.PHeader-Text {
  padding: 30px;
  font-weight: bold;
  white-space: pre;
}

// :deep(.van-icon) { // 处理正式服务器上箭头上下位移问题
//   font-size: var(--van-cell-icon-size);
//   line-height: var(--van-cell-line-height);
// }
</style>
