import { ICellProps } from "../../types/cell";

import "./cell.css";

export const Cell = ({ cell, cMenu, onClick }: ICellProps) => {
  const { isRevealed, isFlagged, isClicked, isMine, isUnknown, n } = cell;
  const isEmpty = n === 0 && !isMine;
  const getValue = () => {
    if (!isRevealed) {
      return isFlagged ? "🚩" : null;
    } else if (isMine) {
      return "💣";
    } else if (isEmpty) {
      return "";
    }

    return n;
  };

  const className =
    "cell" +
    (isRevealed ? "" : " hidden") +
    (isMine ? " is-mine" : "") +
    (isClicked ? " is-clicked" : "") +
    (isEmpty ? " is-empty" : "") +
    (isUnknown ? " is-unknown" : "") +
    (isFlagged ? " is-flag" : "");

  return (
    <div className={className} onClick={onClick} onContextMenu={cMenu}>
      {getValue()}
    </div>
  );
};
