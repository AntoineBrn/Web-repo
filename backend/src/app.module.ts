import { Module } from "@nestjs/common";
import { CustomersModule } from "./customers/customers.module.js";
import { BikesModule } from "./bikes/bikes.module.js";
import { DatabaseModule } from "./database/database.module.js";

@Module({
  imports: [DatabaseModule, CustomersModule, BikesModule],
})
export class AppModule {}
