import Joi from '@hapi/joi';

const LoginValidationSchema = Joi.object().keys({
    email: Joi.string().max(100),
    username: Joi.string().min(6).max(100).regex(/^[a-zA-Z0-9]*$/),
    password: Joi.string().min(6).max(100).regex(/^[a-zA-Z0-9]*$/)
  }
);

export default LoginValidationSchema;