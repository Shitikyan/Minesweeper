export interface IBoardProps {
  height: number;
  width: number;
  mines: number;
  status: number | string;
  ref: any;
}

export type TGrid = Array<Array<ICell>>;

export interface ICell {
  x: number;
  y: number;
  n: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  isUnknown: boolean;
  isClicked: boolean;
}
