import {injectable} from 'inversify';
import ProductModel from '../models/product';
import urlSlug from "url-slug";

@injectable()
export class ProductService {
  createProduct = async ({title, sku, description, topic, user, images, salePrice, originalPrice, tags,
                           design , specialOccasion, floret, city, district, color, seoUrl, seoDescription, seoImage}) => {
    //TODO: map price ranges
    const priceRange = 0;

    //TODO: add tags

    //TODO: generate slug
    let slug = urlSlug(title);

    const duplicatedNumber = await ProductModel.count({
      title: title
    });
    if(duplicatedNumber > 0){
      slug = `${slug}-${duplicatedNumber}`
    }

    let saleOff = {
      price: 0,
      startDate: null,
      endDate: null,
      active: false
    };
    if(salePrice){
      saleOff = {
        price: salePrice,
        startDate: null,
        endDate: null,
        active: false
      }
    }
    const newProduct = new ProductModel({
      title,
      sku,
      description,
      topic,
      priceRange,
      slug,
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
