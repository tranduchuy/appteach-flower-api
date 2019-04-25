import { injectable } from 'inversify';
import CartModel, { Cart } from '../models/cart';
import { Product } from '../models/product';

@injectable()
export class CartService {

  createCart = async (userId: string): Promise<Cart> => {
    const newCart = new CartModel({ user: userId });
    return newCart.save();
  };

  findCart = async (userId: string): Promise<Cart> => {
    return CartModel.findOne({ user: userId });
  }

  addToCart = async (cart: Cart, product: Product): Promise<Cart> => {
    cart.products.push(product);
    return CartModel.updateOne({ _id: cart.id }, cart);
  }
}
