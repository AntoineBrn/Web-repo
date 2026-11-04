import type {
  CustomerModel,
  CustomersPageModel,
} from "../models/customer.model";

export class CustomerResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  birthDate: string | null;
  address: string | null;
  postalCode: string | null;
  city: string | null;
  country: string | null;

  static fromModel(model: CustomerModel): CustomerResponseDto {
    return Object.assign(new CustomerResponseDto(), model);
  }
}

export class CustomersPageResponseDto {
  totalCount: number;
  customers: CustomerResponseDto[];

  static fromModel(model: CustomersPageModel): CustomersPageResponseDto {
    return Object.assign(new CustomersPageResponseDto(), {
      totalCount: model.totalCount,
      customers: model.customers.map((c) => CustomerResponseDto.fromModel(c)),
    });
  }
}
