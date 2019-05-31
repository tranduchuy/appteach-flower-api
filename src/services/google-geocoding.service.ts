import { injectable } from 'inversify';
import NodeGeocoder from 'node-geocoder';
import { GOOGLE_GEOCODING } from '../utils/secrets';

@injectable()
export class GoogleGeocodingService {
  options = {
    provider: 'google',
    apiKey: GOOGLE_GEOCODING
  };
  geocoder;
  checkAddress = (addressText: string) => {
    return new Promise((resolve, reject) => {
      this.geocoder.geocode(addressText, (err, addresses) => {
        if (err) {
          reject(err);
        }

        resolve(addresses);
      });
    });
  };

  constructor() {
    this.geocoder = NodeGeocoder(this.options);
  }

}