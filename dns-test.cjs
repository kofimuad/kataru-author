const dns = require('dns');
const resolver = new dns.promises.Resolver();
resolver.setServers(['8.8.8.8','1.1.1.1']);
(async () => {
  try {
    const srv = await resolver.resolveSrv('_mongodb._tcp.kataru-author.yujhpck.mongodb.net');
    console.log('srv', srv);
  } catch (err) {
    console.error('srv err', err);
  }
  try {
    const ips = await resolver.resolve4('ac-dnb6z3t-shard-00-02.yujhpck.mongodb.net');
    console.log('ips', ips);
  } catch (err) {
    console.error('ips err', err);
  }
})();
