import { Injectable, Logger } from "@nestjs/common";
import type { ModuleDefinition } from "./module-definition.js";

@Injectable()
export class ModuleRegistryService {
    private readonly logger = new Logger(ModuleRegistryService.name);
    private readonly definitions = new Map<string, ModuleDefinition>();

    registerModule(definition: ModuleDefinition) {
        const exists = this.definitions.has(definition.key);
        if (exists) {
            throw new Error(`Module "${definition.key}" already registered`);
        }
        this.definitions.set(definition.key, definition);
        this.logger.log(`Registered module "${definition.key}"`);

    }

    get(key: string) {
        return this.definitions.get(key);
    }

    getAll() {
        return Array.from(this.definitions.values());
    }
}