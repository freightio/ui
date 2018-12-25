export class Empty {
  constructor ();
  toObject(): Empty.AsObject;
  serializeBinary(): Uint8Array;
  static deserializeBinary: (bytes: {}) => Empty;
}

export namespace Empty {
  export type AsObject = {
  }
}

export class Freight {
  constructor ();
  getId(): string;
  setId(a: string): void;
  getName(): string;
  setName(a: string): void;
  getImage(): string;
  setImage(a: string): void;
  getWeight(): string;
  setWeight(a: string): void;
  getLwh(): string;
  setLwh(a: string): void;
  getCube(): string;
  setCube(a: string): void;
  getPrice(): Price;
  setPrice(a: Price): void;
  toObject(): Freight.AsObject;
  serializeBinary(): Uint8Array;
  static deserializeBinary: (bytes: {}) => Freight;
}

export namespace Freight {
  export type AsObject = {
    Id: string;
    Name: string;
    Image: string;
    Weight: string;
    Lwh: string;
    Cube: string;
    Price: Price;
  }
}

export class FreightsReply {
  constructor ();
  getItemsList(): Freight[];
  setItemsList(a: Freight[]): void;
  toObject(): FreightsReply.AsObject;
  serializeBinary(): Uint8Array;
  static deserializeBinary: (bytes: {}) => FreightsReply;
}

export namespace FreightsReply {
  export type AsObject = {
    ItemsList: Freight[];
  }
}

export class Price {
  constructor ();
  getStart(): Start;
  setStart(a: Start): void;
  getThen(): number;
  setThen(a: number): void;
  toObject(): Price.AsObject;
  serializeBinary(): Uint8Array;
  static deserializeBinary: (bytes: {}) => Price;
}

export namespace Price {
  export type AsObject = {
    Start: Start;
    Then: number;
  }
}

export class Start {
  constructor ();
  getDistance(): number;
  setDistance(a: number): void;
  getFee(): number;
  setFee(a: number): void;
  toObject(): Start.AsObject;
  serializeBinary(): Uint8Array;
  static deserializeBinary: (bytes: {}) => Start;
}

export namespace Start {
  export type AsObject = {
    Distance: number;
    Fee: number;
  }
}

