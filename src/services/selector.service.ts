import { injectable } from 'inversify';
import { SearchSelector } from '../constant/search-selector.constant';

@injectable()
export class SelectorService {

  static getTextByValue = (selector, value) => {
    const obj = selector.find(o => {
      return o.value === value;
    });

    if (obj && obj.text)
      return obj.text;
    else return null;
  }

  static getCityByCode = (cd) => {
    return SearchSelector.Cities.find(city => {
      return city.code === cd;
    });
  };

  static getDistrictByValue = (Cities, value) => {
    return Cities.districts.find(d => {
      return d.id === value;
    });
  };

}

