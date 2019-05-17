import Joi from '@hapi/joi';

const CheckDate = Joi.object().keys(
  {
    startDate: Joi.date().required(),
    endDate: Joi.date().required()
  }
);

export default CheckDate;