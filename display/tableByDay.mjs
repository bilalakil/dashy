const display = (config, data) => {
  const orderedDays = data.map(_ => _.date);
  orderedDays.sort();
  if (config.reversed) orderedDays.reverse();

  const days = orderedDays
    .map(_ => new Date(_).toLocaleDateString())
    .reduce(
      (arr, _) => {
        if (arr.indexOf(_) === -1) arr.push(_);
        return arr;
      },
      []
    );

  const tableData = data.reduce(
    (obj, d) => {
      const row = config.rows.find(_ => _.id === d.id && _.prop in d);
      if (!row) return obj;

      if (!(row.row in obj)) obj[row.row] = {};

      const day = new Date(d.date).toLocaleDateString();
      obj[row.row][day] = d[row.prop];

      return obj;
    },
    {}
  );

  return `
    <div class="table-container">
      <table>
        <tr>
          <th></th>
          ${days.map(_ => `<th>${_}</th>`).join('')}
        </tr>
        ${config.rows.map(
          row => `<tr>
            <td>${row.row}</td>
            ${days
              .map(day => `<td>${tableData[row.row][day]}</td>`)
              .join('')
            }
          </tr>`
        ).join('\n')}
      </table>
    </div>
  `;
};

export default display;
