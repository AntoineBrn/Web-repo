import { EditOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
import type { BikeModel, UpdateBikeModel } from "../models/BikeModel";
import { BikeFormModal } from "./BikeFormModal";

interface EditBikeButtonProps {
  bike: BikeModel;
  updateBike: (input: UpdateBikeModel) => Promise<unknown>;
}

export const EditBikeButton = ({ bike, updateBike }: EditBikeButtonProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <Button icon={<EditOutlined />} onClick={() => setIsOpen(true)}>
        Edit
      </Button>
      {isOpen && (
        <BikeFormModal
          title={`Editing ${bike.brand} ${bike.model}`}
          okText="Save"
          bike={bike}
          onClose={() => setIsOpen(false)}
          onSubmit={updateBike}
        />
      )}
    </>
  );
};