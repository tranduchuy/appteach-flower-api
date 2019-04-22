import { controller, httpGet, httpPost } from 'inversify-express-utils';

@controller('search')
export class SearchController {
  @httpGet('/')
  public search(): Promise<any> {
    return new Promise<any>((resolve => {

    }));
  }

  @httpPost('box')
  public box(): Promise<any> {
    return new Promise<any>((resolve => {

    }));
  }
}
