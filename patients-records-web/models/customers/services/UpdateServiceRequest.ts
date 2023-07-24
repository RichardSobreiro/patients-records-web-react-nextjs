/** @format */

import { FileCustom } from "@/hooks/use-file-input";
import { GetServiceTypeResponse } from "../service-types/GetServiceTypesResponse";

/** @format */
export class UpdateServiceRequest {
  constructor(
    public serviceId: string,
    public date: Date,
    public serviceTypes: GetServiceTypeResponse[],
    public beforeNotes?: string,
    public beforePhotos?: FileCustom[],
    public afterNotes?: string,
    public afterPhotos?: FileCustom[]
  ) {}
}
