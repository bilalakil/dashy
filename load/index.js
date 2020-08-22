const config = require('./config');

const domExtract = require('./domExtract');

const loaders = {
  domExtract,
};

const runSync = async () => {
  const shortlist = process.argv.slice(2);

  for (const c of config) {
    if (
      shortlist.length !== 0
      && shortlist.indexOf(c.id) === -1
    ) continue;

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
