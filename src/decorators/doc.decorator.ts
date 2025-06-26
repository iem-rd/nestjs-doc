import { SetMetadata } from "@nestjs/common";

export const NESTJS_DOC_KEY = "nestjs:doc";

export interface DocOptions {
  summary: string;
  pattern?: string;
  input?: any;
  output?: any;
  description?: string;
}

export const Doc = (options: DocOptions) =>
  SetMetadata(NESTJS_DOC_KEY, options);
