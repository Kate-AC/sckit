import { AbiItem } from "web3-utils";

type ContractJsonType = {
  address: string;
  abi: any;
  binary: string;
//  abi: AbiItem | AbiItem[];
}

export type { ContractJsonType }