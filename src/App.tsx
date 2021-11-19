import React, { useState } from "react";
import logo from "./logo.svg";
import { Button, Card, Col, Input, Row, Slider, Statistic } from "antd";
import "./App.less";

const MIN_NET_SIZE = 1;
const MAX_NET_SIZE = 32;

function calcMask(vNetSize: number): [vnetBin: string[], subNetDec: number[]] {
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

function calcHostCount(vNetSize: number) {
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

function pad(bin: string) {
  return bin.padStart(8, "0");
}

function andIpBin(a: string[], b: string[]) {
  return a.map((v, i) => and(v, b[i]));
}

function orIpBin(a: string[], b: string[]) {
  return a.map((v, i) => or(v, b[i]));
}

function binIp2Dec(ip: string[]) {
  return ip.map((bin) => parseInt(bin, 2).toString());
}

function decIp2Bin(ip: string[]) {
  return ip.map((dec) => pad(Number(dec).toString(2)));
}

const invert = (v: string) => (v === "1" ? "0" : "1");

function Ip(props: { title: string; dec?: string[]; bin?: string[] }) {
  const { dec, bin, title } = props;
  const decIp = dec ? dec : binIp2Dec(bin!);
  const binIp = bin ? bin : decIp2Bin(dec!);

  return (
    <Row gutter={20}>
      <Col span={12}>
        <Statistic title={title + " (dec)"} value={decIp.join(".")} />
      </Col>
      <Col span={12}>
        <Statistic title={title + " (bin)"} value={binIp.join(".")} />
      </Col>
    </Row>
  );
}

function App() {
  const [vNetSize, setVNetSize] = useState(16);
  const [subNetSize, setSubNetSize] = useState(24);
  const [ipRange, setIpRange] = useState("192.168.0.0");

  const [vnetBin, vNetDec] = calcMask(vNetSize);
  const [subnetBin, subNetDec] = calcMask(subNetSize);
  const invertedSubnet = subnetBin.map((s) => s.split("").map(invert).join(""));

  const ipRangeDec = ipRange.split(".");
  const ipRangeBin = ipRangeDec.map((dec) => pad(Number(dec).toString(2)));
  const hostCountVnet = calcHostCount(vNetSize);
  const hostCountSubnet = calcHostCount(subNetSize);

  const networkPrefixBin = andIpBin(ipRangeBin, subnetBin);
  const networkPrefixDec = binIp2Dec(networkPrefixBin);

  const lastSubnetIpBin = orIpBin(ipRangeBin, invertedSubnet);
  const lastSubnetIpDec = binIp2Dec(lastSubnetIpBin);

  let subNetBits = 0;
  for (let index = 0; index < MAX_NET_SIZE - 1; index++) {
    const sub = subnetBin.join("")[index];
    const vnet = vnetBin.join("")[index];
    if (sub === "1" && vnet === "0") {
      subNetBits += 1;
    }
  }

  const subnetCount = Math.pow(2, subNetBits);

  return (
    <div className="site-card-border-less-wrapper">
      <Card title="V-Net">
        <Row>
          <Col span={12}>
            <Slider
              min={MIN_NET_SIZE}
              max={MAX_NET_SIZE}
              onChange={setVNetSize}
              value={vNetSize}
            />
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={12}>
            <Input
              placeholder="IP Range"
              value={ipRange}
              onChange={(e) => setIpRange(e.target.value)}
              addonAfter={"/" + vNetSize}
            />
          </Col>
        </Row>
        <Ip title="Ip Range" dec={ipRange.split(".")} />
        <Ip title="vnet" bin={vnetBin} />

        <Row>
          <Col span={12}>
            <Statistic
              title="Host Count (minus Networkaddress and broadcast)"
              value={`${hostCountVnet} - 2 = ${hostCountVnet - 2} `}
            />
          </Col>
        </Row>
      </Card>

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
      </Card>
    </div>
  );
}

export default App;
