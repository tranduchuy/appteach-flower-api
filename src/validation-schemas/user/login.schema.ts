import Joi from '@hapi/joi';

const LoginValidationSchema = Joi.object().keys({
      email: Joi.string().max(100).email(),
      username: Joi.string().min(6).max(100).regex(/^[a-zA-Z0-9]*$/),
      phone: Joi.string().min(10).max(11).regex(/^[0-9]*$/),
      password: Joi.string().min(6).max(100).regex(/^[a-zA-Z0-9]*$/)
    }
);

export default LoginValidationSchema;