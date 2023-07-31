/** @format */

import { FileCustom } from "@/hooks/use-file-input";

export class CreateAnamnesisTypeContentRequest {
  constructor(
    public anamnesisTypeId: string,
    public anamnesisTypeDescription: string,
    public isDefault: boolean,
    public content?: string | null | FileCustom[]
  ) {}
}

export class CreateAnamnesisRequest {
  constructor(
    public customerId: string,
    public date: Date,
    public anamnesisTypesContent: CreateAnamnesisTypeContentRequest[],
    public freeTypeText?: string,
    public gender?: string,
    public ethnicity?: string,
    public maritalStatus?: string,
    public employmentStatus?: string,
    public comments?: string
  ) {}
}
