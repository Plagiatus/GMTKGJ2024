namespace game {
    export interface DrawingStep {
        path: Path2D,
        pos: { x: number, y: number },
        scale: number,
        outline?: boolean,
        cutout?: boolean,
    }
    export class Canvas {
        canvas: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
        currentImage: ImageData | undefined = undefined;
        drawingSteps: DrawingStep[] = [];
        drawCenter: boolean = false;
        enabledGrid: boolean = false;
        #scale: number = 0;
        #scaledScale: number = 1;
        #currentScale: number = 0;
        #scaleStep: number = 0.1;
        #lastPreview: DrawingStep | undefined;

        constructor(_canvasID: string) {
            this.canvas = <HTMLCanvasElement>document.getElementById(_canvasID);
            this.context = this.canvas.getContext("2d")!;

            // this.canvas.width = this.canvas.parentElement!.clientWidth;
            // this.canvas.height = this.canvas.parentElement!.clientHeight;
            this.canvas.width = 300;
            this.canvas.height = 300;
            requestAnimationFrame(this.drawScalingImage)
        }


        #prevTimeStamp: number = 0;
        #animStartTime: number = 0;
        drawScalingImage = (_timestamp: number) => {
            requestAnimationFrame(this.drawScalingImage);
            let delta = (_timestamp - this.#prevTimeStamp) / 100;
            this.#prevTimeStamp = _timestamp;
            if (this.#animStartTime < 0) {
                this.#animStartTime = _timestamp;
            }
            if (_timestamp - this.#animStartTime > 100) {
                this.#currentScale = this.#scale;
            }
            if (this.#currentScale === this.#scale) return;

            this.#currentScale += this.#scaleStep * delta;
            this.#scaledScale = Math.pow(10, this.#currentScale);
            this.drawCurrent();
        }

        get scale() {
            return this.#scale;
        }

        setScale(_amt: number): boolean {
            let oldScale = this.#scaledScale;
            if (_amt > this.#scale) {
                this.setupScaleAnimation(_amt);
                return true;
            }
            // return false;
            this.#scaledScale = Math.pow(10, _amt);
            let additionalPixels: number = 100;
            let width = this.canvas.width + additionalPixels * 2;
            let height = this.canvas.height + additionalPixels * 2;

            let canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            let ctx = canvas.getContext("2d")!;
            this.drawCurrent(ctx);
            let imageData = ctx.getImageData(0, 0, width, height);
            // let img = document.createElement("img");
            // img.src = canvas.toDataURL();
            // document.body.appendChild(img);
            // return true;

            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    if (x > additionalPixels && x < width - additionalPixels && y > additionalPixels && y < height - additionalPixels) continue;
                    let pos = y * (width * 4) + x * 4;
                    // console.log(imageData.data[pos], imageData.data[pos + 1], imageData.data[pos + 2], imageData.data[pos + 3])
                    if (imageData.data[pos + 3] > 0) {
                        this.#scaledScale = oldScale;
                        return false;
                    }
                }
            }

            this.#scaledScale = oldScale;
            this.setupScaleAnimation(_amt);
            return true;
        }

        private setupScaleAnimation(_newScale: number) {
            _newScale = Math.round(_newScale * 10) / 10;
            this.#scale = _newScale;
            this.#scaleStep = this.#scale - this.#currentScale;
            this.#animStartTime = -1;
            this.#scaledScale = Math.pow(10, _newScale);
        }

        preview(_posX: number, _posY: number, _path: Path2D, _cutout: boolean) {
            this.drawCurrent();
            this.context.fillStyle = "rgba(255, 0, 0, 0.5)";
            this.context.strokeStyle = "rgba(255, 0, 0, 0.5)";
            this.#lastPreview = this.makeStep(_posX, _posY, _path, _cutout);
            this.drawOneStep(this.#lastPreview)
        }
        draw(_posX: number, _posY: number, _path: Path2D, _cutout: boolean) {
            this.drawingSteps.push(this.makeStep(_posX, _posY, _path, false, _cutout));
            this.#lastPreview = undefined;
            this.drawCurrent();
        }
        reset() {
            this.currentImage = undefined;
            this.#lastPreview = undefined;
            this.context.reset();
            this.drawingSteps = [];
            this.#scale = this.#currentScale = 0;
            this.#scaledScale = Math.pow(10, this.#currentScale);
            this.drawCurrent();
        }
        drawCurrent(context = this.context, reset: boolean = true) {
            if (reset)
                context.reset();
            for (let step of this.drawingSteps) {
                this.drawOneStep(step, context);
            }
            context.scale(1, 1);

            if (this.drawCenter) {
                context.resetTransform();
                context.fillStyle = "rgba(255, 0, 0, 0.5)";
                context.translate(this.canvas.width / 2, context.canvas.height / 2);
                context.fillRect(-10, -2, 20, 4);
                context.fillRect(-2, -10, 4, 20);
            }
            context.resetTransform();
        }
        private drawOneStep(step: DrawingStep, context = this.context) {
            context.resetTransform();
            context.translate(context.canvas.width / 2, context.canvas.height / 2);
            context.scale(step.scale / this.#scaledScale, step.scale / this.#scaledScale);
            context.translate(step.pos.x, step.pos.y);
            if(step.cutout){
                // context.stroke(step.path);
                context.globalCompositeOperation = "destination-out";
                // context.fillStyle = "rgba(0,0,0,0.1)";
                context.fill(step.path);
                context.globalCompositeOperation = "source-over";
            } else if (step.outline){
                context.stroke(step.path);
            } else {
                context.fill(step.path);
            }
        }
        private makeStep(_posX: number, _posY: number, _path: Path2D, _outline: boolean = false, _cutout: boolean = false): DrawingStep {
            // to canvas coordinates
            let x = _posX - this.canvas.width / 2;
            let y = _posY - this.canvas.height / 2;

            // prevent drawing outside
            x = Math.max(Math.min(x, this.canvas.width / 2 - shapeSize / 2), -this.canvas.width / 2 + shapeSize / 2);
            y = Math.max(Math.min(y, this.canvas.height / 2 - shapeSize / 2), -this.canvas.height / 2 + shapeSize / 2);

            if (this.enabledGrid) {
                x += shapeSize / 2;
                x = x - (x % shapeSize) + Math.sign(x) * shapeSize / 2 - shapeSize / 2;
                y += shapeSize / 2;
                y = y - (y % shapeSize) + Math.sign(y) * shapeSize / 2 - shapeSize / 2;
            }
            return {
                path: _path,
                pos: { x, y },
                scale: this.#scaledScale,
                cutout: _cutout,
                outline: _outline,
            }

        }
    }
}