import express from 'express'
import authRouter from './modules/auth/auth.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requireAuth } from './middleware/requireAuth.js';

const app = express();
app.use(express.json());

app.use('/auth', authRouter)
app.use(errorHandler)


app.get('/health', (_req, res) => {
    res.json({status: 'ok'})
});

app.listen(3000, () => console.log("Server su http://localhost:3000"))