import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

/* ROUTE IMPORT */
import userRoutes from './routers/user-router';
import projectRoutes from './routers/project-router';

/* CONFIGURATIONS */
dotenv.config();

const app = express();
const port = 5000;
app.use(express.json());
app.use(helmet());
app.use(
  helmet.crossOriginResourcePolicy({
    policy: 'cross-origin',
  })
);
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(cors());

/* ROUTES */

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/user', userRoutes);
app.use('/project', projectRoutes);

/* START SERVER */
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
