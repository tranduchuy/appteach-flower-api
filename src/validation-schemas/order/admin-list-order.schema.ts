import Joi from '@hapi/joi';
import { Status } from '../../constant/status';

const ListOrderSchema = Joi.object().keys(
  {
    code: Joi.string(),
    limit: Joi.number().integer().min(5).max(200),
    page: Joi.number().integer().min(1),
    status: Joi.number().valid([Status.ORDER_NOT_YET_PAID, Status.ORDER_PAID, Status.ORDER_CANCEL]),
    sortBy: Joi.string().max(50),
    sortDirection: Joi.string().valid('ASC', 'DESC')
  }
);

export default ListOrderSchema;
