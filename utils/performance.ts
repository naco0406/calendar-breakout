/**
 * Performance monitoring and optimization utilities
 */

/**
 * Debounce function to limit execution rate
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function to limit execution rate
 * @param func - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 */
export const throttle = <T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Request idle callback with fallback
 * @param callback - Callback to execute
 * @param options - Idle callback options
 * @returns Callback ID
 */
export const requestIdleCallbackShim = (
  callback: IdleRequestCallback,
  options?: IdleRequestOptions
): number => {
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, options);
  }
  
  // Fallback for unsupported browsers
  const start = Date.now();
  return setTimeout(() => {
    callback({
      didTimeout: false,
      timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
    });
  }, 1) as unknown as number;
};

/**
 * Cancel idle callback with fallback
 * @param id - Callback ID to cancel
 */
export const cancelIdleCallbackShim = (id: number): void => {
  if ('cancelIdleCallback' in window) {
    window.cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
};

/**
 * Memory usage monitor
 * @returns Current memory usage or null if not supported
 */
interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

export const getMemoryUsage = (): MemoryInfo | null => {
  if ('memory' in performance) {
    return (performance as Performance & { memory: MemoryInfo }).memory;
  }
  return null;
};

/**
 * FPS counter for performance monitoring
 */
export class FPSCounter {
  private lastTime = performance.now();
  private frames = 0;
  private fps = 0;

  /**
   * Update FPS counter
   * @returns Current FPS
   */
  update(): number {
    this.frames++;
    const currentTime = performance.now();
    
    if (currentTime >= this.lastTime + 1000) {
      this.fps = Math.round((this.frames * 1000) / (currentTime - this.lastTime));
      this.frames = 0;
      this.lastTime = currentTime;
    }
    
    return this.fps;
  }

  /**
   * Get current FPS
   * @returns Current FPS value
   */
  getFPS(): number {
    return this.fps;
  }
}

/**
 * Cleanup manager for preventing memory leaks
 */
export class CleanupManager {
  private cleanupFunctions: Array<() => void> = [];

  /**
   * Register a cleanup function
   * @param cleanup - Cleanup function to register
   */
  register(cleanup: () => void): void {
    this.cleanupFunctions.push(cleanup);
  }

  /**
   * Execute all cleanup functions
   */
  cleanup(): void {
    this.cleanupFunctions.forEach(fn => {
      try {
        fn();
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    });
    this.cleanupFunctions = [];
  }
}

/**
 * Performance marks for measuring execution time
 */
export class PerformanceMonitor {
  private marks = new Map<string, number>();

  /**
   * Start a performance measurement
   * @param name - Name of the measurement
   */
  start(name: string): void {
    this.marks.set(name, performance.now());
  }

  /**
   * End a performance measurement
   * @param name - Name of the measurement
   * @returns Duration in milliseconds
   */
  end(name: string): number | null {
    const start = this.marks.get(name);
    if (!start) return null;
    
    const duration = performance.now() - start;
    this.marks.delete(name);
    return duration;
  }

  /**
   * Measure a function's execution time
   * @param name - Name of the measurement
   * @param fn - Function to measure
   * @returns Function result
   */
  measure<T>(name: string, fn: () => T): T {
    this.start(name);
    const result = fn();
    const duration = this.end(name);
    if (duration !== null && duration > 16) {
      console.warn(`Performance warning: ${name} took ${duration.toFixed(2)}ms`);
    }
    return result;
  }
}