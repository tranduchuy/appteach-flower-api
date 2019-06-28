import Joi from '@hapi/joi';

const GetOrderShippingCostValidationSchema = Joi.object().keys({
      addressId: Joi.string().required()
    }
);

export default GetOrderShippingCostValidationSchema;