/** @format */

import { FileCustom } from "@/hooks/use-file-input";
import { GetServiceTypeResponse } from "../service-types/GetServiceTypesResponse";

export class CreateServiceRequest {
  constructor(
    public date: Date,
    public serviceTypes: GetServiceTypeResponse[],
    public beforeNotes?: string,
    public beforePhotos?: FileCustom[],
    public afterNotes?: string,
    public afterPhotos?: FileCustom[]
  ) {}
}
