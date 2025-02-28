import { ethers } from 'ethers';

// Define interfaces for type safety
interface SafeTxInput {
  to: string;
  value: string;
  data: string;
  operation: number;
  safeTxGas: string;
  baseGas: string;
  gasPrice: string;
  gasToken: string;
  refundReceiver: string;
  nonce: number;
  safeAddress: string;
  chainId: number;
}

/**
 * Calculates the Safe transaction hash based on transaction input
 * @param txInput Safe transaction parameters
 * @returns Promise<string> The calculated safeTxHash
 */
export async function calculateSafeTxHash(txInput: SafeTxInput): Promise<string> {
  try {
    // Validate inputs
    if (!ethers.utils.isAddress(txInput.to)) {
      throw new Error('Invalid "to" address');
    }
    if (!ethers.utils.isAddress(txInput.safeAddress)) {
      throw new Error('Invalid Safe address');
    }
    if (!ethers.utils.isAddress(txInput.gasToken)) {
      throw new Error('Invalid gas token address');
    }
    if (!ethers.utils.isAddress(txInput.refundReceiver)) {
      throw new Error('Invalid refund receiver address');
    }
    if (!ethers.utils.isHexString(txInput.data)) {
      throw new Error('Invalid data format - must be hex string');
    }

    // Prepare typed data for EIP-712 hashing
    const domain = {
      chainId: txInput.chainId,
      verifyingContract: txInput.safeAddress
    };

    const message = {
      to: txInput.to,
      value: txInput.value,
      data: txInput.data,
      operation: txInput.operation,
      safeTxGas: txInput.safeTxGas,
      baseGas: txInput.baseGas,
      gasPrice: txInput.gasPrice,
      gasToken: txInput.gasToken,
      refundReceiver: txInput.refundReceiver,
      nonce: txInput.nonce
    };

    // Calculate domain separator
    const domainSeparator = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ['uint256', 'address'],
        [txInput.chainId, txInput.safeAddress]
      )
    );

    // Calculate message hash
    const messageHash = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        [
          'address',
          'uint256',
          'bytes',
          'uint8',
          'uint256',
          'uint256',
          'uint256',
          'address',
          'address',
          'uint256'
        ],
        [
          txInput.to,
          txInput.value,
          txInput.data,
          txInput.operation,
          txInput.safeTxGas,
          txInput.baseGas,
          txInput.gasPrice,
          txInput.gasToken,
          txInput.refundReceiver,
          txInput.nonce
        ]
      )
    );

    // Calculate final safeTxHash according to EIP-712
    const safeTxHash = ethers.utils.keccak256(
      ethers.utils.solidityPack(
        ['bytes1', 'bytes1', 'bytes32', 'bytes32'],
        ['0x19', '0x01', domainSeparator, messageHash]
      )
    );

    return safeTxHash;
  } catch (error: unknown) {
    // Type assertion to Error
    if (error instanceof Error) {
      throw new Error(`Failed to calculate safeTxHash: ${error.message}`);
    }
    // Fallback for non-Error objects
    throw new Error('Failed to calculate safeTxHash: Unknown error occurred');
  }
}

// Example usage
async function example() {
  const txInput: SafeTxInput = {
    to: '0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F',
    value: '1000000000000000000', // 1 ETH in wei
    data: '0x',
    operation: 0,
    safeTxGas: '0',
    baseGas: '0',
    gasPrice: '0',
    gasToken: '0x0000000000000000000000000000000000000000',
    refundReceiver: '0x0000000000000000000000000000000000000000',
    nonce: 1,
    safeAddress: '0x1234567890123456789012345678901234567890',
    chainId: 1 // Mainnet
  };

  try {
    const safeTxHash = await calculateSafeTxHash(txInput);
    console.log('Calculated SafeTxHash:', safeTxHash);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    } else {
      console.error('Error: Unknown error occurred');
    }
  }
}

// Run example
example();