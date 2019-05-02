import Joi from '@hapi/joi';

const ForgetPasswordValidationSchema = Joi.object().keys({
      email: Joi.string().required().max(100).email()
    }
);

export default ForgetPasswordValidationSchema;