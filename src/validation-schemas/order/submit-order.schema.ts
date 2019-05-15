import Joi from '@hapi/joi';

const SubmitOrderValidationSchema = Joi.object().keys({
      address: Joi.string().requried(),
      deliveryTime: Joi.date(),
      note: Joi.string()
    }
);

export default SubmitOrderValidationSchema;