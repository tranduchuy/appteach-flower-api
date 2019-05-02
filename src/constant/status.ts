export const Status = {
  ACTIVE: 1,
  PENDING_OR_WAIT_CONFIRM: 2,
  BLOCKED: 3,
  DELETE: 4,

  PAYMENT_PAID: 5,
  PAYMENT_UNPAID: 6,
  PAYMENT_FREE: 7,

  CHILD_ACCEPTED: 8,
  CHILD_WAITING: 9,
  CHILD_REJECTED: 10,
  CHILD_DELETED: 11,
  CHILD_NONE: 12,
  PAID_FORM_VIEW_ACTIVE: 40,
  PAID_FORM_VIEW_STOP: 50,
  OUT_OF_STOCK: 60,

  NOTIFY_NEW: 200,
  NOTIFY_READ: 201,

  ORDER_PENDING: 1,
  ORDER_SUCCESS: 2
};

export const StatusNm = {
  1: 'Kích hoạt',
  2: 'Chờ',
  3: 'Bị khoá',
  4: 'Bị xoá',
  5: 'Đã trả',
  6: 'Chưa trả',
  7: 'Miễn phí',
  8: 'Đồng ý',
  9: 'Chờ',
  10: 'Từ chối',
  11: 'Bị xoá',
  12: 'Null',
  40: 'Kích hoạt',
  50: 'Tạm dừng',
  200: 'Thông báo mới',
  201: 'Thông báo đã đọc'
};

export const StatusCd2Nm = (cd: number): string => {
  return StatusNm[cd.toString()];
};
