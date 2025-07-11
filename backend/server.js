import express from 'express';
import cors from 'cors';
import { router } from './routes.js';
import { categoriesRouter } from './routes.categories.js';


const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use(router);
app.use('/categories', categoriesRouter);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});