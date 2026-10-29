import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomerEntity } from "./entities/customer.entity.js";
import { BikeSellEntity } from "./entities/bike-sell.entity.js";
import { CustomersController } from "./customers.controller.js";
import { CustomersService } from "./customers.service.js";
import { CustomersRepository } from "./customers.repository.js";

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity, BikeSellEntity])],
  controllers: [CustomersController],
  providers: [CustomersService, CustomersRepository],
})
export class CustomersModule {}
