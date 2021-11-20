import React from "react";
import { Col, Row, Statistic } from "antd";
import { binIp2Dec, decIp2Bin } from "./utilities";

export function Ip(props: { title: string; dec?: string[]; bin?: string[]; }) {
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
