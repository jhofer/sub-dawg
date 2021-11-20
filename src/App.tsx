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
import { calcSubnets } from "./calculator";

function App() {
  const [vNetSize, setVNetSize] = useState(16);

  const [ipRange, setIpRange] = useState("192.168.0.0");

  const [vnetBin] = calcMask(vNetSize);
  const [subnetSizes, setSubnetSizes] = useState([vNetSize]);
  const hostCountVnet = calcHostCount(vNetSize);

 

  const subnets = calcSubnets(ipRange,vNetSize,subnetSizes);
  const subnetHostCount = subnets.reduce((total,sub)=>total+sub.hostcount,0)

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
        <Row>
          <Col span={12}>
            <Statistic
              title="Host Count of all Subnets"
              value={`${subnetHostCount}`}
            />
          </Col>
        </Row>
      </Card>
      {subnets.map((subnet, index) => (
        <Subnet
          key={index}
          subnet={subnet}
          onSizeChange={(newSIze) => {
              const newSizes = [...subnetSizes];
              newSizes[index] =newSIze
              setSubnetSizes(newSizes);
            }
          }
        />
      ))}
      <Button
        onClick={() => {
          setSubnetSizes([...subnetSizes, subnets[subnets.length-1].size]); 
        }}
      >
        Add Subnet
      </Button>
    </div>
  );
}

export default App;
