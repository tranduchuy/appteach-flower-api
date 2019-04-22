import Joi from '@hapi/joi';

const AddNewValidationSchema = Joi.object().keys({
    title: Joi.string().required().min(3),
    images: Joi.array().required(),
    sku: Joi.string().required().min(3).regex(/^[a-zA-Z0-9]*$/),
    description: Joi.string().required().min(3).max(3000),
    topic: Joi.number().required(),
    originalPrice: Joi.number().required(),
    salePrice: Joi.number(),
    design: Joi.number(),
    specialOccasion: Joi.number(),
    floret: Joi.number(),
    city: Joi.string(),
    district: Joi.number(),
    color: Joi.number(),
    seoUrl: Joi.string(),
    seoDescription: Joi.string(),
    seoImage: Joi.string()
  }
);

export default AddNewValidationSchema;