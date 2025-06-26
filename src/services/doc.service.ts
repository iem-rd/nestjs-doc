import { Injectable, OnModuleInit } from "@nestjs/common";
import { DiscoveryService, Reflector } from "@nestjs/core";
import { getMetadataStorage } from "class-validator";
import * as fs from "fs";
import * as path from "path";

const metadata = getMetadataStorage();

function getAllDtoProperties(type: any): Record<string, string> {
  if (!type || typeof type !== "function") return {};
  const metas = metadata.getTargetValidationMetadatas(type, "", false, false);

  const props: Record<string, string> = {};
  for (const meta of metas) {
    if (meta && meta.propertyName && meta.name)
      props[meta.propertyName] = meta.name;
  }

  return props;
}

function serializeType(type: any): any {
  if (!type) return null;
  if (typeof type === "string") return type;
  if (type === String) return undefined;
  if (typeof type === "function") {
    const name = type.name;
    if (name && !["Object", "Array", "Number", "Boolean"].includes(name)) {
      const allProps = getAllDtoProperties(type);
      return { type: name, properties: allProps };
    }
    return name;
  }
  if (Array.isArray(type)) return "Array";
  return typeof type;
}

function getPattern(handler: any, metadata: any) {
  if (Reflect.hasMetadata("microservices:pattern", handler)) {
    const infos = Reflect.getMetadata("microservices:pattern", handler);
    if (Array.isArray(infos) && infos[0]?.cmd) return infos[0]?.cmd;
    return infos;
  }
  return metadata.pattern;
}

@Injectable()
export class DocService implements OnModuleInit {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector
  ) {}

  onModuleInit() {
    const controllers = this.discoveryService.getControllers();

    const docs = [];

    for (const wrapper of controllers) {
      const instance = wrapper.instance;

      if (!instance) continue;

      const prototype = Object.getPrototypeOf(instance);
      const methodNames = Object.getOwnPropertyNames(prototype).filter(
        (method) => typeof instance[method] === "function"
      );

      for (const method of methodNames) {
        const handler = instance[method];
        const metadata = this.reflector.get("doc", handler);
        const pattern = getPattern(handler, metadata);

        if (metadata && pattern) {
          docs.push({
            pattern,
            ...metadata,
            input: serializeType(metadata.input),
            output: serializeType(metadata.output),
          });
        }
      }
    }

    const outputPath = path.resolve(process.cwd(), "doc.json");
    fs.writeFileSync(outputPath, JSON.stringify(docs, null, 2), "utf-8");
    console.log(`Documentation generated in ${outputPath}`);
  }
}
