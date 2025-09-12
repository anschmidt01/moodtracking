import express from 'express';
import cors from 'cors';
import { router } from './routes.js';
import { categoriesRouter } from './routes.categories.js';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get('/health', (_, res) => res.json({ ok: true }));

app.use(router);
app.use('/categories', categoriesRouter);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});