import {injectable} from 'inversify';
import ProductModel from '../models/product';

@injectable()
export class ProductService {
  createProduct = async ({title, sku, description, topic, priceRange, slug, originalPrice, user}) => {
    const newProduct = new ProductModel({
      title,
      sku,
      description,
      topic,
      priceRange,
      slug,
      originalPrice,
      user
    });

    return await newProduct.save();
  }

}
