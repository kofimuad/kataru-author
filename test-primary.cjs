const mongoose = require('mongoose');
const hosts = [
  'ac-dnb6z3t-shard-00-00.yujhpck.mongodb.net',
  'ac-dnb6z3t-shard-00-01.yujhpck.mongodb.net',
  'ac-dnb6z3t-shard-00-02.yujhpck.mongodb.net',
];
(async () => {
  for (const host of hosts) {
    const uri = `mongodb://hydra:2o1CcxjNjklS5N1m@${host}:27017/kataru_yahya?tls=true&directConnection=true&authSource=admin&retryWrites=true&w=majority`;
    console.log('----', host, '----');
    try {
      const conn = await mongoose.createConnection(uri, { serverSelectionTimeoutMS: 10000 }).asPromise();
      const admin = conn.db.admin();
      const info = await admin.command({ hello: 1 });
      console.log('hello', info);
      await conn.close();
    } catch (err) {
      console.error('ERR', err.name, err.message);
    }
  }
  process.exit(0);
})();
