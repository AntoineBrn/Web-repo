import { DeleteOutlined } from "@ant-design/icons";
import { Button, message, Modal } from "antd";
import { isAxiosError } from "axios";
import { useState } from "react";
import type { BikeModel } from "../models/BikeModel";

interface DeleteBikeButtonProps {
  bike: BikeModel;
  deleteBike: (id: string) => Promise<unknown>;
}

export const DeleteBikeButton = ({
  bike,
  deleteBike,
}: DeleteBikeButtonProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onConfirm = () => {
    deleteBike(bike.id)
      .catch((error) => {
        if (isAxiosError(error) && error.response?.status === 409)
          message.error("This bike is linked to a sale and cannot be deleted");
        else message.error("The bike could not be deleted");
      })
      .finally(() => setIsOpen(false));
  };

  return (
    <>
      <Button danger onClick={() => setIsOpen(true)}>
        <DeleteOutlined />
      </Button>
      <Modal
        okButtonProps={{ danger: true }}
        open={isOpen}
        title={`Deleting ${bike.brand} ${bike.model}`}
        onCancel={() => setIsOpen(false)}
        onOk={onConfirm}
        okText="Yes, delete"
      >
        You are about to delete the bike {bike.brand} {bike.model}. This action
        cannot be undone, are you sure ?
      </Modal>
    </>
  );
};