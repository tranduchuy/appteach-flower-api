import Joi from '@hapi/joi';
import { Status } from '../../constant/status';
import { addHandleMessageFunction } from '../../utils/custom-joi-message';

const customFieldName = {
    title: 'Tên sản phẩm',
    images: 'Hình ảnh',
    description: 'Mô tả',
    originalPrice: 'Giá gốc',
    salePrice: 'Giá giảm',
    attributeValues: 'Thuộc tính sản phẩm',
    status: 'Trạng thái sản phẩm',
    freeShip: 'Miễn phí ship',
    saleActive: 'Kích hoạt giảm giá',
    startDate: 'Ngày bắt đầu giảm giá',
    endDate: 'Ngày kết thúc giảm giá'
};

const rules = {
  title: Joi.string()
    .required()
    .min(3),
  images: Joi.array().required().items(Joi.string()),
  //   sku: Joi.string().min(3).regex(/^[a-zA-Z0-9]*$/),
  description: Joi.string()
    .required()
    .min(3)
    .max(3000),
  originalPrice: Joi.number()
    .required()
    .min(0),

  // price
  salePrice: Joi.number().min(0),
  saleActive: Joi.boolean(),
  startDate: Joi.date(),
  endDate: Joi.date(),

  attributeValues: Joi.array()
    .min(1)
    .items(Joi.number())
    .required(),
  //   topic: Joi.number().required(),
  //   design: Joi.number(),
  //   specialOccasion: Joi.number(),
  //   floret: Joi.number(),
  //   color: Joi.number(),

  //   city: Joi.string(),
  //   district: Joi.number(),
  //   seoUrl: Joi.string(),
  //   seoDescription: Joi.string(),
  //   seoImage: Joi.string(),
  keywordList: Joi.array().items(Joi.string()),
  status: Joi.number().valid([Status.ACTIVE, Status.PRODUCT_HIDDEN]),
  freeShip: Joi.boolean()
};

const AddNewValidationSchema = Joi.object().keys(addHandleMessageFunction(rules, customFieldName));

export default AddNewValidationSchema;
