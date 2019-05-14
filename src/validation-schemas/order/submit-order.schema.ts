import Joi from '@hapi/joi';

const SubmitOrderValidationSchema = Joi.object().keys({
      address: Joi.string(),
      deliveryTime: Joi.date(),
      note: Joi.string()
    }
);

export default SubmitOrderValidationSchema;