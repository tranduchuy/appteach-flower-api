export enum OrderRoute {
    Name = '/order',
    // GET
    GetOrder = '/',
    GetOrderItem = '/:orderId/item',
    GetPendingOrder = '/pending',

    // UPDATE
    SubmitOrder = '/',

    // CREATE
    AddItem = '/',

    // DELETE
    DeleteItem = '/item/:itemId',
}