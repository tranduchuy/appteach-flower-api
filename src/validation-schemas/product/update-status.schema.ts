import Joi from '@hapi/joi';
import { General } from "../../constant/generals";
import ProductStatus = General.ProductStatus;

const productStatus = Object.keys(ProductStatus).map(key => {
  return ProductStatus[key];
});
const UpdateStatusValidationSchema = Joi.object().keys({
      status: Joi.number().required().valid(productStatus)
    }
);

export default UpdateStatusValidationSchema;