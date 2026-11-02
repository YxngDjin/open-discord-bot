import { Module, OnModuleInit } from "@nestjs/common";
import { ModuleRegistryService } from "../../core/module-registry/module-registry.service.js";
import { welcomeModule } from "./welcome.definition.js";

@Module({})
export class WelcomeModule implements OnModuleInit {
    constructor(private readonly moduleRegistry: ModuleRegistryService) {}

    onModuleInit() {
        this.moduleRegistry.registerModule(welcomeModule);
    }
}