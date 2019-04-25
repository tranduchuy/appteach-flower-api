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

  updateAddress = () => {

  }


}