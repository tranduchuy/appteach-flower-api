export namespace ResponseMessages {
  export const SUCCESS = "Thành công";
  export namespace User {
    export namespace Register {
      export const PHONE_DUPLICATED = "Số điện thoại đã được đăng kí";
      export const EMAIL_DUPLICATED = "Email đã được đăng kí";
      export const USERNAME_DUPLICATED = "Username đã được đăng kí";
      export const PASSWORD_DONT_MATCH = "Mật khẩu và mật khẩu xác nhận không giống nhau";
      export const REGISTER_SUCCESS = "Đăng kí thành công";
    }
    export namespace Login {
      export const USER_NOT_FOUND = "Tài khoản không tồn tại";
      export const WRONG_PASSWORD = "Sai mật khẩu";
      export const INACTIVE_USER = "Tài khoản chưa được kí hoạt";
      export const LOGIN_SUCCESS = "Đăng nhập thành công";
    }
    export namespace Confirm {
      export const INVALID_TOKEN = "Token không hợp lệ";
      export const CONFIRM_SUCCESS = "Kích hoạt tài khoản thành công";
    }
  }
  export namespace Product {
    export namespace Add {
      export const ADD_PRODUCT_SUCCESS = "Thêm sản phẩm thành công";
      export const NO_ADD_PRODUCT_PERMISSION = "Chỉ có người bán được phép thêm sản phẩm";
    }
  }
}