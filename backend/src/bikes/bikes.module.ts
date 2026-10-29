import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BikeEntity } from "./entities/bike.entity.js";
import { BikesController } from "./bikes.controller.js";
import { BikesService } from "./bikes.service.js";
import { BikesRepository } from "./bikes.repository.js";

@Module({
  imports: [TypeOrmModule.forFeature([BikeEntity])],
  controllers: [BikesController],
  providers: [BikesService, BikesRepository],
})
export class BikesModule {}
