// api/data-sources.js
export const mockDataSources = {
  // API de usuarios y ventas
  sales: {
    getDailySales: () => new Promise(resolve => 
      setTimeout(() => resolve({
        date: new Date().toISOString().split('T')[0],
        total: 15420,
        transactions: 89,
        average: 173.26,
        growth: 12.4
      }), 600)
    ),
    
    getTopProducts: () => new Promise(resolve => 
      setTimeout(() => resolve([
        { id: 1, name: 'Laptop Pro', sales: 5420, units: 32, growth: 8.2 },
        { id: 2, name: 'Smartphone X', sales: 4870, units: 54, growth: 15.7 },
        { id: 3, name: 'Tablet Mini', sales: 3210, units: 28, growth: -2.1 },
        { id: 4, name: 'Headphones', sales: 2980, units: 67, growth: 22.4 },
        { id: 5, name: 'Smart Watch', sales: 2450, units: 19, growth: 5.8 }
      ]), 800)
    )
  },

  // API de usuarios y engagement
  users: {
    getUserStats: () => new Promise(resolve => 
      setTimeout(() => resolve({
        total: 12540,
        active: 8940,
        newToday: 124,
        churnRate: 2.4,
        satisfaction: 4.3
      }), 700)
    ),
    
    getUserActivity: () => new Promise(resolve => 
      setTimeout(() => resolve([
        { hour: '00:00', active: 450 },
        { hour: '04:00', active: 230 },
        { hour: '08:00', active: 1240 },
        { hour: '12:00', active: 2870 },
        { hour: '16:00', active: 3520 },
        { hour: '20:00', active: 2140 }
      ]), 500)
    )
  },

  // API de métricas de negocio
  business: {
    getKPIs: () => new Promise(resolve => 
      setTimeout(() => resolve({
        revenue: { current: 154200, target: 160000, growth: 8.4 },
        conversion: { current: 3.2, target: 3.5, growth: -2.1 },
        retention: { current: 78.4, target: 80.0, growth: 1.2 },
        acquisition: { current: 1240, target: 1500, growth: 15.7 }
      }), 900)
    ),
    
    getRegionalData: () => new Promise(resolve => 
      setTimeout(() => resolve([
        { region: 'North America', revenue: 65420, growth: 12.4, marketShare: 42 },
        { region: 'Europe', revenue: 48750, growth: 8.7, marketShare: 32 },
        { region: 'Asia Pacific', revenue: 29840, growth: 22.1, marketShare: 19 },
        { region: 'Latin America', revenue: 10290, growth: 15.3, marketShare: 7 }
      ]), 750)
    )
  }
};