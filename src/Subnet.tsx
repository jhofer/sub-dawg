import React, { useEffect, useState } from "react";
import { Card, Col, Input, Row, Slider, Statistic } from "antd";
import { Ip } from "./Ip";
import { MAX_NET_SIZE } from "./utilities";
import { ISubnet } from "./calculator";

export interface SubnetProps {
  subnet: ISubnet;
  onSizeChange: (newSize: number) => void;
}

export function Subnet(props: SubnetProps) {
  const { subnet, onSizeChange } = props;
  const { startIp, lastIp, minSize, size, subnetMask, hostcount } = subnet;

  const [subnetSize, setSubnetSize] = useState(size);

  useEffect(() => {
    onSizeChange(subnetSize);
  }, [subnetSize]);

  return (
    <Card title="Sub-Net">
        <Row gutter={20}>
        <Col span={12}>
          <Statistic title={"Subnet" } value={startIp+"/"+subnetSize} />
        </Col>
      </Row>
      <Row>
        <Col span={9}>
          <Slider
            min={minSize}
            max={MAX_NET_SIZE}
            onChange={setSubnetSize}
            value={subnetSize}
          />
        </Col>

        <Col span={3}>
          <div style={{ fontSize: 20 }}>{subnetSize}</div>
        </Col>
      </Row>

    
      <Ip title="Subnet" dec={subnetMask.split(".")}></Ip>

      <Row>
        <Col span={12}>
          <Statistic
            title="Subnet Host Count (minus Networkaddress and broadcast)"
            value={`${hostcount} - 2 = ${hostcount - 2} `}
          />
        </Col>
      </Row>

      <Ip dec={lastIp.split(".")} title="Last Subnet IP" />
    </Card>
  );
}
