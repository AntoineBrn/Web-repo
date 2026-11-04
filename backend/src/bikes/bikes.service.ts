import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { FilterCustomersModel } from "../customers/models/customer.model";
import { BikesRepository } from "./bikes.repository";
import { BikeInUseError } from "./models/bike-in-use.error";
import type {
  BikeModel,
  BikesPageModel,
  CreateBikeModel,
  UpdateBikeModel,
} from "./models/bike.model";

@Injectable()
export class BikesService {
  constructor(
    @Inject(BikesRepository) private readonly repository: BikesRepository,
  ) {}

  findAll(pagination: FilterCustomersModel): Promise<BikesPageModel> {
    return this.repository.findAll(pagination);
  }

  async findById(id: string): Promise<BikeModel> {
    const bike = await this.repository.findById(id);
    if (!bike) throw new NotFoundException("Bike not found");
    return bike;
  }

  create(input: CreateBikeModel): Promise<BikeModel> {
    return this.repository.create(input);
  }

  async update(id: string, input: UpdateBikeModel): Promise<BikeModel> {
    if (!Object.values(input).some((value) => value !== undefined))
      throw new BadRequestException("At least one field must be supplied");
    const bike = await this.repository.update(id, input);
    if (!bike) throw new NotFoundException("Bike not found");
    return bike;
  }

  async delete(id: string): Promise<void> {
    try {
      if (!(await this.repository.delete(id)))
        throw new NotFoundException("Bike not found");
    } catch (error) {
      if (error instanceof BikeInUseError)
        throw new ConflictException("Bike is linked to a sale");
      throw error;
    }
  }
}