import { injectable } from "inversify";
import AddressModel from "../models/address";
import { General } from "../constant/generals";
import AddressTypes = General.AddressTypes;

@injectable()
export class AddressService {
  listDeliveryAddressFields = ['name', 'user', 'phone', 'city', 'district', 'address'];
  listPossibleDeliveryAddressFields = ['city', 'district'];
  createDeliveryAddress = async ({name, user, phone, city, district, address}) => {
    const newAddress = new AddressModel({
      name,
      phone,
      city,
      district,
      address,
      user: user._id,
      type: AddressTypes.DELIVERY
    });

    return await newAddress.save();
  };
  createPossibleDeliveryAddress = async ({city, user, district}) => {
    const newAddress = new AddressModel({
      city,
      district,
      user: user._id,
      type: AddressTypes.POSSIBLE_DELIVERY
    });

    return await newAddress.save();
  };

  getDelieveryAddress = async (user) => {
    return await AddressModel.find({
      user: user._id,
      type: AddressTypes.DELIVERY
    }, this.listDeliveryAddressFields)
  };
  getPossibleDelieveryAddress = async (user) => {
    return await AddressModel.find({
      user: user._id,
      type: AddressTypes.POSSIBLE_DELIVERY
    }, this.listPossibleDeliveryAddressFields)
  };

  updateDeliveryAddress = async (addressId, {
    name,
    phone,
    city,
    district,
    address
  }) => {
    const newAddress = {
      name: name || null,
      city: city || null,
      district: district || null,
      phone: phone || null,
      address: address || null
    };

    Object.keys(newAddress).map(key => {
      if (newAddress[key] === null) {
        delete newAddress[key];
      }
    });

    return await AddressModel.findOneAndUpdate({_id: addressId}, newAddress);
  }

  findDeliveryAddressById = async (addressId, userId) => {
    try {
      return await AddressModel.findOne({
        _id: addressId,
        user: userId
      });
    } catch (e) {
      console.log(e);
    }

  };


}