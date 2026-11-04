import { ArrowLeftOutlined, ShopOutlined } from "@ant-design/icons";
import type { DescriptionsProps } from "antd";
import { Card, Descriptions, Skeleton, Space } from "antd";
import Title from "antd/es/typography/Title";
import { useEffect } from "react";
import { ButtonLink } from "../../shared/components/ButtonLink";
import { formatPrice } from "../formatPrice";
import { useBikeDetailsProvider } from "../providers/useBikeDetailsProvider";
import { EditBikeButton } from "./EditBikeButton";

interface BikeDetailsProps {
  bikeId: string;
}

export const BikeDetails = ({ bikeId }: BikeDetailsProps) => {
  const { bike, isLoading, load, updateBike } = useBikeDetailsProvider(bikeId);

  useEffect(() => {
    load();
  }, [bikeId]);

  const items: DescriptionsProps["items"] = bike
    ? [
        { key: "brand", label: "Brand", children: bike.brand },
        { key: "model", label: "Model", children: bike.model },
        { key: "category", label: "Category", children: bike.category },
        { key: "description", label: "Description", children: bike.description },
        { key: "frameMaterial", label: "Frame material", children: bike.frameMaterial },
        { key: "frameSizeCm", label: "Frame size", children: `${bike.frameSizeCm} cm` },
        { key: "wheelSizeInches", label: "Wheel size", children: `${bike.wheelSizeInches} in` },
        { key: "gearCount", label: "Gears", children: bike.gearCount },
        { key: "weightKg", label: "Weight", children: `${bike.weightKg} kg` },
        { key: "electric", label: "Electric", children: bike.electric ? "Yes" : "No" },
        { key: "price", label: "Price", children: formatPrice(bike.priceCents) },
      ]
    : [];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 16,
        padding: ".25rem .5rem",
      }}
    >
      <ButtonLink to="/bikes" icon={<ArrowLeftOutlined />}>
        Back to bikes
      </ButtonLink>

      <Space align="center">
        <ShopOutlined style={{ fontSize: "1.5rem" }} />
        {isLoading ? (
          <Skeleton.Input active size="large" />
        ) : (
          <Title level={2} style={{ margin: 0 }}>
            {bike ? `${bike.brand} ${bike.model}` : "Bike not found"}
          </Title>
        )}
      </Space>

      <Card
        title="Details"
        style={{ alignSelf: "stretch" }}
        extra={bike && <EditBikeButton bike={bike} updateBike={updateBike} />}
      >
        {isLoading ? <Skeleton /> : <Descriptions column={1} items={items} />}
      </Card>
    </div>
  );
};