export interface IRes<T> {
  status: Number;
  messages: string[];
  data: T;
}
