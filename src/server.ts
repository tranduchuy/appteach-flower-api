import errorHandler from 'errorhandler';
import * as dumpUser from './dump-data/user';
// import * as dumpProduct from './dump-data/products';
import * as socketIo from 'socket.io';
import app from './app';
import { init } from "./utils/socket";

app.use(errorHandler());

const console = process['console'];

const server = app.listen(app.get('port'), () => {
  console.log(
    '  App is running at http://localhost:%d in %s mode',
    app.get('port'),
    app.get('env')
  );
  console.log('  Press CTRL-C to stop\n');
  dumpUser.run();
  // dumpProduct.run();
});

//init socket
let io = socketIo.listen(server);
init(io);

export default server;

