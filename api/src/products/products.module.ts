import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller.js';
import { ProductsService } from './products.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Products, ProductsSchema } from './products.schema.js';

@Module({
  imports: [MongooseModule.forFeature([{
    name: Products.name,
    schema: ProductsSchema
  }])],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule { }
