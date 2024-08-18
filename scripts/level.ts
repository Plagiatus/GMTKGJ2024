/// <reference path="shapes.ts" />

namespace game {
    interface Level {
        steps: DrawingStep[];
        shapes: SHAPE[];
        cutout?: boolean;
    }

    export const levels: Level[] = [
        {
            steps: [
                {
                    path: shapes.get(SHAPE.SQUARE)?.path()!,
                    pos: {x: 0, y: 0},
                    scale: 1
                },
                {
                    path: shapes.get(SHAPE.CIRCLE)?.path()!,
                    pos: {x: 0, y: shapeSize},
                    scale: 1
                },
                {
                    path: shapes.get(SHAPE.CIRCLE)?.path()!,
                    pos: {x: 0, y: -shapeSize},
                    scale: 1
                },
            ],
            shapes: [SHAPE.SQUARE, SHAPE.CIRCLE],
            cutout: true,
        }
    ]
}