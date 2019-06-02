export enum OrderRoute {
    Name = '/order',
    // GET
    GetOrder = '/',
    GetOrderItem = '/:orderId/item',
    GetPendingOrder = '/pending',
    GetOrderShippingCost = '/shipping-cost',
    GuestGetOrderDetail = '/guest-detail/:code',

    // UPDATE
    SubmitOrder = '/',

    // CREATE
    AddItem = '/',
    AddMany = '/many',
    SubmitNoLoginOrder = '/no-login',

    // DELETE
    DeleteItem = '/item/:itemId',
}

export enum OrderItemRoute {
  Name = '/order-item',
  // GET

  // UPDATE
  UpdateOrderItem = '/new/:id',
  UpdateOrderItemStatus = '/status/:id',

  // CREATE

  // DELETE
}