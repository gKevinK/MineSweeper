export function Pick (board: Array<Array<string>>) : Array<{ x: number, y: number }> {
    throw new Error('Not implemented');
    
    const flag = flagCells(board);
    const safe = safeCells(board);
    if (safe.length)
        return safe;
    let { mat, pos } = getMatrix(board);
    let r = solve(mat);
}

function flagCells (board: Array<Array<string>>) : Array<Array<number>> {

    throw new Error('Not implemented');
}

function safeCells (board: Array<Array<string>>) : Array<{ x: number, y: number }> {

    throw new Error('Not implemented');
}

function getMatrix (board: Array<Array<string>>) : { mat: Array<Array<number>>, pos: Array<{ x: number, y: number }> } {

    throw new Error('Not implemented');
}

function solve (matrix: Array<Array<number>>) : { ps: Array<number>, gs: Array<Array<number>> } {

    throw new Error('Not implemented');
}
