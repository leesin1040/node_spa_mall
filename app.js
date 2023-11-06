const express = require('express');
const app = express();
const port = 3000;
const productRouter = require('./routes/products.router.js');

// const goodsRouter = require('./routes/goods.js');
// const cartsRouter = require('./routes/cart.js');
const connect = require('./schemas');
connect();

app.use(express.json());

app.post('/', (req, res) => {
  console.log(req.body);

  res.send('기본 URI에 Post 메소드가 정상적으로 실행되었습니다.');
});

// app.get('/', (req, res) => {
//   console.log(req.body);

//   const obj = {
//     KeyKey: 'value 입니다.',
//     '이름입니다.': '이름일까요?',
//   };

//   res.json(obj);
// });

app.get('/', (req, res) => {
  console.log(req.query);

  res.send('정상적으로 반환되었습니다.');
});

app.get('/:id', (req, res) => {
  console.log(req.params);
  res.send(':id URI에 정상적으로 반환되었습니다.');
});
// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

//localhost:3000/api -> goodsRouter

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});

app.use('/api', [productRouter]);
