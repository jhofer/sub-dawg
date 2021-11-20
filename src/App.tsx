import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import { Button, Card, Col, Input, Row, Slider, Statistic } from "antd";
import "./App.less";
import { Ip } from "./Ip";
import {
  calcMask,
  calcHostCount,
  MAX_NET_SIZE,
  MIN_NET_SIZE,
} from "./utilities";
import { Subnet } from "./Subnet";

function App() {
  const [vNetSize, setVNetSize] = useState(16);

  const [ipRange, setIpRange] = useState("192.168.0.0");

  const [vnetBin] = calcMask(vNetSize);
  const [subnets, setSubNets] = useState([
    { startIp: ipRange, size: vNetSize },
  ]);
  const hostCountVnet = calcHostCount(vNetSize);

  useEffect(() => {
    const newSubs = [...subnets];
    newSubs[0] = { startIp: ipRange, size: vNetSize };
    setSubNets(newSubs);
  }, [ipRange, vNetSize]);

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
      {subnets.map(({ startIp, size }, index) => (
        <Subnet
          key={startIp}
          startIp={startIp}
          vNetSize={size}
          onChange={(nextIp) => {
            if (index + 1 < subnets.length) {
              const newSubnets = [...subnets];
              newSubnets[index + 1] = {
                ...newSubnets[index],
                startIp: nextIp,
              };
              setSubNets(newSubnets);
            }
          }}
        />
      ))}
      <Button
        onClick={() => {
          setSubNets([...subnets, { startIp: "", size: 0 }]);
        }}
      >
        Add Subnet
      </Button>
    </div>
  );
}

export default App;
