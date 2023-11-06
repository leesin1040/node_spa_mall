require('dotenv').config();
const mongoose = require('mongoose');

const connect = () => {
	mongoose
		.connect(
			`mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.iukvvuy.mongodb.net/nodejsdb?retryWrites=true&w=majority`,
		)
		.catch((err) => console.log(err));
};

mongoose.connection.on('error', (err) => {
	console.error('몽고디비 연결 에러', err);
});

module.exports = connect;
