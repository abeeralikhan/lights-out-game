import React, {Component} from "react";
import Cell from "./Cell";
import './Board.css';


/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - hasWon: boolean, true when board is all off
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

class Board extends Component {
  static defaultProps = {
    nrows: 5,
    ncols: 5,
    chanceLightStartsOn: 0.5
  }

  constructor(props) {
    super(props);
    // initial state
    this.state = {
      hasWon: false,
      board: this.createBoard()
    }
    this.flipCellsAround = this.flipCellsAround.bind(this);
  }

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */

  createBoard() {
    let board = [];

    for (let i=0; i < this.props.nrows; i++) {
      let row = [];
      for (let j=0; j < this.props.ncols; j++) {
        row.push(Math.random() < this.props.chanceLightStartsOn)
      }
      board.push(row); 
      
    }
    // array-of-arrays of true/false values
    // board = this.state.board.map((row, i) => {
    //   return <tr key={i}>
    //     { row.map((col, j) => {
    //       return <Cell isLit={ col } key={`${i}-${j}`} flipCellsAroundMe={ this.flipCellsAround }/>
    //     })}
    //   </tr>
    // });

    return board
  }

  /** checking for win condition: returns boolean */

  checkWin(board) {
    for( let row of board ) {
      for ( let col of row ) {
        if (col) { return false }
      }
    }
    return true;  
  }

  /** handle changing a cell: update board & determine if winner */

  flipCellsAround(coord) {
    let {ncols, nrows} = this.props;
    let board = this.state.board;
    let [y, x] = coord.split("-").map(Number);

    function flipCell(y, x) {
      // if this coord is actually on board, flip it
      // console.log('coord', x, y);
      // console.log('max rows and columns', nrows, ncols);
      // console.log('x >= 0', x >= 0);
      // console.log('x < ncols', x < ncols);
      // console.log('y >= 0', y >= 0);
      // console.log('y < nrows', y < nrows);
    
      if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
        board[y][x] = !board[y][x];
      }
    }

    // flip this cell and the cells around it
    flipCell(y, x) // cell
    flipCell(y-1, x) // top cell
    flipCell(y, x+1) // right cell
    flipCell(y+1, x) // bottom cell
    flipCell(y, x-1) // left cell

    // win when every cell is turned off
    const hasWon = this.checkWin(board);
    // const hasWon = board.every(row => row.every(cell => !cell));
    this.setState({board, hasWon});
  }


  /** Render game board or winning message. */

  render() {
    if (this.state.hasWon) {
      return (
        <div className='Board-title'>
          <div className='winner'>
            <span className="neon-orange">YOU</span>
            <span className="neon-blue">WIN</span>
          </div>
        </div>
      );
    }
    // const displayBoard = <table><tbody>{ this.createBoard() }</tbody></table>;
    // const winMessage = <p>You won!</p>;

    let tblBoard = []
    for (let i = 0; i < this.props.nrows; i++) {
      let row = [];
      for (let j = 0; j < this.props.ncols; j++) {
        let coord = `${i}-${j}`
        row.push(<Cell key={ coord } isLit={ this.state.board[i][j] }
        flipCellsAroundMe={ () => this.flipCellsAround(coord) }/>);
      }
      tblBoard.push(<tr>{ row }</tr>);
    }
    return (
      <div className="Board">
        <div className='Board-title'>
          <div className="neon-orange">Lights</div>
          <div className="neon-blue">Out</div>
        </div>
        <table className="Board-tiles">
          <tbody>
            { tblBoard }
          </tbody>
        </table>
      </div>
    );
  } 
}


export default Board;
