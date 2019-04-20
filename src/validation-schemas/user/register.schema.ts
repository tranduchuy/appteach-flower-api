import Joi from '@hapi/joi';
const RegisterValidationSchema = Joi.object().keys({
    email: Joi.string().required().max(100).email(),
    password: Joi.string().required().min(6),
    confirmedPassword: Joi.string().required().min(6),
    phone: Joi.string().required().min(10).max(11),
    address: Joi.string().required().min(6).max(200),
    city: Joi.number(),
    district: Joi.number(),
    ward: Joi.number(),
    gender: Joi.number().required(),
    name: Joi.string().required().min(3),
    username: Joi.string().required().min(6)
    }
);

export default RegisterValidationSchema;

