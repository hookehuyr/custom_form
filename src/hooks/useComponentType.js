import _ from '@/utils/lodash'
import TextField from '@/components/TextField/index.vue'
import TextareaField from '@/components/TextareaField/index.vue'
// import RadioField from '@/components/RadioField/index.vue'
// import CheckboxField from '@/components/CheckboxField/index.vue'
// import PickerField from '@/components/PickerField/index.vue'
// import AreaPickerField from '@/components/AreaPickerField/index.vue'
// import DatePickerField from '@/components/DatePickerField/index.vue'
// import TimePickerField from '@/components/TimePickerField/index.vue'
// import DateTimePickerField from '@/components/DateTimePickerField/index.vue'
// import ImageUploaderField from '@/components/ImageUploaderField/index.vue'
// import FileUploaderField from '@/components/FileUploaderField/index.vue'
// import PhoneField from '@/components/PhoneField/index.vue'
// import EmailField from '@/components/EmailField/index.vue'
// import SignField from '@/components/SignField/index.vue'
// import RatePickerField from '@/components/RatePickerField/index.vue'
// import CalendarField from '@/components/CalendarField/index.vue'
// import IdentityField from '@/components/IdentityField/index.vue'
// import NumberField from '@/components/NumberField/index.vue'
// import DesField from '@/components/DesField/index.vue'
// import DividerField from '@/components/DividerField/index.vue'
// import VideoField from '@/components/VideoField/index.vue'
// import MarqueeField from '@/components/MarqueeField/index.vue'
// import ContactField from '@/components/ContactField/index.vue'
// import RuleField from '@/components/RuleField/index.vue'
// import MultiRuleField from '@/components/MultiRuleField/index.vue'
// import ButtonField from '@/components/ButtonField/index.vue'
// import NoteField from '@/components/NoteField/index.vue'
// import NameField from '@/components/NameField/index.vue'
// import GenderField from '@/components/GenderField/index.vue'

/**
 * 生成自定义组件类型
 * @param {*} data
 * @type input 单行文本 TextField
 * @type textarea 多行文本 TextareaField
 * @type radio 单项选择 RadioField
 * @type checkbox 多项选择 CheckboxField
 * @type select 单列选择器 PickerField
 * @type area_picker 地址选择器 AreaPickerField
 * @type date_picker 日期选择器 DatePickerField
 * @type time_picker 时间选择器 TimePickerField
 * @type datetime_picker 日期时间选择器 DateTimePickerField
 * @type image_uploader 图片上传 ImageUploaderField
 * @type phone 手机输入框 PhoneField
 * @type email 邮箱输入框 EmailField
 * @type sign 电子签名输入框 SignField
 * @type rate_picker 评分选择器 RatePickerField
 * @type calendar 日历选择器 CalendarField
 * @type id_code 身份证输入框 IdentityField
 * @type desc 文字描述 DesField
 * @type divider 分割线 DividerField
 * @type video 视频控件 VideoField
 * @type marquee 跑马灯控件 MarqueeField
 * @type rule 活动规则控件 RuleField
 * @type multi_rule 活动规则控件 MultiRuleField
 * @type note 富文本控件 NoteField
 * @type name 姓名控件 NameField
 * @type gender 性别控件 GenderField
 */
export function createComponentType(data) {
  // 判断类型和使用组件
  _.each(data, (item, index) => {
    // 必填项规则添加
    if (item.component_props.required) {
      item.rules = [
        {
          required: true,
          message: item.placeholder ? item.placeholder : '必填项不能为空',
        },
      ]
    }
    if (item.component_props.tag === 'input') {
      item.type = 'text'
      item.name = item.key
      item.component = TextField
    }
    if (item.component_props.tag === 'textarea') {
      item.type = 'textarea'
      item.name = item.key
      item.component = TextareaField
    }
    // if (item.component_props.tag === 'number') {
    //   item.name = item.key
    //   item.component = NumberField
    // }
    // if (item.component_props.tag === 'radio') {
    //   item.component = RadioField
    // }
    // if (item.component_props.tag === 'checkbox') {
    //   item.component = CheckboxField
    // }
    // if (item.component_props.tag === 'select') {
    //   item.component = PickerField
    // }
    // if (item.component_props.tag === 'address') {
    //   item.component = AreaPickerField
    // }
    // if (item.component_props.tag === 'date') {
    //   item.component = DatePickerField
    // }
    // if (item.component_props.tag === 'time') {
    //   item.component = TimePickerField
    // }
    // if (item.component_props.tag === 'datetime') {
    //   item.component = DateTimePickerField
    // }
    // if (item.component_props.tag === 'image_uploader') {
    //   item.component = ImageUploaderField
    // }
    // if (item.component_props.tag === 'file_uploader') {
    //   item.component = FileUploaderField
    // }
    // if (item.component_props.tag === 'phone') {
    //   item.name = item.key
    //   item.component = PhoneField
    // }
    // if (item.component_props.tag === 'email') {
    //   item.name = item.key
    //   item.component = EmailField
    // }
    // if (item.component_props.tag === 'sign') {
    //   item.name = item.key
    //   item.component = SignField
    // }
    // if (item.component_props.tag === 'rate') {
    //   item.name = item.key
    //   item.component = RatePickerField
    // }
    // if (item.component_props.tag === 'calendar') {
    //   item.name = item.key
    //   item.component = CalendarField
    // }
    // if (item.component_props.tag === 'id_card') {
    //   item.name = item.key
    //   item.component = IdentityField
    // }
    // if (item.component_props.tag === 'desc') {
    //   item.name = item.key
    //   item.component = DesField
    // }
    // if (item.component_props.tag === 'divider') {
    //   item.name = item.key
    //   item.component = DividerField
    // }
    // if (item.component_props.tag === 'video') {
    //   item.name = item.key
    //   item.component = VideoField
    // }
    // if (item.component_props.tag === 'marquee') {
    //   item.name = item.key
    //   item.component = MarqueeField
    // }
    // if (item.component_props.tag === 'contact') {
    //   item.name = item.key
    //   item.component = ContactField
    // }
    // if (item.component_props.tag === 'rule') {
    //   item.name = item.key
    //   item.component = RuleField
    // }
    // if (item.component_props.tag === 'button') {
    //   item.name = item.key
    //   item.component = ButtonField
    // }
    // if (item.component_props.tag === 'multi_rule') {
    //   item.name = item.key
    //   item.value = []
    //   item.component = MultiRuleField
    // }
    // if (item.component_props.tag === 'note') {
    //   item.name = item.key
    //   item.component = NoteField
    // }
    // if (item.component_props.tag === 'name') {
    //   item.name = item.key
    //   item.component = NameField
    // }
    // if (item.component_props.tag === 'gender') {
    //   item.name = item.key
    //   item.component = GenderField
    // }
  })
}
