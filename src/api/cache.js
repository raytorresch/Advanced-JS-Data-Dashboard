export function createCacheManager(ttl = 300000) { // 5 minutos default
  const cache = new Map();
  let stats = {
    hits : 0,
    misses : 0
  }; 
  return {
    get: (key) => {
      const entry = cache.get(key);
      if (!entry) {
        stats.misses++;
        return null;
    }
      
      if (Date.now() - entry.timestamp > ttl) {
        cache.delete(key);
        stats.misses++;
        return null;
      }

      stats.hits++;
      return entry.data;
    },
    
    set: (key, data) => {
      cache.set(key, {
        data,
        timestamp: Date.now()
      });
    },
    
    clear: () => cache.clear(),
    
    getStats: () => ({
      size: cache.size,
      keys: Array.from(cache.keys()),
      ...stats,
      hitRate:
        (stats.hits + stats.misses) === 0
          ? 0
          : (stats.hits / (stats.hits + stats.misses)).toFixed(2)
    })
  };
}