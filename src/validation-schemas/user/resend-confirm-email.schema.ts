import Joi from '@hapi/joi';

const ResendConfirm = Joi.object().keys(
  {
    email: Joi.string().required().max(100).email()
  }
);

export default ResendConfirm;