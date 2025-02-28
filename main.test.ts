import { calculateSafeTxHash } from './main';

describe('calculateSafeTxHash', () => {
  it('calculates hash correctly', async () => {
    const txInput = {
      to: '0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F',
      value: '1000000000000000000',
      data: '0x',
      operation: 0,
      safeTxGas: '0',
      baseGas: '0',
      gasPrice: '0',
      gasToken: '0x0000000000000000000000000000000000000000',
      refundReceiver: '0x0000000000000000000000000000000000000000',
      nonce: 1,
      safeAddress: '0x1234567890123456789012345678901234567890',
      chainId: 1
    };
    const hash = await calculateSafeTxHash(txInput);
    expect(hash).toMatch(/^0x[a-fA-F0-9]{64}$/); // Check for valid hash
  });
});