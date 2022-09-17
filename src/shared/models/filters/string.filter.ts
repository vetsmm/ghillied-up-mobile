import { Enumerable } from "./types";

export class NestedStringNullableFilter {
  equals?: string | null;

  in?: Enumerable<string> | null;

  notIn?: Enumerable<string> | null;

  lt?: string;

  lte?: string;

  gt?: string;

  gte?: string;

  contains?: string;

  startsWith?: string;

  endsWith?: string;

  search?: string;

  not?: NestedStringNullableFilter | string | null;
}

export class NestedStringFilter {
  equals?: string;

  in?: Enumerable<string>;

  notIn?: Enumerable<string>;

  lt?: string;

  lte?: string;

  gt?: string;

  gte?: string;

  contains?: string;

  startsWith?: string;

  endsWith?: string;

  search?: string;

  not?: NestedStringFilter | string;
}

export class StringFilter {
  equals?: string;

  in?: Enumerable<string>;

  notIn?: Enumerable<string>;

  lt?: string;

  lte?: string;

  gt?: string;

  gte?: string;

  contains?: string;

  startsWith?: string;

  endsWith?: string;

  search?: string;

  not?: NestedStringFilter | string;
}
