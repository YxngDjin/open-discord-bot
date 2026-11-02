import { Global, Module } from "@nestjs/common";
import { ModuleRegistryService } from "./module-registry.service.js";

@Global()
@Module({
    providers: [ModuleRegistryService],
    exports: [ModuleRegistryService]
})

export class ModuleRegistryModule {}