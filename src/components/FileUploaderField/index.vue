<!--
 * @Date: 2022-08-31 16:16:49
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-02-10 11:17:21
 * @FilePath: /data-table/src/components/FileUploaderField/index.vue
 * @Description: 文件上传控件
-->
<template>
  <div v-if="HideShow" class="file-uploader-field">
    <div class="label">
      <span v-if="item.component_props.required">&nbsp;*</span>
      {{ item.component_props.label }}
    </div>
    <div
      v-if="item.component_props.note"
      v-html="item.component_props.note"
      style="font-size: 0.9rem; margin-left: 1rem; color: gray; padding-bottom: 0.5rem; padding-top: 0.25rem; white-space: pre-wrap;"
    />
    <div>
      <p
        v-for="(file, index) in fileList"
        :key="index"
        style="padding-left: 1rem; margin-bottom: 0.5rem"
      >
        <p style="font-size: 1rem; word-break: break-all; margin-right: 0.75rem;">
          <span>{{ index + 1 }}.&nbsp;{{ file.filename }}&nbsp;&nbsp;{{ (file.size / 1024 / 1024).toFixed(2) }}MB</span>
          &nbsp;&nbsp;
          <span style="color: #e32525; font-size: 0.85rem" @click="beforeDelete(file)">移除</span>
        </p>
      </p>
    </div>
    <div style="padding: 1rem">
      <van-uploader
        :name="item.name"
        upload-icon="add"
        accept="*"
        :before-read="beforeRead"
        :after-read="afterRead"
        :before-delete="beforeDelete"
        :multiple="item.component_props.max_size > 1"
      >
        <van-button icon="plus" type="primary">上传文件</van-button>
      </van-uploader>
    </div>
    <!-- <div class="type-text">上传格式：{{ type_text }}</div> -->
    <div
      v-if="show_empty"
      class="van-field__error-message"
      style="padding: 0 1rem 1rem 1rem"
    >
      文件上传不能为空
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
 * 文件上传
 * @param name[String] 组件名称
 * @param file_type[Array] 文件上传类型
 * @param multiple[Boolean] 文件多选
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

// 文件类型中文页面显示
const type_text = computed(() => {
  return props.item.component_props.file_type;
});
// 上传文件集合
const fileList = ref([
  // { url: "https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg" },
  // Uploader 根据文件后缀来判断是否为文件文件
  // 如果文件 URL 中不包含类型信息，可以添加 isImage 标记来声明
  // { url: 'https://cloud-image', isImage: true },
]);

// 上传前置处理
const beforeRead = (file) => {
  // TODO: 需要file_type集合
  // 类型限制
  // const file_types = _.map(
  //   props.item.component_props.file_type.split("/"),
  //   (item) => `video/${item}`
  // );
  let flag = true;
  if (file.length + 1 > props.item.component_props.max_count) {
    // 数量限制
    flag = false;
    showToast(`最大上传数量为${props.item.component_props.max_count}个`);
  }
  if (fileList.value.length + 1 > props.item.component_props.max_count) {
    // 数量限制
    flag = false;
    showToast(`最大上传数量为${props.item.component_props.max_count}个`);
  }
  if ((file.size / 1024 / 1024).toFixed(2) > props.item.component_props.max_size) {
    // 体积限制
    flag = false;
    showToast(
      `最大文件体积为${props.item.component_props.max_size}MB`
    );
  }
  // if (_.isArray(file)) {
  //   // 多张文件
  //   const types = _.difference(_.uniq(_.map(file, (item) => item.type)), file_types); // 数组返回不能上传的类型
  //   if (types.length) {
  //     flag = false;
  //     showFailToast("请上传指定格式文件");
  //   }
  // } else {
  //   if (!_.includes(file_types, file.type)) {
  //     showFailToast("请上传指定格式文件");
  //     flag = false;
  //   }
  // }
  return flag;
};

// 文件读取完成后的回调函数
const afterRead = async (files) => {
  if (Array.isArray(files)) {
    // 多张文件上传files是一个数组
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
        size: files.file.size
        // isImage: true,
      });
      loading.value = false;
    }
  }
  // 过滤非包含URL的文件
  fileList.value = fileList.value.filter((item) => {
    if (item.url) return item;
  });
  props.item.value = {
    key: "file_uploader",
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
    key: "file_uploader",
    filed_name: props.item.key,
    // value: fileList.value.map((item) => item.url),
    value: fileList.value,
  };
  // 完整数据回调到表单上
  emit("active", props.item.value);
};

/********** 上传七牛云获取文件地址 ***********/
const loading = ref(false);
const formCode = $route.query.code; // 表单code

// 上传文件返回文件URL
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
          // 返回数据库真实文件地址
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

// 多选文件上传遍历
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
        size: files.file.size
        // isImage: true,
      });
      loading.value = false;
    }
  }
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
  const { filekey, hash, image_info } = await qiniuUploadAPI(
    qiniuUploadUrl,
    formData,
    config
  );
  if (filekey) {
    // 保存文件
    const { data } = await saveFileAPI({
      name,
      filekey,
      hash: md5,
      // format: image_info.format,
      // height: image_info.height,
      // width: image_info.width,
    });
    return data;
  }
};

/****************** END *******************/

// 校验模块
const validFileUploader = () => {
  // 必填项 未上传文件
  if (props.item.component_props.required && !fileList.value.length) {
    show_empty.value = true;
  } else {
    show_empty.value = false;
  }
  return !show_empty.value;
};

defineExpose({ validFileUploader });
</script>

<style lang="less" scoped>
.file-uploader-field {
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
