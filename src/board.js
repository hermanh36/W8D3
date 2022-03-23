// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  var Piece = require("./piece");
}
// DON'T TOUCH THIS CODE

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
  outer_arr = new Array(8);
  for(let i = 0; i < outer_arr.length; i++) {
    outer_arr[i] = (new Array(8));
  }
  outer_arr[3][4] = new Piece("black");
  outer_arr[4][3] = new Piece("black");
  outer_arr[3][3] = new Piece("white");
  outer_arr[4][4] = new Piece("white");
  return outer_arr;
}

/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
}

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
  if (pos[0] < 0 || pos[1] < 0) {
    return false;
  } else if (pos[0] > 7 || pos[1] > 7) {
    return false;
  }
  return true; 
};

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  let x = pos[0]; 
  let y = pos[1];
  if (!this.isValidPos(pos)){
    throw new Error('Not valid pos!');
  }else  { 
    return this.grid[x][y];
  }
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  let x = pos[0];
  let y = pos[1];
  if(this.grid[x][y] instanceof Piece){
    if(this.grid[x][y].color === color){
      return true;
    }else {
      return false;
    }
  }else {
    return false;
  }
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  let x = pos[0], y = pos[1];
  if(this.grid[x][y] instanceof Piece){
    return true;
  }else {
    return false;
  }
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns an empty array if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns empty array if it hits an empty position.
 *
 * Returns empty array if no pieces of the opposite color are found.
 */
Board.prototype._positionsToFlip = function(pos, color, dir, piecesToFlip) {
  if (!piecesToFlip) {
    piecesToFlip = [];
  } 
  let x = pos[0] + dir[0], y = pos[1]+ dir[1];
  let newPos = [x,y];
  if (!this.isValidPos(newPos)) {
    return [];
  } else if(!this.isOccupied(newPos)) {
    return [];
  } else if(this.isMine(newPos, color)) {
    return piecesToFlip;
  } else { 
    piecesToFlip.push(newPos);
    return this._positionsToFlip(newPos,color,dir,piecesToFlip);
  
  }
};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  if (this.isOccupied(pos)){
    return false;
  }
  let valid = false
  for(let i= 0; i< Board.DIRS.length; i++){
    if(this._positionsToFlip(pos,color,Board.DIRS[i]).length > 0) {
      return true;
    }
  }
  return false;
};

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
    if (!this.isValidPos(pos)){
      throw new Error("Invalid move!");
    }
    if (this.isOccupied(pos)){
      throw new Error("Invalid move!");
    }
    if (!this.validMove(pos, color)){
      throw new Error("Invalid move!");
    }else {
      let flipPos = [];
      for (let i = 0; i < Board.DIRS.length; i++) {
        if (this._positionsToFlip(pos, color, Board.DIRS[i]).length > 0) {
          flipPos = flipPos.concat(this._positionsToFlip(pos, color, Board.DIRS[i]));
        }
      }
      for(let i = 0; i < flipPos.length; i++){
        this.getPiece(flipPos[i]).flip(); 
      }
      this.grid[pos[0]][pos[1]] = new Piece(color)
    }

};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
  validMovesArr = [];

  for(let i = 0; i < this.grid.length; i++){
    for(let j = 0; j < this.grid.length; j++){
      if(this.validMove([i,j], color)){
        validMovesArr.push([i,j])
      }
    }
  }
  return validMovesArr;

};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
  return this.validMoves(color).length >= 1;
};



/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
  if(this.hasMove('white') || this.hasMove('black')){
    return false;
  }
  return true;

};




/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
};


// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  module.exports = Board;
}
// DON'T TOUCH THIS CODE