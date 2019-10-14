import Joi from '@hapi/joi';

const shopShipAddress = Joi.object().keys({
    city: Joi.string().required(),
    district: Joi.number()
});

const RegisterShopValidationSchema = Joi.object().keys({
    name: Joi.string().required(),
    slug: Joi.string().required(),
    images: Joi.array().required().items(Joi.string()),
    availableShipCountry: Joi.boolean().required(),
    address: Joi.string().min(6).max(200),
    availableShipAddresses: Joi.array().items(shopShipAddress),
    longitude: Joi.number().required(),
    latitude: Joi.number().required()
  }
);

export default RegisterShopValidationSchema;

