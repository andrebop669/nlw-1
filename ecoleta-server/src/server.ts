import express from 'express';
import routes from './routes';
import path from 'path';
import cors from 'cors';
import {errors} from 'celebrate';

const app  = express();

app.use(express.json());
app.use(cors());
app.use(routes);
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(errors());
app.listen(3333);


// GET: buscar algo do backend
// POST: criar alguma coisa no backend
// PUT: Atualizar uma informação existente no backend
// DELETE: Remover uma informação do backend

// request.params: parametros obrigatórios que vem na propria url / e normalmente identifica um objeto
// Query param: parametros que $ vem opcionais para "busca", paginação etc...
// Request body: Parametros para a criação e atualização de informações
