<!--
 * @Date: 2022-09-06 16:29:31
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-04-13 15:28:49
 * @FilePath: /custom_form/src/components/SignField/index.vue
 * @Description: 电子签名控件
-->
<template>
  <div v-if="HideShow" class="sign-page">
    <div class="label">
      <text v-if="item.component_props.required">&nbsp;*</text>
      {{ item.component_props.label }}
    </div>
    <div class="esign-wrapper">
      <nut-signature v-if="show_sign" class="sign-wrapper" @confirm="confirm" @clear="clear"></nut-signature>
      <div v-if="image_url">
        <img :src="image_url" style="width: 100%; border: 1px solid #eaeaea; background-color: #fcfcfc;">
        <nut-button color="red" @click="removeSign">删除签名</nut-button>
      </div>
    </div>
    <div v-if="show_empty" style="padding: 10px 20px; color: red; font-size: 12px;">
      电子签名不能为空
    </div>
    <nut-divider :style="{ color: '#ebedf0' }" />
    <nut-overlay v-model:visible="loading">
      <div class="wrapper" style="color: white; font-size: 15px;">
        <Loading />
        上传中...
      </div>
    </nut-overlay>
    <nut-toast :msg="toast_msg" v-model:visible="toast_show" :type="toast_type" />
  </div>
</template>

<script setup>
import Taro, { useLoad } from '@tarojs/taro'
import { ref, computed, watch, onMounted, reactive } from "vue";
import { v4 as uuidv4 } from "uuid";
import { qiniuTokenAPI, qiniuUploadAPI, saveFileAPI } from "@/api/common";
// import { showSuccessToast, showFailToast } from "vant";
import { getUrlParams } from "@/utils/tools";
import { getEtag } from "@/utils/qetag.js"; // 生成hash值
import dayjs from "dayjs";
import { Uploader, Loading, Edit } from '@nutui/icons-vue-taro';

const props = defineProps({
  item: Object,
});
// 隐藏显示
const HideShow = computed(() => {
  return !props.item.component_props.disabled
})

const toast_msg = ref('');
const toast_show = ref(false);
const toast_type = ref('success');

const emit = defineEmits(["active"]);

const show_sign = ref(true);

const removeSign = () => {
  show_sign.value = true;
  clear()
}

// 确认签名回调
const confirm = async (canvas, data) => {
  if (canvas === '请绘制签名') {
    validSign();
    return false;
  }
  // H5环境 只能获取canvas
  if (process.env.TARO_ENV === 'h5') {
    let affix = uuidv4();
    let fileName = `uploadForm/${formCode}/${affix}_sign.png`;
    let file = dataURLtoFile(canvas.toDataURL("image/png"), fileName); // 生成文件
    const imgUrl = await handleUpload(file, fileName);
    if (imgUrl) {
      loading.value = false;
      props.item.value = {
        key: "sign",
        filed_name: props.item.key,
        value: { name: `电子签名${dayjs().format('YYYYMMDDHHmmss')}.png`, url: imgUrl.src},
      };
      image_url.value = imgUrl.src;
      show_sign.value = false;
      show_empty.value = false;
      emit("active", props.item.value);
    }
  } else { // weapp 环境
    if (!data) {
      toast_msg.value = '生成签名失败，请稍后尝试'
      toast_show.value = true;
      toast_type.value = 'warn';
      return false;
    }
    const fs = Taro.getFileSystemManager()
    fs.getFileInfo({
      filePath: data,
      success: async (res) => {
        const file_info = res;
        // 获取七牛token
        const filename = `uploadForm/${formCode}/${file_info.digest}_sign.png`; // 真实文件名
        const getToken = await qiniuTokenAPI({
          name: filename,
          hash: file_info.digest,
        });
        // 文件上传七牛云
        // 第一次上传
        if (getToken.token) {
          loading.value = true;
          // 自拍图片上传七牛服务器
          Taro.uploadFile({
              url: 'https://up.qbox.me',
              filePath: data,
              name: `file`,
              formData: {
                token: getToken.token,
                key: filename
              },
            })
            .then(async (res) => {
              res.data = JSON.parse(res.data);
              if (res.data.filekey) {
                // 保存文件
                const { data } = await saveFileAPI({
                  name: filename,
                  filekey: res.data.filekey,
                  hash: file_info.digest,
                });
                // 生成图片成功
                if (data.src) {
                  loading.value = false;
                  props.item.value = {
                    key: "sign",
                    filed_name: props.item.key,
                    value: { name: `电子签名${dayjs().format('YYYYMMDDHHmmss')}.png`, url: data.src },
                  };
                  image_url.value = data.src;
                  show_sign.value = false;
                  show_empty.value = false;
                  emit("active", props.item.value);
                }
              }
            })
            .catch((error) => {
              console.error(error)
              loading.value = false;
            })
        }
      }
    })
  }
};
const clear = () => {
  // 删除可能存在的签名
  image_url.value = "";
  props.item.value = {
    key: "sign",
    filed_name: props.item.key,
    value: "",
  };
  emit("active", props.item.value);
}

const image_url = ref("");
const show_empty = ref(false);

/********** 上传七牛云获取图片地址 ***********/
const loading = ref(false);
const formCode = getUrlParams(location.href) ? getUrlParams(location.href).code : ''; // 表单code
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

<script>
export default {
  mounted() {
  },
}
</script>

<style lang="less">
.sign-page {

  // padding-bottom: 1rem;
  .label {
    margin-left: 1rem;
    padding-bottom: 20px;
    font-size: 26px;
    font-weight: bold;

    text {
      color: red;
    }
  }

  .esign-wrapper {
    padding: 0 1rem;
    position: relative;
    box-sizing: border-box;

    .sign-wrapper {
      // border: 1px solid #eaeaea;
      border-radius: 5px;
    }
    .nut-signature-inner {
      background: #fcfcfc !important;
    }

    .whiteboard {
      position: absolute;
      height: 100%;
      width: 100%;
      left: 50%;
      top: 40%;
      transform: translate(-50%, -50%);
      text-align: center;

      .text {
        font-size: 28px;
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
