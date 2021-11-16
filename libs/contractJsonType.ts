import { AbiItem } from "web3-utils";

type ContractJsonType = {
  address: string;
  abi: any;
//  abi: AbiItem | AbiItem[];
}

export type { ContractJsonType }