namespace game {
    export interface Shape {
        path: () => Path2D;
    }

    export enum SHAPE {
        SQUARE,
        CIRCLE,
        HALF_CIRCLE,
    }

    export const shapeSize: number = 40;
    export const shapes: Map<SHAPE, Shape> = new Map([
        [SHAPE.SQUARE, {
            path() {
                let path = new Path2D();
                path.rect(-shapeSize / 2, -shapeSize / 2, shapeSize, shapeSize);
                return path;
            },
        }],
        [SHAPE.CIRCLE, {
            path() {
                let path = new Path2D();
                path.arc(0, 0, shapeSize / 2, 0, Math.PI * 2);
                return path;
            },
        }],
        [SHAPE.HALF_CIRCLE, {
            path() {
                let path = new Path2D();
                path.arc(0, 0, shapeSize / 2, 0, Math.PI);
                return path;
            },
        }],
    ]);
}
