export const MIN_NET_SIZE = 1;
export const MAX_NET_SIZE = 32;

export function calcMask(vNetSize: number): [vnetBin: string[], subNetDec: number[]] {
  const vnetBin: string[] = [];
  let posIndex = 0;
  for (let bit = MIN_NET_SIZE; bit <= MAX_NET_SIZE; bit++) {
    let currentValue = vnetBin[posIndex] || "";
    const nextBit = bit <= vNetSize ? "1" : "0";
    vnetBin[posIndex] = currentValue + nextBit;

    if (bit % 8 === 0) {
      posIndex += 1;
    }
  }

  const subNetDec = vnetBin.map((bin) => parseInt(bin, 2));
  return [vnetBin, subNetDec];
}
export function calcHostCount(vNetSize: number) {
  return Math.pow(2, MAX_NET_SIZE - vNetSize);
}
function and(a: string, b: string) {
  return a
    .split("")
    .map((v, i) => (v === "1" && b[i] === "1" ? "1" : "0"))
    .join("");
}
function or(a: string, b: string) {
  return a
    .split("")
    .map((v, i) => (v === "1" || b[i] === "1" ? "1" : "0"))
    .join("");
}
export function pad(bin: string) {
  return bin.padStart(8, "0");
}
export function andIpBin(a: string[], b: string[]) {
  return a.map((v, i) => and(v, b[i]));
}
export function orIpBin(a: string[], b: string[]) {
  return a.map((v, i) => or(v, b[i]));
}

export function binIp2Dec(ip: string[]) {
  return ip.map((bin) => parseInt(bin, 2).toString());
}

export function decIp2Bin(ip: string[]) {
  return ip.map((dec) => pad(Number(dec).toString(2)));
}
export const invert = (v: string) => (v === "1" ? "0" : "1");

export function getNextIp(ipDez: string []){
    const increased = [...ipDez];
    
    for (let i = ipDez.length-1; i > 0; i--) {
      const ipPart = ipDez[i];
      const ipPartDez = Number(ipPart);
      if(ipPartDez < 255){
        const newPart =  ipPartDez+1
        increased[i] = `${newPart}`; 
        break;
      }else {
        increased[i] = "0"
      }
    }
    return increased
}


export function calcSubnetCount(subnetBin: string[], vnetBin:string[]) {
  let subNetBits = 0;
  for (let index = 0; index < MAX_NET_SIZE - 1; index++) {
      const sub = subnetBin.join("")[index];
      const vnet = vnetBin.join("")[index];
      if (sub === "1" && vnet === "0") {
          subNetBits += 1;
      }
  }

  const subnetCount = Math.pow(2, subNetBits);
  return subnetCount;
}