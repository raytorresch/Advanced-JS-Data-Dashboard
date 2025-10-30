export function UserTable({ title, columns = [], rows = [], borderColor = '#000' , backgroundColor = '#fff' }) {
    const headerHTML = columns
        .map(col => `<th>${col}</th>`)
        .join('');

    const rowHTML = rows
        .map(row => {
            return `<td>${row}</td>`;
        })
        .join('');

    return `
        <div class="metric-card">
            <h3>${title}</h3>
            <table class="data-table" style="border-color: ${borderColor}; background-color: ${backgroundColor};">
                <thead>
                    <tr>${headerHTML}</tr>
                </thead>
                <tbody>
                    <tr>${rowHTML}</tr>
                </tbody>
            </table>
        </div>
    `;
}