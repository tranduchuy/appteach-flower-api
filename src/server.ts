import errorHandler from 'errorhandler';
import * as dumpUser from './dump-data/user';
import * as dumpUrlParams from './dump-data/urlParams';
// import * as dumpProduct from './dump-data/products';
import * as socketIo from 'socket.io';
import app from './app';
import { init } from './utils/socket';
import { MONGODB_URI, MYSQL_CONNECTION } from './utils/secrets';
import mongoose from 'mongoose';

app.use(errorHandler());

// const console = process['console'];

// Connect to MongoDB
mongoose.connect(MONGODB_URI, <any>{ useNewUrlParser: true }, (err) => {
  if (err) {
    console.error('Unable to connect to mongodb cluster', err);
  } else {
    // Connect to MySQL
    MYSQL_CONNECTION.authenticate()
      .then(() => {
        const server = app.listen(app.get('port'), () => {
          console.log(
            '  App is running at http://localhost:%d in %s mode',
            app.get('port'),
            app.get('env')
          );
          console.log('  Press CTRL-C to stop\n');
          dumpUser.run();
          dumpUrlParams.run();
          // dumpProduct.run();
        });

        // init socket
        const io = socketIo.listen(server);
        init(io);

        console.log('Connect to MySQL database successfully');
      })
      .catch(err => {
        console.error('Unable to connect to MySQL database', err);
      });

    console.log('Connect to mongodb cluster successfully');
  }
});

