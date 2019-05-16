export enum OrderRoute {
    Name = '/order',
    // GET
    GetOrder = '/',
    GetOrderItem = '/:orderId/item',
    GetPendingOrder = '/pending',
    GetOrderShippingCost = '/shipping-cost',

    // UPDATE
    SubmitOrder = '/',

    // CREATE
    AddItem = '/',

    // DELETE
    DeleteItem = '/item/:itemId',
}

export enum OrderItemRoute {
  Name = '/order-item',
  // GET

  // UPDATE
  UpdateOrderItem = '/new/:id',

  // CREATE

  // DELETE
}