import { injectable } from 'inversify';
import CartModel, { Cart } from '../models/cart';
import { Product } from '../models/product';
import { User } from '../models/user';
import * as _ from 'lodash';

@injectable()
export class CartService {

  createCart = async (user: User): Promise<Cart> => {
    const newCart = new CartModel({ user });
    return newCart.save();
  };

  findCart = async (userId: string): Promise<Cart> => CartModel.findOne({ user: userId });

  addToCart = async (cart: Cart, product: Product): Promise<Cart> => {
    if (this.isProductInCart(cart, product)) return cart;
    cart.products.push(product);
    return CartModel.updateOne({ _id: cart.id }, cart);
  }

  isProductInCart = (cart, product): Boolean => {
    const productId = _.get(product, 'id');
    // Need check condition here
    if (_.findIndex(cart.products, productId)) return true;
    return false;
  }
}
