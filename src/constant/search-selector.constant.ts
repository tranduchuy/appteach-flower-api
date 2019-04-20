export namespace SearchSelector {
  export const Topics = [
    {text: 'Hoa khai trương', value: 1},
    {text: 'Sinh nhật', value: 2},
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

  export const Colors = [
    {text: 'Màu đỏ', value: 1},
    {text: 'Màu vàng', value: 2},
    {text: 'Màu trắng', value: 3},
    {text: 'Màu tím', value: 4},
    {text: 'Màu xanh', value: 5},
    {text: 'Màu hồng', value: 6},
    {text: 'Kết hợp', value: 7}
  ];

  export const PriceRanges = [
    {text: '100.000 - 300.000', value: 1, min: 100000, max: 300000},
    {text: '300.000 - 500.000', value: 2, min: 300000, max: 500000},
    {text: '500.000 - 1.000.000', value: 3, min: 500000, max: 1000000},
    {text: '1.000.000 - 2.000.000', value: 4, min: 1000000, max: 2000000},
    {text: '> 2.000.000', value: 5, min: 2000000}
  ];

  export const Cities = [{
    'code': 'AG',
    'name': 'An Giang',
    'districts': [
      {'name': 'An Phú', 'pre': 'Huyện', 'id': 85}, {
        'name': 'Châu Phú',
        'pre': 'Huyện',
        'id': 86
      }, {'name': 'Châu Thành', 'pre': 'Huyện', 'id': 87}, {
        'name': 'Châu Đốc',
        'pre': 'Thị xã',
        'id': 95
      }, {'name': 'Chợ Mới', 'pre': 'Huyện', 'id': 88}, {
        'name': 'Long Xuyên',
        'pre': 'Thành phố',
        'id': 94
      }, {'name': 'Phú Tân', 'pre': 'Huyện', 'id': 90}, {
        'name': 'Thoại Sơn',
        'pre': 'Huyện',
        'id': 92
      }, {'name': 'Tri Tôn', 'pre': 'Huyện', 'id': 89}, {
        'name': 'Tân Châu',
        'pre': 'Thị xã',
        'id': 91
      }, {'name': 'Tịnh Biên', 'pre': 'Huyện', 'id': 93}]
  }, {
    'code': 'VT',
    'name': 'Bà Rịa Vũng Tàu',
    'districts': [{'name': 'Bà Rịa', 'pre': 'Thị xã', 'id': 103}, {
      'name': 'Châu Đức',
      'pre': 'Huyện',
      'id': 96
    }, {'name': 'Côn Đảo', 'pre': 'Huyện', 'id': 97}, {
      'name': 'Long Điền',
      'pre': 'Huyện',
      'id': 99
    }, {'name': 'Phú Mỹ', 'pre': 'Thị xã', 'id': 100}, {
      'name': 'Vũng Tàu',
      'pre': 'Thành phố',
      'id': 102
    }, {'name': 'Xuyên Mộc', 'pre': 'Huyện', 'id': 101}, {'name': 'Đất Đỏ', 'pre': 'Huyện', 'id': 98}]
  }, {
    'code': 'BD',
    'name': 'Bình Dương',
    'districts': [{'name': 'Bàu Bàng', 'pre': 'Huyện', 'id': 716}, {
      'name': 'Bắc Tân Uyên',
      'pre': 'Huyện',
      'id': 730
    }, {'name': 'Bến Cát', 'pre': 'Thị xã', 'id': 156}, {
      'name': 'Dĩ An',
      'pre': 'Thị xã',
      'id': 158
    }, {'name': 'Dầu Tiếng', 'pre': 'Huyện', 'id': 157}, {
      'name': 'Phú Giáo',
      'pre': 'Huyện',
      'id': 159
    }, {'name': 'Thuận An', 'pre': 'Huyện', 'id': 161}, {
      'name': 'Thủ Dầu Một',
      'pre': 'Thị xã',
      'id': 163
    }, {'name': 'Tân Uyên', 'pre': 'Huyện', 'id': 160}]
  }, {
    'code': 'BP',
    'name': 'Bình Phước',
    'districts': [{'name': 'Bình Long', 'pre': 'Thị xã', 'id': 164}, {
      'name': 'Bù Gia Mập',
      'pre': 'Huyện',
      'id': 699
    }, {'name': 'Bù Đăng', 'pre': 'Huyện', 'id': 165}, {
      'name': 'Bù Đốp',
      'pre': 'Huyện',
      'id': 166
    }, {'name': 'Chơn Thành', 'pre': 'Huyện', 'id': 167}, {
      'name': 'Hớn Quản',
      'pre': 'Huyện',
      'id': 698
    }, {'name': 'Lộc Ninh', 'pre': 'Huyện', 'id': 169}, {
      'name': 'Phú Riềng',
      'pre': 'Huyện',
      'id': 728
    }, {'name': 'Phước Long', 'pre': 'Thị xã', 'id': 170}, {
      'name': 'Đồng Phú',
      'pre': 'Huyện',
      'id': 168
    }, {'name': 'Đồng Xoài', 'pre': 'Thị xã', 'id': 171}]
  }, {
    'code': 'BTH',
    'name': 'Bình Thuận  ',
    'districts': [{'name': 'Bắc Bình', 'pre': 'Huyện', 'id': 172}, {
      'name': 'Hàm Thuận Bắc',
      'pre': 'Huyện',
      'id': 176
    }, {'name': 'Hàm Thuận Nam', 'pre': 'Huyện', 'id': 177}, {
      'name': 'Hàm Tân',
      'pre': 'Huyện',
      'id': 175
    }, {'name': 'La Gi', 'pre': 'Thị xã', 'id': 182}, {
      'name': 'Phan Thiết',
      'pre': 'Thành phố',
      'id': 181
    }, {'name': 'Tuy Phong', 'pre': 'Huyện', 'id': 179}, {
      'name': 'Tánh Linh',
      'pre': 'Huyện',
      'id': 178
    }, {'name': 'Đảo Phú Quý', 'pre': 'Huyện', 'id': 173}, {'name': 'Đức Linh', 'pre': 'Huyện', 'id': 174}]
  }, {
    'code': 'BDD',
    'name': 'Bình Định',
    'districts': [{'name': 'An Lão', 'pre': 'Huyện', 'id': 145}, {
      'name': 'An Nhơn',
      'pre': 'Huyện',
      'id': 146
    }, {'name': 'Hoài Nhơn', 'pre': 'Huyện', 'id': 148}, {
      'name': 'Hoài Ân',
      'pre': 'Huyện',
      'id': 147
    }, {'name': 'Phù Cát', 'pre': 'Huyện', 'id': 149}, {
      'name': 'Phù Mỹ',
      'pre': 'Huyện',
      'id': 150
    }, {'name': 'Quy Nhơn', 'pre': 'Thành phố', 'id': 155}, {
      'name': 'Tuy Phước',
      'pre': 'Huyện',
      'id': 152
    }, {'name': 'Tây Sơn', 'pre': 'Huyện', 'id': 151}, {
      'name': 'Vân Canh',
      'pre': 'Huyện',
      'id': 153
    }, {'name': 'Vĩnh Thạnh', 'pre': 'Huyện', 'id': 154}]
  }, {
    'code': 'BL',
    'name': 'Bạc Liêu',
    'districts': [{'name': 'Bạc Liêu', 'pre': 'Thành phố', 'id': 128}, {
      'name': 'Giá Rai',
      'pre': 'Huyện',
      'id': 123
    }, {'name': 'Hòa Bình', 'pre': 'Huyện', 'id': 124}, {
      'name': 'Hồng Dân',
      'pre': 'Huyện',
      'id': 125
    }, {'name': 'Phước Long', 'pre': 'Huyện', 'id': 126}, {
      'name': 'Vĩnh Lợi',
      'pre': 'Huyện',
      'id': 127
    }, {'name': 'Đông Hải', 'pre': 'Huyện', 'id': 122}]
  }, {
    'code': 'BG',
    'name': 'Bắc Giang',
    'districts': [{'name': 'Bắc Giang', 'pre': 'Thành phố', 'id': 113}, {
      'name': 'Hiệp Hòa',
      'pre': 'Huyện',
      'id': 104
    }, {'name': 'Lạng Giang', 'pre': 'Huyện', 'id': 105}, {
      'name': 'Lục Nam',
      'pre': 'Huyện',
      'id': 106
    }, {'name': 'Lục Ngạn', 'pre': 'Huyện', 'id': 107}, {
      'name': 'Sơn Động',
      'pre': 'Huyện',
      'id': 108
    }, {'name': 'Tân Yên', 'pre': 'Huyện', 'id': 109}, {
      'name': 'Việt Yên',
      'pre': 'Huyện',
      'id': 110
    }, {'name': 'Yên Dũng', 'pre': 'Huyện', 'id': 111}, {'name': 'Yên Thế', 'pre': 'Huyện', 'id': 112}]
  }, {
    'code': 'BK',
    'name': 'Bắc Kạn',
    'districts': [{'name': 'Ba Bể', 'pre': 'Huyện', 'id': 114}, {
      'name': 'Bạch Thông',
      'pre': 'Huyện',
      'id': 115
    }, {'name': 'Bắc Kạn', 'pre': 'Thị xã', 'id': 121}, {
      'name': 'Chợ Mới',
      'pre': 'Huyện',
      'id': 117
    }, {'name': 'Chợ Đồn', 'pre': 'Huyện', 'id': 116}, {
      'name': 'Na Rì',
      'pre': 'Huyện',
      'id': 118
    }, {'name': 'Ngân Sơn', 'pre': 'Huyện', 'id': 119}, {'name': 'Pác Nặm', 'pre': 'Huyện', 'id': 120}]
  }, {
    'code': 'BN',
    'name': 'Bắc Ninh',
    'districts': [{'name': 'Bắc Ninh', 'pre': 'Thành phố', 'id': 136}, {
      'name': 'Gia Bình',
      'pre': 'Huyện',
      'id': 129
    }, {'name': 'Lương Tài', 'pre': 'Huyện', 'id': 130}, {
      'name': 'Quế Võ',
      'pre': 'Huyện',
      'id': 131
    }, {'name': 'Thuận Thành', 'pre': 'Huyện', 'id': 132}, {
      'name': 'Tiên Du',
      'pre': 'Huyện',
      'id': 133
    }, {'name': 'Từ Sơn', 'pre': 'Thị xã', 'id': 134}, {'name': 'Yên Phong', 'pre': 'Huyện', 'id': 135}]
  }, {
    'code': 'BTR',
    'name': 'Bến Tre',
    'districts': [{'name': 'Ba Tri', 'pre': 'Huyện', 'id': 137}, {
      'name': 'Bình Đại',
      'pre': 'Huyện',
      'id': 138
    }, {'name': 'Bến Tre', 'pre': 'Thành phố', 'id': 144}, {
      'name': 'Châu Thành',
      'pre': 'Huyện',
      'id': 139
    }, {'name': 'Chợ Lách', 'pre': 'Huyện', 'id': 140}, {
      'name': 'Giồng Trôm',
      'pre': 'Huyện',
      'id': 141
    }, {'name': 'Mỏ Cày Bắc', 'pre': 'Huyện', 'id': 705}, {
      'name': 'Mỏ Cày Nam',
      'pre': 'Huyện',
      'id': 706
    }, {'name': 'Thạnh Phú', 'pre': 'Huyện', 'id': 143}]
  }, {
    'code': 'CB',
    'name': 'Cao Bằng',
    'districts': [{'name': 'Bảo Lâm', 'pre': 'Huyện', 'id': 193}, {
      'name': 'Bảo Lạc',
      'pre': 'Huyện',
      'id': 192
    }, {'name': 'Cao Bằng', 'pre': 'Thị xã', 'id': 204}, {
      'name': 'Hà Quảng',
      'pre': 'Huyện',
      'id': 195
    }, {'name': 'Hòa An', 'pre': 'Huyện', 'id': 196}, {
      'name': 'Hạ Lang',
      'pre': 'Huyện',
      'id': 194
    }, {'name': 'Nguyên Bình', 'pre': 'Huyện', 'id': 197}, {
      'name': 'Phục Hòa',
      'pre': 'Huyện',
      'id': 198
    }, {'name': 'Quảng Uyên', 'pre': 'Huyện', 'id': 199}, {
      'name': 'Thông Nông',
      'pre': 'Huyện',
      'id': 201
    }, {'name': 'Thạch An', 'pre': 'Huyện', 'id': 200}, {
      'name': 'Trà Lĩnh',
      'pre': 'Huyện',
      'id': 202
    }, {'name': 'Trùng Khánh', 'pre': 'Huyện', 'id': 203}]
  }, {
    'code': 'CM',
    'name': 'Cà Mau',
    'districts': [{'name': 'Cà Mau', 'pre': 'Thành phố', 'id': 191}, {
      'name': 'Cái Nước',
      'pre': 'Huyện',
      'id': 183
    }, {'name': 'Ngọc Hiển', 'pre': 'Huyện', 'id': 186}, {
      'name': 'Năm Căn',
      'pre': 'Huyện',
      'id': 185
    }, {'name': 'Phú Tân', 'pre': 'Huyện', 'id': 187}, {
      'name': 'Thới Bình',
      'pre': 'Huyện',
      'id': 188
    }, {'name': 'Trần Văn Thời', 'pre': 'Huyện', 'id': 189}, {
      'name': 'U Minh',
      'pre': 'Huyện',
      'id': 190
    }, {'name': 'Đầm Dơi', 'pre': 'Huyện', 'id': 184}]
  }, {
    'code': 'CT',
    'name': 'Cần Thơ',
    'districts': [{'name': ' Thới Lai', 'pre': 'Huyện', 'id': 704}, {
      'name': 'Bình Thủy',
      'pre': 'Quận',
      'id': 81
    }, {'name': 'Cái Răng', 'pre': 'Quận', 'id': 82}, {'name': 'Cờ Đỏ', 'pre': 'Huyện', 'id': 77}, {
      'name': 'Ninh Kiều',
      'pre': 'Quận',
      'id': 83
    }, {'name': 'Phong Điền', 'pre': 'Huyện', 'id': 78}, {
      'name': 'Thốt Nốt',
      'pre': 'Quận',
      'id': 79
    }, {'name': 'Vĩnh Thạnh', 'pre': 'Huyện', 'id': 80}, {'name': 'Ô Môn', 'pre': 'Quận', 'id': 84}]
  }, {
    'code': 'GL',
    'name': 'Gia Lai',
    'districts': [{'name': 'AYun Pa', 'pre': 'Thị xã', 'id': 258}, {
      'name': 'An Khê',
      'pre': 'Thị xã',
      'id': 273
    }, {'name': 'Chư Păh', 'pre': 'Huyện', 'id': 259}, {
      'name': 'Chư Pưh',
      'pre': 'Huyện',
      'id': 710
    }, {'name': 'Chư Sê', 'pre': 'Huyện', 'id': 260}, {
      'name': 'ChưPRông',
      'pre': 'Huyện',
      'id': 261
    }, {'name': 'Ia Grai', 'pre': 'Huyện', 'id': 265}, {'name': 'Ia Pa', 'pre': 'Huyện', 'id': 266}, {
      'name': 'KBang',
      'pre': 'Huyện',
      'id': 267
    }, {'name': 'Krông Pa', 'pre': 'Huyện', 'id': 269}, {
      'name': 'Kông Chro',
      'pre': 'Huyện',
      'id': 268
    }, {'name': 'Mang Yang', 'pre': 'Huyện', 'id': 270}, {
      'name': 'Phú Thiện',
      'pre': 'Huyện',
      'id': 271
    }, {'name': 'Plei Ku', 'pre': 'Thành phố', 'id': 272}, {
      'name': 'Đăk Pơ',
      'pre': 'Huyện',
      'id': 263
    }, {'name': 'Đăk Đoa', 'pre': 'Huyện', 'id': 262}, {'name': 'Đức Cơ', 'pre': 'Huyện', 'id': 264}]
  }, {
    'code': 'HN',
    'name': 'Hà Nội',
    'districts': [{'name': 'Ba Vì', 'pre': 'Huyện', 'id': 18}, {
      'name': 'Ba Đình',
      'pre': 'Quận',
      'id': 2
    }, {'name': 'Bắc Từ Liêm', 'pre': 'Quận', 'id': 718}, {
      'name': 'Chương Mỹ',
      'pre': 'Huyện',
      'id': 24
    }, {'name': 'Cầu Giấy', 'pre': 'Quận', 'id': 7}, {
      'name': 'Gia Lâm',
      'pre': 'Huyện',
      'id': 11
    }, {'name': 'Hai Bà Trưng', 'pre': 'Quận', 'id': 4}, {
      'name': 'Hoài Đức',
      'pre': 'Huyện',
      'id': 21
    }, {'name': 'Hoàn Kiếm', 'pre': 'Quận', 'id': 1}, {'name': 'Hoàng Mai', 'pre': 'Quận', 'id': 8}, {
      'name': 'Hà Đông',
      'pre': 'Quận',
      'id': 15
    }, {'name': 'Long Biên', 'pre': 'Quận', 'id': 9}, {'name': 'Mê Linh', 'pre': 'Huyện', 'id': 17}, {
      'name': 'Mỹ Đức',
      'pre': 'Huyện',
      'id': 29
    }, {'name': 'Nam Từ Liêm', 'pre': 'Quận', 'id': 14}, {
      'name': 'Phú Xuyên',
      'pre': 'Huyện',
      'id': 27
    }, {'name': 'Phúc Thọ', 'pre': 'Huyện', 'id': 19}, {
      'name': 'Quốc Oai',
      'pre': 'Huyện',
      'id': 22
    }, {'name': 'Sóc Sơn', 'pre': 'Huyện', 'id': 12}, {
      'name': 'Sơn Tây',
      'pre': 'Thị xã',
      'id': 16
    }, {'name': 'Thanh Oai', 'pre': 'Huyện', 'id': 25}, {
      'name': 'Thanh Trì',
      'pre': 'Huyện',
      'id': 13
    }, {'name': 'Thanh Xuân', 'pre': 'Quận', 'id': 5}, {
      'name': 'Thường Tín',
      'pre': 'Huyện',
      'id': 26
    }, {'name': 'Thạch Thất', 'pre': 'Huyện', 'id': 23}, {
      'name': 'Tây Hồ',
      'pre': 'Quận',
      'id': 6
    }, {'name': 'Đan Phượng', 'pre': 'Huyện', 'id': 20}, {
      'name': 'Đông Anh',
      'pre': 'Huyện',
      'id': 10
    }, {'name': 'Đống Đa', 'pre': 'Quận', 'id': 3}, {'name': 'Ứng Hòa', 'pre': 'Huyện', 'id': 28}]
  }, {
    'code': 'HG',
    'name': 'Hà Giang',
    'districts': [{'name': 'Bắc Mê', 'pre': 'Huyện', 'id': 274}, {
      'name': 'Bắc Quang',
      'pre': 'Huyện',
      'id': 275
    }, {'name': 'Hoàng Su Phì', 'pre': 'Huyện', 'id': 277}, {
      'name': 'Hà Giang',
      'pre': 'Thành phố',
      'id': 284
    }, {'name': 'Mèo Vạc', 'pre': 'Huyện', 'id': 278}, {
      'name': 'Quang Bình',
      'pre': 'Huyện',
      'id': 280
    }, {'name': 'Quản Bạ', 'pre': 'Huyện', 'id': 279}, {
      'name': 'Vị Xuyên',
      'pre': 'Huyện',
      'id': 281
    }, {'name': 'Xín Mần', 'pre': 'Huyện', 'id': 282}, {
      'name': 'Yên Minh',
      'pre': 'Huyện',
      'id': 283
    }, {'name': 'Đồng Văn', 'pre': 'Huyện', 'id': 276}]
  }, {
    'code': 'HNA',
    'name': 'Hà Nam',
    'districts': [{'name': 'Bình Lục', 'pre': 'Huyện', 'id': 285}, {
      'name': 'Duy Tiên',
      'pre': 'Huyện',
      'id': 286
    }, {'name': 'Kim Bảng', 'pre': 'Huyện', 'id': 287}, {
      'name': 'Lý Nhân',
      'pre': 'Huyện',
      'id': 288
    }, {'name': 'Phủ Lý', 'pre': 'Thành phố', 'id': 290}, {'name': 'Thanh Liêm', 'pre': 'Huyện', 'id': 289}]
  }, {
    'code': 'HT',
    'name': 'Hà Tĩnh',
    'districts': [{'name': 'Can Lộc', 'pre': 'Huyện', 'id': 292}, {
      'name': 'Cẩm Xuyên',
      'pre': 'Huyện',
      'id': 291
    }, {'name': 'Hà Tĩnh', 'pre': 'Thành phố', 'id': 301}, {
      'name': 'Hương Khê',
      'pre': 'Huyện',
      'id': 294
    }, {'name': 'Hương Sơn', 'pre': 'Huyện', 'id': 295}, {
      'name': 'Hồng Lĩnh',
      'pre': 'Thị xã',
      'id': 302
    }, {'name': 'Kỳ Anh', 'pre': 'Huyện', 'id': 296}, {
      'name': 'Lộc Hà',
      'pre': 'Huyện',
      'id': 297
    }, {'name': 'Nghi Xuân', 'pre': 'Huyện', 'id': 298}, {
      'name': 'Thạch Hà',
      'pre': 'Huyện',
      'id': 299
    }, {'name': 'Vũ Quang', 'pre': 'Huyện', 'id': 300}, {'name': 'Đức Thọ', 'pre': 'Huyện', 'id': 293}]
  }, {
    'code': 'HB',
    'name': 'Hòa Bình',
    'districts': [{'name': 'Cao Phong', 'pre': 'Huyện', 'id': 322}, {
      'name': 'Hòa Bình',
      'pre': 'Thành phố',
      'id': 332
    }, {'name': 'Kim Bôi', 'pre': 'Huyện', 'id': 324}, {
      'name': 'Kỳ Sơn',
      'pre': 'Huyện',
      'id': 325
    }, {'name': 'Lương Sơn', 'pre': 'Huyện', 'id': 328}, {
      'name': 'Lạc Sơn',
      'pre': 'Huyện',
      'id': 326
    }, {'name': 'Lạc Thủy', 'pre': 'Huyện', 'id': 327}, {
      'name': 'Mai Châu',
      'pre': 'Huyện',
      'id': 329
    }, {'name': 'Tân Lạc', 'pre': 'Huyện', 'id': 330}, {
      'name': 'Yên Thủy',
      'pre': 'Huyện',
      'id': 331
    }, {'name': 'Đà Bắc', 'pre': 'Huyện', 'id': 323}]
  }, {
    'code': 'HY',
    'name': 'Hưng Yên',
    'districts': [{'name': 'Hưng Yên', 'pre': 'Thành phố', 'id': 342}, {
      'name': 'Khoái Châu',
      'pre': 'Huyện',
      'id': 334
    }, {'name': 'Kim Động', 'pre': 'Huyện', 'id': 335}, {
      'name': 'Mỹ Hào',
      'pre': 'Huyện',
      'id': 336
    }, {'name': 'Phù Cừ', 'pre': 'Huyện', 'id': 337}, {
      'name': 'Tiên Lữ',
      'pre': 'Huyện',
      'id': 338
    }, {'name': 'Văn Giang', 'pre': 'Huyện', 'id': 339}, {
      'name': 'Văn Lâm',
      'pre': 'Huyện',
      'id': 340
    }, {'name': 'Yên Mỹ', 'pre': 'Huyện', 'id': 341}, {'name': 'Ân Thi', 'pre': 'Huyện', 'id': 333}]
  }, {
    'code': 'HD',
    'name': 'Hải Dương',
    'districts': [{'name': 'Bình Giang', 'pre': 'Huyện', 'id': 303}, {
      'name': 'Chí Linh',
      'pre': 'Thị xã',
      'id': 305
    }, {'name': 'Cẩm Giàng', 'pre': 'Huyện', 'id': 304}, {
      'name': 'Gia Lộc',
      'pre': 'Huyện',
      'id': 306
    }, {'name': 'Hải Dương', 'pre': 'Thành phố', 'id': 314}, {
      'name': 'Kim Thành',
      'pre': 'Huyện',
      'id': 307
    }, {'name': 'Kinh Môn', 'pre': 'Huyện', 'id': 308}, {
      'name': 'Nam Sách',
      'pre': 'Huyện',
      'id': 309
    }, {'name': 'Ninh Giang', 'pre': 'Huyện', 'id': 310}, {
      'name': 'Thanh Hà',
      'pre': 'Huyện',
      'id': 311
    }, {'name': 'Thanh Miện', 'pre': 'Huyện', 'id': 312}, {'name': 'Tứ Kỳ', 'pre': 'Huyện', 'id': 313}]
  }, {
    'code': 'HP',
    'name': 'Hải Phòng',
    'districts': [{'name': 'An Dương', 'pre': 'Huyện', 'id': 37}, {
      'name': 'An Lão',
      'pre': 'Huyện',
      'id': 38
    }, {'name': 'Bạch Long Vĩ', 'pre': 'Huyện', 'id': 39}, {
      'name': 'Cát Hải',
      'pre': 'Huyện',
      'id': 40
    }, {'name': 'Dương Kinh', 'pre': 'Quận', 'id': 31}, {
      'name': 'Hải An',
      'pre': 'Quận',
      'id': 32
    }, {'name': 'Hồng Bàng', 'pre': 'Quận', 'id': 33}, {
      'name': 'Kiến An',
      'pre': 'Quận',
      'id': 34
    }, {'name': 'Kiến Thụy', 'pre': 'Huyện', 'id': 41}, {
      'name': 'Lê Chân',
      'pre': 'Quận',
      'id': 35
    }, {'name': 'Ngô Quyền', 'pre': 'Quận', 'id': 36}, {
      'name': 'Thủy Nguyên',
      'pre': 'Huyện',
      'id': 42
    }, {'name': 'Tiên Lãng', 'pre': 'Huyện', 'id': 43}, {
      'name': 'Vĩnh Bảo',
      'pre': 'Huyện',
      'id': 44
    }, {'name': 'Đồ Sơn', 'pre': 'Quận', 'id': 30}]
  }, {
    'code': 'HGI',
    'name': 'Hậu Giang',
    'districts': [{'name': 'Châu Thành', 'pre': 'Huyện', 'id': 315}, {
      'name': 'Châu Thành A',
      'pre': 'Huyện',
      'id': 316
    }, {'name': 'Long Mỹ', 'pre': 'Huyện', 'id': 317}, {
      'name': 'Ngã Bảy',
      'pre': 'Thị xã',
      'id': 320
    }, {'name': 'Phụng Hiệp', 'pre': 'Huyện', 'id': 318}, {
      'name': 'Vị Thanh',
      'pre': 'Thành phố',
      'id': 321
    }, {'name': 'Vị Thủy', 'pre': 'Huyện', 'id': 319}]
  }, {
    'code': 'SG',
    'name': 'Hồ Chí Minh',
    'districts': [{'name': 'Bình Chánh', 'pre': 'Huyện', 'id': 72}, {
      'name': 'Bình Thạnh',
      'pre': 'Quận',
      'id': 66
    }, {'name': 'Bình Tân', 'pre': 'Quận', 'id': 65}, {'name': 'Cần Giờ', 'pre': 'Huyện', 'id': 73}, {
      'name': 'Củ Chi',
      'pre': 'Huyện',
      'id': 74
    }, {'name': 'Gò Vấp', 'pre': 'Quận', 'id': 67}, {'name': 'Hóc Môn', 'pre': 'Huyện', 'id': 75}, {
      'name': 'Nhà Bè',
      'pre': 'Huyện',
      'id': 76
    }, {'name': 'Phú Nhuận', 'pre': 'Quận', 'id': 68}, {'name': 'Quận 1', 'pre': '', 'id': 53}, {
      'name': 'Quận 10',
      'pre': '',
      'id': 62
    }, {'name': 'Quận 11', 'pre': '', 'id': 63}, {'name': 'Quận 12', 'pre': '', 'id': 64}, {
      'name': 'Quận 2',
      'pre': '',
      'id': 54
    }, {'name': 'Quận 3', 'pre': '', 'id': 55}, {'name': 'Quận 4', 'pre': '', 'id': 56}, {
      'name': 'Quận 5',
      'pre': '',
      'id': 57
    }, {'name': 'Quận 6', 'pre': '', 'id': 58}, {'name': 'Quận 7', 'pre': '', 'id': 59}, {
      'name': 'Quận 8',
      'pre': '',
      'id': 60
    }, {'name': 'Quận 9', 'pre': '', 'id': 61}, {'name': 'Thủ Đức', 'pre': 'Quận', 'id': 71}, {
      'name': 'Tân Bình',
      'pre': 'Quận',
      'id': 69
    }, {'name': 'Tân Phú', 'pre': 'Quận', 'id': 70}]
  }, {
    'code': 'KH',
    'name': 'Khánh Hòa',
    'districts': [{'name': 'Cam Lâm', 'pre': 'Huyện', 'id': 343}, {
      'name': 'Cam Ranh',
      'pre': 'Thành phố',
      'id': 351
    }, {'name': 'Diên Khánh', 'pre': 'Huyện', 'id': 344}, {
      'name': 'Khánh Sơn',
      'pre': 'Huyện',
      'id': 345
    }, {'name': 'Khánh Vĩnh', 'pre': 'Huyện', 'id': 346}, {
      'name': 'Nha Trang',
      'pre': 'Thành phố',
      'id': 350
    }, {'name': 'Ninh Hòa', 'pre': 'Thị xã', 'id': 347}, {
      'name': 'Trường Sa',
      'pre': 'Huyện',
      'id': 348
    }, {'name': 'Vạn Ninh', 'pre': 'Huyện', 'id': 349}]
  }, {
    'code': 'KG',
    'name': 'Kiên Giang',
    'districts': [{'name': 'An Biên', 'pre': 'Huyện', 'id': 352}, {
      'name': 'An Minh',
      'pre': 'Huyện',
      'id': 353
    }, {'name': 'Châu Thành', 'pre': 'Huyện', 'id': 354}, {
      'name': 'Giang Thành',
      'pre': 'Huyện',
      'id': 723
    }, {'name': 'Giồng Riềng', 'pre': 'Huyện', 'id': 355}, {
      'name': 'Gò Quao',
      'pre': 'Huyện',
      'id': 356
    }, {'name': 'Hà Tiên', 'pre': 'Thị xã', 'id': 365}, {
      'name': 'Hòn Đất',
      'pre': 'Huyện',
      'id': 357
    }, {'name': 'Kiên Hải', 'pre': 'Huyện', 'id': 358}, {
      'name': 'Kiên Lương',
      'pre': 'Huyện',
      'id': 359
    }, {'name': 'Phú Quốc', 'pre': 'Huyện', 'id': 360}, {
      'name': 'Rạch Giá',
      'pre': 'Thành phố',
      'id': 364
    }, {'name': 'Tân Hiệp', 'pre': 'Huyện', 'id': 361}, {
      'name': 'U minh Thượng',
      'pre': 'Huyện',
      'id': 362
    }, {'name': 'Vĩnh Thuận', 'pre': 'Huyện', 'id': 363}]
  }, {
    'code': 'KT',
    'name': 'Kon Tum',
    'districts': [{'name': 'Ia H\'Drai', 'pre': 'Huyện', 'id': 729}, {
      'name': 'Kon Plông',
      'pre': 'Huyện',
      'id': 369
    }, {'name': 'Kon Rẫy', 'pre': 'Huyện', 'id': 370}, {
      'name': 'KonTum',
      'pre': 'Thành phố',
      'id': 374
    }, {'name': 'Ngọc Hồi', 'pre': 'Huyện', 'id': 371}, {
      'name': 'Sa Thầy',
      'pre': 'Huyện',
      'id': 372
    }, {'name': 'Tu Mơ Rông', 'pre': 'Huyện', 'id': 373}, {
      'name': 'Đăk Glei',
      'pre': 'Huyện',
      'id': 366
    }, {'name': 'Đăk Hà', 'pre': 'Huyện', 'id': 367}, {'name': 'Đăk Tô', 'pre': 'Huyện', 'id': 368}]
  }, {
    'code': 'LCH',
    'name': 'Lai Châu',
    'districts': [{'name': 'Lai Châu', 'pre': 'Thị xã', 'id': 380}, {
      'name': 'Mường Tè',
      'pre': 'Huyện',
      'id': 375
    }, {'name': 'Nậm Nhùn', 'pre': 'Huyện', 'id': 709}, {
      'name': 'Phong Thổ',
      'pre': 'Huyện',
      'id': 376
    }, {'name': 'Sìn Hồ', 'pre': 'Huyện', 'id': 377}, {
      'name': 'Tam Đường',
      'pre': 'Huyện',
      'id': 378
    }, {'name': 'Than Uyên', 'pre': 'Huyện', 'id': 379}, {'name': 'Tân Uyên', 'pre': 'Huyện', 'id': 691}]
  }, {
    'code': 'LA',
    'name': 'Long An',
    'districts': [{'name': 'Bến Lức', 'pre': 'Huyện', 'id': 415}, {
      'name': 'Châu Thành',
      'pre': 'Huyện',
      'id': 418
    }, {'name': 'Cần Giuộc', 'pre': 'Huyện', 'id': 417}, {
      'name': 'Cần Đước',
      'pre': 'Huyện',
      'id': 416
    }, {'name': 'Kiến Tường', 'pre': 'Thị xã', 'id': 724}, {
      'name': 'Mộc Hóa',
      'pre': 'Huyện',
      'id': 421
    }, {'name': 'Thạnh Hóa', 'pre': 'Huyện', 'id': 425}, {
      'name': 'Thủ Thừa',
      'pre': 'Huyện',
      'id': 426
    }, {'name': 'Tân An', 'pre': 'Thành phố', 'id': 429}, {
      'name': 'Tân Hưng',
      'pre': 'Huyện',
      'id': 422
    }, {'name': 'Tân Thạnh', 'pre': 'Huyện', 'id': 423}, {
      'name': 'Tân Trụ',
      'pre': 'Huyện',
      'id': 424
    }, {'name': 'Vĩnh Hưng', 'pre': 'Huyện', 'id': 427}, {
      'name': 'Đức Huệ',
      'pre': 'Huyện',
      'id': 420
    }, {'name': 'Đức Hòa', 'pre': 'Huyện', 'id': 419}]
  }, {
    'code': 'LCA',
    'name': 'Lào Cai',
    'districts': [{'name': 'Bát Xát', 'pre': 'Huyện', 'id': 407}, {
      'name': 'Bảo Thắng',
      'pre': 'Huyện',
      'id': 405
    }, {'name': 'Bảo Yên', 'pre': 'Huyện', 'id': 406}, {
      'name': 'Bắc Hà',
      'pre': 'Huyện',
      'id': 404
    }, {'name': 'Lào Cai', 'pre': 'Thành phố', 'id': 414}, {
      'name': 'Mường Khương',
      'pre': 'Huyện',
      'id': 408
    }, {'name': 'Sa Pa', 'pre': 'Huyện', 'id': 409}, {
      'name': 'Văn Bàn',
      'pre': 'Huyện',
      'id': 410
    }, {'name': 'Xi Ma Cai', 'pre': 'Huyện', 'id': 411}]
  }, {
    'code': 'LDD',
    'name': 'Lâm Đồng',
    'districts': [{'name': 'Bảo Lâm', 'pre': 'Huyện', 'id': 381}, {
      'name': 'Bảo Lộc',
      'pre': 'Thành phố',
      'id': 392
    }, {'name': 'Cát Tiên', 'pre': 'Huyện', 'id': 382}, {
      'name': 'Di Linh',
      'pre': 'Huyện',
      'id': 386
    }, {'name': 'Lâm Hà', 'pre': 'Huyện', 'id': 390}, {
      'name': 'Lạc Dương',
      'pre': 'Huyện',
      'id': 389
    }, {'name': 'Đam Rông', 'pre': 'Huyện', 'id': 385}, {
      'name': 'Đà Lạt',
      'pre': 'Thành phố',
      'id': 391
    }, {'name': 'Đơn Dương', 'pre': 'Huyện', 'id': 387}, {
      'name': 'Đạ Huoai',
      'pre': 'Huyện',
      'id': 383
    }, {'name': 'Đạ Tẻh', 'pre': 'Huyện', 'id': 384}, {'name': 'Đức Trọng', 'pre': 'Huyện', 'id': 388}]
  }, {
    'code': 'LS',
    'name': 'Lạng Sơn',
    'districts': [{'name': 'Bình Gia', 'pre': 'Huyện', 'id': 394}, {
      'name': 'Bắc Sơn',
      'pre': 'Huyện',
      'id': 393
    }, {'name': 'Cao Lộc', 'pre': 'Huyện', 'id': 395}, {
      'name': 'Chi Lăng',
      'pre': 'Huyện',
      'id': 396
    }, {'name': 'Hữu Lũng', 'pre': 'Huyện', 'id': 398}, {
      'name': 'Lạng Sơn',
      'pre': 'Thành phố',
      'id': 403
    }, {'name': 'Lộc Bình', 'pre': 'Huyện', 'id': 399}, {
      'name': 'Tràng Định',
      'pre': 'Huyện',
      'id': 400
    }, {'name': 'Văn Lãng', 'pre': 'Huyện', 'id': 401}, {
      'name': 'Văn Quan',
      'pre': 'Huyện',
      'id': 402
    }, {'name': 'Đình Lập', 'pre': 'Huyện', 'id': 397}]
  }, {
    'code': 'NDD',
    'name': 'Nam Định',
    'districts': [{'name': 'Giao Thủy', 'pre': 'Huyện', 'id': 430}, {
      'name': 'Hải Hậu',
      'pre': 'Huyện',
      'id': 431
    }, {'name': 'Mỹ Lộc', 'pre': 'Huyện', 'id': 432}, {
      'name': 'Nam Trực',
      'pre': 'Huyện',
      'id': 433
    }, {'name': 'Nam Định', 'pre': 'Thành phố', 'id': 439}, {
      'name': 'Nghĩa Hưng',
      'pre': 'Huyện',
      'id': 434
    }, {'name': 'Trực Ninh', 'pre': 'Huyện', 'id': 435}, {
      'name': 'Vụ Bản',
      'pre': 'Huyện',
      'id': 436
    }, {'name': 'Xuân Trường', 'pre': 'Huyện', 'id': 437}, {'name': 'Ý Yên', 'pre': 'Huyện', 'id': 438}]
  }, {
    'code': 'NA',
    'name': 'Nghệ An',
    'districts': [{'name': 'Anh Sơn', 'pre': 'Huyện', 'id': 440}, {
      'name': 'Con Cuông',
      'pre': 'Huyện',
      'id': 441
    }, {'name': 'Cửa Lò', 'pre': 'Thị xã', 'id': 458}, {
      'name': 'Diễn Châu',
      'pre': 'Huyện',
      'id': 442
    }, {'name': 'Hoàng Mai', 'pre': 'Thị xã', 'id': 725}, {
      'name': 'Hưng Nguyên',
      'pre': 'Huyện',
      'id': 444
    }, {'name': 'Kỳ Sơn', 'pre': 'Huyện', 'id': 445}, {
      'name': 'Nam Đàn',
      'pre': 'Huyện',
      'id': 446
    }, {'name': 'Nghi Lộc', 'pre': 'Huyện', 'id': 447}, {
      'name': 'Nghĩa Đàn',
      'pre': 'Huyện',
      'id': 448
    }, {'name': 'Quế Phong', 'pre': 'Huyện', 'id': 449}, {
      'name': 'Quỳ Châu',
      'pre': 'Huyện',
      'id': 450
    }, {'name': 'Quỳ Hợp', 'pre': 'Huyện', 'id': 451}, {
      'name': 'Quỳnh Lưu',
      'pre': 'Huyện',
      'id': 452
    }, {'name': 'Thanh Chương', 'pre': 'Huyện', 'id': 454}, {
      'name': 'Thái Hòa',
      'pre': 'Thị xã',
      'id': 692
    }, {'name': 'Tân Kỳ', 'pre': 'Huyện', 'id': 453}, {
      'name': 'Tương Dương',
      'pre': 'Huyện',
      'id': 455
    }, {'name': 'Vinh', 'pre': 'Thành phố', 'id': 457}, {
      'name': 'Yên Thành',
      'pre': 'Huyện',
      'id': 456
    }, {'name': 'Đô Lương', 'pre': 'Huyện', 'id': 443}]
  }, {
    'code': 'NB',
    'name': 'Ninh Bình',
    'districts': [{'name': 'Gia Viễn', 'pre': 'Huyện', 'id': 459}, {
      'name': 'Hoa Lư',
      'pre': 'Huyện',
      'id': 460
    }, {'name': 'Kim Sơn', 'pre': 'Huyện', 'id': 461}, {
      'name': 'Nho Quan',
      'pre': 'Huyện',
      'id': 462
    }, {'name': 'Ninh Bình', 'pre': 'Thành phố', 'id': 465}, {
      'name': 'Tam Điệp',
      'pre': 'Thị xã',
      'id': 466
    }, {'name': 'Yên Khánh', 'pre': 'Huyện', 'id': 463}, {'name': 'Yên Mô', 'pre': 'Huyện', 'id': 464}]
  }, {
    'code': 'NT',
    'name': 'Ninh Thuận',
    'districts': [{'name': 'Bác Ái', 'pre': 'Huyện', 'id': 467}, {
      'name': 'Ninh Hải',
      'pre': 'Huyện',
      'id': 468
    }, {'name': 'Ninh Phước', 'pre': 'Huyện', 'id': 469}, {
      'name': 'Ninh Sơn',
      'pre': 'Huyện',
      'id': 470
    }, {'name': 'Phan Rang - Tháp Chàm', 'pre': 'Thành phố', 'id': 472}, {
      'name': 'Thuận Bắc',
      'pre': 'Huyện',
      'id': 471
    }, {'name': 'Thuận Nam', 'pre': 'Huyện', 'id': 693}]
  }, {
    'code': 'PT',
    'name': 'Phú Thọ',
    'districts': [{'name': 'Cẩm Khê', 'pre': 'Huyện', 'id': 473}, {
      'name': 'Hạ Hòa',
      'pre': 'Huyện',
      'id': 475
    }, {'name': 'Lâm Thao', 'pre': 'Huyện', 'id': 476}, {
      'name': 'Phù Ninh',
      'pre': 'Huyện',
      'id': 477
    }, {'name': 'Phú Thọ', 'pre': 'Thị xã', 'id': 486}, {
      'name': 'Tam Nông',
      'pre': 'Huyện',
      'id': 478
    }, {'name': 'Thanh Ba', 'pre': 'Huyện', 'id': 480}, {
      'name': 'Thanh Sơn',
      'pre': 'Huyện',
      'id': 481
    }, {'name': 'Thanh Thủy', 'pre': 'Huyện', 'id': 482}, {
      'name': 'Tân Sơn',
      'pre': 'Huyện',
      'id': 479
    }, {'name': 'Việt Trì', 'pre': 'Thành phố', 'id': 485}, {
      'name': 'Yên Lập',
      'pre': 'Huyện',
      'id': 483
    }, {'name': 'Đoan Hùng', 'pre': 'Huyện', 'id': 474}]
  }, {
    'code': 'PY',
    'name': 'Phú Yên',
    'districts': [{'name': 'Phú Hòa', 'pre': 'Huyện', 'id': 489}, {
      'name': 'Sông Cầu',
      'pre': 'Thị xã',
      'id': 491
    }, {'name': 'Sông Hinh', 'pre': 'Huyện', 'id': 492}, {
      'name': 'Sơn Hòa',
      'pre': 'Huyện',
      'id': 490
    }, {'name': 'Tuy An', 'pre': 'Huyện', 'id': 494}, {
      'name': 'Tuy Hòa',
      'pre': 'Thành phố',
      'id': 495
    }, {'name': 'Tây Hòa', 'pre': 'Huyện', 'id': 493}, {
      'name': 'Đông Hòa',
      'pre': 'Huyện',
      'id': 487
    }, {'name': 'Đồng Xuân', 'pre': 'Huyện', 'id': 488}]
  }, {
    'code': 'QB',
    'name': 'Quảng Bình',
    'districts': [{'name': 'Ba Đồn', 'pre': 'Thị xã', 'id': 720}, {
      'name': 'Bố Trạch',
      'pre': 'Huyện',
      'id': 496
    }, {'name': 'Lệ Thủy', 'pre': 'Huyện', 'id': 497}, {
      'name': 'Minh Hóa',
      'pre': 'Huyện',
      'id': 498
    }, {'name': 'Quảng Ninh', 'pre': 'Huyện', 'id': 499}, {
      'name': 'Quảng Trạch',
      'pre': 'Huyện',
      'id': 500
    }, {'name': 'Tuyên Hóa', 'pre': 'Huyện', 'id': 501}, {'name': 'Đồng Hới', 'pre': 'Thành phố', 'id': 502}]
  }, {
    'code': 'QNA',
    'name': 'Quảng Nam',
    'districts': [{'name': 'Bắc Trà My', 'pre': 'Huyện', 'id': 503}, {
      'name': 'Duy Xuyên',
      'pre': 'Huyện',
      'id': 507
    }, {'name': 'Hiệp Đức', 'pre': 'Huyện', 'id': 508}, {
      'name': 'Hội An',
      'pre': 'Thành phố',
      'id': 520
    }, {'name': 'Nam Giang', 'pre': 'Huyện', 'id': 509}, {
      'name': 'Nam Trà My',
      'pre': 'Huyện',
      'id': 510
    }, {'name': 'Nông Sơn', 'pre': 'Huyện', 'id': 694}, {
      'name': 'Núi Thành',
      'pre': 'Huyện',
      'id': 511
    }, {'name': 'Phú Ninh', 'pre': 'Huyện', 'id': 512}, {
      'name': 'Phước Sơn',
      'pre': 'Huyện',
      'id': 513
    }, {'name': 'Quế Sơn', 'pre': 'Huyện', 'id': 514}, {
      'name': 'Tam Kỳ',
      'pre': 'Thành phố',
      'id': 519
    }, {'name': 'Thăng Bình', 'pre': 'Huyện', 'id': 516}, {
      'name': 'Tiên Phước',
      'pre': 'Huyện',
      'id': 517
    }, {'name': 'Tây Giang', 'pre': 'Huyện', 'id': 515}, {
      'name': 'Điện Bàn',
      'pre': 'Huyện',
      'id': 505
    }, {'name': 'Đông Giang', 'pre': 'Huyện', 'id': 506}, {'name': 'Đại Lộc', 'pre': 'Huyện', 'id': 504}]
  }, {
    'code': 'QNG',
    'name': 'Quảng Ngãi',
    'districts': [{'name': 'Ba Tơ', 'pre': 'Huyện', 'id': 521}, {
      'name': 'Bình Sơn',
      'pre': 'Huyện',
      'id': 522
    }, {'name': 'Lý Sơn', 'pre': 'Huyện', 'id': 524}, {
      'name': 'Minh Long',
      'pre': 'Huyện',
      'id': 525
    }, {'name': 'Mộ Đức', 'pre': 'Huyện', 'id': 526}, {
      'name': 'Nghĩa Hành',
      'pre': 'Huyện',
      'id': 527
    }, {'name': 'Quảng Ngãi', 'pre': 'Thành phố', 'id': 534}, {
      'name': 'Sơn Hà',
      'pre': 'Huyện',
      'id': 528
    }, {'name': 'Sơn Tây', 'pre': 'Huyện', 'id': 529}, {
      'name': 'Sơn Tịnh',
      'pre': 'Huyện',
      'id': 530
    }, {'name': 'Trà Bồng', 'pre': 'Huyện', 'id': 532}, {
      'name': 'Tây Trà',
      'pre': 'Huyện',
      'id': 531
    }, {'name': 'Tư Nghĩa', 'pre': 'Huyện', 'id': 533}, {'name': 'Đức Phổ', 'pre': 'Huyện', 'id': 523}]
  }, {
    'code': 'QNI',
    'name': 'Quảng Ninh',
    'districts': [{'name': 'Ba Chẽ', 'pre': 'Huyện', 'id': 535}, {
      'name': 'Bình Liêu',
      'pre': 'Huyện',
      'id': 536
    }, {'name': 'Cô Tô', 'pre': 'Huyện', 'id': 537}, {
      'name': 'Cẩm Phả',
      'pre': 'Thành phố',
      'id': 547
    }, {'name': 'Hoành Bồ', 'pre': 'Huyện', 'id': 541}, {
      'name': 'Hạ Long',
      'pre': 'Thành phố',
      'id': 546
    }, {'name': 'Hải Hà', 'pre': 'Huyện', 'id': 540}, {
      'name': 'Móng Cái',
      'pre': 'Thành phố',
      'id': 548
    }, {'name': 'Quảng Yên', 'pre': 'Huyện', 'id': 708}, {
      'name': 'Tiên Yên',
      'pre': 'Huyện',
      'id': 542
    }, {'name': 'Uông Bí', 'pre': 'Thị xã', 'id': 549}, {
      'name': 'Vân Đồn',
      'pre': 'Huyện',
      'id': 543
    }, {'name': 'Đông Triều', 'pre': 'Huyện', 'id': 539}, {'name': 'Đầm Hà', 'pre': 'Huyện', 'id': 538}]
  }, {
    'code': 'QT',
    'name': 'Quảng Trị',
    'districts': [{'name': 'Cam Lộ', 'pre': 'Huyện', 'id': 550}, {
      'name': 'Gio Linh',
      'pre': 'Huyện',
      'id': 553
    }, {'name': 'Hướng Hóa', 'pre': 'Huyện', 'id': 555}, {
      'name': 'Hải Lăng',
      'pre': 'Huyện',
      'id': 554
    }, {'name': 'Quảng Trị', 'pre': 'Thị xã', 'id': 559}, {
      'name': 'Triệu Phong',
      'pre': 'Huyện',
      'id': 556
    }, {'name': 'Vĩnh Linh', 'pre': 'Huyện', 'id': 557}, {
      'name': 'Đa Krông',
      'pre': 'Huyện',
      'id': 551
    }, {'name': 'Đông Hà', 'pre': 'Thành phố', 'id': 558}, {'name': 'Đảo Cồn cỏ', 'pre': 'Huyện', 'id': 552}]
  }, {
    'code': 'ST',
    'name': 'Sóc Trăng',
    'districts': [{'name': 'Châu Thành', 'pre': 'Huyện', 'id': 695}, {
      'name': 'Cù Lao Dung',
      'pre': 'Huyện',
      'id': 560
    }, {'name': 'Kế Sách', 'pre': 'Huyện', 'id': 561}, {
      'name': 'Long Phú',
      'pre': 'Huyện',
      'id': 562
    }, {'name': 'Mỹ Tú', 'pre': 'Huyện', 'id': 563}, {
      'name': 'Mỹ Xuyên',
      'pre': 'Huyện',
      'id': 564
    }, {'name': 'Ngã Năm', 'pre': 'Huyện', 'id': 565}, {
      'name': 'Sóc Trăng',
      'pre': 'Thành phố',
      'id': 568
    }, {'name': 'Thạnh Trị', 'pre': 'Huyện', 'id': 566}, {
      'name': 'Trần Đề',
      'pre': 'Huyện',
      'id': 707
    }, {'name': 'Vĩnh Châu', 'pre': 'Huyện', 'id': 567}]
  }, {
    'code': 'SL',
    'name': 'Sơn La',
    'districts': [{'name': 'Bắc Yên', 'pre': 'Huyện', 'id': 569}, {
      'name': 'Mai Sơn',
      'pre': 'Huyện',
      'id': 570
    }, {'name': 'Mường La', 'pre': 'Huyện', 'id': 572}, {
      'name': 'Mộc Châu',
      'pre': 'Huyện',
      'id': 571
    }, {'name': 'Phù Yên', 'pre': 'Huyện', 'id': 573}, {
      'name': 'Quỳnh Nhai',
      'pre': 'Huyện',
      'id': 574
    }, {'name': 'Sông Mã', 'pre': 'Huyện', 'id': 575}, {
      'name': 'Sơn La',
      'pre': 'Thành phố',
      'id': 579
    }, {'name': 'Sốp Cộp', 'pre': 'Huyện', 'id': 576}, {
      'name': 'Thuận Châu',
      'pre': 'Huyện',
      'id': 577
    }, {'name': 'Vân Hồ', 'pre': 'Huyện', 'id': 726}, {'name': 'Yên Châu', 'pre': 'Huyện', 'id': 578}]
  }, {
    'code': 'TH',
    'name': 'Thanh Hóa',
    'districts': [{'name': 'Bá Thước', 'pre': 'Huyện', 'id': 606}, {
      'name': 'Bỉm Sơn',
      'pre': 'Thị xã',
      'id': 631
    }, {'name': 'Cẩm Thủy', 'pre': 'Huyện', 'id': 607}, {
      'name': 'Hoằng Hóa',
      'pre': 'Huyện',
      'id': 611
    }, {'name': 'Hà Trung', 'pre': 'Huyện', 'id': 609}, {
      'name': 'Hậu Lộc',
      'pre': 'Huyện',
      'id': 610
    }, {'name': 'Lang Chánh', 'pre': 'Huyện', 'id': 612}, {
      'name': 'Mường Lát',
      'pre': 'Huyện',
      'id': 613
    }, {'name': 'Nga Sơn', 'pre': 'Huyện', 'id': 614}, {
      'name': 'Ngọc Lặc',
      'pre': 'Huyện',
      'id': 615
    }, {'name': 'Như Thanh', 'pre': 'Huyện', 'id': 616}, {
      'name': 'Như Xuân',
      'pre': 'Huyện',
      'id': 617
    }, {'name': 'Nông Cống', 'pre': 'Huyện', 'id': 618}, {
      'name': 'Quan Hóa',
      'pre': 'Huyện',
      'id': 619
    }, {'name': 'Quan Sơn', 'pre': 'Huyện', 'id': 620}, {
      'name': 'Quảng Xương',
      'pre': 'Huyện',
      'id': 621
    }, {'name': 'Sầm Sơn', 'pre': 'Thị xã', 'id': 632}, {
      'name': 'Thanh Hóa',
      'pre': 'Thành phố',
      'id': 630
    }, {'name': 'Thiệu Hóa', 'pre': 'Huyện', 'id': 623}, {
      'name': 'Thường Xuân',
      'pre': 'Huyện',
      'id': 625
    }, {'name': 'Thạch Thành', 'pre': 'Huyện', 'id': 622}, {
      'name': 'Thọ Xuân',
      'pre': 'Huyện',
      'id': 624
    }, {'name': 'Triệu Sơn', 'pre': 'Huyện', 'id': 627}, {
      'name': 'Tĩnh Gia',
      'pre': 'Huyện',
      'id': 626
    }, {'name': 'Vĩnh Lộc', 'pre': 'Huyện', 'id': 628}, {
      'name': 'Yên Định',
      'pre': 'Huyện',
      'id': 629
    }, {'name': 'Đông Sơn', 'pre': 'Huyện', 'id': 608}]
  }, {
    'code': 'TB',
    'name': 'Thái Bình',
    'districts': [{'name': 'Hưng Hà', 'pre': 'Huyện', 'id': 590}, {
      'name': 'Kiến Xương',
      'pre': 'Huyện',
      'id': 591
    }, {'name': 'Quỳnh Phụ', 'pre': 'Huyện', 'id': 592}, {
      'name': 'Thái Bình',
      'pre': 'Thành phố',
      'id': 596
    }, {'name': 'Thái Thuỵ', 'pre': 'Huyện', 'id': 593}, {
      'name': 'Tiền Hải',
      'pre': 'Huyện',
      'id': 594
    }, {'name': 'Vũ Thư', 'pre': 'Huyện', 'id': 595}, {'name': 'Đông Hưng', 'pre': 'Huyện', 'id': 589}]
  }, {
    'code': 'TN',
    'name': 'Thái Nguyên',
    'districts': [{'name': 'Phú Bình', 'pre': 'Huyện', 'id': 601}, {
      'name': 'Phú Lương',
      'pre': 'Huyện',
      'id': 602
    }, {'name': 'Phổ Yên', 'pre': 'Huyện', 'id': 600}, {
      'name': 'Sông Công',
      'pre': 'Thị xã',
      'id': 605
    }, {'name': 'Thái Nguyên', 'pre': 'Thành phố', 'id': 604}, {
      'name': 'Võ Nhai',
      'pre': 'Huyện',
      'id': 603
    }, {'name': 'Đại Từ', 'pre': 'Huyện', 'id': 597}, {
      'name': 'Định Hóa',
      'pre': 'Huyện',
      'id': 598
    }, {'name': 'Đồng Hỷ', 'pre': 'Huyện', 'id': 599}]
  }, {
    'code': 'TTH',
    'name': 'Thừa Thiên Huế',
    'districts': [{'name': 'A Lưới', 'pre': 'Huyện', 'id': 633}, {
      'name': 'Huế',
      'pre': 'Thành phố',
      'id': 641
    }, {'name': 'Hương Thủy', 'pre': 'Thị xã', 'id': 634}, {
      'name': 'Hương Trà',
      'pre': 'Huyện',
      'id': 635
    }, {'name': 'Nam Đông', 'pre': 'Huyện', 'id': 636}, {
      'name': 'Phong Điền',
      'pre': 'Huyện',
      'id': 637
    }, {'name': 'Phú Lộc', 'pre': 'Huyện', 'id': 638}, {
      'name': 'Phú Vang',
      'pre': 'Huyện',
      'id': 639
    }, {'name': 'Quảng Điền', 'pre': 'Huyện', 'id': 640}]
  }, {
    'code': 'TG',
    'name': 'Tiền Giang',
    'districts': [{'name': 'Cai Lậy', 'pre': 'Thị xã', 'id': 727}, {
      'name': 'Châu Thành',
      'pre': 'Huyện',
      'id': 644
    }, {'name': 'Chợ Gạo', 'pre': 'Huyện', 'id': 645}, {
      'name': 'Cái Bè',
      'pre': 'Huyện',
      'id': 642
    }, {'name': 'Gò Công', 'pre': 'Thị xã', 'id': 651}, {
      'name': 'Gò Công Tây',
      'pre': 'Huyện',
      'id': 647
    }, {'name': 'Gò Công Đông', 'pre': 'Huyện', 'id': 646}, {
      'name': 'Huyện Cai Lậy',
      'pre': 'Huyện',
      'id': 643
    }, {'name': 'Mỹ Tho', 'pre': 'Thành phố', 'id': 650}, {
      'name': 'Tân Phú Đông',
      'pre': 'Huyện',
      'id': 649
    }, {'name': 'Tân Phước', 'pre': 'Huyện', 'id': 648}]
  }, {
    'code': 'TV',
    'name': 'Trà Vinh',
    'districts': [{'name': 'Châu Thành', 'pre': 'Huyện', 'id': 655}, {
      'name': 'Càng Long',
      'pre': 'Huyện',
      'id': 652
    }, {'name': 'Cầu Kè', 'pre': 'Huyện', 'id': 653}, {
      'name': 'Cầu Ngang',
      'pre': 'Huyện',
      'id': 654
    }, {'name': 'Duyên Hải', 'pre': 'Huyện', 'id': 656}, {
      'name': 'Tiểu Cần',
      'pre': 'Huyện',
      'id': 657
    }, {'name': 'Trà Cú', 'pre': 'Huyện', 'id': 658}, {'name': 'Trà Vinh', 'pre': 'Thành phố', 'id': 659}]
  }, {
    'code': 'TQ',
    'name': 'Tuyên Quang',
    'districts': [{'name': 'Chiêm Hóa', 'pre': 'Huyện', 'id': 660}, {
      'name': 'Hàm Yên',
      'pre': 'Huyện',
      'id': 661
    }, {'name': 'Lâm Bình', 'pre': 'Huyện', 'id': 712}, {
      'name': 'Na Hang',
      'pre': 'Huyện',
      'id': 662
    }, {'name': 'Sơn Dương', 'pre': 'Huyện', 'id': 663}, {
      'name': 'Tuyên Quang',
      'pre': 'Thành phố',
      'id': 665
    }, {'name': 'Yên Sơn', 'pre': 'Huyện', 'id': 664}]
  }, {
    'code': 'TNI',
    'name': 'Tây Ninh',
    'districts': [{'name': 'Bến Cầu', 'pre': 'Huyện', 'id': 580}, {
      'name': 'Châu Thành',
      'pre': 'Huyện',
      'id': 581
    }, {'name': 'Dương Minh Châu', 'pre': 'Huyện', 'id': 582}, {
      'name': 'Gò Dầu',
      'pre': 'Huyện',
      'id': 583
    }, {'name': 'Hòa Thành', 'pre': 'Huyện', 'id': 584}, {
      'name': 'Trảng Bàng',
      'pre': 'Huyện',
      'id': 587
    }, {'name': 'Tân Biên', 'pre': 'Huyện', 'id': 585}, {
      'name': 'Tân Châu',
      'pre': 'Huyện',
      'id': 586
    }, {'name': 'Tây Ninh', 'pre': 'Thị xã', 'id': 588}]
  }, {
    'code': 'VL',
    'name': 'Vĩnh Long',
    'districts': [{'name': 'Bình Minh', 'pre': 'Huyện', 'id': 666}, {
      'name': 'Bình Tân',
      'pre': 'Quận',
      'id': 667
    }, {'name': 'Long Hồ', 'pre': 'Huyện', 'id': 668}, {
      'name': 'Mang Thít',
      'pre': 'Huyện',
      'id': 669
    }, {'name': 'Tam Bình', 'pre': 'Huyện', 'id': 670}, {
      'name': 'Trà Ôn',
      'pre': 'Huyện',
      'id': 671
    }, {'name': 'Vĩnh Long', 'pre': 'Thành phố', 'id': 673}, {'name': 'Vũng Liêm', 'pre': 'Huyện', 'id': 672}]
  }, {
    'code': 'VP',
    'name': 'Vĩnh Phúc',
    'districts': [{'name': 'Bình Xuyên', 'pre': 'Huyện', 'id': 674}, {
      'name': 'Lập Thạch',
      'pre': 'Huyện',
      'id': 675
    }, {'name': 'Phúc Yên', 'pre': 'Thị xã', 'id': 681}, {
      'name': 'Sông Lô',
      'pre': 'Huyện',
      'id': 696
    }, {'name': 'Tam Dương', 'pre': 'Huyện', 'id': 677}, {
      'name': 'Tam Đảo',
      'pre': 'Huyện',
      'id': 676
    }, {'name': 'Vĩnh Tường', 'pre': 'Huyện', 'id': 678}, {
      'name': 'Vĩnh Yên',
      'pre': 'Thành phố',
      'id': 680
    }, {'name': 'Yên Lạc', 'pre': 'Huyện', 'id': 679}]
  }, {
    'code': 'YB',
    'name': 'Yên Bái',
    'districts': [{'name': 'Lục Yên', 'pre': 'Huyện', 'id': 682}, {
      'name': 'Mù Cang Chải',
      'pre': 'Huyện',
      'id': 683
    }, {'name': 'Nghĩa Lộ', 'pre': 'Thị xã', 'id': 713}, {
      'name': 'Trạm Tấu',
      'pre': 'Huyện',
      'id': 684
    }, {'name': 'Trấn Yên', 'pre': 'Huyện', 'id': 685}, {
      'name': 'Văn Chấn',
      'pre': 'Huyện',
      'id': 686
    }, {'name': 'Văn Yên', 'pre': 'Huyện', 'id': 687}, {
      'name': 'Yên Bái',
      'pre': 'Thành phố',
      'id': 689
    }, {'name': 'Yên Bình', 'pre': 'Huyện', 'id': 688}]
  }, {
    'code': 'DDB',
    'name': 'Điện Biên',
    'districts': [{'name': 'Mường Chà', 'pre': 'Huyện', 'id': 230}, {
      'name': 'Mường Lay',
      'pre': 'Thị xã',
      'id': 235
    }, {'name': 'Mường Nhé', 'pre': 'Huyện', 'id': 231}, {
      'name': 'Mường Ảng',
      'pre': 'Huyện',
      'id': 229
    }, {'name': 'Nậm Pồ', 'pre': 'Huyện', 'id': 711}, {
      'name': 'Tuần Giáo',
      'pre': 'Huyện',
      'id': 233
    }, {'name': 'Tủa Chùa', 'pre': 'Huyện', 'id': 232}, {
      'name': 'Điện Biên',
      'pre': 'Huyện',
      'id': 227
    }, {'name': 'Điện Biên Phủ', 'pre': 'Thành phố', 'id': 234}, {'name': 'Điện Biên Đông', 'pre': 'Huyện', 'id': 228}]
  }, {
    'code': 'DDN',
    'name': 'Đà Nẵng',
    'districts': [{'name': 'Cẩm Lệ', 'pre': 'Quận', 'id': 45}, {
      'name': 'Hoàng Sa',
      'pre': 'Huyện',
      'id': 52
    }, {'name': 'Hòa Vang', 'pre': 'Huyện', 'id': 51}, {
      'name': 'Hải Châu',
      'pre': 'Quận',
      'id': 46
    }, {'name': 'Liên Chiểu', 'pre': 'Quận', 'id': 47}, {
      'name': 'Ngũ Hành Sơn',
      'pre': 'Quận',
      'id': 48
    }, {'name': 'Sơn Trà', 'pre': 'Quận', 'id': 49}, {'name': 'Thanh Khê', 'pre': 'Quận', 'id': 50}]
  }, {
    'code': 'DDL',
    'name': 'Đắk Lắk',
    'districts': [{'name': 'Buôn Hồ', 'pre': 'Thị xã', 'id': 697}, {
      'name': 'Buôn Ma Thuột',
      'pre': 'Thành phố',
      'id': 218
    }, {'name': 'Buôn Đôn', 'pre': 'Huyện', 'id': 205}, {
      'name': 'Cư Kuin',
      'pre': 'Huyện',
      'id': 206
    }, {'name': 'Cư M\'gar', 'pre': 'Huyện', 'id': 207}, {
      'name': 'Ea H\'Leo',
      'pre': 'Huyện',
      'id': 208
    }, {'name': 'Ea Kar', 'pre': 'Huyện', 'id': 209}, {
      'name': 'Ea Súp',
      'pre': 'Huyện',
      'id': 210
    }, {'name': 'Krông Ana', 'pre': 'Huyện', 'id': 211}, {
      'name': 'Krông Buk',
      'pre': 'Huyện',
      'id': 213
    }, {'name': 'Krông Bông', 'pre': 'Huyện', 'id': 212}, {
      'name': 'Krông Năng',
      'pre': 'Huyện',
      'id': 214
    }, {'name': 'Krông Pắc', 'pre': 'Huyện', 'id': 215}, {'name': 'Lăk', 'pre': 'Huyện', 'id': 216}, {
      'name': 'M\'Đrăk',
      'pre': 'Huyện',
      'id': 217
    }]
  }, {
    'code': 'DNO',
    'name': 'Đắk Nông',
    'districts': [{'name': 'Cư Jút', 'pre': 'Huyện', 'id': 219}, {
      'name': 'Dăk GLong',
      'pre': 'Huyện',
      'id': 220
    }, {'name': 'Dăk Mil', 'pre': 'Huyện', 'id': 221}, {
      'name': 'Dăk R\'Lấp',
      'pre': 'Huyện',
      'id': 222
    }, {'name': 'Dăk Song', 'pre': 'Huyện', 'id': 223}, {
      'name': 'Gia Nghĩa',
      'pre': 'Thị xã',
      'id': 226
    }, {'name': 'Krông Nô', 'pre': 'Huyện', 'id': 224}, {'name': 'Tuy Đức', 'pre': 'Huyện', 'id': 225}]
  }, {
    'code': 'DNA',
    'name': 'Đồng Nai',
    'districts': [{'name': 'Biên Hòa', 'pre': 'Thành phố', 'id': 245}, {
      'name': 'Cẩm Mỹ',
      'pre': 'Huyện',
      'id': 236
    }, {'name': 'Long Khánh', 'pre': 'Thị xã', 'id': 246}, {
      'name': 'Long Thành',
      'pre': 'Huyện',
      'id': 238
    }, {'name': 'Nhơn Trạch', 'pre': 'Huyện', 'id': 239}, {
      'name': 'Thống Nhất',
      'pre': 'Huyện',
      'id': 241
    }, {'name': 'Trảng Bom', 'pre': 'Huyện', 'id': 242}, {
      'name': 'Tân Phú',
      'pre': 'Quận',
      'id': 240
    }, {'name': 'Vĩnh Cửu', 'pre': 'Huyện', 'id': 243}, {
      'name': 'Xuân Lộc',
      'pre': 'Huyện',
      'id': 244
    }, {'name': 'Định Quán', 'pre': 'Huyện', 'id': 237}]
  }, {
    'code': 'DDT',
    'name': 'Đồng Tháp',
    'districts': [{'name': 'Cao Lãnh', 'pre': 'Thành phố', 'id': 721}, {
      'name': 'Châu Thành',
      'pre': 'Huyện',
      'id': 248
    }, {'name': 'Huyện Cao Lãnh', 'pre': 'Huyện', 'id': 247}, {
      'name': 'Huyện Hồng Ngự',
      'pre': 'Huyện',
      'id': 722
    }, {'name': 'Hồng Ngự', 'pre': 'Thị xã', 'id': 249}, {
      'name': 'Lai Vung',
      'pre': 'Huyện',
      'id': 250
    }, {'name': 'Lấp Vò', 'pre': 'Huyện', 'id': 251}, {
      'name': 'Sa Đéc',
      'pre': 'Thị xã',
      'id': 257
    }, {'name': 'Tam Nông', 'pre': 'Huyện', 'id': 252}, {
      'name': 'Thanh Bình',
      'pre': 'Huyện',
      'id': 254
    }, {'name': 'Tháp Mười', 'pre': 'Huyện', 'id': 255}, {'name': 'Tân Hồng', 'pre': 'Huyện', 'id': 253}]
  }];
}
