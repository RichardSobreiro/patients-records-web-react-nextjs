/** @format */

import { CreateAnamneseRequest } from "./CreateAnamnesisRequest";

export class CreateCustomerRequest {
  constructor(
    public customerName: string,
    public phoneNumber: string,
    public anamnese?: CreateAnamneseRequest,
    public email?: string
  ) {}
}
