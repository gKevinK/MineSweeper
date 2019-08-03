export function Pick (board: Array<Array<string>>) : { x: number, y: number } {
    // const flag = flagCells(board);
    const safe = safeCells(board);
    if (safe.length)
        return safe[Math.floor(Math.random() * safe.length)];
    return { x: 0, y: 0 };
    // let { mat, pos } = getMatrix(board);
    // let r = solve(mat);
}

function flagCells (board: Array<Array<string>>) : Array<Array<number>> {

    throw new Error('Not implemented');
}

function safeCells (board: Array<Array<string>>) : Array<{ x: number, y: number }> {
    // TODO
    let res = [];
    for (let i = 0; i < board.length; ++i) {
        for (let j = 0; j < board[0].length; ++j) {
            if (board[i][j] == " ") {
                res.push({ x: i, y: j });
            }
        }
    }
    return res;
}

function getMatrix (board: Array<Array<string>>) : { mat: Array<Array<number>>, pos: Array<{ x: number, y: number }> } {

    throw new Error('Not implemented');
}

function solve (matrix: Array<Array<number>>) : { ps: Array<number>, gs: Array<Array<number>> } {

    throw new Error('Not implemented');
}
