import Joi from '@hapi/joi';

const AddAddressValidationSchema = Joi.object().keys({
      name: Joi.string().required().min(3),
      phone: Joi.string().required().min(10).max(11).regex(/^[0-9]*$/),
      city: Joi.string().required(),
      district: Joi.number().required(),
      ward: Joi.number().required(),
      address: Joi.string().required()
    }
);

export default AddAddressValidationSchema;