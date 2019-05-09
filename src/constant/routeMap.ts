export enum OrderRoute {
    Name = '/order',
    // GET
    GetOrder = '/',
    GetOrderItem = '/:orderId/item',

    // UPDATE
    SubmitOrder = '/',

    // CREATE
    AddItem = '/',

    // DELETE
    DeleteItem = '/item/:itemId',
}