<!--
 * @Date: 2022-08-31 16:16:49
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-01-17 16:44:32
 * @FilePath: /data-table/src/components/ImageUploaderField/index.vue
 * @Description: 图片上传控件
-->
<template>
  <div v-if="HideShow" class="image-uploader-field">
    <div class="label">
      <span v-if="item.component_props.required">&nbsp;*</span>
      {{ item.component_props.label }}
    </div>
    <div
      v-if="item.component_props.note"
      v-html="item.component_props.note"
      style="font-size: 0.9rem; margin-left: 1rem; color: gray; padding-bottom: 0.5rem; padding-top: 0.25rem; white-space: pre;"
    />
    <div style="padding: 1rem">
      <van-uploader
        :name="item.name"
        upload-icon="add"
        :before-read="beforeRead"
        :after-read="afterRead"
        :before-delete="beforeDelete"
        v-model="fileList"
        :multiple="item.component_props.max_size > 1"
      />
    </div>
    <div class="type-text">上传类型:&nbsp;{{ type_text }}</div>
    <div
      v-if="show_empty"
      class="van-field__error-message"
      style="padding: 0 1rem 1rem 1rem"
    >
      图片上传不能为空
    </div>
    <van-divider />
  </div>

  <van-overlay :show="loading">
    <div class="wrapper" @click.stop>
      <van-loading vertical color="#FFFFFF">上传中...</van-loading>
    </div>
  </van-overlay>
</template>

<script setup>
/**
 * 图片上传
 * @param name[String] 组件名称
 * @param image_type[Array] 图片上传类型
 * @param multiple[Boolean] 图片多选
 */
import { showSuccessToast, showFailToast, showToast } from "vant";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import { qiniuTokenAPI, qiniuUploadAPI, saveFileAPI } from "@/api/common";
import BMF from "browser-md5-file";
import { useRoute } from "vue-router";
import axios from "axios";
import { getEtag } from "@/utils/qetag.js"; // 生成hash值

const $route = useRoute();
const props = defineProps({
  item: Object,
});
// 隐藏显示
const HideShow = computed(() => {
  return !props.item.component_props.disabled
})
const emit = defineEmits(["active"]);
const show_empty = ref(false);

// 固定类型限制
const imageTypes = "jpg/jpeg/png/gif/bmp/psd/tif";

// 文件类型中文页面显示
const type_text = computed(() => {
  // return props.item.component_props.image_type;
  return imageTypes;
});
// 上传图片集合
const fileList = ref([
  // { url: "https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg" },
  // Uploader 根据文件后缀来判断是否为图片文件
  // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
  // { url: 'https://cloud-image', isImage: true },
]);

// 上传前置处理
const beforeRead = (file) => {
  // 类型限制
  // const image_types = _.map(
  //   props.item.component_props.image_type.split("/"),
  //   (item) => `image/${item}`
  // );
  const image_types = _.map(imageTypes.split("/"), (item) => `image/${item}`);

  let flag = true;
  if (_.isArray(file)) {
    // 多张图片
    const types = _.difference(_.uniq(_.map(file, (item) => item.type)), image_types); // 数组返回不能上传的类型
    if (types.length) {
      flag = false;
      showFailToast("请上传指定格式图片");
    }
    if (fileList.value.length + file.length > props.item.component_props.max_count) {
      // 数量限制
      flag = false;
      showToast(`最大上传数量为${props.item.component_props.max_count}张`);
    }
  } else {
    if (!_.includes(image_types, file.type)) {
      showFailToast("请上传指定格式图片");
      flag = false;
    }
    if (fileList.value.length + 1 > props.item.component_props.max_count) {
      // 数量限制
      flag = false;
      showToast(`最大上传数量为${props.item.component_props.max_count}张`);
    }
    if ((file.size / 1024 / 1024).toFixed(2) > props.item.component_props.max_size) {
      // 体积限制
      flag = false;
      showToast(
        `最大文件体积为${props.item.component_props.max_size}MB`
      );
    }
  }
  return flag;
};

