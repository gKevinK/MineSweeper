import { Content } from './Utils';

export function Pick (board: Array<Array<Content>>, mine: number) : { p: { x: number, y: number}, op: "F" | "C" | "T" } {
    let op = simpleCell(board);
    if (op) return op;

    let op2 = probabilitySolve(board, mine);
    if (op2) return op2;

    const empty = emptyCells(board);
    if (empty.length)
        return { p: empty[Math.floor(Math.random() * empty.length)], op: "T" };
    return { p: { x: 0, y: 0 }, op: "C" };
}

function simpleCell (board: Array<Array<Content>>) : { p: { x: number, y: number}, op: "F" | "C" } | undefined {
    let m = board.length, n = board[0].length;
    for (let i = 0; i < m; ++i) {
        for (let j = 0; j < n; ++j) {
            let count = parseInt(board[i][j]);
            if (isNaN(count) || count == 0) continue;
            let r = [];
            for (let c of adjacentCoord(i, j, m, n)) {
                if (board[c.x][c.y] == " " || board[c.x][c.y] == "M")
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

function matrixSolve (board: Array<Array<Content>>)
        : { p: { x: number, y: number}, op: "F" | "C" } | undefined {

    throw new Error('Not implemented');
}

function probabilitySolve (board: Array<Array<Content>>, mine: number)
        : { p: { x: number, y: number}, op: "F" | "T" | "C" } | undefined {
    let m = board.length, n = board[0].length;
    let b = [...Array(m)].map(_ =>
        [...Array(n)].map(_ =>
            0.5
        )
    );
    let empty = emptyCells(board);
    for (let c of empty) {
        b[c.x][c.y] = mine / empty.length;
    }

    let constraints = [];
    for (let i = 0; i < m; ++i) {
        for (let j = 0; j < n; ++j) {
            let num = parseInt(board[i][j]);
            if (!isNaN(num)) {
                let adjacencies = adjacentCoord(i, j, m, n);
                let unknownAdjacencies = adjacencies
                    .filter(c => board[c.x][c.y] == ' ' || board[c.x][c.y] == 'M');
                if (unknownAdjacencies.length) {
                    constraints.push({
                        x: i, y: j, a: unknownAdjacencies,
                        mine: num - adjacencies.filter(a => board[a.x][a.y] == 'F').length
                    });
                }
            }
        }
    }

    for (let round = 0; round < 100; ++round) {
        for (let c of constraints) {
            let sum = c.a.reduce((p, curr) => p + b[curr.x][curr.y], 0);
            for (let a of c.a) {
                b[a.x][a.y] += (c.mine - sum) / c.a.length * 1.1;
            }
        }
        let sum = empty.reduce((p, curr) => p + b[curr.x][curr.y], 0);
        for (let c of empty) {
            let t = limit(b[c.x][c.y] + (mine - sum) / empty.length * 1.1);
            b[c.x][c.y] = t;
            if (round >= 50) {
                if (t < 0.02) {
                    return { p: c, op: "C" };
                } else if (t > 0.98) {
                    return { p: c, op: "F" };
                }
            }
        }
    }

    let min = 1;
    let ps = [{ x: 0, y: 0 }];
    for (let e of empty) {
        if (b[e.x][e.y] < min - 0.01) {
            min = b[e.x][e.y];
            ps = [ e ];
        } else if (b[e.x][e.y] < min + 0.01) {
            ps.push(e);
        }
    }
    for (let p of ps) {
        if (p.x == Math.floor(m / 2 - 0.5) && p.y ==  Math.floor(n / 2 - 0.5))
            return { p, op: "T" };
    }
    for (let p of ps) {
        if (p.x == 0 && p.y == 0) return { p, op: "T" };
        if (p.x == 0 && p.y == n - 1) return { p, op: "T" };
        if (p.x == m - 1 && p.y == 0) return { p, op: "T" };
        if (p.x == m - 1 && p.y == n - 1) return { p, op: "T" };
    }
    return { p: ps[Math.floor(Math.random() * ps.length)], op: "T" };
}

function limit (x: number) {
    x = 0.5 + (x - 0.5) / 1.005;
    if (x > 1) return 1;
    if (x < 0) return 0;
    return x;
    // return 1 / (1 + Math.exp(0.5 - 2 * x));
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