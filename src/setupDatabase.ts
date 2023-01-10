/**set up mongo db */
import mongoose from 'mongoose';
import { config } from '@root/config';
import Logger from 'bunyan';
import { redisConnection } from '@service/redis/redis.connection';

/** indicate the log is coming from the database */
const log: Logger = config.createLogger('setupDatabase');

/** export an anonymous function, so when import we can use any name */
export default () => {
  const connect = () => {
    mongoose.set('strictQuery',true);
    mongoose
      .connect(`${config.DATABASE_URL}`)
      .then(() => {
        log.info('Sucessfully connected to database.');
        redisConnection.connect();
      })
      .catch((error) => {
        log.error('Error connecting to database', error);
        return process.exit(1);
      });
  };
  connect();
  /** if disconnected, will try connect again */
  mongoose.connection.on('disconnected', connect);
};
