export namespace ResponseMessages {
  export const SUCCESS = 'Thành công';
  export namespace User {
    export namespace Register {
      export const PHONE_DUPLICATED = 'Số điện thoại đã được đăng kí';
      export const EMAIL_DUPLICATED = 'Email đã được đăng kí';
      export const USERNAME_DUPLICATED = 'Username đã được đăng kí';
      export const PASSWORD_DONT_MATCH = 'Mật khẩu và mật khẩu xác nhận không giống nhau';
      export const REGISTER_SUCCESS = 'Đăng kí thành công';
    }
    export namespace Login {
      export const USER_NOT_FOUND = 'Tài khoản không tồn tại';
      export const WRONG_PASSWORD = 'Sai mật khẩu';
      export const INACTIVE_USER = 'Tài khoản chưa được kí hoạt';
      export const LOGIN_SUCCESS = 'Đăng nhập thành công';
      export const PERMISSION_DENIED = 'Không có quyền truy cập';
    }
    export namespace Confirm {
      export const INVALID_TOKEN = 'Token không hợp lệ';
      export const CONFIRM_SUCCESS = 'Kích hoạt tài khoản thành công';
    }
  }

  export namespace Product {
    export const PRODUCT_NOT_FOUND = 'Không tìm thấy sản phẩm';
    export const NOT_VALID_PRICE = 'Giá khuyến mãi phải nhỏ hơn giá bình thường';
    export namespace Add {
      export const ADD_PRODUCT_SUCCESS = 'Thêm sản phẩm thành công';
      export const NO_ADD_PRODUCT_PERMISSION = 'Chỉ có người bán được phép thêm sản phẩm';
    }
    export namespace Update {
      export const UPDATE_PRODUCT_SUCCESS = 'Cập nhật sản phẩm thành công';
      export const NO_UPDATE_PRODUCT_PERMISSION = 'Chỉ có người bán được phép cập nhật sản phẩm';
    }
  }
  export namespace Address {
    export const ADDRESS_NOT_FOUND = 'Không tìm thấy địa chỉ này';
    export namespace Add {
      export const ADD_ADDRESS_SUCCESS = 'Thêm địa chỉ thành công';
      export const NO_ADD_ADDRESS_PERMISSION = 'Chỉ có người bán được phép thêm địa chỉ có thể giao hàng';
    }
    export namespace Update {
      export const UPDATE_ADDRESS_SUCCESS = 'Cập nhật địa chỉ thành công';
    }

  export namespace Shop {
    export const SHOP_NOT_FOUND = 'Không tìm thấy thông tin shop';
  }
}