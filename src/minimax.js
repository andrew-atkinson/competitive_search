/*
 *
 *
The function "makeMove" is already written for you.
You do not need to modify it, but you should read it.

It will choose moves intelligently once minimax,
which it invokes, evaluates different board-states
correctly.  It is the ONLY function invoked when
you play against the computer after starting up
the server.

Input: A state object, representing the Connect 4 board.

Output: Returns an integer indicating the column
where the piece will be dropped.

*/

const makeMove = (state) => {

  // Find whose move it is; 'x' or 'o'
  const playerMoving = state.nextMovePlayer;

  // state.legalMoves returns an array of integer values,
  // which indicate the locations (0 through 6)
  // where one can currently legally drop a piece.
  const allLegalMoves = state.legalMoves();

  // To get a successor state following a move,
  // just call state.move(someMove).  This returns
  // the board state after that move has been made.
  // It autmatically switches the player whose
  // move it is, adds the piece to the board, etc.
  //
  // Note that state is immutable; invoking state.move
  // does NOT change the original state, but
  // returns a new one.
  const newState = state.move(allLegalMoves[0]);


  // The following is the guts of the make-move function.
  // It evaluates each possible successor state with
  // minimax, and performs the move that leads to the best
  // state.
  const depth = 3;

  let bestMoveIndex = null;
  let bestMoveValue = null;
  allLegalMoves.forEach((legalMove, i) => {

    const potentialState = state.move(legalMove)

    // Sets the playerMoving to be the maximizer.
    // This variable gets handed down in the recursive
    // minimax call unchanged.

    const stateValue = minimax(potentialState, depth, playerMoving);
    //const stateValue = minimaxAlphaBetaWrapper(potentialState, depth, playerMoving)

    if (stateValue > bestMoveValue || bestMoveValue === null) {
      bestMoveIndex = i;
      bestMoveValue = stateValue;
    }

  });
  return allLegalMoves[bestMoveIndex]

}



/*
You must write the function "heuristic".

Input: state, maximizingPlayer.  The state will be
a state object.  The maximizingPlayer will be either
an 'x' or an 'o', and is the player whose advantage
is signified by positive numbers.

Output: A number evaluating how good the state is from
the perspective of the player who is maximizing.

A useful method on state here would be state.numLines.
This function takes an integer and a player
like this "state.numLines(2,'x')" and returns the
number of lines of that length which that player
has.  That is, it returns the number of contiguous linear
pieces of that length that that player has.

You'll want to pass the tests defined in minimax_specs.js.
*/
const heuristic = (state, maximizingPlayer) => {

  //This is how you can retrieve the minimizing player.
  const minimizingPlayer = (maximizingPlayer == 'x') ? 'o' : 'x';
  let returnNumber = 0;

  // console.log(state);
  //
  //Your code here.  Don't return random, obviously.

  //  has no defensive instinct
  // returnNumber += (state.numLines(2, maximizingPlayer) + (state.numLines(3, maximizingPlayer) * 5) + (state.numLines(4, maximizingPlayer) * 10)) - (state.numLines(2, minimizingPlayer) + (state.numLines(3, minimizingPlayer) * 5) + (state.numLines(4, minimizingPlayer) * 10));


  returnNumber += (state.numLines(2, maximizingPlayer) + (state.numLines(3, maximizingPlayer) * 15) + (state.numLines(4, maximizingPlayer) * 10)) - (state.numLines(2, minimizingPlayer) + (state.numLines(3, minimizingPlayer) * 15) + (state.numLines(4, minimizingPlayer) * 10));

  // const findValueForPlayer = (player)=>{
  //   return [2,3,4].reduce((total, lineLength) => {
  //     return total + state.numLines(lineLength, player)
  //   }, 0);
  // }


  // console.log(`2 long for ${maximizingPlayer}:`,
  //   state.numLines(2, maximizingPlayer),
  //   `... 3 long for ${maximizingPlayer}:`,
  //   state.numLines(3, maximizingPlayer),
  //   `... 4 long for ${maximizingPlayer}:`,
  //   state.numLines(4, maximizingPlayer),
  //   `heuristic: `,
  //   returnNumber);

  return returnNumber;
}








/*
You must write the function "minimax".

Input: state, depth, maximizingPlayer.  The state is
an instance of a state object.  The depth is an integer
greater than zero; when it is zero, the minimax function
should return the value of the heuristic function.

Output: Returns a number evaluating the state, just
like heuristic does.

You'll need to use state.nextStates(), which returns
a list of possible successor states to the state passed in
as an argument.

You'll also probably need to use state.nextMovePlayer,
which returns whether the next moving player is 'x' or 'o',
to see if you are maximizing or minimizing.
*/



// james solution
// const minimax = (state, depth, maximizingPlayer) => {
//   var minimizingPlayer = (maximizingPlayer == 'x') ? 'o' : 'x';
//   var possibleStates = state.nextStates();
//   var currentPlayer = state.nextMovePlayer;
//   if (depth === 0 || possibleStates.length === 0) {
//     return heuristic(state, maximizingPlayer);
//   } else {
//     const stateValues = possibleStates.map((nextState) => {
//       return minimax(nextState, depth - 1, maximizingPlayer);
//     });

//     return (maximizingPlayer === currentPlayer) ?
//       Math.max.apply(null, stateValues) : Math.min.apply(null, stateValues);
//   }
// }

const minimax = (state, depth, maximizingPlayer) => {
  var minimizingPlayer = (maximizingPlayer == 'x') ? 'o' : 'x';
  var possibleStates = state.nextStates();
  var currentPlayer = state.nextMovePlayer;
  //Your code here.
  if (depth === 0 || possibleStates.length === 0) {
    return heuristic(state, maximizingPlayer);
  } else {
    let states = possibleStates.map((a) => minimax(a, depth - 1, maximizingPlayer),
      0);
    return (currentPlayer === maximizingPlayer) ? states.reduce((a, b) => Math.max(a, b)) : states.reduce((a, b) => Math.min(a, b))
  }
}




















/* minimaxAlphaBetaWrapper is a pre-written function, but it will not work
   unless you fill in minimaxAB within it.

   It is called with the same values with which minimax itself is called.*/
const minimaxAlphaBetaWrapper = (state, depth, maximizingPlayer) => {

  /*
    You will need to write minimaxAB for the extra credit.
    Input: state and depth are as they are before.  (Maximizing player
    is closed over from the parent function.)

    Alpha is the BEST value currently guaranteed to the maximizing
    player, if they play well, no matter what the minimizing player
    does; this is why it is a very low number to start with.

    Beta is the BEST value currently guaranteed to the minimizing
    player, if they play well, no matter what the maximizing player
    does; this is why it is a very high value to start with.
  */
  const minimaxAB = (state, depth, alpha, beta) => {}

  return minimaxAB(state, depth, -100000, 100000);
}

module.exports = { makeMove, minimax, heuristic };
