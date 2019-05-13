import { injectable } from 'inversify';
import FB from 'fb';

@injectable()
export class FacebookGraphApiService {
  FB = FB;

  constructor() {
  }

  getUserInfoByAccessToken = async (accessToken: string) => {
    return new Promise((resolve) => {
      this.FB.setAccessToken(accessToken);
      return this.FB.api('me', {fields: ['id', 'name', 'email']}, (res) => {
        if (!res || res.error) {
          resolve(null);
        }
        resolve(res);
      });
    });
  };
}