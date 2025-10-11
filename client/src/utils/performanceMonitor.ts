import React from 'react';

// Performance monitoring utility for tracking login speed
export class PerformanceMonitor {
  private static marks: Map<string, number> = new Map();

  static mark(name: string): void {
    this.marks.set(name, performance.now());
  }

  static measure(startMark: string, endMark: string): number {
    const start = this.marks.get(startMark);
    const end = this.marks.get(endMark);
    
    if (start !== undefined && end !== undefined) {
      const duration = end - start;
      console.log(`⚡ Performance: ${startMark} -> ${endMark}: ${duration.toFixed(2)}ms`);
      return duration;
    }
    
    return 0;
  }

  static measureFromStart(startMark: string): number {
    const start = this.marks.get(startMark);
    if (start !== undefined) {
      const duration = performance.now() - start;
      console.log(`⚡ Performance: ${startMark} -> now: ${duration.toFixed(2)}ms`);
      return duration;
    }
    return 0;
  }

  static clear(): void {
    this.marks.clear();
  }
}

// Optimize React component rendering
export const withPerformance = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
): React.ComponentType<P> => {
  return (props: P) => {
    const renderStart = performance.now();
    
    React.useEffect(() => {
      const renderEnd = performance.now();
      const renderTime = renderEnd - renderStart;
      
      if (renderTime > 100) {
        console.warn(`⚠️ Slow render detected: ${componentName} took ${renderTime.toFixed(2)}ms`);
      }
    }, []);

    return React.createElement(Component, props);
  };
};
