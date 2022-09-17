import {Enumerable} from "./types";

export class NestedDateTimeFilter {
  equals?: Date | string

  in?: Enumerable<Date> | Enumerable<string>

  notIn?: Enumerable<Date> | Enumerable<string>

  lt?: Date | string

  lte?: Date | string

  gt?: Date | string

  gte?: Date | string

  not?: NestedDateTimeFilter | Date | string
}

export class DateTimeFilter {

  equals?: Date | string

  in?: Enumerable<Date> | Enumerable<string>

  notIn?: Enumerable<Date> | Enumerable<string>

  lt?: Date | string

  lte?: Date | string

  gt?: Date | string

  gte?: Date | string

  not?: NestedDateTimeFilter | Date | string
}
