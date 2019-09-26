import Joi from '@hapi/joi';

const RegisterSaleNotificationSchema = Joi.object().keys({
    email: Joi.string().required().max(100).email()
});

export default RegisterSaleNotificationSchema;