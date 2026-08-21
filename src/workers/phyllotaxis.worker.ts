import type {
  PhyllotaxisComputeRequest,
  PhyllotaxisComputeResult,
} from '../math/phyllotaxisCompute.js';
import { computePhyllotaxis } from '../math/phyllotaxisCompute.js';

/**
 * Web Worker: computes the phyllotaxis disc off the main thread.
 * Receives serialized requests and posts back the typed array as transferable.
 */

const scope = self as unknown as {
  postMessage(message: PhyllotaxisComputeResult, transfer: Transferable[]): void;
  onmessage: ((e: MessageEvent<PhyllotaxisComputeRequest>) => void) | null;
};

scope.onmessage = (e: MessageEvent<PhyllotaxisComputeRequest>) => {
  const result = computePhyllotaxis(e.data);
  scope.postMessage(result, [result.data.buffer]);
};
