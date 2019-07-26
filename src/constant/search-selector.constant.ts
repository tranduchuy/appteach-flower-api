export namespace SearchSelector {
  export const Topics = [
    {text: 'Hoa khai trương', value: 1},
    {text: 'Hoa Sinh nhật', value: 2},
    {text: 'Hoa tình yêu', value: 3},
    {text: 'Hoa tặng mẹ', value: 4},
    {text: 'Hoa tình bạn', value: 5},
    {text: 'Hoa chúc mừng', value: 6},
    {text: 'Hoa cảm ơn', value: 7},
    {text: 'Hoa tang lễ', value: 8},
    {text: 'Hoa tặng dịp đặc biệt', value: 9},
    {text: 'Hoa cưới', value: 10},
    {text: 'Hoa tươi', value: 11},
  ];

  export const SpecialOccasions = [
    {text: 'Tết Nguyên Đán (Tết âm lịch)', value: 111},
    {text: 'Lễ Tình Nhân (Valentin 14/2)', value: 112},
    {text: 'Ngày thầy thuốc (27/2)', value: 113},
    {text: 'Ngày quốc tế phụ nữ (8/3)', value: 114},
    {text: 'Ngày của Mẹ', value: 115},
    {text: 'Ngày của Cha', value: 116},
    {text: 'Ngày nhà báo (21/6)', value: 117},
    {text: 'Ngày Khai giảng (5/9)', value: 118},
    {text: 'Ngày Doanh Nhân (13/10)', value: 119},
    {text: 'Ngày phụ nữ Việt Nam (20/10)', value: 120},
    {text: 'Ngày nhà giáo Việt Nam (20/11)', value: 121},
    {text: 'Lễ Giáng sinh (25/12)', value: 122}
  ];

  export const Designs = [
    {text: 'Hoa bó', value: 1},
    {text: 'Lẵng hoa', value: 2},
    {text: 'Hộp gỗ', value: 3},
    {text: 'Giỏ hoa', value: 4},
    {text: 'Hoa bình', value: 5},
    {text: 'Vòng hoa', value: 6},
    {text: 'Kệ hoa khai trương', value: 7},
    {text: 'Hoa hồ điệp', value: 8},
    {text: 'Hoa bàn họp', value: 9},
    {text: 'Bục phát biểu', value: 10},
    {text: 'Hoa tặng đại biểu', value: 11},
    {text: 'Hoa cài áo', value: 12}
  ];

  export const Florets = [
    {text: 'Nhiều loại', value: 13},
    {text: 'Hoa hồng', value: 1},
    {text: 'Hoa ly', value: 2},
    {text: 'Hoa lan, địa lan', value: 3},
    {text: 'Hoa cẩm tú cầu', value: 4},
    {text: 'Hoa cẩm chướng', value: 5},
    {text: 'Hoa loa kèn', value: 6},
    {text: 'Hoa hồng môn', value: 7},
    {text: 'Hoa hồ điệp', value: 8},
    {text: 'Hoa đồng tiền', value: 9},
    {text: 'lan tường', value: 10},
    {text: 'Hoa hướng dương', value: 11},
    {text: 'Hoa sen', value: 12}
  ];

  export const TopicsForShop = [
    {text: 'Hoa khai trương', value: 1},
    {text: 'Hoa Sinh nhật', value: 2},
    {text: 'Hoa tình yêu', value: 3},
    {text: 'Hoa tặng mẹ', value: 4},
    {text: 'Hoa tình bạn', value: 5},
    {text: 'Hoa chúc mừng', value: 6},
    {text: 'Hoa cảm ơn', value: 7},
    {text: 'Hoa tang lễ', value: 8},
    {text: 'Hoa tặng dịp đặc biệt', value: 9},
    {text: 'Hoa cưới', value: 10},
    {text: 'Hoa tươi', value: 11},
    {text: 'Quà tặng', value: 12},
    {text: 'Combo', value: 13}
  ];

  export const Colors = [
    {text: 'Nhiều màu', value: 8},
    {text: 'Màu đỏ', value: 1},
    {text: 'Màu vàng', value: 2},
    {text: 'Màu trắng', value: 3},
    {text: 'Màu tím', value: 4},
    {text: 'Màu xanh', value: 5},
    {text: 'Màu hồng', value: 6},
    {text: 'Kết hợp', value: 7}
  ];

  export const PriceRanges = [
    {text: '< 50.000', value: 6, max: 50000},
    {text: '50.000 - 100.000', value: 7, min: 50000, max: 100000},
    {text: '100.000 - 300.000', value: 1, min: 100000, max: 300000},
    {text: '300.000 - 500.000', value: 2, min: 300000, max: 500000},
    {text: '500.000 - 1.000.000', value: 3, min: 500000, max: 1000000},
    {text: '1.000.000 - 2.000.000', value: 4, min: 1000000, max: 2000000},
    {text: '> 2.000.000', value: 5, min: 2000000}
  ];

  export const Cities = require('../../cities.json');
}
