import Joi from '@hapi/joi';

const addressInfoSchema = Joi.object().keys({
    address: Joi.string().required(),
    longitude: Joi.number().required(),
    latitude: Joi.number().required(),
}).required();

const orderItemSchema = Joi.object().keys({
    productId: Joi.string().required()
});

const GetNoLoginOrderShippingCostValidationSchema = Joi.object().keys({
        addressInfo: addressInfoSchema,
        items: Joi.array().items(orderItemSchema).required(),
    }
);

export default GetNoLoginOrderShippingCostValidationSchema;