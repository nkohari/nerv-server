export type GetManyProperties<T> = {
  [P in keyof T]?: T[P] | T[P][];
};
