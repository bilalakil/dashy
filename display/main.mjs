import header from './header.mjs';
import tableByDay from './tableByDay.mjs';

const displays = {
  header,
  tableByDay,
};

const run = async () => {
  let req = await fetch('./data.txt', { cache: 'no-cache' });
  const data = (await req.text())
    .trim()
    .split('\n')
    .map(_ => {
      try {
        return JSON.parse(_);
      } catch (e) {
        console.error(e);
        return false;
      }
    })
    .filter(_ => _);

  req = await fetch('display/config.json', { cache: 'no-cache' });
  const config = await req.json();

  const main = document.querySelector('main');
  for (const c of config) {
    main.insertAdjacentHTML(
      'beforeend',
      displays[c.type](c, data)
    );
  }
};

run();
