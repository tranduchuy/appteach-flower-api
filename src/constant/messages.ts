export namespace ResponseMessages {
  export const SUCCESS = 'Thành công';
  export namespace User {
    export const USER_NOT_FOUND = 'Tài khoản không tồn tại';

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
    export namespace ForgetPassword {
      export const INVALID_REGISTER_TYPE = 'Tài khoản đăng kí bằng mạng xã hội hoặc google không thể reset mật khẩu.';
      export const FORGET_PASSWORD_SUCCESS = 'Gửi yêu cầu khôi phục mật khẩu thành công, vui lòng kiểm tra email của bạn';
    }
    export namespace ResetPassword {
      export const EXPIRED_TOKEN = 'Token reset mật khẩu hết hạn, vui lòng tạo yêu cầu mới.';
      export const RESET_PASSWORD_SUCCESS = 'Khôi phục mật tài khoản thành công';
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
    export namespace List {
      export const NO_POSSIBLE_ADDRESS_PERMISSION = 'Chỉ có người bán có địa chỉ có thể giao hàng';
    }
    export namespace Add {
      export const ADD_ADDRESS_SUCCESS = 'Thêm địa chỉ thành công';
      export const NO_ADD_ADDRESS_PERMISSION = 'Chỉ có người bán được phép thêm địa chỉ có thể giao hàng';
      export const ADDRESS_EXSIST = 'Địa chỉ đã tồn tại';
    }
    export namespace Update {
      export const UPDATE_ADDRESS_SUCCESS = 'Cập nhật địa chỉ thành công';
    }
    export namespace Delete {
      export const DELETE_ADDRESS_SUCCESS = 'Xóa địa chỉ thành công';
    }
  }

  export namespace Shop {
    export const SHOP_NOT_FOUND = 'Không tìm thấy thông tin shop';
    export const DUPLICATE_SLUG = 'Bị trùng slug với một shop khác';
    export const SHOP_OF_USER_NOT_FOUND = 'Không tìm thấy thông tin shop của người dùng';
    export const EXIST_SHOP_OF_USER = 'Bạn đã mở shop rồi';
  }
}