const express = require('express');
const router = express.Router();
const Products = require('../schemas/products.schema.js');

//상품 목록 가져오기 - 완료
router.get('/products', async (req, res) => {
  try {
    const products = await Products.find(
      {},
      { title: 1, author: 1, status: 1, createAT: 1 } //상품명, 작성자명, 상품상태, 작성날짜 조회
    );
    //내림차순 정렬
    function sortDeta(a, b) {
      let DateA = new Date(a['createAT']).getTime();
      let DateB = new Date(b['createAT']).getTime();
      return DateA < DateB ? 1 : -1;
    }
    res.status(200).json({ 상품정보: products.sort(sortDeta) });
  } catch {
    res.status(400).json({ message: '정보를 불러올 수 없습니다.' });
  }
});

//상품등록 -완료
router.post('/products', async (req, res) => {
  try {
    const { title, content, author, password } = req.body;
    console.log(req.body);
    // 현재 날짜 및 시간 생성
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줍니다.
    let day = currentDate.getDate();
    let hours = currentDate.getHours(); // 시간
    let minutes = currentDate.getMinutes(); // 분
    let seconds = currentDate.getSeconds(); // 초
    let date = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    const createProduct = await Products.create({
      title: title,
      status: 'FOR_SALE',
      content: content,
      author: author,
      password: password,
      createAT: date,
    });
    res.status(200).json({
      message: '판매 상품을 등록하였습니다.',
    });
  } catch {
    res.status(400).json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
  }
});

//상품 상세조회 find 성공 -filter, for 사용한 방법은 작동안했음. 왜?
router.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [products] = await Products.find(
      { _id: id },
      { title: 1, content: 1, author: 1, status: 1, createAT: 1 }
    );
    // const product = products.filter((p) => {
    //   return p._id === id;
    // });
    // if (product.length === 0) {
    //   res.status(400).json({ errorMessage: '상품을 찾을 수 없습니다.' });
    // }
    res.status(200).json({ detail: products });
  } catch {
    res.status(400).json({ errorMessage: '상품을 찾을 수 없습니다.' });
  }
});

//상품 수정
router.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const reqPassword = req.body.password;
    const { title, content, author, status } = req.body;
    const [existsProduct] = await Products.find({ _id: id });
    if (existsProduct && existsProduct.password === reqPassword) {
      await Products.updateOne(
        { _id: id },
        {
          $set: {
            title: title,
            content: content,
            author: author,
            status: status,
          },
        }
      );
      const updateProduct = await Products.find({ _id: id });
      res.json({
        result: '상품 정보를 수정하였습니다.',
        '수정된 상품정보': updateProduct,
      });
    } else if (existsProduct && existsProduct.password !== reqPassword)
      res
        .status(401)
        .json({ result: '상품을 수정할 권한이 존재하지 않습니다.' });
  } catch {
    res.status(400).json({ result: '상품 조회에 실패하였습니다.' });
  }
});

//상품 삭제 - 성공! 데이터 형식이 올바르지 않는 경우가 뭔지 모르겠음.
router.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const reqPassword = req.body.password;
    // console.log(reqPassword);
    const [existsProduct] = await Products.find(
      { _id: id },
      { title: 1, status: 1, content: 1, author: 1, createAT: 1 }
    );
    if (existsProduct.password === reqPassword) {
      await Products.deleteOne({ _id: id });
      res.json({ result: '상품을 삭제하였습니다.' });
    } else if (existsProduct.password !== reqPassword) {
      res
        .status(401)
        .json({ result: '상품을 삭제할 권한이 존재하지 않습니다.' });
    }
  } catch {
    // res.status(400).json({ result: '데이터 형식이 올바르지 않습니다.' });
    res.status(404).json({ result: '상품 조회에 실패하였습니다.' });
  }
});

module.exports = router;
