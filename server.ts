import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import messagesRoute from './routes/messages.route';
import usersRoute from './routes/users.route';

dotenv.config();

const app = express();
const PORT: number = 3000;
const HOST: string = '0.0.0.0';
const CONNECTION_STRING: string = process.env.MONGODB_CONNECTION_STRING!;
const DB_NAME: string = process.env.DB_NAME!;

app.use(express.json());

mongoose.connect(CONNECTION_STRING, { dbName: DB_NAME }).then(() => {
  app.listen(PORT, HOST, (err) => {
    if (!err) {
      console.log('Database actived!');
      console.log(`Server started at http://${HOST}:${PORT}`);
    } else {
      console.log(`Error occured, ${err}`);
    }
  });
});

app.use('/api/messages', messagesRoute);
app.use('/api/users', usersRoute);
