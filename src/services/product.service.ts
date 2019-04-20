import { injectable } from 'inversify';
import ProductModel from '../models/product';
import urlSlug from "url-slug";
import { SearchSelector } from "../constant/search-selector.constant";
import PriceRanges = SearchSelector.PriceRanges;

import RandomString from 'randomstring';

@injectable()
export class ProductService {
  createProduct = async ({
                           title, sku, description, topic, user, images, salePrice, originalPrice, tags,
                           design, specialOccasion, floret, city, district, color, seoUrl, seoDescription, seoImage
                         }) => {
    //TODO: map price ranges
    let priceRange = null;
    const range = PriceRanges.find(range => {
      return (range.min <= originalPrice && originalPrice < range.max);
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
      slug = `${slug}-${duplicatedNumber}`
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
      }
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
  }

}
