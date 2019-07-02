export namespace ResponseMessages {
  export const SUCCESS = 'Thành công';
  export const INVALID_ID = 'ID không hợp lệ';
  export const INVALID_URL = 'URL không hợp lệ';
  export namespace User {
    export const USER_NOT_FOUND = 'Tài khoản không tồn tại';
    export const RESEND_CONFIRM_EMAIL = 'Hệ thống đã gửi lại email xác nhận tài khoản. Vui lòng kiểm tra email';

    export namespace Register {
      export const PHONE_DUPLICATED = 'Số điện thoại đã được đăng kí';
      export const EMAIL_DUPLICATED = 'Email đã được đăng kí';
      export const USERNAME_DUPLICATED = 'Username đã được đăng kí';
      export const PASSWORD_DONT_MATCH = 'Mật khẩu và mật khẩu xác nhận không giống nhau';
      export const REGISTER_SUCCESS = 'Đăng kí thành công';
      export const WRONG_OTP = 'Mã xác thực sai';
      export const EXCEED_MAX_SEND_OTP = 'Đã quá số lần gửi OTP. Tài khoản của bạn đã bị khóa. Vui lòng liên hệ ADMIN';
      export const RESEND_OTP = 'Hệ thống đã gửi 1 mã OTP đến số điện thoại của bạn';
    }
    export namespace Login {
      export const USER_NOT_FOUND = 'Tài khoản không tồn tại';
      export const WRONG_PASSWORD = 'Sai mật khẩu';
      export const INACTIVE_USER = 'Tài khoản chưa được kí hoạt';
      export const LOGIN_SUCCESS = 'Đăng nhập thành công';
      export const PERMISSION_DENIED = 'Không có quyền truy cập';
      export const INVALID_TOKEN = 'accessToken không hợp lệ';
      export const NEW_USER_BY_GOOGLE = 'Tài khoản mới đã được tạo vui lòng xác nhận số điện thoại của bạn';

      export const NEW_USER_BY_FACEBOOK = 'Tài khoản mới đã được tạo vui lòng xác nhận số điện thoại của bạn';
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

  export namespace New {
    export const NOT_FOUND = 'Không tìm thấy tin này';
    export const EXISTED_SLUG = 'Slug đã tồn tại';
  }

  export namespace Product {
    export const PRODUCT_NOT_FOUND = 'Không tìm thấy sản phẩm';
    export const NOT_VALID_PRICE = 'Giá khuyến mãi phải nhỏ hơn giá bình thường';
    export const NO_ADD_ITEM_PERMISSION = 'Bạn không thể thêm sản phẩm của shop bạn';
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

  export namespace Order {
    export const ORDER_NOT_FOUND = 'Không tìm thấy đơn hàng';
    export const ORDER_EMPTY = 'Giỏ hàng trống';
    export const WRONG_STATUS = 'Trạng thái đơn hàng không đúng';
    export namespace Add {
      export const ADD_ORDER_SUCCESS = 'Thêm đơn hàng thành công';
      export const NO_ADD_ORDER_PERMISSION = 'Chỉ có chủ đơn hàng được phép thêm sản phẩm';
    }
    export namespace Update {
      export const UPDATE_ORDER_SUCCESS = 'Cập nhật sản phẩm thành công';
      export const NO_UPDATE_ORDER_PERMISSION = 'Chỉ có chủ đơn hàng được phép cập nhật sản phẩm';
    }
  }

  export namespace OrderItem {
    export const ORDER_ITEM_NOT_FOUND = 'Không tìm thấy sản phẩm trong giỏ hàng';
    export const ORDER_SUBMITTED = 'Đơn hàng đã hoàn tất, không thể thay đổi thông tin được nữa';
    export const WRONG_STATUS_FLOW = 'Không thể cập nhật, trạng thái không đúng';
  }
}