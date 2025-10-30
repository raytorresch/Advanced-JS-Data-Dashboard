// core/state-manager.js
export function createDashboardState() {
  let state = {
    data: {
      sales: null,
      users: null,
      business: null
    },
    loading: {
      sales: false,
      users: false, 
      business: false
    },
    errors: {},
    lastUpdated: null
  };

  let listeners = [];

  const notifyListeners = () => {
    listeners.forEach(listener => listener({ ...state }));
  };

  return {
    // Getters
    getState: () => ({ ...state }),
    isLoading: () => Object.values(state.loading).some(Boolean),
    hasErrors: () => Object.keys(state.errors).length > 0,

    // Setters
    setLoading: (key, isLoading) => {
      state.loading[key] = isLoading;
      notifyListeners();
    },

    setData: (key, data) => {
      state.data[key] = data;
      state.errors[key] = null;
      state.lastUpdated = new Date();
      notifyListeners();
    },

    setError: (key, error) => {
      state.errors[key] = error;
      state.loading[key] = false;
      notifyListeners();
    },

    // Suscripciones
    subscribe: (listener) => {
      listeners.push(listener);
      return () => {
        listeners = listeners.filter(l => l !== listener);
      };
    },

    // Utilidades
    clearErrors: () => {
      state.errors = {};
      notifyListeners();
    }
  };
}