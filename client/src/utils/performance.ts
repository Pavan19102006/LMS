export const measurePerformance = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    const metrics = {
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      firstInputDelay: 0,
      cumulativeLayoutShift: 0,
      timeToInteractive: navigation.loadEventEnd - navigation.fetchStart,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
      pageLoad: navigation.loadEventEnd - navigation.fetchStart
    };

    return metrics;
  }
  return null;
};

export const logPerformanceMetrics = () => {
  const metrics = measurePerformance();
  if (metrics && process.env.NODE_ENV === 'development') {
    console.table(metrics);
  }
};
