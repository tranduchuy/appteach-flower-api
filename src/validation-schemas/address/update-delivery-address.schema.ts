import Joi from '@hapi/joi';

const AddAddressValidationSchema = Joi.object().keys({
      name: Joi.string().min(3),
      phone: Joi.string().min(10).max(11).regex(/^[0-9]*$/),
      city: Joi.string(),
      district: Joi.number(),
      ward: Joi.number(),
      address: Joi.string()
    }
);

export default AddAddressValidationSchema;