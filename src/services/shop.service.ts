import { injectable } from 'inversify';
import mongoose from 'mongoose';
import ShopModel, { Shop } from '../models/shop';

export interface IQueryWaitingShop {
  limit: number;
  page: number;
  sortBy?: string;
  sortDirection?: string;
  userId?: string;
}

@injectable()
export class ShopService {
  async findShopOfUser(userId: string): Promise<Shop> {
    return await ShopModel.findOne({user: userId});
  }

  async createNewShop(userId: string, name: string, slug: string, images: string[], availableShipCountry: boolean): Promise<Shop> {
    const shop = new ShopModel({
      name,
      slug,
      images,
      availableShipCountry,
      user: new mongoose.Types.ObjectId('5cb9a7c8aad2582d60ea5cbe'),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return await shop.save();
  }

  buildStageQueryShopWaiting(queryCondition: IQueryWaitingShop): any[] {
    const stages = [];

    if (queryCondition.userId) {
      stages.push({
        $match: {
          user: queryCondition.userId
        }
      });
    }

    if (queryCondition.sortBy) {
      stages.push({
        $sort: {
          [queryCondition.sortBy]: queryCondition.sortDirection || 'ASC'
        }
      });
    }

    stages.push({
      $facet: {
        entries: [
          {$skip: (queryCondition.page - 1) * queryCondition.limit},
          {$limit: queryCondition.limit}
        ],
        meta: [
          {$group: {_id: null, totalItems: {$sum: 1}}},
        ],
      }
    });

    return stages;
  }
}
