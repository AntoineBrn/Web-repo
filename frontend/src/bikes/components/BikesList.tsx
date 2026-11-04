import { Pagination, Skeleton, Space } from "antd";
import { useEffect, useState } from "react";
import { useBikesProvider } from "../providers/useBikesProvider";
import { AddBikeButton } from "./AddBikeButton";
import { BikeListItem } from "./BikeListItem";

const PAGE_SIZE = 10;

export const BikesList = () => {
  const { bikes, totalCount, isLoading, load, createBike, deleteBike } =
    useBikesProvider();
  const [page, setPage] = useState(1);

  useEffect(() => {
    load(page, PAGE_SIZE);
  }, [page]);

  const reload = () => load(page, PAGE_SIZE);

  const handleDelete = (id: string) =>
    deleteBike(id).then(() => {
      // Last bike of the page deleted: go back one page
      if (bikes.length === 1 && page > 1) setPage(page - 1);
      else reload();
    });

  return (
    <Space orientation="vertical" style={{ padding: ".25rem .5rem" }}>
      <AddBikeButton createBike={(input) => createBike(input).then(reload)} />
      {isLoading ? (
        <Skeleton />
      ) : (
        bikes.map((bike) => (
          <BikeListItem key={bike.id} bike={bike} deleteBike={handleDelete} />
        ))
      )}
      <Pagination
        current={page}
        pageSize={PAGE_SIZE}
        total={totalCount}
        showSizeChanger={false}
        onChange={(newPage) => setPage(newPage)}
      />
    </Space>
  );
};