export class Point {
  id: number;
  x: number;
  y: number;
  code: string;
  address: string;
  company: string;
  calledFromMap?: boolean = false;
  calledFromList?: boolean = false;

  constructor(
    id: number,
    x: number,
    y: number,
    code: string,
    address: string,
    company: string,
    calledFromMap?: boolean,
    calledFromList?: boolean,
  ) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.code = code;
    this.address = address;
    this.company = company;
    this.calledFromMap = calledFromMap ?? false;
    this.calledFromList = calledFromList ?? false;
  }
}
