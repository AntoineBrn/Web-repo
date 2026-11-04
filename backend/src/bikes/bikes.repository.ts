import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { BikeSellEntity } from "../customers/entities/bike-sell.entity";
import type { FilterCustomersModel } from "../customers/models/customer.model";
import { BikeEntity } from "./entities/bike.entity";
import { BikeInUseError } from "./models/bike-in-use.error";
import type {
  BikeModel,
  BikesPageModel,
  CreateBikeModel,
  UpdateBikeModel,
} from "./models/bike.model";

@Injectable()
export class BikesRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findAll({
    page,
    limit,
  }: FilterCustomersModel): Promise<BikesPageModel> {
    const [entities, totalCount] = await this.dataSource
      .getRepository(BikeEntity)
      .findAndCount({
        order: { brand: "ASC", model: "ASC", id: "ASC" },
        take: limit,
        skip: (page - 1) * limit,
      });
    return {
      totalCount,
      bikes: entities.map((entity) => this.toBikeModel(entity)),
    };
  }

  async findById(id: string): Promise<BikeModel | null> {
    const entity = await this.dataSource
      .getRepository(BikeEntity)
      .findOneBy({ id });
    return entity ? this.toBikeModel(entity) : null;
  }

  async create(input: CreateBikeModel): Promise<BikeModel> {
    const repository = this.dataSource.getRepository(BikeEntity);
    return this.toBikeModel(await repository.save(repository.create(input)));
  }

  async update(id: string, input: UpdateBikeModel): Promise<BikeModel | null> {
    const repository = this.dataSource.getRepository(BikeEntity);
    const entity = await repository.findOneBy({ id });
    if (!entity) return null;
    repository.merge(entity, input);
    return this.toBikeModel(await repository.save(entity));
  }

  async delete(id: string): Promise<boolean> {
    if (
      await this.dataSource
        .getRepository(BikeSellEntity)
        .existsBy({ bikeId: id })
    )
      throw new BikeInUseError();
    const result = await this.dataSource.getRepository(BikeEntity).delete(id);
    return (result.affected ?? 0) > 0;
  }

  private toBikeModel(entity: BikeEntity): BikeModel {
    return {
      id: entity.id,
      brand: entity.brand,
      model: entity.model,
      description: entity.description,
      category: entity.category,
      frameMaterial: entity.frameMaterial,
      frameSizeCm: entity.frameSizeCm,
      wheelSizeInches: entity.wheelSizeInches,
      gearCount: entity.gearCount,
      weightKg: entity.weightKg,
      electric: entity.electric,
      priceCents: entity.priceCents,
    };
  }
}
