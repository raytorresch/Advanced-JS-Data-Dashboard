// app.js
import { mockDataSources } from './api/data-sources.js';
import { createCacheManager } from './api/cache.js';
import { createDataPipeline } from './core/data-pipeline.js';
import { dataTransformers } from './core/data-transforms.js';
import { createDashboardState } from './core/state-manager.js';
import { updateUI } from './ui/renderer.js';

class DashboardApp {
  constructor() {
    this.cache = createCacheManager(300000); // 5 min cache
    this.state = createDashboardState();
    this.pipeline = createDataPipeline(dataTransformers);
    
    this.init();
  }

  async init() {
    // Suscribirse a cambios de estado
    this.state.subscribe((newState) => {
      updateUI(newState);
    });

    // Cargar datos iniciales
    await this.loadAllData();
    
    // Configurar actualizaciones automáticas
    setInterval(() => this.loadAllData(), 60000); // Actualizar cada minuto
  }

  async loadAllData() {
    const loaders = [
      this.loadSalesData(),
      this.loadUserData(), 
      this.loadBusinessData()
    ];

    await Promise.allSettled(loaders);
  }

  async loadSalesData() {
    const cacheKey = 'sales-data';
    const cached = this.cache.get(cacheKey);
    
    if (cached) {
      this.state.setData('sales', cached);
      return;
    }

    this.state.setLoading('sales', true);

    try {
      const [dailySales, topProducts] = await Promise.all([
        mockDataSources.sales.getDailySales(),
        mockDataSources.sales.getTopProducts()
      ]);

      const processedData = this.pipeline.processSalesData(dailySales, topProducts);
      
      this.cache.set(cacheKey, processedData);
      this.state.setData('sales', processedData);
    } catch (error) {
      this.state.setError('sales', error.message);
    }
  }

  async loadUserData() {
    const cacheKey = 'user-data';
    const cached = this.cache.get(cacheKey);

    if (cached) {
        this.state.setData('users', cached);
        return
    }

    this.state.setLoading('users', true);

    try {
        const [userStats, userActivity] = await Promise.all([
            mockDataSources.users.getUserStats(),
            mockDataSources.users.getUserActivity()
        ]);

        const processedData = this.pipeline.processUserData(userStats, userActivity);

        this.cache.set(cacheKey, processedData);
        this.state.setData('users', processedData);
    } catch (error) {
        this.state.setError('users', error.message);
    }
  }

  async loadBusinessData() {
    const cacheKey = 'business';
    const cached = this.cache.get(cacheKey);

    if (cached) {
        this.state.setData('business', cached);
        return
    }

    this.state.setLoading('business', true);
    
    try {
        const [kpis, regionalData] = await Promise.all([
            mockDataSources.business.getKPIs(),
            mockDataSources.business.getRegionalData()
        ]);
        
        const processedData = this.pipeline.processBusinessData(kpis, regionalData);
        
        this.cache.set(processedData);
        
        this.state.setData('business', processedData);
    } catch (error) {
        this.state.setError('business', error.message);
    }
  }

  // Métodos de utilidad
  forceRefresh() {
    this.cache.clear();
    this.loadAllData();
  }

  getPerformanceMetrics() {
    const state = this.state.getState();
    // TU TAREA: Calcular métricas de performance del dashboard
    const { data, errors, lastUpdated } = state;

    const now = Date.now();

    ///-- Perfomance metrics
    const cacheStats = this.cache.getStats();
    const totalCachesHits = cacheStats.hits;
    const totalCacheMisses = cacheStats.misses;
    const cacheHitsRate = cacheStats.hitRate;

    // last update - seconds
    const timeSinceLastUpdate = lastUpdated
        ? ((now - new Date(lastUpdated).getTime()) / 1000).toFixed(1)
        : null;

    // modules
    const loadedModules = Object.entries(data)
        .filter(([_, value]) => value !== null)
        .map(([key]) => key).length;

    const totalModules = Object.keys(data).length;
    const successRate = (loadedModules / totalModules) * 100;

    //error count
    const errorCount = Object.values(errors).filter(Boolean).length || 0;

    ///-- Data Quality Metrics
    const dataFreshness = lastUpdated
        ? `${timeSinceLastUpdate} sec ago`
        : 'No data yet';

    const hasIntegrity = Object.values(data).every(dataset => {
        if (!dataset) return false;
        //must have at least one key
        return typeof dataset === 'object' && Object.keys(dataset).length > 0;
    });

    // -- Business metrics
    let businessMetrics = null;
    if(data.sales && data.users && data.business) {
        const avgRevenuePerUser = data.users.active
            ? (data.sales.total / data.users.active).toFixed(2)
            : 0;        

        const avgGrowth = data.business.summary.totalRevenue
            .toFixed(2);

        const kpiDeviation = (
            ((data.business.kpis.revenue.current - data.business.kpis.revenue.target) /
            data.business.kpis.revenue.target) * 100
        ).toFixed(2);

        businessMetrics = {
            avgRevenuePerUser,
            avgGrowth,
            avgRevenuePerUser
        };
    }

    //-- Operational metrics
    const isHealthy = errorCount === 0 & successRate === 100;
    const uptimeStatus = isHealthy ? 'Healthy' : 'Issues detected';

    return {
      system: {
        totalModules,
        loadedModules,
        successRate,
        totalCachesHits,
        totalCacheMisses,
        cacheHitsRate,
        timeSinceLastUpdate
      },
      data: {
        freshness: dataFreshness,
        integrity: hasIntegrity,
        errors: errorCount
      },
      business: businessMetrics,
      operational: {
        healthy: isHealthy,
        status: uptimeStatus,
        lastUpdated: lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'N/A'
      }
    };
  }
}

export { DashboardApp };