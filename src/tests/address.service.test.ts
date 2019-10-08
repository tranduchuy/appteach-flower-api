import { AddressService } from './__mocks__/address.service';

jest.mock('./__mocks__/address.service');
const addressService: AddressService = new AddressService();