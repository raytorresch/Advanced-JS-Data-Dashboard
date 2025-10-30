export function Table({title, columns = [], rows = []}) {

    const headerHTML = columns
        .map(col => `<th>${col}</th>`)
        .join('');

    const rowsHTML = rows
        .map(row => {
        const cells = columns
            .map(col => `<td>${row[col] ?? ''}</td>`)
            .join('');
        return `<tr>${cells}</tr>`;
        })
        .join('');

    return `
        <div class='table-grid'>
            <div class='table-card'>
                <h3>${title}</h3>
                <table class='data-table'>
                    <thead>
                        <tr>
                            <tr>${headerHTML}</tr>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHTML}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}