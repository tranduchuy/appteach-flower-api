import Joi from '@hapi/joi';

const SubmitOrderValidationSchema = Joi.object().keys({
      address: Joi.string().required(),
      deliveryTime: Joi.date().required(),
      note: Joi.string()
    }
);

export default SubmitOrderValidationSchema;