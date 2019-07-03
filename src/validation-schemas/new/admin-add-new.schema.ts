import Joi from '@hapi/joi';

const AdminAddNew = Joi.object().keys(
  {
    title: Joi.string().required(),
    content: Joi.string().required(),
    cate: Joi.number().required(),
    image: Joi.string().required(),
    description: Joi.string().required(),
    metaTitle: Joi.string(),
    metaDescription: Joi.string(),
    metaType: Joi.string(),
    metaUrl: Joi.string(),
    metaImage: Joi.string(),
    canonical: Joi.string(),
    textEndPage: Joi.string(),
    createdByType: Joi.number()
  }
);

export default AdminAddNew;