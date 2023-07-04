/** @format */

export class CreateUserResponse {
  constructor(
    public id: string,
    public email: string,
    public username: string,
    public userCreationCompleted: boolean,
    public userPlanId?: string,
    public paymentStatus?: {
      paymentOk: boolean;
      paymentIssueMessage: string;
    },
    public password?: string,
    public userCompanyName?: string
  ) {}
}
