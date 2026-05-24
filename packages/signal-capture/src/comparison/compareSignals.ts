import type { InputFrame } from '../input/inputSampler';

export function compareSignals(a: InputFrame[], b: InputFrame[]) {
  const aCorrections = a.filter((f) => Math.abs(f.mouse.velocityX) > 0 && Math.abs(f.mouse.velocityY) > 0).length;
  const bCorrections = b.filter((f) => Math.abs(f.mouse.velocityX) > 0 && Math.abs(f.mouse.velocityY) > 0).length;
  const aPauses = a.filter((f, i) => i > 0 && f.timestamp - a[i - 1].timestamp > 120).length;
  const bPauses = b.filter((f, i) => i > 0 && f.timestamp - b[i - 1].timestamp > 120).length;

  return {
    correctionDelta: aCorrections - bCorrections,
    hesitationDelta: aPauses - bPauses,
    descriptor: {
      correctionShift: aCorrections > bCorrections ? 'more corrective' : 'less corrective',
      hesitationShift: aPauses > bPauses ? 'more hesitant' : 'less hesitant'
    }
  };
}
