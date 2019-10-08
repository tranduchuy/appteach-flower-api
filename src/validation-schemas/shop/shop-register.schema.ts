import Joi from '@hapi/joi';
import { General } from '../../constant/generals';
import Genders = General.Genders;

const genderValues = Object.keys(Genders).map(key => {
  return Genders[key];
});

const shopShipAddress = Joi.object().keys({
  city: Joi.string().required(),
  district: Joi.number()
});

const RegisterShop = Joi.object().keys(
  {
    email: Joi.string().required().max(100).email(),
    password: Joi.string().required().min(6).regex(/^[a-zA-Z0-9]*$/),
    confirmedPassword: Joi.string().required().min(6).regex(/^[a-zA-Z0-9]*$/),
    phone: Joi.string().required().min(10).max(11).regex(/^[0-9]*$/),
    address: Joi.string().min(6).max(200),
    gender: Joi.number().required().valid(genderValues),
    name: Joi.string().required().min(3),
    shopName: Joi.string().required(),
    slug: Joi.string().required(),
    images: Joi.array().required().items(Joi.string()),
    availableShipCountry: Joi.boolean().required(),
    availableShipAddresses: Joi.array().items(shopShipAddress),
    longitude: Joi.number().required(),
    latitude: Joi.number().required()
  }
);

export default RegisterShop;