<!--
 * @Date: 2022-09-06 16:29:31
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-03-23 15:50:45
 * @FilePath: /data-table/src/components/SignField/index.vue
 * @Description: 电子签名控件
-->
<template>
  <div v-if="HideShow" class="sign-page">
    <div class="label">
      <span v-if="item.component_props.required">&nbsp;*</span>
      {{ item.component_props.label }}
      {{ valid }}
    </div>
    <div ref="wrapperRef" class="esign-wrapper">
      <!-- <div style="padding: 1rem; position: relative; height: 150px; background-color: #FCFCFC;border: 1px solid #EAEAEA; border-radius: 5px;"> -->
      <vue-esign v-if="esignWidth" ref="esign" class="sign-wrapper" :width="esignWidth" :height="esignHeight" :isCrop="isCrop"
        :lineWidth="lineWidth" :lineColor="lineColor" :bgColor.sync="bgColor" />
      <div v-if="show_sign" class="whiteboard">
        <div class="text" @click="startSign">
          <van-icon name="edit" />&nbsp;点击开始签署电子签名
        </div>
      </div>
    </div>
    <div v-if="!show_sign">
      <div v-if="show_control" class="control-sign">
        <van-row gutter="20" style="padding: 0 1rem">
          <van-col :span="12">
            <van-button type="default" block @click="handleGenerate">确认签名</van-button>
          </van-col>
          <van-col :span="12">
            <van-button type="default" block @click="cancelSign">取消签名</van-button>
          </van-col>
        </van-row>
      </div>
      <div v-else style="padding: 0 1rem">
        <van-button type="danger" block @click="handleReset">删除签名</van-button>
      </div>
    </div>
    <div v-if="show_empty" class="van-field__error-message" style="padding: 0 1rem 1rem 1rem">
      电子签名不能为空
    </div>
    <van-divider />
  </div>

  <van-overlay :show="loading">
    <div class="wrapper" @click.stop>
      <van-loading vertical color="#FFFFFF">生成中...</van-loading>
    </div>
  </van-overlay>
</template>

<script setup>
import { v4 as uuidv4 } from "uuid";
import { qiniuTokenAPI, qiniuUploadAPI, saveFileAPI } from "@/api/common";
import { showSuccessToast, showFailToast } from "vant";
import { useRoute } from "vue-router";
import BMF from "browser-md5-file";
import { getEtag } from "@/utils/qetag.js"; // 生成hash值
import dayjs from "dayjs";

const props = defineProps({
  item: Object,
});
// 隐藏显示
const HideShow = computed(() => {
  return !props.item.component_props.disabled
})
const $route = useRoute();
const emit = defineEmits(["active"]);

const esign = ref(null);

let esignWidth = ref();
let esignHeight = ref();
const wrapperRef = ref(null)
onMounted(() => {
  // 动态计算画板canvas宽度/高度
  setTimeout(() => {
    esignWidth.value = wrapperRef.value.offsetWidth - 32;
    esignHeight.value = (window.innerHeight) / 5;
  }, 100);
})
const lineWidth = ref(6);
const lineColor = ref("#000000");
const bgColor = ref("#FCFCFC");
const isCrop = ref(false);
const show_control = ref(true);
const image_url = ref("");
const show_empty = ref(false);

const handleReset = () => {
  // 清空画板
  esign.value.reset();
  show_control.value = true;
  // 删除可能存在的签名
  image_url.value = "";
  props.item.value = {
    key: "sign",
    filed_name: props.item.key,
    value: "",
  };
  emit("active", props.item.value);
};

/********** 上传七牛云获取图片地址 ***********/
const loading = ref(false);
const formCode = $route.query.code; // 表单code
const uuid = () => {
  let s = [];
  let hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid;
};

const uploadQiniu = async (file, token, filename) => {
  let formData = new FormData();
  formData.append("file", file); // 通过append向form对象添加数据
  formData.append("token", token);
  formData.append("key", filename);
  let config = {
    headers: { "Content-Type": "multipart/form-data" },
  };
  // 自拍图片上传七牛服务器
  let qiniuUploadUrl;
  if (window.location.protocol === 'https:') {
    qiniuUploadUrl = 'https://up.qbox.me';
  } else {
    qiniuUploadUrl = 'http://upload.qiniu.com';
  }
  const { filekey, hash, image_info } = await qiniuUploadAPI(
    qiniuUploadUrl,
    formData,
    config
  );
  if (filekey) {
    // 保存图片
    const { data } = await saveFileAPI({
      filekey,
      hash,
      format: image_info.format,
      height: image_info.height,
      width: image_info.width,
    });
    return data;
  }
};
/****************** END *******************/

const handleUpload = async (files, filename) => {
  // 上传图片流程
  loading.value = true;
  // 获取HASH值
  const hash = getEtag(files);
  // 获取七牛token
  const { token, key, code } = await qiniuTokenAPI({
    name: filename,
    hash,
  });
  // 文件上传七牛云
  const imgUrl = await uploadQiniu(files, token, filename);
  return imgUrl;
};

const handleGenerate = () => {
  esign.value
    .generate()
    .then(async (res) => {
      let affix = uuidv4();
      let fileName = `uploadForm/${formCode}/${affix}_sign.png`;
      let file = dataURLtoFile(res, fileName); // 生成文件
      const imgUrl = await handleUpload(file, fileName);
      loading.value = false;
      props.item.value = {
        key: "sign",
        filed_name: props.item.key,
        value: { name: `电子签名${dayjs().format('YYYYMMDDHHmmss')}.png`, url: imgUrl.src},
      };
      image_url.value = imgUrl.src;
      show_control.value = false;
      show_empty.value = false;
      emit("active", props.item.value);
    })
    .catch((err) => {
      loading.value = false;
      // 签名生成失败
      console.warn(err);
      if (err) {
        showFailToast("签名生成失败");
      }
    });
};

//将图片base64转换为文件
const dataURLtoFile = (dataurl, filename) => {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

const show_sign = ref(true);
const startSign = () => {
  show_sign.value = false;
  show_empty.value = false;
};
const cancelSign = () => {
  show_sign.value = true;
  show_empty.value = false;
  handleReset();
};

const validSign = () => {
  // 必填项 未生成签名
  if (props.item.component_props.required && !image_url.value) {
    show_empty.value = true;
  } else {
    show_empty.value = false;
  }
  return !show_empty.value;
};

defineExpose({ validSign });
</script>

<!-- <script>
export default {
  methods: {
    validSign () {
      console.warn(0);
    }
  }
}
</script> -->

<style lang="less" scoped>
.sign-page {

  // padding-bottom: 1rem;
  .label {
    padding: 1rem 1rem 0 1rem;
    font-size: 0.9rem;
    font-weight: bold;

    span {
      color: red;
    }
  }

  .esign-wrapper {
    padding: 1rem;
    position: relative;
    box-sizing: border-box;

    .sign-wrapper {
      border: 1px solid #eaeaea;
      border-radius: 5px;
    }

    .whiteboard {
      position: absolute;
      height: 100%;
      width: 100%;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      text-align: center;

      .text {
        position: absolute;
        width: 100%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }

  }

  .control-sign {
    padding-bottom: 1rem;
  }
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  width: 120px;
  height: 120px;
  background-color: #fff;
}
</style>
