import { injectable } from "inversify";
import AddressModel from "../models/address";
import { General } from "../constant/generals";
import AddressTypes = General.AddressTypes;

@injectable()
export class AddressService {
  listDeliveryAddressFields = ['name', 'user', 'phone', 'city', 'district', 'ward', 'address'];
  listPossibleDeliveryAddressFields = ['city', 'district'];
  createDeliveryAddress = async ({name, user, ward, phone, city, district, address}) => {
    const newAddress = new AddressModel({
      name,
      phone,
      city,
      district,
      address,
      ward,
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
    }, this.listDeliveryAddressFields).sort({updatedAt: -1})
  };

  getPossibleDelieveryAddress = async (user) => {
    return await AddressModel.find({
      user: user._id,
      type: AddressTypes.POSSIBLE_DELIVERY
    }, this.listPossibleDeliveryAddressFields).sort({updatedAt: -1})
  };

  updateDeliveryAddress = async (addressId, {
    name,
    phone,
    city,
    district,
    address,
    ward
  }) => {
    const newAddress = {
      name: name || null,
      city: city || null,
      district: district || null,
      phone: phone || null,
      address: address || null,
      ward: ward || null,
      updatedAt: new Date()
    };

    Object.keys(newAddress).map(key => {
      if (newAddress[key] === null) {
        delete newAddress[key];
      }
    });

    return await AddressModel.findOneAndUpdate({_id: addressId}, newAddress);
  };

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

  findPossibleDeliveryAddress = async ({city, district, user}) => {
    try {
      return await AddressModel.findOne({
        city,
        district,
        type: AddressTypes.POSSIBLE_DELIVERY,
        user: user._id
      });
    } catch (e) {
      console.log(e);
    }
  };

  findAddressById = async (addressId, userId) => {
    try {
      return await AddressModel.findOne({
        _id: addressId,
        user: userId
      });
    } catch (e) {
      console.log(e);
    }
  };

  deleteAddress = async (id) =>{
    try {
      return await AddressModel.findByIdAndRemove(id);
    } catch (e) {
      console.log(e);
    }
  }


}