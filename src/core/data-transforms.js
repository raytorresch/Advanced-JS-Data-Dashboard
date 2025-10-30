// core/data-transforms.js

// Pure functions para transformar datos
export const dataTransformers = {
  // Calcular métricas derivadas
  calculateMetrics: (rawData) => (
     {        
        ...rawData,
        derived: {
        // revenuePerUser: rawData.revenue.current / rawData.users.total ?? 1,
        conversionValue: rawData.revenue.current * rawData.conversion.current / 100,
        growthScore: (rawData.revenue.growth + rawData.conversion.growth + rawData.retention.growth) / 3
        }
  }),

  // Enriquecer datos de productos
  enrichProducts: (products, salesData) => 
    products.map(product => ({
      ...product,
      revenuePerUnit: product.sales / product.units,
      performance: product.growth > 10 ? 'high' : product.growth > 0 ? 'medium' : 'low',
      contribution: (product.sales / salesData.total) * 100
    })),

  // Preparar datos para gráficos
  prepareChartData: (activityData, type = 'line') => 
    activityData.reduce((acc, item, index) => ({
      labels: [...acc.labels, item.hour],
      datasets: [{
        ...acc.datasets[0],
        data: [...acc.datasets[0].data, item.active]
      }]
    }), {
      labels: [],
      datasets: [{
        label: 'Active Users',
        data: [],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)'
      }]
    }),

  // Agregar datos regionales
  aggregateRegions: (regions) => 
    regions.reduce((acc, region) => ({
      totalRevenue: acc.totalRevenue + region.revenue,
      totalGrowth: acc.totalGrowth + region.growth,
      regions: [...acc.regions, region]
    }), { totalRevenue: 0, totalGrowth: 0, regions: [] })
};