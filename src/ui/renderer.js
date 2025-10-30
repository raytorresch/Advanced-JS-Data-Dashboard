import  { Card, Table, SimpleCard, UserTable, Button } from './components/index.js';

let appContainer = null;
export function renderDashboard(state) {
    console.log(state);

    return `
        <div class="dashboard">
            <header class="dashboard-header">
                <h1>Business Analytics Dashboard</h1>
                <div class="last-update-indicator">
                    Last Update: ${state.lastUpdated}
                </div>
                ${Button({
                    id: 'refresh-btn',
                    label: 'Refresh',
                    disabled: state.loading.sales ||
                              state.loading.users ||
                              state.loading.business
                })}                 

                <div class="loading-indicator ${state.loading ? 'loading' : ''}">
                ${
                    state.loading.sales ||
                    state.loading.users ||
                    state.loading.business
                        ? '🔄 Updating...' : '✅ Updated'}
                </div>
            </header>

            ${Button({
                id: 'metrics-btn',
                label: 'Show Metrics',
                disabled: false
            })}
            ${renderMetrics(state.performanceMetrics)}
            <h2>Business</h2>

            ${renderKPISCard(state.data.business)}

            ${businessTable(state.data.business)}

            <h2>Sales</h2>
            ${salesTable(state.data.sales)}
            
            <h2>Users</h2>
            ${renderUsersCard(state.data.users)}
            <h3>Insights</h3>
            ${insightsUsersCard(state.data.users)}
            ${userTable(state.data.users)}
            
            ${state.errors ? renderErrors(state.errors) : ''}

        </div>
    `;
}

function renderMetrics(metrics) {
    if (!metrics) return '<div class="metric-loading">No Metrics Loaded...</div>';
    const businessMetrics = SimpleCard({
        title: 'Business Metrics',
        value: `Avg. Revenue/User: $${metrics.business.avgRevenuePerUser}, Avg. Growth: ${metrics.business.avgGrowth}%`
    });

    const dataQualityMetrics = SimpleCard({
        title: 'Data Quality Metrics',
        value: `Data Freshness: ${metrics.data.freshness}, Data Integrity: ${metrics.data.integrity ? 'Good' : 'Poor'}`
    });

    const operationalMetrics = SimpleCard({
        title: 'Operational Metrics',
        value: `Uptime Status: ${metrics.operational.lastUpdated}, Success Rate: ${metrics.operational.status}`
    });

    const systemCard = `
        <div class="metric-card">
            <h3>System Metrics</h3>
            <p>Loaded Modules: ${metrics.system.loadedModules}</p>
            <p>Success Rate: ${metrics.system.successRate}%</p>
            <p>Time Since Last Update: ${metrics.system.timeSinceLastUpdate}s</p>
        </div>
    `;
    return `
        <div class="metrics-dashboard">
            <h2>Performance Metrics</h2>
            <div class="metrics-grid">
                ${businessMetrics}
                ${dataQualityMetrics}
                ${operationalMetrics}
                ${systemCard}
            </div>
        </div>
    `;
}

function renderKPISCard(metrics){
    if (!metrics) return '<div class="metric-loading">Loading...</div>';

    const  acquisitionCard = Card({
        title: 'Acquisition',
        value: metrics.kpis.acquisition.current,
        growth: metrics.kpis.acquisition.growth,
        target: metrics.kpis.acquisition.target
    });

    const conversionCard = Card({
        title: 'Conversion',
        value: metrics.kpis.conversion.current,
        growth: metrics.kpis.conversion.growth,
        target: metrics.kpis.conversion.target
    });

    const derivedCard = `
        <div class="metric-card">
        <h3>Derived</h3>
        <div class="conversion">Conversion. ${metrics.kpis.derived.conversionValue}</div>
        <div class="growth ${metrics.kpis.derived.growthScore > 0 ? 'positive' : 'negative'}">
           Growth. ${metrics.kpis.derived.growthScore > 0 ? '↗' : '↘'} ${formatNumber(metrics.kpis.derived.growthScore)}%
        </div>
        </div>
    `;

    const retentionCard = Card({
        title: 'Retention',
        value: metrics.kpis.retention.current,
        growth: metrics.kpis.retention.growth,
        target: metrics.kpis.retention.target
    });

    const revenueCard = Card({
        title: 'Revenue',
        value: metrics.kpis.revenue.current,
        growth: metrics.kpis.revenue.growth,
        target: metrics.kpis.revenue.target
    });

    const summaryCard = `
        <div class="metric-card">
        <h3>Summary</h3>
        <div class="avgGrowth">Avg. Growth. ${metrics.summary.averageGrowth}</div>
        <div class="total">
            Total. ${metrics.summary.totalRevenue}
        </div>
        </div>
    `;

    return `
        <div class="metrics-grid">
            ${acquisitionCard}
            ${conversionCard}
            ${retentionCard}
            ${revenueCard}
            ${derivedCard}
            ${summaryCard}
        </div>
    `;
}



