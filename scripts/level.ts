/// <reference path="shapes.ts" />

namespace game {
    export interface Level {
        steps: DrawingStep[];
        shapes: SHAPE[];
        cutout?: boolean;
        finalScale: number;
    }

    export const levels: Level[] = [

        {
            steps: [{
                path: shapes.get(SHAPE.SQUARE)?.path()!,
                pos: { x: 0, y: 0 },
                scale: 1,
                cutout: false,
                outline: false
            }],
            finalScale: -0.2,
            shapes: [SHAPE.SQUARE],
            cutout: false,

        },
        {
            steps: [
                {
                    path: shapes.get(SHAPE.SQUARE)?.path()!,
                    pos: { x: 0, y: 40 },
                    scale: 0.5835525887331022,
                    cutout: false,
                    outline: false
                },
                {
                    path: shapes.get(SHAPE.SQUARE)?.path()!,
                    pos: { x: 0, y: 0 },
                    scale: 0.9988033722822518,
                    cutout: false,
                    outline: false
                },
                {
                    path: shapes.get(SHAPE.SQUARE)?.path()!,
                    pos: { x: 0, y: -40 },
                    scale: 0.794255077759259,
                    cutout: false,
                    outline: false
                }
            ],
            finalScale: -0.1,
            shapes: [SHAPE.SQUARE],
            cutout: false,

        },
        {
            steps: [
                {
                    path: shapes.get(SHAPE.SQUARE)?.path()!,
                    pos: { x: 0, y: 0 },
                    scale: 1
                },
                {
                    path: shapes.get(SHAPE.CIRCLE)?.path()!,
                    pos: { x: 0, y: shapeSize },
                    scale: 1
                },
                {
                    path: shapes.get(SHAPE.CIRCLE)?.path()!,
                    pos: { x: 0, y: -shapeSize },
                    scale: 1
                },
            ],
            shapes: [SHAPE.SQUARE, SHAPE.CIRCLE],
            cutout: false,
            finalScale: 0.1,
        },
        {
            steps: [
                {
                    path: shapes.get(SHAPE.SQUARE)?.path()!,
                    pos: { x: 0, y: 0 },
                    scale: 1
                },
                {
                    path: shapes.get(SHAPE.CIRCLE)?.path()!,
                    pos: { x: 0, y: 0 },
                    scale: Math.pow(10, -0.3),
                    cutout: true,
                },
            ],
            shapes: [SHAPE.SQUARE, SHAPE.CIRCLE],
            cutout: true,
            finalScale: -0.3,
        },
        {
            steps: [{ "path": shapes.get(SHAPE.SQUARE)?.path()!, "pos": { "x": 0, "y": 0 }, "scale": 1, "cutout": false, "outline": false }, { "path": shapes.get(SHAPE.HALF_CIRCLE)?.path()!, "pos": { "x": 0, "y": 0 }, "scale": 1, "cutout": true, "outline": false }, { "path": shapes.get(SHAPE.SQUARE)?.path()!, "pos": { "x": 0, "y": -40 }, "scale": 0.446827609139784, "cutout": false, "outline": false }, { "path": shapes.get(SHAPE.CIRCLE)?.path()!, "pos": { "x": 0, "y": 40 }, "scale": 0.446827609139784, "cutout": false, "outline": false }, { "path": shapes.get(SHAPE.CIRCLE)?.path()!, "pos": { "x": 40, "y": 0 }, "scale": 0.446827609139784, "cutout": false, "outline": false }, { "path": shapes.get(SHAPE.CIRCLE)?.path()!, "pos": { "x": -40, "y": 0 }, "scale": 0.446827609139784, "cutout": false, "outline": false }],
            shapes: [SHAPE.SQUARE, SHAPE.CIRCLE, SHAPE.HALF_CIRCLE],
            cutout: true,
            finalScale: -0.3,
        },
    ]
}