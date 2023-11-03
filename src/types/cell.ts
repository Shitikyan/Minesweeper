import { ICell } from "./board";

export interface ICellProps {
  cell: ICell;
  onClick: () => void;
  cMenu: (e: any) => any;
}
