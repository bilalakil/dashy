const config = require('./config');
const unity_allCurrentUsers = require('./unity_allCurrentUsers');

const loaders = {
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
