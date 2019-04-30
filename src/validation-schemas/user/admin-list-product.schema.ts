import Joi from '@hapi/joi';

const ListProductSchema = Joi.object().keys(
  {
    shop_id: Joi.string(),
    product_name: Joi.string(),
    limit: Joi.number().integer().min(5).max(200),
    page: Joi.number().integer().min(1),
    status: Joi.number(),
    sb: Joi.string().max(50),
    sd: Joi.string().valid('asc', 'desc')
  }
);

export default ListProductSchema;