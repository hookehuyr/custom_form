var __defProp = Object.defineProperty
var __defNormalProp = (obj, key, value) =>
  key in obj
    ? __defProp(obj, key, {
        enumerable: true,
        configurable: true,
        writable: true,
        value,
      })
    : (obj[key] = value)
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== 'symbol' ? key + '' : key, value)
  return value
}
import {
  reactive,
  computed,
  resolveComponent,
  openBlock,
  createElementBlock,
  normalizeClass,
  renderSlot,
  createTextVNode,
  createBlock,
  createCommentVNode,
  Fragment,
  renderList,
  createElementVNode,
  toDisplayString,
  createVNode,
} from 'vue'
import { c as createComponent } from './component-25dcca32.js'
import { f as funInterceptor } from './interceptor-157a0193.js'
import Progress from './Progress.js'
import Button from './Button.js'
import Taro from '@tarojs/taro'
import { Photograph, Failure, Loading, Del, Link } from '@nutui/icons-vue-taro'
import { _ as _export_sfc } from './_plugin-vue_export-helper-cc2b3d55.js'
import '../locale/lang'
class UploadOptions {
  constructor() {
    __publicField(this, 'url', '')
    __publicField(this, 'name', 'file')
    __publicField(this, 'fileType', 'image')
    __publicField(this, 'formData')
    __publicField(this, 'sourceFile')
    __publicField(this, 'method', 'post')
    __publicField(this, 'xhrState', 200)
    __publicField(this, 'timeout', 30 * 1e3)
    __publicField(this, 'headers', {})
    __publicField(this, 'withCredentials', false)
    __publicField(this, 'onStart')
    __publicField(this, 'taroFilePath')
    __publicField(this, 'onProgress')
    __publicField(this, 'onSuccess')
    __publicField(this, 'onFailure')
    __publicField(this, 'beforeXhrUpload')
  }
}
class Uploader {
  constructor(options) {
    __publicField(this, 'options')
    this.options = options
  }
  upload() {
    var _a
    const options = this.options
    const xhr = new XMLHttpRequest()
    xhr.timeout = options.timeout
    if (xhr.upload) {
      xhr.upload.addEventListener(
        'progress',
        (e) => {
          var _a2
          ;(_a2 = options.onProgress) == null
            ? void 0
            : _a2.call(options, e, options)
        },
        false,
      )
      xhr.onreadystatechange = () => {
        var _a2, _b
        if (xhr.readyState === 4) {
          if (xhr.status == options.xhrState) {
            ;(_a2 = options.onSuccess) == null
              ? void 0
              : _a2.call(options, xhr.responseText, options)
          } else {
            ;(_b = options.onFailure) == null
              ? void 0
              : _b.call(options, xhr.responseText, options)
          }
        }
      }
      xhr.withCredentials = options.withCredentials
      xhr.open(options.method, options.url, true)
      for (const [key, value] of Object.entries(options.headers)) {
        xhr.setRequestHeader(key, value)
      }
      ;(_a = options.onStart) == null ? void 0 : _a.call(options, options)
      if (options.beforeXhrUpload) {
        options.beforeXhrUpload(xhr, options)
      } else {
        xhr.send(options.formData)
      }
    } else {
      console.warn('浏览器不支持 XMLHttpRequest')
    }
  }
}
class UploaderTaro extends Uploader {
  constructor(options) {
    super(options)
  }
  uploadTaro(uploadFile, env) {
    var _a
    const options = this.options
    if (env === 'WEB') {
      this.upload()
    } else {
      if (options.beforeXhrUpload) {
        options.beforeXhrUpload(uploadFile, options)
      } else {
        const uploadTask = uploadFile({
          url: options.url,
          filePath: options.taroFilePath,
          fileType: options.fileType,
          header: {
            'Content-Type': 'multipart/form-data',
            ...options.headers,
          },
          //
          formData: options.formData,
          name: options.name,
          success(response) {
            var _a2, _b
            if (options.xhrState == response.statusCode) {
              ;(_a2 = options.onSuccess) == null
                ? void 0
                : _a2.call(options, response, options)
            } else {
              ;(_b = options.onFailure) == null
                ? void 0
                : _b.call(options, response, options)
            }
          },
          fail(e) {
            var _a2
            ;(_a2 = options.onFailure) == null
              ? void 0
              : _a2.call(options, e, options)
          },
        })
        ;(_a = options.onStart) == null ? void 0 : _a.call(options, options)
        uploadTask.progress((res) => {
          var _a2
          ;(_a2 = options.onProgress) == null
            ? void 0
            : _a2.call(options, res, options)
        })
      }
    }
  }
}
const { translate: translate$1 } = createComponent('uploader')
class FileItem {
  constructor() {
    __publicField(this, 'status', 'ready')
    __publicField(this, 'message', translate$1('ready'))
    __publicField(this, 'uid', /* @__PURE__ */ new Date().getTime().toString())
    __publicField(this, 'name')
    __publicField(this, 'url')
    __publicField(this, 'type')
    __publicField(this, 'path')
    __publicField(this, 'percentage', 0)
    __publicField(this, 'formData', {})
  }
}
const { componentName, create, translate } = createComponent('uploader')
const _sfc_main = create({
  components: {
    [Progress.name]: Progress,
    [Button.name]: Button,
    Photograph,
    Failure,
    Loading,
    Del,
    Link,
  },
  props: {
    name: { type: String, default: 'file' },
    url: { type: String, default: '' },
    sizeType: {
      type: Array,
      default: () => ['original', 'compressed'],
    },
    sourceType: {
      type: Array,
      default: () => ['album', 'camera'],
    },
    mediaType: {
      type: Array,
      default: () => ['image', 'video', 'mix'],
    },
    imageType: {
      type: Array,
      default: () => [],
    },
    camera: {
      type: String,
      default: 'back',
    },
    timeout: { type: [Number, String], default: 1e3 * 30 },
    // defaultFileList: { type: Array, default: () => new Array<FileItem>() },
    fileList: { type: Array, default: () => [] },
    isPreview: { type: Boolean, default: true },
    // picture、list
    listType: { type: String, default: 'picture' },
    isDeletable: { type: Boolean, default: true },
    method: { type: String, default: 'post' },
    capture: { type: Boolean, default: false },
    maximize: { type: [Number, String], default: Number.MAX_VALUE },
    maximum: { type: [Number, String], default: 9 },
    clearInput: { type: Boolean, default: true },
    accept: { type: String, default: '*' },
    headers: { type: Object, default: {} },
    data: { type: Object, default: {} },
    xhrState: { type: [Number, String], default: 200 },
    multiple: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
    autoUpload: { type: Boolean, default: true },
    maxDuration: { type: Number, default: 10 },
    beforeXhrUpload: {
      type: Function,
      default: null,
    },
    beforeDelete: {
      type: Function,
      default: (file, files) => {
        return true
      },
    },
    onChange: { type: Function },
  },
  emits: [
    'start',
    'progress',
    'oversize',
    'success',
    'failure',
    'change',
    'delete',
    'update:fileList',
    'file-item-click',
    'image-type-error',
  ],
  setup(props, { emit }) {
    const fileList = reactive(props.fileList)
    let uploadQueue = []
    const classes = computed(() => {
      const prefixCls = componentName
      return {
        [prefixCls]: true,
      }
    })
    const chooseImage = () => {
      if (props.disabled) {
        return
      }
      if (Taro.getEnv() == 'WEB') {
        let el = document.getElementById('taroChooseImage')
        if (el) {
          el == null ? void 0 : el.setAttribute('accept', props.accept)
        } else {
          const obj = document.createElement('input')
          obj.setAttribute('type', 'file')
          obj.setAttribute('id', 'taroChooseImage')
          obj.setAttribute('accept', props.accept)
          obj.setAttribute(
            'style',
            'position: fixed; top: -4000px; left: -3000px; z-index: -300;',
          )
          document.body.appendChild(obj)
        }
      }
      if (Taro.getEnv() == 'WEAPP') {
        // 上传文件类型
        if (props.mediaType.includes('file')) {
          wx.chooseMessageFile({
            /** 最多可以选择的文件个数 */
            count: props.multiple
              ? props.maximum * 1 - props.fileList.length
              : 1,
            type: 'file',
            /** 接口调用失败的回调函数 */
            fail: (res) => {
              emit('failure', res)
            },
            /** 接口调用成功的回调函数 */
            success: onChangeFile,
          })
        } else {
          Taro.chooseMedia({
            /** 最多可以选择的文件个数 */
            count: props.multiple
              ? props.maximum * 1 - props.fileList.length
              : 1,
            /** 文件类型 */
            mediaType: props.mediaType,
            /** 图片和视频选择的来源 */
            sourceType: props.sourceType,
            /** 拍摄视频最长拍摄时间，单位秒。时间范围为 3s 至 30s 之间 */
            maxDuration: props.maxDuration,
            /** 仅对 mediaType 为 image 时有效，是否压缩所选文件 */
            sizeType: [],
            /** 仅在 sourceType 为 camera 时生效，使用前置或后置摄像头 */
            camera: props.camera,
            /** 接口调用失败的回调函数 */
            fail: (res) => {
              emit('failure', res)
            },
            /** 接口调用成功的回调函数 */
            success: onChangeMedia,
          })
        }
      } else {
        Taro.chooseImage({
          // 选择数量
          count: props.multiple ? props.maximum * 1 - props.fileList.length : 1,
          // 可以指定是原图还是压缩图，默认二者都有
          sizeType: props.sizeType,
          sourceType: props.sourceType,
          success: onChangeImage,
          fail: (res) => {
            emit('failure', res)
          },
        })
      }
    }
    const onChangeMedia = (res) => {
      const { type, tempFiles } = res
      const _files = filterFiles(tempFiles)
      readFile(_files)
      emit('change', {
        fileList,
      })
    }
    const onChangeFile = (res) => {
      const { type, tempFiles } = res
      const _files = filterFiles(tempFiles)
      readFile(_files)
      emit('change', {
        fileList,
      })
    }
    const onChangeImage = (res) => {
      const { tempFilePaths, tempFiles } = res
      const _files = filterFiles(tempFiles)
      readFile(_files)
      emit('change', {
        fileList,
      })
    }
    const fileItemClick = (fileItem) => {
      emit('file-item-click', { fileItem })
    }
    const executeUpload = (fileItem, index) => {
      const uploadOption = new UploadOptions()
      uploadOption.name = props.name
      uploadOption.url = props.url
      uploadOption.fileType = fileItem.type
      uploadOption.formData = fileItem.formData
      uploadOption.timeout = props.timeout * 1
      uploadOption.method = props.method
      uploadOption.xhrState = props.xhrState
      uploadOption.method = props.method
      uploadOption.headers = props.headers
      uploadOption.taroFilePath = fileItem.path
      uploadOption.beforeXhrUpload = props.beforeXhrUpload
      uploadOption.onStart = (option) => {
        fileItem.status = 'ready'
        fileItem.message = translate('readyUpload')
        clearUploadQueue(index)
        emit('start', option)
      }
      uploadOption.onProgress = (event, option) => {
        fileItem.status = 'uploading'
        fileItem.message = translate('uploading')
        fileItem.percentage = event.progress
        emit('progress', { event, option, percentage: fileItem.percentage })
      }
      uploadOption.onSuccess = (data, option) => {
        fileItem.status = 'success'
        fileItem.message = translate('success')
        emit('success', {
          data,
          responseText: data,
          option,
          fileItem,
        })
        emit('update:fileList', fileList)
      }
      uploadOption.onFailure = (data, option) => {
        fileItem.status = 'error'
        fileItem.message = translate('error')
        emit('failure', {
          data,
          responseText: data,
          option,
          fileItem,
        })
      }
      let task = new UploaderTaro(uploadOption)
      if (props.autoUpload) {
        task.uploadTaro(Taro.uploadFile, Taro.getEnv())
      } else {
        uploadQueue.push(
          new Promise((resolve, reject) => {
            resolve(task)
          }),
        )
      }
    }
    const clearUploadQueue = (index = -1) => {
      if (index > -1) {
        uploadQueue.splice(index, 1)
      } else {
        uploadQueue = []
        fileList.splice(0, fileList.length)
      }
    }
    const submit = () => {
      Promise.all(uploadQueue).then((res) => {
        res.forEach((i) => i.uploadTaro(Taro.uploadFile, Taro.getEnv()))
      })
    }
    const readFile = (files) => {
      files.forEach((file, index) => {
        var _a, _b
        let fileType = file.type
        let filepath = file.tempFilePath || file.path
        const fileItem = reactive(new FileItem())
        if (file.fileType) {
          fileType = file.fileType
        } else {
          const imgReg = /\.(png|jpeg|jpg|webp|gif)$/i
          if (
            !fileType &&
            (imgReg.test(filepath) || filepath.includes('data:image'))
          ) {
            fileType = 'image'
          }
        }
        fileItem.path = filepath
        fileItem.name = file.name ? file.name : filepath
        fileItem.status = 'ready'
        fileItem.message = translate('waitingUpload')
        fileItem.type = fileType
        if (Taro.getEnv() == 'WEB') {
          const formData = new FormData()
          for (const [key, value] of Object.entries(props.data)) {
            formData.append(key, value)
          }
          formData.append(props.name, file.originalFileObj)
          fileItem.name = (_a = file.originalFileObj) == null ? void 0 : _a.name
          fileItem.type = (_b = file.originalFileObj) == null ? void 0 : _b.type
          fileItem.formData = formData
        } else {
          fileItem.formData = props.data
        }
        if (props.isPreview) {
          fileItem.url = fileType == 'video' ? file.thumbTempFilePath : filepath
        }
        fileList.push(fileItem)
        executeUpload(fileItem, index)
      })
    }
    const filterFiles = (files) => {
      const maximum = props.maximum * 1
      const maximize = props.maximize * 1
      const oversizes = new Array()
      files = files.filter((file) => {
        if (Taro.getEnv() != 'WEAPP') {
          file.type = file.originalFileObj.name.split('.').pop()
        } else {
          file.type = file.tempFilePath.split('.').pop()
        }
        if (file.size > maximize) {
          oversizes.push(file)
          return false
        } else if (!props.imageType.includes(file.type)) {
          // 控制文件类型上传
          emit('image-type-error', file.type)
          return false
        } else {
          return true
        }
      })
      if (oversizes.length) {
        emit('oversize', oversizes)
      }
      let currentFileLength = files.length + fileList.length
      if (currentFileLength > maximum) {
        files.splice(files.length - (currentFileLength - maximum))
      }
      return files
    }
    const deleted = (file, index) => {
      fileList.splice(index, 1)
      emit('delete', {
        file,
        fileList,
        index,
      })
    }
    const onDelete = (file, index) => {
      clearUploadQueue(index)
      funInterceptor(props.beforeDelete, {
        args: [file, fileList],
        done: () => deleted(file, index),
      })
    }
    return {
      onDelete,
      fileList,
      classes,
      chooseImage,
      fileItemClick,
      clearUploadQueue,
      submit,
    }
  },
})
const _hoisted_1 = {
  key: 0,
  class: 'nut-uploader__slot',
}
const _hoisted_2 = {
  key: 0,
  class: 'nut-uploader__preview-img',
}
const _hoisted_3 = {
  key: 0,
  class: 'nut-uploader__preview__progress',
}
const _hoisted_4 = { class: 'nut-uploader__preview__progress__msg' }
const _hoisted_5 = ['onClick']
const _hoisted_6 = ['onClick', 'src']
const _hoisted_7 = {
  key: 3,
  class: 'nut-uploader__preview-img__file',
}
const _hoisted_8 = ['onClick']
const _hoisted_9 = { class: 'file__name_tips' }
const _hoisted_10 = { class: 'tips' }
const _hoisted_11 = {
  key: 1,
  class: 'nut-uploader__preview-list',
}
const _hoisted_12 = ['onClick']
const _hoisted_13 = { class: 'file__name_tips' }
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_nut_button = resolveComponent('nut-button')
  const _component_Failure = resolveComponent('Failure')
  const _component_Loading = resolveComponent('Loading')
  const _component_Link = resolveComponent('Link')
  const _component_Del = resolveComponent('Del')
  const _component_nut_progress = resolveComponent('nut-progress')
  const _component_Photograph = resolveComponent('Photograph')
  return (
    openBlock(),
    createElementBlock(
      'view',
      {
        class: normalizeClass(_ctx.classes),
      },
      [
        _ctx.$slots.default
          ? (openBlock(),
            createElementBlock('view', _hoisted_1, [
              renderSlot(_ctx.$slots, 'default'),
              createTextVNode(),
              Number(_ctx.maximum) - _ctx.fileList.length
                ? (openBlock(),
                  createBlock(
                    _component_nut_button,
                    {
                      key: 0,
                      class: 'nut-uploader__input',
                      onClick: _ctx.chooseImage,
                    },
                    null,
                    8,
                    ['onClick'],
                  ))
                : createCommentVNode('', true),
            ]))
          : createCommentVNode('', true),
        createTextVNode(),
        (openBlock(true),
        createElementBlock(
          Fragment,
          null,
          renderList(_ctx.fileList, (item, index) => {
            return (
              openBlock(),
              createElementBlock(
                'view',
                {
                  class: normalizeClass([
                    'nut-uploader__preview',
                    [_ctx.listType],
                  ]),
                  key: item.uid,
                },
                [
                  _ctx.listType == 'picture' && !_ctx.$slots.default
                    ? (openBlock(),
                      createElementBlock('view', _hoisted_2, [
                        item.status != 'success'
                          ? (openBlock(),
                            createElementBlock('view', _hoisted_3, [
                              item.status != 'ready'
                                ? (openBlock(),
                                  createElementBlock(
                                    Fragment,
                                    { key: 0 },
                                    [
                                      item.status == 'error'
                                        ? (openBlock(),
                                          createBlock(_component_Failure, {
                                            key: 0,
                                            color: '#fff',
                                          }))
                                        : (openBlock(),
                                          createBlock(_component_Loading, {
                                            key: 1,
                                            name: 'loading',
                                            color: '#fff',
                                          })),
                                    ],
                                    64,
                                  ))
                                : createCommentVNode('', true),
                              createTextVNode(),
                              createElementVNode(
                                'view',
                                _hoisted_4,
                                toDisplayString(item.message),
                                1,
                              ),
                            ]))
                          : createCommentVNode('', true),
                        createTextVNode(),
                        _ctx.isDeletable
                          ? (openBlock(),
                            createElementBlock(
                              'view',
                              {
                                key: 1,
                                class: 'close',
                                onClick: ($event) => _ctx.onDelete(item, index),
                              },
                              [
                                renderSlot(
                                  _ctx.$slots,
                                  'delete-icon',
                                  {},
                                  () => [createVNode(_component_Failure)],
                                ),
                              ],
                              8,
                              _hoisted_5,
                            ))
                          : createCommentVNode('', true),
                        createTextVNode(),
                        ['image', 'video'].includes(item.type) && item.url
                          ? (openBlock(),
                            createElementBlock(
                              'img',
                              {
                                key: 2,
                                class: 'nut-uploader__preview-img__c',
                                mode: 'aspectFit',
                                onClick: ($event) => _ctx.fileItemClick(item),
                                src: item.url,
                              },
                              null,
                              8,
                              _hoisted_6,
                            ))
                          : (openBlock(),
                            createElementBlock('view', _hoisted_7, [
                              createElementVNode(
                                'view',
                                {
                                  class:
                                    'nut-uploader__preview-img__file__name',
                                  onClick: ($event) => _ctx.fileItemClick(item),
                                },
                                [
                                  createElementVNode(
                                    'view',
                                    _hoisted_9,
                                    toDisplayString(item.name),
                                    1,
                                  ),
                                ],
                                8,
                                _hoisted_8,
                              ),
                            ])),
                        createTextVNode(),
                        createElementVNode(
                          'view',
                          _hoisted_10,
                          toDisplayString(item.name),
                          1,
                        ),
                      ]))
                    : _ctx.listType == 'list'
                    ? (openBlock(),
                      createElementBlock('view', _hoisted_11, [
                        createElementVNode(
                          'view',
                          {
                            class: normalizeClass([
                              'nut-uploader__preview-img__file__name',
                              [item.status],
                            ]),
                            onClick: ($event) => _ctx.fileItemClick(item),
                          },
                          [
                            createVNode(_component_Link, {
                              class: 'nut-uploader__preview-img__file__link',
                            }),
                            createTextVNode(),
                            createElementVNode(
                              'view',
                              _hoisted_13,
                              toDisplayString(item.name),
                              1,
                            ),
                            createTextVNode(),
                            _ctx.isDeletable
                              ? (openBlock(),
                                createBlock(
                                  _component_Del,
                                  {
                                    key: 0,
                                    color: '#808080',
                                    class:
                                      'nut-uploader__preview-img__file__del',
                                    onClick: ($event) =>
                                      _ctx.onDelete(item, index),
                                  },
                                  null,
                                  8,
                                  ['onClick'],
                                ))
                              : createCommentVNode('', true),
                          ],
                          10,
                          _hoisted_12,
                        ),
                        createTextVNode(),
                        item.status == 'uploading'
                          ? (openBlock(),
                            createBlock(
                              _component_nut_progress,
                              {
                                key: 0,
                                size: 'small',
                                percentage: item.percentage,
                                'stroke-color':
                                  'linear-gradient(270deg, rgba(18,126,255,1) 0%,rgba(32,147,255,1) 32.815625%,rgba(13,242,204,1) 100%)',
                                'show-text': false,
                              },
                              null,
                              8,
                              ['percentage'],
                            ))
                          : createCommentVNode('', true),
                      ]))
                    : createCommentVNode('', true),
                ],
                2,
              )
            )
          }),
          128,
        )),
        createTextVNode(),
        _ctx.listType == 'picture' &&
        !_ctx.$slots.default &&
        Number(_ctx.maximum) - _ctx.fileList.length
          ? (openBlock(),
            createElementBlock(
              'view',
              {
                key: 1,
                class: normalizeClass([
                  'nut-uploader__upload',
                  [_ctx.listType],
                ]),
              },
              [
                renderSlot(_ctx.$slots, 'upload-icon', {}, () => [
                  createVNode(_component_Photograph, { color: '#808080' }),
                ]),
                createTextVNode(),
                createVNode(
                  _component_nut_button,
                  {
                    class: normalizeClass([
                      'nut-uploader__input',
                      { disabled: _ctx.disabled },
                    ]),
                    onClick: _ctx.chooseImage,
                  },
                  null,
                  8,
                  ['class', 'onClick'],
                ),
              ],
              2,
            ))
          : createCommentVNode('', true),
      ],
      2,
    )
  )
}
const index_taro = /* @__PURE__ */ _export_sfc(_sfc_main, [
  ['render', _sfc_render],
])
export { index_taro as default }
