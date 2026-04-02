const mongoose = require('mongoose');
const uri = 'mongodb://hydra:2o1CcxjNjklS5N1m@ac-dnb6z3t-shard-00-00.yujhpck.mongodb.net:27017,ac-dnb6z3t-shard-00-01.yujhpck.mongodb.net:27017,ac-dnb6z3t-shard-00-02.yujhpck.mongodb.net:27017/kataru_yahya?tls=true&replicaSet=atlas-dnb6z3t-shard-0&authSource=admin&retryWrites=true&w=majority';
console.log('connect attempt');
mongoose.connect(uri).then(c => {
  console.log('connected', c.connections[0].readyState);
  process.exit(0);
}).catch(err => {
  console.error('error', err);
  process.exit(1);
});
