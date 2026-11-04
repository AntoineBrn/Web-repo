import { Checkbox, Col, Input, message, Modal, Row, Typography } from "antd";
import { useState } from "react";
import type { BikeModel, CreateBikeModel } from "../models/BikeModel";

interface BikeFormModalProps {
  title: string;
  okText: string;
  bike?: BikeModel;
  onClose: () => void;
  onSubmit: (input: CreateBikeModel) => Promise<unknown>;
}

type TextField =
  | "brand"
  | "model"
  | "description"
  | "category"
  | "frameMaterial"
  | "frameSizeCm"
  | "wheelSizeInches"
  | "gearCount"
  | "weightKg"
  | "price";

type BikeFormValues = Record<TextField, string> & { electric: boolean };
type BikeFormErrors = Partial<Record<TextField, string>>;

const emptyValues: BikeFormValues = {
  brand: "",
  model: "",
  description: "",
  category: "",
  frameMaterial: "",
  frameSizeCm: "",
  wheelSizeInches: "",
  gearCount: "",
  weightKg: "",
  price: "",
  electric: false,
};

const toValues = (bike: BikeModel): BikeFormValues => ({
  brand: bike.brand,
  model: bike.model,
  description: bike.description,
  category: bike.category,
  frameMaterial: bike.frameMaterial,
  frameSizeCm: String(bike.frameSizeCm),
  wheelSizeInches: String(bike.wheelSizeInches),
  gearCount: String(bike.gearCount),
  weightKg: String(bike.weightKg),
  price: String(bike.priceCents / 100),
  electric: bike.electric,
});

const validate = (values: BikeFormValues): BikeFormErrors => {
  const errors: BikeFormErrors = {};
  (
    ["brand", "model", "description", "category", "frameMaterial"] as const
  ).forEach((name) => {
    if (!values[name].trim()) errors[name] = "This field is required";
  });
  (["frameSizeCm", "wheelSizeInches", "weightKg"] as const).forEach((name) => {
    if (!(Number(values[name]) > 0)) errors[name] = "Must be greater than 0";
  });
  if (
    !Number.isInteger(Number(values.gearCount)) ||
    Number(values.gearCount) < 1
  )
    errors.gearCount = "Must be a whole number greater than 0";
  if (values.price.trim() === "" || !(Number(values.price) >= 0))
    errors.price = "Must be 0 or more";
  return errors;
};

const toCreateBikeModel = (values: BikeFormValues): CreateBikeModel => ({
  brand: values.brand.trim(),
  model: values.model.trim(),
  description: values.description.trim(),
  category: values.category.trim(),
  frameMaterial: values.frameMaterial.trim(),
  frameSizeCm: Number(values.frameSizeCm),
  wheelSizeInches: Number(values.wheelSizeInches),
  gearCount: Number(values.gearCount),
  weightKg: Number(values.weightKg),
  electric: values.electric,
  priceCents: Math.round(Number(values.price) * 100),
});

// Rendered only while open, so the form starts fresh each time
export const BikeFormModal = ({
  title,
  okText,
  bike,
  onClose,
  onSubmit,
}: BikeFormModalProps) => {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [values, setValues] = useState<BikeFormValues>(
    bike ? toValues(bike) : emptyValues,
  );
  const [errors, setErrors] = useState<BikeFormErrors>({});

  const onConfirm = () => {
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSaving(true);
    onSubmit(toCreateBikeModel(values))
      .then(onClose)
      .catch(() => message.error("The bike could not be saved"))
      .finally(() => setIsSaving(false));
  };

  const textField = (name: TextField, label: string, type: string = "text") => (
    <>
      <label htmlFor={`bike-${name}`}>{label}</label>
      <Input
        id={`bike-${name}`}
        type={type}
        value={values[name]}
        status={errors[name] && "error"}
        onChange={(event) => {
          setValues({ ...values, [name]: event.target.value });
          setErrors({ ...errors, [name]: undefined });
        }}
      />
      {errors[name] && (
        <Typography.Text type="danger">{errors[name]}</Typography.Text>
      )}
    </>
  );

  return (
    <Modal
      open
      title={title}
      okText={okText}
      onCancel={onClose}
      onOk={onConfirm}
      confirmLoading={isSaving}
    >
      <Row gutter={[16, 16]}>
        <Col span={12}>{textField("brand", "Brand *")}</Col>
        <Col span={12}>{textField("model", "Model *")}</Col>
        <Col span={12}>{textField("category", "Category *")}</Col>
        <Col span={12}>{textField("frameMaterial", "Frame material *")}</Col>
        <Col span={24}>{textField("description", "Description *")}</Col>
        <Col span={8}>{textField("frameSizeCm", "Frame size (cm) *", "number")}</Col>
        <Col span={8}>
          {textField("wheelSizeInches", "Wheel size (in) *", "number")}
        </Col>
        <Col span={8}>{textField("gearCount", "Gears *", "number")}</Col>
        <Col span={12}>{textField("weightKg", "Weight (kg) *", "number")}</Col>
        <Col span={12}>{textField("price", "Price (€) *", "number")}</Col>
        <Col span={24}>
          <Checkbox
            checked={values.electric}
            onChange={(event) =>
              setValues({ ...values, electric: event.target.checked })
            }
          >
            Electric
          </Checkbox>
        </Col>
      </Row>
    </Modal>
  );
};