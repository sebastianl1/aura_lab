import type {
  BifurcationComputeRequest,
  BifurcationComputeResult,
} from '../math/bifurcationCompute.js';
import { computeBifurcationData } from '../math/bifurcationCompute.js';
import { globalModelRegistry } from '../math/models/ModelRegistry.js';

/**
 * Web Worker: computes the bifurcation density grid and the Lyapunov curve
 * off the main thread. Receives serialized requests and posts back the typed
 * arrays as transferables.
 */

const scope = self as unknown as {
  postMessage(message: BifurcationComputeResult, transfer: Transferable[]): void;
  onmessage: ((e: MessageEvent<BifurcationComputeRequest>) => void) | null;
};

scope.onmessage = (e: MessageEvent<BifurcationComputeRequest>) => {
  const req = e.data;
  const model = globalModelRegistry.getModel(req.modelId);
  if (req.polyK !== undefined) globalModelRegistry.setPolynomialK(req.polyK);

  const result = computeBifurcationData(req, model);

  const transfer: Transferable[] = [result.density.buffer];
  if (result.lyapunov) transfer.push(result.lyapunov.buffer);
  if (result.lyapunovNorm) transfer.push(result.lyapunovNorm.buffer);

  scope.postMessage(result, transfer);
};
