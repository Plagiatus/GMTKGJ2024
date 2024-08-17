/// <reference path="shapes.ts" />

namespace game {
    interface Level {
        orderPath: () => Path2D;
        shapes: SHAPE[];
    }

    export const levels: Level[] = [
        {
            orderPath() {
                let path = new Path2D();
                path.arc(0, shapeSize, shapeSize / 2, 0, Math.PI * 2);
                path.rect(-shapeSize / 2, -shapeSize / 2, shapeSize, shapeSize);
                path.arc(0, -shapeSize, shapeSize / 2, 0, Math.PI * 2);
                return path;
            },
            shapes: [SHAPE.SQUARE, SHAPE.CIRCLE]
        }
    ]
}