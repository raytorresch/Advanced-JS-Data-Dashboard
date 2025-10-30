# Advanced JS Data Dashboard

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Functional Programming](https://img.shields.io/badge/Functional-Programming-blue.svg)](https://en.wikipedia.org/wiki/Functional_programming)
[![Async/Await](https://img.shields.io/badge/Async%2FAwait-Patterns-green.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
[![Architecture](https://img.shields.io/badge/Clean-Architecture-orange.svg)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

**Un dashboard de analytics empresarial construido con JavaScript vanilla con patrones avanzados de programación y arquitectura limpia.**

## Características Principales

###  **Arquitectura Avanzada**
- **Gestión de estado** con closures y factory functions
- **Separación de concerns** (API, Core, UI)
- **Sistema de cache** con TTL y cleanup automático
- **Patrón pub/sub** para actualizaciones reactivas

### **Async Patterns**
- **Retry logic** con exponential backoff
- **Request cancellation** con AbortController
- **Loading states** management
- **Error handling** robusto y granular

### **Transformaciones de Datos**
- **Functional programming** puro (sin side effects)
- **Data pipeline** con composición de funciones
- **Enriquecimiento** y agregación de datos
- **Preparación** para visualizaciones

## Stack Tecnológico

| Capa | Tecnologías |
|------|-------------|
| **Lenguaje** | JavaScript ES6+ |
| **Paradigma** | Functional Programming |
| **Async** | Async/Await, Promises |
| **Patrones** | Factory Functions, Closures, HOFs |
| **APIs** | RESTful patterns, Error handling |
| **UI** | Vanilla DOM manipulation |

## Estructura del Proyecto
```bash
│ src/
├── api/
│ ├── client.js # RobustApiClient con retry y timeout
│ ├── data-sources.js # Múltiples APIs mock
│ └── cache.js # Sistema de cache con TTL
├── core/
│ ├── data-transforms.js # Transformaciones funcionales
│ ├── data-pipeline.js # Composición de procesamiento
│ └── state-manager.js # Gestor de estado reactivo
├── ui/
│ ├── renderer.js # Sistema de renderizado vanilla
│ └── components.js # Componentes de UI
└── app.js # Aplicación principal
```

##  Instalación y Uso

```bash
# Clonar el repositorio
git clone https://github.com/user/repo.git

# Entrar al directorio
cd dir-name

# servir con un servidor local
python3 -m http.server

# acceder a
http://[::]:8000/
````

