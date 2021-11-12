class ContractParser {
  data: string;
  binary: string;
  abi: string;

  constructor(data: string) {
    this.data = data;
    this.binary = '';
    this.abi = '';
    this.parse();
  }

  parse(): void {
    const splitted = this.data.split('Contract JSON ABI');
    const binaryBase = 'Binary:';
  
    this.binary = '0x' + splitted[0].substr(splitted[0].indexOf(binaryBase) + binaryBase.length).trim();
    this.abi = splitted[1].trim();
  }

  getBinary(): string {
    return this.binary;
  }

  getAbi(): string {
    return this.abi;
  }
}

export default ContractParser;