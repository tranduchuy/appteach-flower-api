export namespace NotifyConstant {
  export const NEW_SHOP = 1;
  export const ADMIN_ACCEPT_SHOP = 2;
  export const NEW_ORDER = 3;
  export const UPDATE_ORDER_ITEM_STATUS = 4;
  export const UPDATE_ORDER_ITEM_ON_DELIVERY = 5;
  export const UPDATE_ORDER_ITEM_FINISHED = 6;
}

export const NotifyContent = {
  3: {
    title: 'Đơn hàng mới',
    content: 'Bạn vừa nhận được đơn hàng mới'
  },
  5: {
    title: 'Đang vận chuyển',
    content: 'Sản phẩm của bạn đang trong quá trình vận chuyển'
  },
  6: {
    title: 'Hoàn tất đơn hàng',
    content: 'Sản phẩm của bạn đã hoàn tất'
  }

};

export const TypeCd2Content = (cd: number): string => {
  return NotifyContent[cd.toString()];
};
