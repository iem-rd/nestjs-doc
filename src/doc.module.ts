import { Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { DocService } from "./services/doc.service";

@Module({
  imports: [DiscoveryModule],
  providers: [DocService],
  exports: [DocService],
})
export class DocModule {}
