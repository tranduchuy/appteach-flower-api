export const addHandleMessageFunction = (ruleObj: Object, customFieldName = {}) => {
  for (const key in ruleObj) {
    if (ruleObj.hasOwnProperty(key)) {
      ruleObj[key] = mapMsg(customFieldName[key] || key, ruleObj[key]);
    }
  }

  return ruleObj;
};

export const mapMsg = (fielName: string, validateRules: any) => {
  return validateRules.error(errors => customMessage(fielName, errors));
};

export const customMessage = (fieldName: string, errors: any[]) => {
  errors.forEach(err => {
    switch (err.type) {
      case 'array.includesOne':
        err.message = customMessage(fieldName + ' thứ ' + err.path[1], err.context.reason);
        break;

      case 'array.min':
        err.message = `'${fieldName}' cần có ít nhất ${err.context.limit} phần tử`;
        break;

      case 'any.required':
        err.message = `'${fieldName}' là thông tin bắt buộc`;
        break;
      case 'any.empty':
        err.message = `'${fieldName}' không được để trống`;
        break;
      case 'any.allowOnly':
        err.message = `'${fieldName}' không thuộc giá trị cho phép ${JSON.stringify(err.context.valids)}`;
        break;

      case 'number.base':
        err.message = `'${fieldName}' phải là số`;
        break;

      case 'string.base':
        err.message = `'${fieldName}' phải là chuỗi`;
        break;
      case 'string.min':
        err.message = `'${fieldName}' cần có ít nhất ${err.context.limit} kí tự`;
        break;
      case 'string.max':
        err.message = `'${fieldName}' nên có ít hơn ${err.context.limit} kí tự`;
        break;

      case 'boolean.base':
        err.message = `'${fieldName}' nên có định dạng boolean true|false`;
        break;

      case 'date.base':
        err.message = `'${fieldName}' phải có định dạng ngày hợp lệ, hoặc là một số (milisecond)`;
      default:
        break;
    }
  });

  return errors;
};
