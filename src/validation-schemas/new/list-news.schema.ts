import Joi from '@hapi/joi';

const ListNewSchema = Joi.object().keys(
  {
    limit: Joi.number().integer().min(5).max(200),
    page: Joi.number().integer().min(1),
    cate: Joi.number().integer().min(1),
    sb: Joi.string().max(50),
    sd: Joi.string().valid('asc', 'desc')
  }
);

export default ListNewSchema;