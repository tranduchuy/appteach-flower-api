import { injectable } from 'inversify';
import Tag from '../models/tag.model';
import urlSlug from 'url-slug';

@injectable()
export class TagService {
    async insertMany(keywords: string[]): Promise<Tag[]> {
        return await Promise.all(keywords.map(async (keyword: string) => {
            const result = await Tag.findOrCreate({
                where: {
                    keyword: keyword,
                    slug: urlSlug(keyword),
                    customSlug: urlSlug(keyword)
                }
            });

            return result[0]; // function findOrCreate return [Model, boolean]
        }));
    }
}
