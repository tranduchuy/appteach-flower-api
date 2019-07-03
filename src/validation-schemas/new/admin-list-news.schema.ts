import Joi from '@hapi/joi';
const AdminListNewSchema = Joi.object().keys(
  {
    _id: Joi.string(),
    limit: Joi.number().integer().min(5).max(200),
    page: Joi.number().integer().min(1),
    title: Joi.string(),
    dateFrom: Joi.string(),
    dateTo: Joi.string(),
    status: Joi.number(),
    createdByType: Joi.string(),
    sortBy: Joi.string().max(50),
    sortDirection: Joi.string().valid('asc', 'desc')
  }
);

export default AdminListNewSchema;