import { injectable } from 'inversify';
import ProductModel from '../models/product';
import urlSlug from 'url-slug';
import { SearchSelector } from '../constant/search-selector.constant';
import PriceRanges = SearchSelector.PriceRanges;

import RandomString from 'randomstring';
import { General } from "../constant/generals";

@injectable()
export class ProductService {
  createProduct = async ({
                           title, sku, description, topic, user, images, salePrice, originalPrice, tags,
                           design, specialOccasion, floret, city, district, color, seoUrl, seoDescription, seoImage
                         }) => {
    //TODO: map price ranges
    let priceRange = null;
    const range = PriceRanges.find(range => {
      if(range.min && range.max){
        return (range.min <= originalPrice && originalPrice < range.max);
      } else{
        return (range.min <= originalPrice);
      }
    });
    if (range) {
      priceRange = range.value;
    }

    //TODO: add tags

    //TODO: generate slug
    let slug = urlSlug(title);

    const duplicatedNumber = await ProductModel.count({
      title: title
    });
    if (duplicatedNumber > 0) {
      slug = `${slug}-${duplicatedNumber}`;
    }

    let saleOff = {
      price: 0,
      startDate: null,
      endDate: null,
      active: false
    };
    if (salePrice) {
      saleOff = {
        price: salePrice,
        startDate: null,
        endDate: null,
        active: false
      };
    }
    const code = RandomString.generate() + Date.now();
    const newProduct = new ProductModel({
      title,
      sku,
      description,
      topic,
      priceRange,
      slug,
      code,
      originalPrice,
      user: user._id,
      images: images || [],
      design: design || null,
      specialOccasion: specialOccasion || null,
      floret: floret || null,
      city: city || null,
      district: district || null,
      color: color || null,
      seoUrl: seoUrl || null,
      seoDescription: seoDescription || null,
      seoImage: seoImage || null,
      saleOff: saleOff
    });

    return await newProduct.save();
  };

  findProductById = async ( productId, userId ) => {
    try {
      return await ProductModel.findOne({
        _id: productId,
        user: userId
      })
    }catch (e) {
      console.log(e);
    }

  };

  updateProduct = async (product, {
                           title, sku, description, topic, images, saleOff, originalPrice, tags,
                           design, specialOccasion, floret, city, district, color, seoUrl, seoDescription, seoImage
                         }) => {
    //TODO: map price ranges
    let productId = product._id;
    let priceRange = null;
    const range = PriceRanges.find(range => {
      if(range.min && range.max){
        return (range.min <= originalPrice && originalPrice < range.max);
      } else{
        return (range.min <= originalPrice);
      }
    });
    if (range) {
      priceRange = range.value;
    }

    //TODO: add tags

    const defaultSaleOff = product.saleOff;
    Object.assign(defaultSaleOff, saleOff);
    let newOriginalPrice = 0;
    if(originalPrice === 0){
      newOriginalPrice = originalPrice;
    } else{
      newOriginalPrice = originalPrice || null;
    }

    const newProduct = {
      title: title || null,
      sku: sku || null,
      description: description || null,
      topic: topic || null,
      priceRange: priceRange || null,
      saleOff: defaultSaleOff,
      originalPrice: newOriginalPrice,
      images: images || null,
      design: design || null,
      specialOccasion: specialOccasion || null,
      floret: floret || null,
      city: city || null,
      district: district || null,
      color: color || null,
      seoUrl: seoUrl || null,
      seoDescription: seoDescription || null,
      seoImage: seoImage || null,
      updatedAt: new Date()
    };

    Object.keys(newProduct).map(key =>{
      if(newProduct[key] === null){
        delete newProduct[key];
      }
    });


    return await ProductModel.findOneAndUpdate({_id: productId}, newProduct);
  };

  updateProductStatus = async (product, status) =>{
    return await ProductModel.findOneAndUpdate({_id: product._id}, {status: status || product.status, updatedAt: new Date()});
  }

  updateViews = async (product) => {
    try {
      if(product){
        product.view = product.view + 1;
        return await product.save();
      }
    } catch (e) {
      console.log(e);
    }
  }

  getFeaturedProducts = async ()=>{
    try {
      return await ProductModel.find({}).sort({
        view: 1
      }).limit(General.HOME_PRODUCT_LIMIT);
    } catch (e) {
      console.log(e);
    }
  }

  getSaleProducts = async ()=>{
    try {
      return await ProductModel.find({"saleOff.active": true}).sort({
        updatedAt: -1
      }).limit(General.HOME_PRODUCT_LIMIT);
    } catch (e) {
      console.log(e);
    }
  }


}
