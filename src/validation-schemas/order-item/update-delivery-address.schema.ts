import Joi from '@hapi/joi';

const UpdateOrderItemValidationSchema = Joi.object().keys({
      quantity: Joi.number().min(1).required(),
    }
);

export default UpdateOrderItemValidationSchema;