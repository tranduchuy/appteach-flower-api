import Joi from '@hapi/joi';
import { Status } from '../../constant/status';

const AdminUpdateNew = Joi.object().keys(
  {
    title: Joi.string(),
    content: Joi.string(),
    status: Joi.number().valid([Status.BLOCKED, Status.ACTIVE, Status.DELETE]),
    cate: Joi.number(),
    image: Joi.string(),
    description: Joi.string(),
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

export default AdminUpdateNew;