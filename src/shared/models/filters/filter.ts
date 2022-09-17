import { Enumerable } from "./types";

export class NestedFilter<T> {
  equals?: T;

  in?: Enumerable<T>;

  notIn?: Enumerable<T>;

  not?: NestedFilter<T> | T;
}

export class Filter<T> {
  equals?: T;

  in?: Enumerable<T>;

  notIn?: Enumerable<T>;

  not?: NestedFilter<T> | T;
}
