export function Pick (board: Array<Array<string>>) : { p: { x: number, y: number}, op: "F" | "C" | "T" } {
    const op = simpleCell(board);
    if (op) return op;

    const empty = emptyCells(board);
    if (empty.length)
        return { p: empty[Math.floor(Math.random() * empty.length)], op: "T" };
    return { p: { x: 0, y: 0 }, op: "C" };
}

function simpleCell (board: Array<Array<string>>) : { p: { x: number, y: number}, op: "F" | "C" } | undefined {
    let m = board.length, n = board[0].length;
    for (let i = 0; i < m; ++i) {
        for (let j = 0; j < n; ++j) {
            let count = parseInt(board[i][j]);
            if (isNaN(count) || count == 0) continue;
            let r = [];
            for (let c of adjacentCoord(i, j, m, n)) {
                if (board[c.x][c.y] == " ")
                    r.push(c);
                else if (board[c.x][c.y] == "F")
                    count--;
            }
            if (count == 0 && r.length)
                return { p: r[0], op: "C" };
            if (count == r.length && r.length)
                return { p: r[0], op: "F" };
        }
    }
    return undefined;
}

function emptyCells (board: Array<Array<string>>) : Array<{ x: number, y: number }> {
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

function adjacentCoord(x: number, y: number, x_lim: number, y_lim: number) : Array<{ x: number, y: number }> {
    let res = [];
    for (let i = x - 1; i <= x + 1; ++i) {
        for (let j = y - 1; j <= y + 1; ++j) {
            if (i < 0 || i >= x_lim || j < 0 || j >= y_lim) continue;
            if (i == x && j == y) continue;
            res.push({ x: i, y: j });
        }
    }
    return res;
}