import { useState, useRef } from "react";
import { Board } from "../Board";

import "./game.css";

export const Game = () => {
  const restartRef = useRef<any>();

  const [width, setWidth] = useState<number>(8);
  const [mines, setMines] = useState<number>(10);
  const [height, setHeight] = useState<number>(8);

  const handleChangeHeight = (event: any) => {
    setHeight(event?.target?.value ?? height);
  };

  const handleChangeWidth = (event: any) => {
    setWidth(event?.target?.value ?? width);
  };

  const handleChangeMines = (event: any) => {
    setMines(event?.target?.value ?? mines);
  };

  const restartGame = () => {
    if (restartRef.current) restartRef.current.restart();
  };

  return (
    <div className="game">
      <Board
        ref={restartRef}
        height={height}
        width={width}
        mines={mines}
        status={0}
      />
      <div className="control-buttons">
        <button onClick={restartGame}>Restart</button>
        <form className="form">
          <label>Height</label>
          <input type="number" value={height} onChange={handleChangeHeight} />
          <label>Width</label>
          <input type="number" value={width} onChange={handleChangeWidth} />
          <label>Mines</label>
          <input type="number" value={mines} onChange={handleChangeMines} />
        </form>
      </div>
    </div>
  );
};
