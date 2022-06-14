import { Router } from 'express';

const index = Router();

index.get('/', function(req, res) {
  res.send('Ну привет');
});

export default index;