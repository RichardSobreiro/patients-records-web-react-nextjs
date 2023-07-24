/** @format */

import { GetServiceTypeResponse } from "../service-types/GetServiceTypesResponse";

/** @format */
export class UpdateServicePhotosResponse {
  constructor(
    public serviceId: string,
    public servicePhotoId: string,
    public servicePhotoType: string,
    public creationDate: Date,
    public url: string,
    public urlExpiresOn: Date
  ) {}
}

export class UpdateServiceResponse {
  constructor(
    public serviceId: string,
    public customerId: string,
    public date: Date,
    public serviceTypes: GetServiceTypeResponse[],
    public beforeNotes?: string,
    public afterNotes?: string,
    public beforePhotos?: UpdateServicePhotosResponse[] | null,
    public afterPhotos?: UpdateServicePhotosResponse[] | null
  ) {}
}
