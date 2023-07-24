/** @format */

import { CreateAnamnesisRequest } from "./CreateAnamnesisRequest";

export class CreateCustomerRequest {
  constructor(
    public customerName: string,
    public phoneNumber: string,
    public anamnese?: CreateAnamnesisRequest,
    public email?: string
  ) {}
}
