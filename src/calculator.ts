import { binIp2Dec, calcHostCount, calcMask, getNextIp, invert, orIpBin, pad } from "./utilities";

export interface ISubnet {
    startIp: string,
    lastIp: string,
    minSize:number,
    size: number,
    subnetMask: string,
    hostcount: number
}

export function calcSubnets(ipRange:string, vNetSize: number, subnetSizes:number[]): Array<ISubnet>{

    const subNets = []
    let nextStartIp = ipRange.split(".");
    let nextMinSize = vNetSize;
    for (let index = 0; index < subnetSizes.length; index++) {
        const subnetSize = subnetSizes[index];


        const [subnetBin, subnetDez] = calcMask(subnetSize);
        const invertedSubnet = subnetBin.map((s) => s.split("").map(invert).join(""));
        const ipRangeBin = nextStartIp.map((dec) => pad(Number(dec).toString(2)));
        const lastSubnetIpBin = orIpBin(ipRangeBin, invertedSubnet);
        const lastIp = binIp2Dec(lastSubnetIpBin);
        const hostcount = calcHostCount(subnetSize);

        subNets.push({
            startIp: nextStartIp.join("."),
            lastIp: lastIp.join("."),
            minSize:vNetSize,
            size: subnetSize,
            subnetMask: subnetDez.join("."),
            hostcount
        })
        
        nextMinSize= subnetSize
        nextStartIp = getNextIp(lastIp)
    }


    return subNets

}