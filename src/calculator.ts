import { binIp2Dec, calcHostCount, calcMask, getNextIp, invert, orIpBin, pad } from "./utilities";

export interface ISubnetDef {
    size: number,
    name: string
}

export interface ISubnet extends ISubnetDef {
    startIp: string,
    lastIp: string,
    minSize:number,
    subnetMask: string,
    hostcount: number
}

export function calcSubnets(ipRange:string, vNetSize: number, subnetSizes:Array<ISubnetDef>): Array<ISubnet>{

    const subNets = []
    let nextStartIp = ipRange.split(".");
    for (let index = 0; index < subnetSizes.length; index++) {
        const {size, name} = subnetSizes[index];

        const [subnetBin, subnetDez] = calcMask(size);
        const invertedSubnet = subnetBin.map((s) => s.split("").map(invert).join(""));
        const ipRangeBin = nextStartIp.map((dec) => pad(Number(dec).toString(2)));
        const lastSubnetIpBin = orIpBin(ipRangeBin, invertedSubnet);
        const lastIp = binIp2Dec(lastSubnetIpBin);
        const hostcount = calcHostCount(size);

        subNets.push({
            startIp: nextStartIp.join("."),
            lastIp: lastIp.join("."),
            minSize:vNetSize,
            size,
            name,
            subnetMask: subnetDez.join("."),
            hostcount
        })
        
       
        nextStartIp = getNextIp(lastIp)
    }


    return subNets

}