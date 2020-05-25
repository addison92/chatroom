/**
 * 验证邮箱
 * @type {Array}
 */
export const emailInput = [{
  required: true,
  type: 'email',
  message: '请输入正确的邮箱地址',
  trigger: 'blur'
}, ];

/**
 * 验证手机号
 * @type {Array}
 */
export const phoneNumInput = (message, ev = "blur") =>  [{
    required: false,
    message: message,
    trigger: ev
  },
  {
    pattern: /^1\d{10}$/ || /^[0-9]*$/,
    message: '手机号格式不正确',
    trigger: 'blur'
  }
];
/**
 * 验证固定电话
 * @type {Array}
 */
export const telephoneNumInput = (message, ev = "blur") => [{
    required: true,
    message: '请输入固定电话',
    trigger: 'blur'
  },
  {
    pattern: /^0\d{2,3}-\d{7,8}(-\d{1,6})?$/,
    message: '固定电话格式不正确 格式示例：021-1234567',
    trigger: 'blur'
  }
];

/**
 * 短信验证码验证
 * @type {Array}
 */
export const verifyCodeInput = [{
    required: true,
    message: '请输入验证码',
    trigger: 'blur'
  },
  {
    len: 6,
    message: '验证码格式不正确',
    trigger: 'blur'
  },
];

/**
 * 密码验证
 * @type {Array}
 */
export const passwordInput = [

  {
    required: true,
    message: '请输入密码',
    trigger: 'blur'
  },
  {
    min: 6,
    message: '密码长度不小于6位',
    trigger: 'blur'
  }
]

/**
 * 修改密码
 * @type {Array}
 */
export const resetPasswordInput= (message, ev = "blur") =>  [{
    required: true,
    message:message,
    trigger:ev
  },
  {
    pattern: /^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).([A-Z]|[a-z]|[0-9]|[,./!@#$%^&]){5,19}$/,
    message: '密码格式有误',
    trigger: 'blur'
  }
]

/**
 * 咨询原文链接
 * @type {Array}
 */
export const infomationLinkInput = [{
    required: true,
    message: '请输入原文链接',
    trigger: 'blur'
  },
  {
    min: 1,
    max: 300,
    message: "300个字符以内",
    trigger: "blur"
  },
  {
    type: "url",
    message: '链接格式不正确',
    trigger: 'blur'
  }
]

/**
 * [校验是否必传]
 * @param  {[type]} message [description]
 * @return {[type]}         [description]
 */
export const requireInput = (message, ev = "blur") => [{
    required: true,
    message: message,
    trigger: ev
  },
  {
    pattern: /^[^'"<>%\\]+$/,
    message: '不能含有特殊字符',
    trigger: 'blur'
  }
]

/**
 *  * [校验是否必传]
 * @param  {[type]} message [description]
 * @return {[type]}         [description]
 */
export const requireInputWithMaxLength = (message, min = 0, max = 15, ev = "blur") => [{
    required: true,
    message: message,
    trigger: ev
  },
  {
    min: min,
    max: max,
    message: `只能输入${min}到${max}个字符`,
    trigger: ev
  },
  {
    pattern: /^[^'"<>%\\]+$/,
    message: '不能含有特殊字符',
    trigger: ev
  }
]

/**
 *  * [校验是否必传]
 * @param  {[type]} message [description]
 * @return {[type]}         [description]
 */
export const requireInputWithMaxLengthNoRules = (message, min = 0, max = 15, ev = "blur") => [{
    required: true,
    message: message,
    trigger: ev
  },
  {
    min: min,
    max: max,
    message: `只能输入${min}到${max}个字符`,
    trigger: ev
  }
]

/**
 *  * [校验字符长度，非必传]
 * @param  {[type]} message [description]
 * @return {[type]}         [description]
 */
export const requireInputWithMaxLengthN = (min = 0, max = 15, ev = "blur") => [{
    min: min,
    max: max,
    message: `只能输入${min}到${max}个字符`,
    trigger: ev
  },
  {
    pattern: /^[^'"<>%\\]+$/,
    message: '不能含有特殊字符',
    trigger: ev
  }
]

//校验身份证
export const idCard = (message,ev = "blur") => [
  {
    required: true,
    message: message,
    trigger: ev
  }, {
  pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9xX]$/,
  message: '请填写正确的身份证',
  trigger: 'blur'
}]

// 校验0-20正整数
export const number20 = (ev = "blur") => [{
  pattern: /^([1][0-9]|20|[1-9])$/,
  message: '请填写0-20的正整数',
  trigger: 'blur'
}]

// 校验0-100正整数
export const number100 = (message,ev = "blur") => [
  {
    required: false,
    message: message,
    trigger: ev
  },{
  pattern: /^(1|[1-9]\d{0,1}|100)$/,
  message: '请填写0-100的正整数',
  trigger: 'blur'
}]

// 校验正整数
export const isPositive = (message, ev = "blur") => [{
  required: true,
  message: message,
  trigger: ev
}, {
  pattern: /(^[1-9]\d*$)/,
  message: '请填写正整数',
  trigger: 'blur'
}]

//校验带http的网址


/**
日期验证
 */
// export const validateDate = (rule, value, callback) => {
//   let num = new Date(this.searchObj.startTime).getTime() - new Date(this.searchObj.endTime).getTime();
//   if (num > 0) {
//       callback(new Error('开始时间不能超过结束时间'));
//   } else if (value == "") {
//       callback(new Error('请选择结束时间'));
//   } else {
//       callback();
//   }
// };



/**
 * [校验是否必传]
 * @param  {[type]} message [description]
 * @return {[type]}         [description]
 */
export const requireTextarea = (message, ev = "blur") => [{
  required: true,
  message: message,
  trigger: ev
}]

export const require = (message, ev = "blur") => [{
  required: true,
  message: message,
  trigger: ev
},
]

export const LengthN = (min = 0, max = 15, ev = "blur") => [{
  min: min,
  max: max,
  message: `只能输入${min}到${max}个字符`,
  trigger: ev
},
]

