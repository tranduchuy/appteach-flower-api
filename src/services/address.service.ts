import { injectable } from 'inversify';
import mongoose from 'mongoose';
import AddressModel from '../models/address';
import { General } from '../constant/generals';
import AddressTypes = General.AddressTypes;
import { SearchSelector } from '../constant/search-selector.constant';
import Cities = SearchSelector.Cities;

@injectable()
export class AddressService {
  listDeliveryAddressFields = ['name', 'user', 'phone', 'city', 'district', 'ward', 'address', 'addressText'];
  listPossibleDeliveryAddressFields = ['city', 'district'];
  createDeliveryAddress = async ({name, user, ward, phone, city, district, address}) => {
    const cityObject = this.getCityByCode(city);
    const districtObject = this.getDistrictByValue(cityObject, district);
    const wardObject = this.getWardByValue(districtObject, ward);
    const addressText = `${address}, ${wardObject.pre} ${wardObject.name}, ${districtObject.pre} ${districtObject.name}, ${cityObject.name}`;
    const newAddress = new AddressModel({
      name,
      phone,
      city,
      district,
      address,
      ward,
      addressText,
      user: user._id,
      type: AddressTypes.DELIVERY
    });

    return await newAddress.save();
  };

  createPossibleDeliveryAddress = async (addressData: { city: string; shopId: string; district: number }) => {
    const newAddress = new AddressModel({
      city: addressData.city,
      district: addressData.district,
      shop: new mongoose.Types.ObjectId(addressData.shopId),
      type: AddressTypes.POSSIBLE_DELIVERY
    });

    return await newAddress.save();
  };

  async createShopAddress(shopId: string, city: string, district: number, ward: number | null, address: string) {
    const newAddress = new AddressModel({
      city,
      district,
      ward,
      address,
      shop: new mongoose.Types.ObjectId(shopId),
      type: AddressTypes.SHOP_ADDRESS
    });

    return await newAddress.save();
  }

  getDelieveryAddress = async (user) => {
    return await AddressModel.find({
      user: user._id,
      type: AddressTypes.DELIVERY
    }, this.listDeliveryAddressFields).sort({updatedAt: -1});
  };

  getPossibleDelieveryAddress = async (user) => {
    return await AddressModel.find({
      user: user._id,
      type: AddressTypes.POSSIBLE_DELIVERY
    }, this.listPossibleDeliveryAddressFields).sort({updatedAt: -1});
  };

  updateDeliveryAddress = async (addressId, {
    name,
    phone,
    city,
    district,
    address,
    ward
  }) => {
    const cityObject = this.getCityByCode(city);
    const districtObject = this.getDistrictByValue(cityObject, district);
    const wardObject = this.getWardByValue(districtObject, ward);
    const addressText = `${address}, ${wardObject.pre} ${wardObject.name}, ${districtObject.pre} ${districtObject.name}, ${cityObject.name}`;
    const newAddress = {
      name: name || null,
      city: city || null,
      district: district || null,
      phone: phone || null,
      address: address || null,
      ward: ward || null,
      addressText: addressText || null,
      updatedAt: new Date()
    };

    Object.keys(newAddress).map(key => {
      if (newAddress[key] === null) {
        delete newAddress[key];
      }
    });

    await AddressModel.findOneAndUpdate({_id: addressId}, newAddress);

    return await AddressModel.findById(addressId);
  };


  updateGeoAddress = async (address, {
    latitude, longitude
  }) => {
    address.latitude = latitude;
    address.longitude = longitude;

    return await address.save();
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

  findDeliveryAddressByShopId = async (shopId) => {
    try {
      return await AddressModel.findOne({
        shop: shopId
      });
    } catch (e) {
      console.log(e);
    }

  };

  findAddress = async (addressId) => {
    try {
      return await AddressModel.findOne({
        _id: addressId
      });
    } catch (e) {
      console.log(e);
    }
  };

  deleteAddress = async (id) => {
    try {
      return await AddressModel.findByIdAndRemove(id);
    } catch (e) {
      console.log(e);
    }
  };

  getCityByCode(cd: string): any {
    return Cities.find(city => {
      return city.code === cd;
    });
  }

  getDistrictByValue(city: any, value: number): any {
    const district = city.districts || [];
    return district.find(d => {
      return d.id === value;
    });
  }

  getWardByValue(district: any, value: number): any {
    return district.wards.find(w => {
      return w.id === value;
    });
  }

}