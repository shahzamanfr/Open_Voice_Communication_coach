/**
 * Performance monitoring utilities for production
 */

interface PerformanceMetrics {
  loadTime: number;
  apiResponseTime: number;
  errorCount: number;
  memoryUsage?: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    loadTime: 0,
    apiResponseTime: 0,
    errorCount: 0,
  };

  private startTimes: Map<string, number> = new Map();

  constructor() {
    this.initializeMonitoring();
  }

  private initializeMonitoring() {
    // Monitor page load time
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        const loadTime = performance.now();
        this.metrics.loadTime = loadTime;
        
        if (import.meta.env.DEV) {
          console.log(`📊 Page load time: ${loadTime.toFixed(2)}ms`);
        }
      });

      // Monitor memory usage (if available)
      if ('memory' in performance) {
        setInterval(() => {
          const memory = (performance as any).memory;
          this.metrics.memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
        }, 30000); // Check every 30 seconds
      }
    }
  }

  startTimer(operation: string): void {
    this.startTimes.set(operation, performance.now());
  }

  endTimer(operation: string): number {
    const startTime = this.startTimes.get(operation);
    if (!startTime) return 0;

    const duration = performance.now() - startTime;
    this.startTimes.delete(operation);

    if (operation.includes('api')) {
      this.metrics.apiResponseTime = duration;
    }

    if (import.meta.env.DEV) {
      console.log(`⏱️ ${operation}: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  recordError(error: Error): void {
    this.metrics.errorCount++;
    
    if (import.meta.env.DEV) {
      console.error('📊 Error recorded:', error.message);
    }

    // In production, you might want to send this to an analytics service
    if (import.meta.env.PROD) {
      // Example: Send to analytics
      // analytics.track('error', { message: error.message, stack: error.stack });
    }
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  logPerformanceReport(): void {
    const report = {
      ...this.metrics,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    if (import.meta.env.DEV) {
      console.table(report);
    }

    // In production, send to monitoring service
    if (import.meta.env.PROD && this.shouldReportMetrics()) {
      // Example: Send to monitoring service
      // monitoringService.send(report);
    }
  }

  private shouldReportMetrics(): boolean {
    // Only report if there are significant metrics or errors
    return this.metrics.errorCount > 0 || 
           this.metrics.apiResponseTime > 5000 || 
           (this.metrics.memoryUsage && this.metrics.memoryUsage > 100);
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Utility functions for easy use
export const startTimer = (operation: string) => performanceMonitor.startTimer(operation);
export const endTimer = (operation: string) => performanceMonitor.endTimer(operation);
export const recordError = (error: Error) => performanceMonitor.recordError(error);
export const getMetrics = () => performanceMonitor.getMetrics();

// Auto-report performance every 5 minutes in production
if (import.meta.env.PROD) {
  setInterval(() => {
    performanceMonitor.logPerformanceReport();
  }, 5 * 60 * 1000);
}