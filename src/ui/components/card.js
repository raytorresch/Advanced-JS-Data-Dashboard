export function Card({ title, value, growth, target }) {
    return `<div class="metric-card">
                <h3>${title}</h3>
                <div class="value">Current: ${value}</div>
                <div class="target">Objective: ${target}</div>
                <div class="growth ${growth > 0 ? 'positive' : 'negative'}">
                    Growth. ${growth > 0 ? '↗' : '↘'} ${growth}%
                </div>
            </div>`;
}
