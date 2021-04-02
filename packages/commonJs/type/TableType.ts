export type Pageable = {
  page: number;
  size: number;
  total: number;
}
export type KeyRow = {
  key: string;
  row: any;
}
export type ElementTableCell = {
  row: any;
  column: any;
  rowIndex: number;
  columnIndex: number;
}
export type ValueProp = {
  value: Array<string> | string;
  prop: string;
}
export type Operation = {
  type: string;
  label: string;
  key: string;
  notShow:
    | ValueProp
    | Array<ValueProp | boolean | Function>
    | boolean
    | Function;
  notShowJoinType: string;
  buttonIcon: string;
  trigger: string;
  childOperations: Array<Operation>;
}
export type ColumnList = {
  prop: string;
  label: string;
  width: string | number;
  headerAlign: string;
  align: string;
  type: string;
  clickEvent: Function;
  operations: Array<Operation>;
  render: Function;
  filter: Vue;
  filterParams: Map<string, object>;
}