// 文件读取完成后的回调函数
const afterRead = async (files) => {
  if (Array.isArray(files)) {
    // 多张图片上传files是一个数组
    muliUpload(files);
  } else {
    const imgUrl = await handleUpload(files);
    // 上传失败提示
    if (!imgUrl.src) {
      files.status = "failed";
      files.message = "上传失败";
      loading.value = false;
    } else {
      files.status = "";
      files.message = "";
      fileList.value.push({
        // meta_id: imgUrl.meta_id,
        name: files.file.name,
        url: imgUrl.src,
        // isImage: true,
      });
      loading.value = false;
    }
  }
  // 过滤非包含URL的图片
  fileList.value = fileList.value.filter((item) => {
    if (item.url) return item;
  });
  props.item.value = {
    key: "image_uploader",
    filed_name: props.item.key,
    // value: fileList.value.map((item) => item.url),
    value: fileList.value,
  };
  show_empty.value = false;
  // 完整数据回调到表单上
  emit("active", props.item.value);
};

// 文件删除前的回调函数
const beforeDelete = (files) => {
  fileList.value = fileList.value.filter((item) => {
    if (item.url !== files.url) return item;
  });
  props.item.value = {
    key: "image_uploader",
    filed_name: props.item.key,
    // value: fileList.value.map((item) => item.url),
    value: fileList.value,
  };
  // 完整数据回调到表单上
  emit("active", props.item.value);
};

/********** 上传七牛云获取图片地址 ***********/
const loading = ref(false);
const formCode = $route.query.code; // 表单code
// const uuid = () => {
//   let s = [];
//   let hexDigits = "0123456789abcdef";
//   for (var i = 0; i < 36; i++) {
//     s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
//   }
//   s[14] = "4";
//   s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
//   s[8] = s[13] = s[18] = s[23] = "-";

//   var uuid = s.join("");
//   return uuid;
// };

// 上传图片返回图片URL
const handleUpload = async (files) => {
  loading.value = true;
  // 获取HASH值
  // const hash = getEtag(files.content);
  return new Promise((resolve, reject) => {
    // 获取MD5值
    const bmf = new BMF();
    bmf.md5(
      files.file,
      async (err, md5) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        // 获取七牛token
        const filename = files.file.name; // 真实文件名
        const getToken = await qiniuTokenAPI({
          name: filename,
          hash: md5,
        });
        // 文件上传七牛云
        let imgUrl = "";
        // 第一次上传
        if (getToken.token) {
          files.status = "uploading";
          files.message = "上传中...";
          // 返回数据库真实图片地址
          imgUrl = await uploadQiniu(files.file, getToken.token, filename, md5);
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

// 多选图片上传遍历
var muliUpload = async (files) => {
  for (let item of files) {
    const res = await handleUpload(item);
    // 上传失败提示
    if (!res.src) {
      item.status = "failed";
      item.message = "上传失败";
      loading.value = false;
    } else {
      item.status = "";
      item.message = "";
      fileList.value.push({
        // meta_id: res.meta_id,
        name: item.file.name,
        url: res.src,
        // isImage: true,
      });
      loading.value = false;
    }
  }
};



const getType = (file, name) => {
  var index1 = name.lastIndexOf(".");
  var index2 = file.length;
  var type = file.substring(index1, index2).toUpperCase();
  return type;
}

// 生成数据库真实图片地址
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
      name,
      filekey,
      hash: md5,
      // format: image_info.format,
      height: image_info.height,
      width: image_info.width,
    });
    return data;
  }
};

/****************** END *******************/

// 校验模块
const validImageUploader = () => {
  // 必填项 未上传图片
  if (props.item.component_props.required && !fileList.value.length) {
    show_empty.value = true;
  } else {
    show_empty.value = false;
  }
  return !show_empty.value;
};

defineExpose({ validImageUploader });
</script>

<style lang="less" scoped>
.image-uploader-field {
  .label {
    padding: 1rem 1rem 0 1rem;
    font-size: 0.9rem;
    font-weight: bold;

    span {
      color: red;
    }
  }

  .type-text {
    font-size: 0.9rem;
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
