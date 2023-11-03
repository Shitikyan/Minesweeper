import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { ICell, IBoardProps, TGrid } from "../../types/board";
import { Cell } from "../Cell";

export const Board = forwardRef(
  ({ height, mines, width, status }: IBoardProps, ref) => {
    const [grid, setGrid] = useState<TGrid>([]);
    const [gameStatus, setGameStatus] = useState<number | string>(status);
    const [minesCount, setMinesCount] = useState<number>(mines);
    const [check, setCheck] = useState<boolean>(false);

    const getRevealed = () => {
      return grid
        .reduce((r, v) => {
          r.push(...v);
          return r;
        }, [])
        .map((v) => v.isRevealed)
        .filter((v) => !!v).length;
    };

    const checkVictory = () => {
      const revealed = getRevealed();

      if (revealed >= height * width - mines) {
        killBoard("win");
      }
    };

    const handleRightClick = (e: any, x: number, y: number) => {
      e.preventDefault();
      const gridd = grid;
      let minesLeft = minesCount;

      if (gridd[x][y].isRevealed) return false;

      if (gridd[x][y].isFlagged) {
        gridd[x][y].isFlagged = false;
        minesLeft++;
      } else {
        gridd[x][y].isFlagged = true;
        minesLeft--;
      }

      setMinesCount(minesLeft);
      setCheck((prev) => !prev);
    };

    const getRandomMines = (
      amount: number,
      columns: number,
      rows: number,
      starter = null
    ) => {
      const minesArray = [];
      const limit = columns * rows;
      const minesPool = [...Array(limit).keys()];

      if (starter && starter > 0 && starter < limit) {
        minesPool.splice(starter, 1);
      }

      for (let i = 0; i < amount; ++i) {
        const n = Math.floor(Math.random() * minesPool.length);
        minesArray.push(...minesPool.splice(n, 1));
      }

      return minesArray;
    };

    const getNeighbours = (grid: TGrid, x: number, y: number) => {
      const neighbours = [];
      const currentRow = grid[x];
      const prevRow = grid[x - 1];
      const nextRow = grid[x + 1];

      if (currentRow[y - 1]) neighbours.push(currentRow[y - 1]);
      if (currentRow[y + 1]) neighbours.push(currentRow[y + 1]);
      if (prevRow) {
        if (prevRow[y - 1]) neighbours.push(prevRow[y - 1]);
        if (prevRow[y]) neighbours.push(prevRow[y]);
        if (prevRow[y + 1]) neighbours.push(prevRow[y + 1]);
      }
      if (nextRow) {
        if (nextRow[y - 1]) neighbours.push(nextRow[y - 1]);
        if (nextRow[y]) neighbours.push(nextRow[y]);
        if (nextRow[y + 1]) neighbours.push(nextRow[y + 1]);
      }

      return neighbours;
    };

    const addGridCell = (grid: TGrid, gridCell: ICell) => {
      const x = grid.length - 1;
      const y = grid[x].length;
      const lastGridCell = gridCell;
      const neighbours = getNeighbours(grid, x, y);

      for (let neighbourGridCell of neighbours) {
        if (lastGridCell.isMine) {
          neighbourGridCell.n += 1;
        } else if (neighbourGridCell.isMine) {
          lastGridCell.n += 1;
        }
      }

      grid[x].push(gridCell);
    };

    const revealEmptyNeigbhours = (grid: TGrid, x: number, y: number) => {
      const neighbours = [...getNeighbours(grid, x, y)];
      grid[x][y].isFlagged = false;
      grid[x][y].isRevealed = true;

      while (neighbours.length) {
        const neighbourGridCell = neighbours.shift();

        if (neighbourGridCell && !neighbourGridCell.isMine) {
          if (!neighbourGridCell.isRevealed) {
            neighbourGridCell.isFlagged = false;
            neighbourGridCell.isRevealed = true;

            if (neighbourGridCell.n === 0) {
              neighbours.push(
                ...getNeighbours(grid, neighbourGridCell.x, neighbourGridCell.y)
              );
            }
          }
        }
      }
    };

    const killBoard = (type: string) => {
      const message = type === "lost" ? "You lost." : "You won.";

      setGameStatus(message);
      revealBoard();
    };

    const revealBoard = () => {
      let newGrid = [...grid];
      for (const row of newGrid) {
        for (const gridCell of row) {
          gridCell.isRevealed = true;
        }
      }
      setGrid(newGrid);
    };

    const handleLeftClick = (x: number, y: number) => {
      const updatedGrid = [...grid];
      const gridCell = updatedGrid[x][y];

      gridCell.isClicked = true;

      if (gridCell.isRevealed || gridCell.isFlagged) {
        return false;
      }

      if (gridCell.isMine) {
        killBoard("lost");
        return false;
      }

      if (gridCell.n === 0 && !gridCell.isMine) {
        revealEmptyNeigbhours(updatedGrid, x, y);
      }

      gridCell.isFlagged = false;
      gridCell.isRevealed = true;

      setCheck((prev) => !prev);
      setGrid(updatedGrid);
      setGameStatus(gameStatus);
    };

    useEffect(() => {
      checkVictory();
    }, [check]);

    const createNewBoard = (click = null) => {
      const grid = [];
      const rows = width;
      const columns = height;
      const minesArray = getRandomMines(mines, columns, rows, click);

      for (let i = 0; i < columns; ++i) {
        grid.push([]);
        for (let j = 0; j < rows; ++j) {
          const gridCell: ICell = {
            x: i,
            y: j,
            n: 0,
            isMine: minesArray.includes(i * rows + j),
            isRevealed: false,
            isFlagged: false,
            isUnknown: false,
            isClicked: false,
          };
          addGridCell(grid, gridCell);
        }
      }

      return grid;
    };

    useImperativeHandle(ref, () => ({
      restart: () => setGrid(createNewBoard()),
    }));

    useEffect(() => {
      setGrid(createNewBoard());
      setMinesCount(mines);
    }, [height, width, mines]);

    return (
      <div className="board">
        <div className="mines-count">
          <span>Mines: {minesCount}</span>
        </div>
        <div className="grid">
          {grid.map((row) => {
            const rowCells = row.map((gridCell) => (
              <Cell
                key={gridCell.y * row.length + gridCell.x}
                onClick={() => handleLeftClick(gridCell.x, gridCell.y)}
                cMenu={(e) => handleRightClick(e, gridCell.x, gridCell.y)}
                cell={gridCell}
              />
            ));

            return <div className="row">{rowCells}</div>;
          })}
        </div>
      </div>
    );
  }
);
