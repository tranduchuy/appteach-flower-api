import errorHandler from 'errorhandler';
import * as dumpUser from './dump-data/user';

import app from './app';

app.use(errorHandler());

const server = app.listen(app.get('port'), () => {
  console.log(
    '  App is running at http://localhost:%d in %s mode',
    app.get('port'),
    app.get('env')
  );
  console.log('  Press CTRL-C to stop\n');
  dumpUser.run();
});

export default server;

