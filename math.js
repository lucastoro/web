class Vector2D {
    constructor(...args) {

        if (args.length == 0) {
            this.v = [0, 0, 1];
        }

        if (args.length == 1) {
            this.v = args[0];
        }

        if (args.length == 2) {
            this.v = [...args, 1];
        }
    }

    length() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    get x() {
        return this.v[0];
    }

    get y() {
        return this.v[1];
    }

    set x(v) {
        this.v[0] = v;
    }

    set y(v) {
        this.v[1] = v;
    }
}

class Matrix2D {
    constructor(mat) {
        this.m = mat ?? [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ];
    }

    multiply_m(matrix) {
        const A = this.m;
        const B = matrix;
        const C = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];

        const I = 3;
        const J = 3;
        const K = 3;

        for (let i = 0; i < I; ++i) {
            for (let j = 0; j < J; ++j) {
                let sum = 0;
                for (let k = 0; k < K; ++k) {
                    sum += A[i][k] * B[k][j]
                }
                C[i][j] = sum;
            }
        }

        return new Matrix2D(C);
    }

    multiply_v(vector) {
        const A = this.m;
        const B = vector;
        const V = [0, 0, 0];

        const I = 3;
        const J = 3;

        for (let i = 0; i < I; ++i) {
            let sum = 0;
            for (let j = 0; j < J; ++j) {
                sum += A[j][i] * B[j];
            }
            V[i] = sum;
        }

        return new Vector2D(V);
    }

    multiply(thing) {

        if (thing instanceof Matrix2D) {
            return this.multiply_m(thing.m);
        }

        if (thing instanceof Vector2D) {
            return this.multiply_v(thing.v);
        }

        console.assert(thing instanceof Array);

        if (thing[0] instanceof Array) {
            return this.multiply_m(thing);
        }

        return this.multiply_v(thing);
    }

    rotate(angle) {

        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

        const mat = [
            [cos, -sin, 0],
            [sin, cos,  0],
            [0,   0,    1],
        ];

        return this.multiply(mat);
    }

    translate(x, y) {

        const mat = [
            [1, 0, x],
            [0, 1, y],
            [0, 0, 1]
        ];

        return this.multiply(mat);
    }

    scale(x, y) {

        const mat = [
            [x, 0, 0],
            [0, y, 0],
            [0, 0, 1]
        ];

        return this.multiply(mat);
    }
}

class Line {
    constructor(m, c) {
        this.m = m;
        this.c = c;
    }
}

function lineFrom2Points(a, b) {
    const m = (b.y - a.y) / (b.x - a.x);
    const c = a.y - m * a.x;
    return new Line(m, c);
}

function perpendicular(line, point) {
    const m = -1 / line.m;
    const c = point.y - m * point.x;
    return new Line(m, c);
}

function intercept(line1, line2) {
    const x = (line1.c - line2.c) / (line2.m - line1.m);
    const y = line1.m * x + line1.c;
    return new Point(x, y);
}

function distanceFromLine(point, line) {
    const perp = perpendicular(line, point);
    const inte = intercept(perp, line);
    return distance(point, inte);
}