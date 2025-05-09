/** @format */

export class GetAnamnesis {
  constructor(
    public anamneseId: string,
    public customerId: string,
    public creationDate: Date,
    public date: Date,
    public anamnesisTypeDescriptions: string[]
  ) {}
}

export class ListPage {
  constructor(public pageNumber: number, public limit: number) {}
}

export class GetAnamnesisResponse {
  constructor(
    public userId: string,
    public customerId: string,
    public count: number,
    public previous?: ListPage,
    public next?: ListPage,
    public anamnesis?: GetAnamnesis[]
  ) {}
}
