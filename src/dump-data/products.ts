import { SearchSelector } from '../constant/search-selector.constant';
import ProductModel from '../models/product';
// import { ProductService } from '../services/product.service';
import mongoose from 'mongoose';

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const run = () => {
  let i = 0;

  while (i < 100) {
    const price = 3e5 * getRandomInt(1, 5);

    const newProduct = new ProductModel({
      title: 'Demo',
      images: [],
      originalPrice: price,
      description: 'demo text',
      topic: SearchSelector.Topics[getRandomInt(0, 10)].value,
      floret: SearchSelector.Florets[getRandomInt(0, 11)].value,
      city: SearchSelector.Cities[getRandomInt(0, 50)].code,
      design: SearchSelector.Designs[getRandomInt(0, 4)].value,
      color: SearchSelector.Colors[getRandomInt(0, 6)].value,
      // priceRange: ProductService.detectPriceRange(price),
      slug: 'demo-' + new Date().getTime(),
      code: 'DUMP_DATA_' + i,
      sku: 'SKU' + new Date().getTime() + getRandomInt(0, 10000),
      saleOff: {
        active: false,
        startDate: null,
        endDate: null,
        price: 0
      },
      createdAt: new Date(),
      user: new mongoose.Types.ObjectId('5cb9a7c8aad2582d60ea5cbe')
    });


    newProduct.save();
    i++;
  }
};