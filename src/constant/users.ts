export namespace UserConstant {
  export const saltLength = 10;
  export const tokenConfirmEmailLength = 50;
  export const tokenExpiredInHour = 48;
  export const availableSortPropertiesForAdmin = [
    'name',
    'email',
    'username',
    'address',
    'city',
    'district',
    'ward',
    'role',
    'type'
  ];
  export const queryProperties = {
    like: ['name', 'username', 'email', 'phone'],
    exactly: ['city', 'district', 'ward', 'type', 'gender', 'role']
  };
}