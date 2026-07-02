export interface Wallet {
  id: string;
  name: string;
  balance: number;
  keyValid: boolean;
}

export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  forged?: boolean;
}

export type BlockStatus = "valid" | "invalid" | "mining";

export interface SimBlock {
  id: string;
  index: number;
  txs: Transaction[];
  hash: string;
  prevHash: string | null;
  status: BlockStatus;
  hashTrigger: number;
  shakeTrigger: number;
}

export type SimNodeState = "idle" | "verifying" | "valid" | "invalid" | "offline";

export interface SimNode {
  id: string;
  label: string;
  state: SimNodeState;
}

export interface SimulationState {
  blocks: SimBlock[];
  pendingTxs: Transaction[];
  nodes: SimNode[];
  wallets: Wallet[];
  tick: number;
}
