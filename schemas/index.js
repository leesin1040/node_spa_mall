const mongoose = require('mongoose');

const connect = () => {
  mongoose
    .connect(
      'mongodb+srv://leesin1040:HyPRp73QLDxevm3R@cluster0.iukvvuy.mongodb.net/nodejsdb?retryWrites=true&w=majority'
    )
    .catch((err) => console.log(err));
};

mongoose.connection.on('error', (err) => {
  console.error('몽고디비 연결 에러', err);
});

module.exports = connect;