function businessTable(metrics) {
    if (!metrics) return '<div class="metric-loading">Loading...</div>';
    
    return Table({
        title: 'Business Regions',
        columns : ['region','revenue', 'growth', 'marketShare'],
        rows: metrics.regions.regions
    });
}

function salesTable(sales) {
    if (!sales) return '<div class="metric-loading">Loading...</div>';

    return Table({
        title: 'Sales Data',
        columns : ['id','name', 'performance', 'revenuePerUnit', 'sales', 'units'],
        rows: sales
    });
}

function renderUsersCard(users){
    if (!users) return '<div class="metric-loading">Loading...</div>';
    
    const activeUsersCard = SimpleCard({
        title: 'Active Users',
        value: `${users.stats.active}`,
    });

    const churnRateCard = SimpleCard({
        title: 'Churn Rate',
        value: `${users.stats.churnRate}%`,
    });

    const satisfactionCard = SimpleCard({
        title: 'Satisfaction',
        value: `${users.stats.satisfaction}%`,
    });

    const newTodayCard = SimpleCard({
        title: 'New Users Today',
        value: `${users.stats.newToday}`,
    });

    const totalUsersCard = SimpleCard({
        title: 'Total Users',
        value: `${users.stats.total}`,
    });

    return `
        <div class="metrics-grid">
            ${activeUsersCard}
            ${churnRateCard}
            ${satisfactionCard}
            ${newTodayCard}
            ${totalUsersCard}
        </div>
    `;
}

function insightsUsersCard(users){
    if (!users) return '<div class="metric-loading">Loading...</div>';
    
    const engagementRateCard = SimpleCard({
        title: 'Engagement Rate',
        value: `${users.insights.engagementRate.toFixed(2)}%`,
    });

    const peakHourCard = SimpleCard({
        title: `Peak Hour - Hour ${users.insights.peakHour.peakHour}`,
        value: `${users.insights.peakHour.active} active users`,
    });

    return `
        <div class="metrics-grid">
            ${engagementRateCard}
            ${peakHourCard}
        </div>
    `;
}

function userTable(users) {
    if (!users) return '<div class="metric-loading">Loading...</div>';
   
    
    return UserTable({
        title: users.activity.datasets[0].label,
        columns: users.activity.labels,
        rows: users.activity.datasets[0].data,
        borderColor: users.activity.datasets[0].borderColor,
        backgroundColor: users.activity.datasets[0].backgroundColor
    });
}

export function setupUI(appInstance) {
  // Guardamos el contenedor de la app (una sola vez)
  appContainer = document.getElementById('app');

  // Añadir listeners globales
  document.addEventListener('click', async (event) => {
    if (event.target.matches('#refresh-btn')) {
      event.target.textContent = 'Refreshing...';
      event.target.disabled = true;

      await appInstance.forceRefresh(); 

      event.target.textContent = 'Refresh';
      event.target.disabled = false;
    }

    if (event.target.matches('#metrics-btn')) {
      const metrics = appInstance.getPerformanceMetrics();
        let state = appInstance.state.getState();
        state.performanceMetrics = metrics;

        updateUI(state);
        
    //   render metrics in ui

    }
  });
}

export function updateUI(state) {
  if (!appContainer) appContainer = document.getElementById('app');
  if (!appContainer) return;
  appContainer.innerHTML = renderDashboard(state);
}

function renderErrors(errors) {
    
  return `
    <div class="error-section">
      <h4>Errors detected:</h4>
      <ul>
        ${Object.entries(errors)
          .map(([key, value]) => value ? `<li>${key}: ${value}</li>` : '')
          .join('')}
      </ul>
    </div>
  `;
}

function formatNumber(value) {
  return typeof value === 'number'
    ? value.toLocaleString('en-US')
    : value ?? '-';
}