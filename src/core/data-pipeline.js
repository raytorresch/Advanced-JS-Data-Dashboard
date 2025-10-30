// core/data-pipeline.js
export function createDataPipeline(transformers) {
  return {
    processSalesData: (salesData, productsData) => {
      return transformers.enrichProducts(
        productsData, 
        salesData
      );
    },
    
    processBusinessData: (kpis, regionalData) => {
      const enrichedKPIs = transformers.calculateMetrics(kpis);
      
      const aggregatedRegions = transformers.aggregateRegions(regionalData);
      
      return {
        kpis: enrichedKPIs,
        regions: aggregatedRegions,
        summary: {
          totalRevenue: aggregatedRegions.totalRevenue,
          averageGrowth: aggregatedRegions.regions.reduce((sum, r) => sum + r.growth, 0) / aggregatedRegions.regions.length
        }
      };
    },
    
    processUserData: (userStats, userActivity) => ({
      stats: userStats,
      activity: transformers.prepareChartData(userActivity),
      insights: {
        peakHour: userActivity.reduce((peak, current) => 
          current.active > peak.active ? current : peak
        ),
        engagementRate: (userStats.active / userStats.total) * 100
      }
    })
  };
}