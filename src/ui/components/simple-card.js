export function SimpleCard({ title, value }) {
    return `
        <div class="metric-card">
            <h3>${title}</h3>
            <p>${value}</p>
        </div>
    `;
}