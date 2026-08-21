import { computeMandelbrot } from '../math/mandelbrotCompute.js';
import type {
  MandelbrotComputeRequest,
  MandelbrotComputeResult,
} from '../math/mandelbrotCompute.js';

/**
 * Web Worker: renders the CPU Mandelbrot fallback off the main thread.
 * Produces the full RGBA buffer and transfers it back to the caller.
 */

const scope = self as unknown as {
  postMessage(message: MandelbrotComputeResult, transfer: Transferable[]): void;
  onmessage: ((e: MessageEvent<MandelbrotComputeRequest>) => void) | null;
};

scope.onmessage = (e: MessageEvent<MandelbrotComputeRequest>) => {
  const result = computeMandelbrot(e.data);
  scope.postMessage(result, [result.data.buffer]);
};
