<!--
 * @Date: 2022-08-31 16:16:49
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-04-12 15:01:26
 * @FilePath: /custom_form/src/components/ImageUploaderField/index.vue
 * @Description: 图片上传控件
-->
<template>
  <div v-if="HideShow" class="image-uploader-field">
    <div class="label">
      <text v-if="item.component_props.required">&nbsp;*</text>
      {{ item.component_props.label }}
    </div>
    <div style="font-size: 12px; color: red; margin-left: 20px;">
      <text>最大图片数为 {{ item.component_props.max_count }} 张</text>,
      <text>单个图片最大体积 {{ item.component_props.max_size }} MB</text>
    </div>
    <div v-if="item.component_props.note" v-html="item.component_props.note"
      style="font-size: 13px; margin-left: 1rem; color: gray; padding-bottom: 0.5rem; padding-top: 0.25rem; white-space: pre-wrap;" />
    <div style="padding: 1rem; padding-top: 0.5rem;">
      <nut-uploader
        :name="item.name"
        v-model:file-list="defaultFileList"
        :maximum="item.component_props.max_count"
        :multiple="item.component_props.max_count > 1"
        :size-type="['compressed']"
        :image-type="imageTypes"
        :maximize="max_size"
        :before-xhr-upload="beforeXhrUpload"
        @oversize="onOversize"
        @success="uploadSuccess"
        @failure="uploadFailure"
        @delete="onDelete"
        @change="onChange"
        @image-type-error="imageTypeError">
      </nut-uploader>
    </div>
    <div class="type-text">上传格式：{{ type_text }}</div>
    <div v-if="show_error" style="padding: 5px 20px; color: red; font-size: 12px;">
      {{ error_msg }}
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
import { ref, computed, watch, onMounted, reactive } from "vue";
import { qiniuTokenAPI, qiniuUploadAPI, saveFileAPI } from "@/api/common";
import BMF from "browser-md5-file";
import { getUrlParams } from "@/utils/tools";
import { Uploader, Loading } from '@nutui/icons-vue-taro';
import Taro from '@tarojs/taro'

const props = defineProps({
  item: Object,
});
// 隐藏显示
const HideShow = computed(() => {
  return !props.item.component_props.disabled
})

const emit = defineEmits(["active"]);

// 固定类型限制
const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'psd', 'tif'];

// 文件类型中文页面显示
const type_text = computed(() => {
  return imageTypes.join('/');
});

// 上传文件集合
const fileList = ref([]);
const defaultFileList = ref([])

// 上传文件体积
const max_size = computed(() => {
  return props.item.component_props.max_size * 1024 * 1024
})

const toast_msg = ref('');
const toast_show = ref(false);
const toast_type = ref('success');

// 超过体积大小回调
const onOversize = (files) => {
  toast_msg.value = `最大图片体积为${props.item.component_props.max_size}MB`
  toast_show.value = true;
  toast_type.value = 'warn';
};

const onStart = (options) => {
  // console.warn(options);
}

// 自定义上传逻辑
const beforeXhrUpload = async (xhr, options) => {
  const imgObj = defaultFileList.value[defaultFileList.value.length - 1];
  // 判断上传文件格式
  imgObj.type = imgObj.type ? imgObj.type : imgObj.name.split(".").pop();
  // H5环境
  if (process.env.TARO_ENV === 'h5') {
    // 把本地路径转换成file实体
    const imgBlob = await fetch(imgObj.url).then(r => r.blob());
    const imgFile = new File([imgBlob], imgObj.name, { type: imgObj.type });
    // 上传返回file数据结构
    const resImgObj = await handleUpload(imgFile);
    // 上传失败提示
    if (!resImgObj) {
      options.onFailure?.(resImgObj, options);
      loading.value = false;
    } else {
      defaultFileList.value[defaultFileList.value.length - 1]['url'] = resImgObj.src;
      defaultFileList.value[defaultFileList.value.length - 1]['type'] = 'image';
      fileList.value.push({
        name: imgFile.name,
        url: resImgObj.src,
        size: imgFile.size
      });
      options.onSuccess?.(resImgObj, options);
      loading.value = false;
    }
  } else {
    const fs = Taro.getFileSystemManager()
    fs.getFileInfo({
      filePath: imgObj.url,
      success: async (res) => {
        const file_info = res;
        let suffix = /\.[^\.]+$/.exec(imgObj.name); // 获取后缀
        // 获取七牛token
        const filename = imgObj.name; // 真实文件名
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
            filePath: imgObj.url,
            name: `file`,
            formData: {
              token: getToken.token,
              key: `uploadForm/${formCode}/${file_info.digest}${suffix}`
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
                defaultFileList.value[defaultFileList.value.length - 1]['url'] = data.src;
                defaultFileList.value[defaultFileList.value.length - 1]['type'] = 'image';
                // 加入上传成功队列
                fileList.value.push({
                  name: filename,
                  url: data.src,
                  size: file_info.size
                });
                options.onSuccess?.(data, options);
                loading.value = false;
              }
            })
            .catch((error) => {
              console.error(error)
              options.onFailure?.(error, options);
              loading.value = false;
            })
        }
        // 重复上传
        if (getToken.data) {
          // 加入上传成功队列
          fileList.value.push({
            name: filename,
            url: getToken.data.src,
            size: file_info.size
          });
          options.onSuccess?.(getToken.data, options);
        }
      }
    })
  }
}

