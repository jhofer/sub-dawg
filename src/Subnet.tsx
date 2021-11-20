import React, { useEffect, useState } from "react";
import { Card, Col, Input, Row, Slider, Statistic } from "antd";
import { Ip } from "./Ip";
import {
  calcMask,
  invert,
  pad,
  calcHostCount,
  andIpBin,
  binIp2Dec,
  orIpBin,
  MAX_NET_SIZE,
  calcSubnetCount,
  getNextIp,
} from "./utilities";

export interface SubnetProps {
  vNetSize: number;
  startIp: string;
  onChange: (nextIp: string) => void;
}

export function Subnet(props: SubnetProps) {
  const { vNetSize, startIp, onChange } = props;
  const [vnetBin] = calcMask(vNetSize);
  const [subNetSize, setSubNetSize] = useState(vNetSize);
  const [subnetBin, subnetDez] = calcMask(subNetSize);
  const invertedSubnet = subnetBin.map((s) => s.split("").map(invert).join(""));
  const hostCountSubnet = calcHostCount(subNetSize);
  const ipRangeDec = startIp.split(".");
  const ipRangeBin = ipRangeDec.map((dec) => pad(Number(dec).toString(2)));
  const networkPrefixBin = andIpBin(ipRangeBin, subnetBin);
  const networkPrefixDec = binIp2Dec(networkPrefixBin);
  const lastSubnetIpBin = orIpBin(ipRangeBin, invertedSubnet);
  const lastSubnetIpDec = binIp2Dec(lastSubnetIpBin);
  const subnetCount = calcSubnetCount(subnetBin, vnetBin);

  const nextSubnetIpDec = getNextIp(lastSubnetIpDec);

  useEffect(() => {
    onChange(nextSubnetIpDec.join("."));
  }, [vNetSize, startIp, subNetSize, onChange]);

  return (
    <Card title="Sub-Net">
      <Row>
        <Col span={9}>
          <Slider
            min={vNetSize}
            max={MAX_NET_SIZE}
            onChange={setSubNetSize}
            value={subNetSize}
          />
        </Col>

        <Col span={3}>
          <div style={{ fontSize: 20 }}>{subNetSize}</div>
        </Col>
      </Row>
      <Row>
        <Col>
          <Input
            readOnly
            placeholder="IP Range"
            value={subnetDez.join(".")}
            addonAfter={"/" + vNetSize}
          />
        </Col>
      </Row>
      <Ip title="Subnet" bin={subnetBin}></Ip>
      <Ip bin={invertedSubnet} title="Inverted" />
      <Row>
        <Col span={12}>
          <Statistic title="SubnetCount" value={subnetCount} />
        </Col>
      </Row>

      <Row>
        <Col span={12}>
          <Statistic
            title="Subnet Host Count (minus Networkaddress and broadcast)"
            value={`${hostCountSubnet} - 2 = ${hostCountSubnet - 2} `}
          />
        </Col>
      </Row>
      <Ip dec={networkPrefixDec} title="Network Prefix" />

      <Ip bin={lastSubnetIpBin} title="Last Subnet IP" />
      <Ip dec={nextSubnetIpDec} title="Next Subnet IP" />
    </Card>
  );
}
