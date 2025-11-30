/**
 * Production health check utilities
 */

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: {
    environment: boolean;
    apiConnection: boolean;
    performance: boolean;
  };
  timestamp: string;
  details?: string;
}

export class HealthChecker {
  private lastCheck: HealthStatus | null = null;
  private checkInterval: number | null = null;

  constructor() {
    if (import.meta.env.PROD) {
      this.startPeriodicChecks();
    }
  }

  async performHealthCheck(): Promise<HealthStatus> {
    const checks = {
      environment: this.checkEnvironment(),
      apiConnection: await this.checkApiConnection(),
      performance: this.checkPerformance(),
    };

    const healthyChecks = Object.values(checks).filter(Boolean).length;
    const totalChecks = Object.keys(checks).length;

    let status: HealthStatus['status'];
    if (healthyChecks === totalChecks) {
      status = 'healthy';
    } else if (healthyChecks >= totalChecks / 2) {
      status = 'degraded';
    } else {
      status = 'unhealthy';
    }

    const result: HealthStatus = {
      status,
      checks,
      timestamp: new Date().toISOString(),
    };

    if (status !== 'healthy') {
      result.details = this.getHealthDetails(checks);
    }

    this.lastCheck = result;
    return result;
  }

  private checkEnvironment(): boolean {
    try {
      const env = import.meta.env;
      return !!(env.VITE_GEMINI_API_KEY && 
               env.VITE_GEMINI_API_KEY !== 'your_gemini_api_key_here' &&
               env.VITE_GEMINI_API_KEY.startsWith('AIza'));
    } catch {
      return false;
    }
  }

  private async checkApiConnection(): Promise<boolean> {
    try {
      // Simple connectivity check - don't waste API quota
      const response = await fetch('https://generativelanguage.googleapis.com/', {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000),
      });
      return response.status < 500;
    } catch {
      return false;
    }
  }

  private checkPerformance(): boolean {
    try {
      // Check if performance is acceptable
      const memory = (performance as any).memory;
      if (memory) {
        const memoryUsageMB = memory.usedJSHeapSize / 1024 / 1024;
        return memoryUsageMB < 150; // Less than 150MB
      }
      return true; // Assume healthy if memory API not available
    } catch {
      return true;
    }
  }

  private getHealthDetails(checks: HealthStatus['checks']): string {
    const issues = [];
    if (!checks.environment) issues.push('Environment configuration');
    if (!checks.apiConnection) issues.push('API connectivity');
    if (!checks.performance) issues.push('Performance degradation');
    return `Issues detected: ${issues.join(', ')}`;
  }

  private startPeriodicChecks(): void {
    // Check health every 5 minutes in production
    this.checkInterval = window.setInterval(async () => {
      const health = await this.performHealthCheck();
      if (health.status !== 'healthy') {
        console.warn('🏥 Health check failed:', health);
      }
    }, 5 * 60 * 1000);
  }

  getLastHealthStatus(): HealthStatus | null {
    return this.lastCheck;
  }

  stop(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
}

// Global health checker instance
export const healthChecker = new HealthChecker();

// Utility function for manual health check
export const checkHealth = () => healthChecker.performHealthCheck();