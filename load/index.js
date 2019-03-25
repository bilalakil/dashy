const config = require('./config');

const raiz_accountValue = require('./raiz_accountValue');
const unity_allCurrentUsers = require('./unity_allCurrentUsers');

const loaders = {
  raiz_accountValue,
  unity_allCurrentUsers,
};

const runSync = async () => {
  for (const c of config) {
    const data = { id: c.id, date: new Date() };
    try {
      await loaders[c.type](c, data);
    } catch (e) {
      console.error(e);
      continue;
    }

    console.log(JSON.stringify(data));
  }
};

runSync().catch(e => {
  console.error(e);
  process.exit(1);
});