// 上传成功回调
const uploadSuccess = async ({ data, fileItem, option, responseText }) => {
  props.item.value = {
    key: "file_uploader",
    filed_name: props.item.key,
    value: fileList.value,
  };
  // 完整数据回调到表单上
  emit("active", props.item.value);
  // 校验数据
  validImageUploader();
};

// 上传失败回调
const uploadFailure = async ({ data, fileItem, option, responseText }) => {
  // 真实上传失败才会提示
  if (data) {
    console.error("上传失败", "fail");
    toast_msg.value = '上传失败，请重新尝试！'
    toast_show.value = true;
    toast_type.value = 'fail';
  }
};

// 删除上传队列回调
const onDelete = ({ file }) => {
  fileList.value = fileList.value.filter((item) => {
    if (item.url !== file.url) return item;
  });
  props.item.value = {
    key: "file_uploader",
    filed_name: props.item.key,
    value: fileList.value,
  };
  // 完整数据回调到表单上
  emit("active", props.item.value);
}

//
const imageTypeError = (file) => {
  toast_msg.value = '请上传指定格式'
  toast_show.value = true;
  toast_type.value = 'warn';
}

const onChange = ({ fileList }) => {
}

/********** 上传七牛云获取文件地址 ***********/
const loading = ref(false);
const formCode = getUrlParams(location.href) ? getUrlParams(location.href).code : ''; // 表单code

// 上传文件返回文件URL
const handleUpload = async (file) => {
  loading.value = true;
  return new Promise((resolve, reject) => {
    // 获取MD5值
    const bmf = new BMF();
    bmf.md5(
      file,
      async (err, md5) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        // 获取七牛token
        const filename = file.name; // 真实文件名
        const getToken = await qiniuTokenAPI({
          name: filename,
          hash: md5,
        });
        // 文件上传七牛云
        let imgUrl = "";
        // 第一次上传
        if (getToken.token) {
          // 返回数据库真实文件地址
          imgUrl = await uploadQiniu(file, getToken.token, filename, md5);
        }
        // 重复上传
        if (getToken.data) {
          imgUrl = getToken.data;
        }
        resolve(imgUrl);
      },
      (process) => {
        //计算进度
      }
    );
  });
};

// 生成数据库真实文件地址
const uploadQiniu = async (file, token, name, md5) => {
  let suffix = /\.[^\.]+$/.exec(name); // 获取后缀
  // let affix = uuidv4();
  let fileName = `uploadForm/${formCode}/${md5}${suffix}`;
  let formData = new FormData();
  formData.append("file", file); // 通过append向form对象添加数据
  formData.append("token", token);
  formData.append("key", fileName);
  let config = {
    headers: { "Content-Type": "multipart/form-data" },
  };
  // 自拍文件上传七牛服务器
  let qiniuUploadUrl;
  if (window.location.protocol === 'https:') {
    qiniuUploadUrl = 'https://up.qbox.me';
  } else {
    qiniuUploadUrl = 'http://upload.qiniu.com';
  }
  const uploadData = await qiniuUploadAPI(
    qiniuUploadUrl,
    formData,
    config
  );
  // 上传失败处理
  if (!uploadData) {
    loading.value = false;
    return false;
  }
  if (uploadData.filekey) {
    // 保存文件
    const { data } = await saveFileAPI({
      name,
      filekey: uploadData.filekey,
      hash: md5,
      // format: image_info.format,
      // height: image_info.height,
      // width: image_info.width,
    });
    return data;
  }
};

/****************** END *******************/

const show_error = ref(false);
const error_msg = ref('');

// 校验模块
const validImageUploader = () => {
  // 必填项 未上传文件
  if (props.item.component_props.required && !fileList.value.length) {
    show_error.value = true;
    error_msg.value = '必填项不能为空'
  } else {
    show_error.value = false;
    error_msg.value = ''
  }
  return !show_error.value;
};

defineExpose({ validImageUploader });
</script>

<style lang="less">
.image-uploader-field {
  .label {
    margin-left: 1rem;
    padding-bottom: 20px;
    font-size: 26px;
    font-weight: bold;

    text {
      color: red;
    }
  }

  .type-text {
    font-size: 22px;
    margin-left: 1rem;
    padding-bottom: 1rem;
    color: gray;
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
