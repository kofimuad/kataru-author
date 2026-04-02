
const mongoose = require('mongoose');
const uri = 'mongodb://hydra:2o1CcxjNjklS5N1m@ac-dnb6z3t-shard-00-00.yujhpck.mongodb.net:27017/kataru_yahya?tls=true&authSource=admin&retryWrites=true&w=majority&directConnection=true';
console.log('connect attempt');
mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 }).then(c => {
  console.log('connected', c.connections[0].readyState);
  process.exit(0);
}).catch(err => {
  console.error('error', err);
  process.exit(1);
});
