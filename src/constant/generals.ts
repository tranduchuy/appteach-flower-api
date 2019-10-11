export namespace General {
  export const API_COMFIRM_IMAGE = 'http://157.230.248.161:3100/images/confirmation';
  export const HOME_PRODUCT_LIMIT = 10;
  export const RELATED_PRODUCT_LIMIT = 12;
  export const ApiTokenName = 'accesstoken';
  export const jwtSecret = 'Hello';
  export const Genders = {
    GENDER_MALE: 1,
    GENDER_FEMALE: 2
  };

  export const RegisterByTypes = {
    NORMAL: 1,
    GOOGLE: 2,
    FACEBOOK: 3
  };

  export const UserTypes = {
    TYPE_CUSTOMER: 1,
    TYPE_SELLER: 2
  };

  export const UserRolesInShop = {
    ROLE_IN_SHOP_OWNER: 1,
  };

  export const AddressTypes = {
    DELIVERY: 1,
    POSSIBLE_DELIVERY: 2,
    SHOP_ADDRESS: 3
  };

  export const UserRoles = {
    USER_ROLE_MASTER: 1,
    USER_ROLE_ADMIN: 2,
    USER_ROLE_ENDUSER: 3
  };

  export const ProductStatus = {
    ACTIVE: 1,
    BLOCKED: 3,
    OUT_OF_STOCK: 60
  };

  export const NewCreatedBy = {
    HAND: 1,
    CRAWL: 2
  };


  export const PAGE_SIZE = 20;


  export const costPerKm = 8000; // 8k/km

  export const checkSaleOffIntervalTime = 5; // 5 minutes
}
