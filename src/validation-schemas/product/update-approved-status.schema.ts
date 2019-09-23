import Joi from '@hapi/joi';
import { Status } from '../../constant/status';

const UpdateApprovedStatusValidationSchema = Joi.object().keys({
    productId: Joi.string(),
    status: Joi.number().required().valid([
      Status.PRODUCT_PENDING_APPROVE,
      Status.PRODUCT_NOT_APPROVED,
      Status.PRODUCT_APPROVED
    ])
  }
);

export default UpdateApprovedStatusValidationSchema;
