import Joi from '@hapi/joi';

const addressInfoSchema = Joi.object().keys({
  name: Joi.string().required().min(3),
  phone: Joi.string().required().min(10).max(11).regex(/^[0-9]*$/),
  address: Joi.string().required(),
  longitude: Joi.number().required(),
  latitude: Joi.number().required(),
  deliveryTime: Joi.date().required(),
  note: Joi.string()
});

const orderItemSchema = Joi.object().keys({
  productId: Joi.string().required(),
  quantity: Joi.number().required()
});

const SubmitNoLoginOrderValidationSchema = Joi.object().keys({
  addressInfo: addressInfoSchema,
  items: Joi.array(orderItemSchema)
});

export default SubmitNoLoginOrderValidationSchema;