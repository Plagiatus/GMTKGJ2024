"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var game;
(function (game) {
    var _Canvas_scale, _Canvas_scaledScale, _Canvas_currentScale, _Canvas_scaleStep, _Canvas_lastPreview, _Canvas_prevTimeStamp, _Canvas_animStartTime;
    class Canvas {
        constructor(_canvasID) {
            this.currentImage = undefined;
            this.drawingSteps = [];
            this.drawCenter = false;
            this.enabledGrid = false;
            _Canvas_scale.set(this, 0);
            _Canvas_scaledScale.set(this, 1);
            _Canvas_currentScale.set(this, 0);
            _Canvas_scaleStep.set(this, 0.1);
            _Canvas_lastPreview.set(this, void 0);
            _Canvas_prevTimeStamp.set(this, 0);
            _Canvas_animStartTime.set(this, 0);
            this.drawScalingImage = (_timestamp) => {
                requestAnimationFrame(this.drawScalingImage);
                let delta = (_timestamp - __classPrivateFieldGet(this, _Canvas_prevTimeStamp, "f")) / 100;
                __classPrivateFieldSet(this, _Canvas_prevTimeStamp, _timestamp, "f");
                if (__classPrivateFieldGet(this, _Canvas_animStartTime, "f") < 0) {
                    __classPrivateFieldSet(this, _Canvas_animStartTime, _timestamp, "f");
                }
                if (_timestamp - __classPrivateFieldGet(this, _Canvas_animStartTime, "f") > 100) {
                    __classPrivateFieldSet(this, _Canvas_currentScale, __classPrivateFieldGet(this, _Canvas_scale, "f"), "f");
                }
                if (__classPrivateFieldGet(this, _Canvas_currentScale, "f") === __classPrivateFieldGet(this, _Canvas_scale, "f"))
                    return;
                __classPrivateFieldSet(this, _Canvas_currentScale, __classPrivateFieldGet(this, _Canvas_currentScale, "f") + __classPrivateFieldGet(this, _Canvas_scaleStep, "f") * delta, "f");
                __classPrivateFieldSet(this, _Canvas_scaledScale, Math.pow(10, __classPrivateFieldGet(this, _Canvas_currentScale, "f")), "f");
                this.drawCurrent();
            };
            this.canvas = document.getElementById(_canvasID);
            this.context = this.canvas.getContext("2d");
            this.canvas.width = this.canvas.parentElement.offsetWidth;
            this.canvas.height = this.canvas.parentElement.offsetHeight;
            requestAnimationFrame(this.drawScalingImage);
        }
        get scale() {
            return __classPrivateFieldGet(this, _Canvas_scale, "f");
        }
        setScale(_amt) {
            let oldScale = __classPrivateFieldGet(this, _Canvas_scaledScale, "f");
            if (_amt > __classPrivateFieldGet(this, _Canvas_scale, "f")) {
                this.setupScaleAnimation(_amt);
                return true;
            }
            // return false;
            __classPrivateFieldSet(this, _Canvas_scaledScale, Math.pow(10, _amt), "f");
            let additionalPixels = 100;
            let width = this.canvas.width + additionalPixels * 2;
            let height = this.canvas.height + additionalPixels * 2;
            let canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            let ctx = canvas.getContext("2d");
            this.drawCurrent(ctx);
            let imageData = ctx.getImageData(0, 0, width, height);
            // let img = document.createElement("img");
            // img.src = canvas.toDataURL();
            // document.body.appendChild(img);
            // return true;
            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    if (x > additionalPixels && x < width - additionalPixels && y > additionalPixels && y < height - additionalPixels)
                        continue;
                    let pos = y * (width * 4) + x * 4;
                    // console.log(imageData.data[pos], imageData.data[pos + 1], imageData.data[pos + 2], imageData.data[pos + 3])
                    if (imageData.data[pos + 3] > 0) {
                        __classPrivateFieldSet(this, _Canvas_scaledScale, oldScale, "f");
                        return false;
                    }
                }
            }
            __classPrivateFieldSet(this, _Canvas_scaledScale, oldScale, "f");
            this.setupScaleAnimation(_amt);
            return true;
        }
        setupScaleAnimation(_newScale) {
            _newScale = Math.round(_newScale * 10) / 10;
            __classPrivateFieldSet(this, _Canvas_scale, _newScale, "f");
            __classPrivateFieldSet(this, _Canvas_scaleStep, __classPrivateFieldGet(this, _Canvas_scale, "f") - __classPrivateFieldGet(this, _Canvas_currentScale, "f"), "f");
            __classPrivateFieldSet(this, _Canvas_animStartTime, -1, "f");
            __classPrivateFieldSet(this, _Canvas_scaledScale, Math.pow(10, _newScale), "f");
        }
        preview(_posX, _posY, _path) {
            this.drawCurrent();
            this.context.fillStyle = "rgba(255, 0, 0, 0.5)";
            __classPrivateFieldSet(this, _Canvas_lastPreview, this.makeStep(_posX, _posY, _path), "f");
            this.drawOneStep(__classPrivateFieldGet(this, _Canvas_lastPreview, "f"));
        }
        draw(_posX, _posY, _path) {
            this.drawingSteps.push(this.makeStep(_posX, _posY, _path));
            __classPrivateFieldSet(this, _Canvas_lastPreview, undefined, "f");
            this.drawCurrent();
        }
        reset() {
            this.currentImage = undefined;
            __classPrivateFieldSet(this, _Canvas_lastPreview, undefined, "f");
            this.context.reset();
            this.drawingSteps = [];
            __classPrivateFieldSet(this, _Canvas_scale, __classPrivateFieldSet(this, _Canvas_currentScale, 0, "f"), "f");
            this.drawCurrent();
        }
        drawCurrent(context = this.context, reset = true) {
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
        drawOneStep(step, context = this.context) {
            context.resetTransform();
            context.translate(context.canvas.width / 2, context.canvas.height / 2);
            context.scale(step.scale / __classPrivateFieldGet(this, _Canvas_scaledScale, "f"), step.scale / __classPrivateFieldGet(this, _Canvas_scaledScale, "f"));
            context.translate(step.pos.x, step.pos.y);
            context.fill(step.path);
        }
        makeStep(_posX, _posY, _path) {
            // to canvas coordinates
            let x = _posX - this.canvas.width / 2;
            let y = _posY - this.canvas.height / 2;
            // prevent drawing outside
            x = Math.max(Math.min(x, this.canvas.width / 2 - game.shapeSize / 2), -this.canvas.width / 2 + game.shapeSize / 2);
            y = Math.max(Math.min(y, this.canvas.height / 2 - game.shapeSize / 2), -this.canvas.height / 2 + game.shapeSize / 2);
            if (this.enabledGrid) {
                x += game.shapeSize / 2;
                x = x - (x % game.shapeSize) + Math.sign(x) * game.shapeSize / 2 - game.shapeSize / 2;
                y += game.shapeSize / 2;
                y = y - (y % game.shapeSize) + Math.sign(y) * game.shapeSize / 2 - game.shapeSize / 2;
            }
            return {
                path: _path,
                pos: { x, y },
                scale: __classPrivateFieldGet(this, _Canvas_scaledScale, "f"),
            };
        }
    }
    _Canvas_scale = new WeakMap(), _Canvas_scaledScale = new WeakMap(), _Canvas_currentScale = new WeakMap(), _Canvas_scaleStep = new WeakMap(), _Canvas_lastPreview = new WeakMap(), _Canvas_prevTimeStamp = new WeakMap(), _Canvas_animStartTime = new WeakMap();
    game.Canvas = Canvas;
})(game || (game = {}));
var game;
(function (game) {
    const overlay = document.getElementById("level-completed-overlay");
    const canvas = overlay.querySelector("canvas");
    const context = canvas.getContext("2d");
    let currentImage;
    const canvasCheck1 = document.createElement("canvas");
    const canvasCheck2 = document.createElement("canvas");
    const contextCheckOriginal = canvasCheck1.getContext("2d");
    const contextCheckPlayer = canvasCheck2.getContext("2d");
    let checkImageOriginal;
    let checkImagePlayer;
    const scanPercentage = document.getElementById("level-completed-scan");
    const resultPercentage = document.getElementById("level-completed-result");
    const resultText = document.getElementById("result-text");
    function checkCompletion() {
        canvas.width = canvasCheck1.width = canvasCheck2.width = game.playCanvas.canvas.width;
        canvas.height = canvasCheck1.height = canvasCheck2.height = game.playCanvas.canvas.height;
        overlay.classList.remove("hidden");
        drawInitial();
        initCheck();
    }
    game.checkCompletion = checkCompletion;
    function drawInitial() {
        context.reset();
        contextCheckOriginal.reset();
        contextCheckPlayer.reset();
        context.fillStyle = "rgba(0, 0, 0, 0.5)";
        // original
        context.translate(canvas.width / 2, canvas.height / 2);
        context.fill(game.levels[game.currentLevel].orderPath());
        contextCheckOriginal.translate(canvas.width / 2, canvas.height / 2);
        contextCheckOriginal.fill(game.levels[game.currentLevel].orderPath());
        //current
        game.playCanvas.drawCenter = false;
        game.playCanvas.drawCurrent(context, false);
        game.playCanvas.drawCurrent(contextCheckPlayer, false);
        game.playCanvas.drawCenter = true;
    }
    const check = { correct: 0, incorrect: 0, currentY: 0 };
    function initCheck() {
        currentImage = context.getImageData(0, 0, canvas.width, canvas.height);
        checkImageOriginal = contextCheckOriginal.getImageData(0, 0, canvas.width, canvas.height);
        checkImagePlayer = contextCheckPlayer.getImageData(0, 0, canvas.width, canvas.height);
        check.correct = 0;
        check.incorrect = 0;
        check.currentY = 0;
        requestAnimationFrame(nextCheckStep);
        // let img = document.createElement("img");
        // img.src = canvasCheck1.toDataURL();
        // document.body.appendChild(img);
        // let img2 = document.createElement("img");
        // img2.src = canvasCheck2.toDataURL();
        // document.body.appendChild(img2);
    }
    const linesPerFrame = 3;
    function nextCheckStep() {
        context.reset();
        context.putImageData(currentImage, 0, 0);
        scanPercentage.innerText = `${Math.min(100, Math.round(check.currentY / canvas.height * 100 * 10) / 10)}%`;
        if (check.currentY > canvas.height)
            return checkCompleted();
        requestAnimationFrame(nextCheckStep);
        for (let y = 0; y < linesPerFrame; y++) {
            if (y + check.currentY >= canvas.height) {
                break;
            }
            for (let x = 0; x < canvas.width; x++) {
                let pos = (y + check.currentY) * (canvas.width * 4) + x * 4;
                if (pos < 0)
                    continue;
                let alphaOriginal = checkImageOriginal.data[pos + 3];
                let alphaPlayer = checkImagePlayer.data[pos + 3];
                if (alphaOriginal === 0 && alphaPlayer === 0)
                    continue;
                if (alphaOriginal > 0 && alphaPlayer > 0) {
                    //correct
                    setPixel(pos, currentImage, 62, 203, 52, 255);
                    check.correct++;
                }
                else {
                    //wrong
                    setPixel(pos, currentImage, 203, 52, 62, 255);
                    check.incorrect++;
                }
            }
        }
        context.fillStyle = "green";
        context.fillRect(0, check.currentY, canvas.width, linesPerFrame);
        check.currentY += linesPerFrame;
    }
    function setPixel(pos, imageData, r, g, b, a) {
        imageData.data[pos + 0] = r;
        imageData.data[pos + 1] = g;
        imageData.data[pos + 2] = b;
        imageData.data[pos + 3] = a;
    }
    function checkCompleted() {
        let percentage = check.correct / (check.correct + check.incorrect);
        console.log(check, percentage);
        resultPercentage.innerText = `${Math.round(percentage * 100 * 10) / 10}%`;
        if (percentage < 0.70) {
            resultText.innerText = "FAILED";
        }
        else if (percentage < 0.85) {
            resultText.innerText = "Let's hope the customer doesn't notice the slight differences...";
        }
        else if (percentage < 0.90) {
            resultText.innerText = "I'd say close enough but that's just not true. I know you can do better.";
        }
        else if (percentage < 0.95) {
            resultText.innerText = "That's really good! Almost perfect!";
        }
        else {
            resultText.innerText = "Amazing!";
        }
    }
})(game || (game = {}));
var game;
(function (game) {
    let SHAPE;
    (function (SHAPE) {
        SHAPE[SHAPE["SQUARE"] = 0] = "SQUARE";
        SHAPE[SHAPE["CIRCLE"] = 1] = "CIRCLE";
        SHAPE[SHAPE["HALF_CIRCLE"] = 2] = "HALF_CIRCLE";
    })(SHAPE = game.SHAPE || (game.SHAPE = {}));
    game.shapeSize = 40;
    game.shapes = new Map([
        [SHAPE.SQUARE, {
                path() {
                    let path = new Path2D();
                    path.rect(-game.shapeSize / 2, -game.shapeSize / 2, game.shapeSize, game.shapeSize);
                    return path;
                },
            }],
        [SHAPE.CIRCLE, {
                path() {
                    let path = new Path2D();
                    path.arc(0, 0, game.shapeSize / 2, 0, Math.PI * 2);
                    return path;
                },
            }],
        [SHAPE.HALF_CIRCLE, {
                path() {
                    let path = new Path2D();
                    path.arc(0, 0, game.shapeSize / 2, 0, Math.PI);
                    return path;
                },
            }],
    ]);
})(game || (game = {}));
/// <reference path="shapes.ts" />
var game;
/// <reference path="shapes.ts" />
(function (game) {
    game.levels = [
        {
            orderPath() {
                let path = new Path2D();
                path.arc(0, game.shapeSize, game.shapeSize / 2, 0, Math.PI * 2);
                path.rect(-game.shapeSize / 2, -game.shapeSize / 2, game.shapeSize, game.shapeSize);
                path.arc(0, -game.shapeSize, game.shapeSize / 2, 0, Math.PI * 2);
                return path;
            },
            shapes: [game.SHAPE.SQUARE, game.SHAPE.CIRCLE]
        }
    ];
})(game || (game = {}));
///<reference path="canvas.ts"/>
///<reference path="level.ts"/>
var game;
///<reference path="canvas.ts"/>
///<reference path="level.ts"/>
(function (game) {
    var _a, _b;
    game.playCanvas = new game.Canvas("play-canvas");
    game.targetCanvas = new game.Canvas("target-canvas");
    game.currentLevel = 0;
    game.targetCanvas.drawCenter = true;
    let selectedShape = game.SHAPE.SQUARE;
    let currentScaleLevel = 0;
    const maxScale = 1;
    const minScale = -1;
    game.playCanvas.canvas.addEventListener("mousemove", mouseOverPlayCanvas);
    game.playCanvas.canvas.addEventListener("click", mouseClickOnPlayCanvas);
    game.playCanvas.canvas.addEventListener("mouseleave", () => game.playCanvas.preview(0, 0, new Path2D()));
    game.playCanvas.canvas.addEventListener("wheel", scaleWithMouse);
    game.playCanvas.drawCenter = true;
    (_a = document.getElementById("play-reset")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", resetPlayCanvas);
    (_b = document.getElementById("play-done")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", game.checkCompletion);
    const scaleElement = document.getElementById("scale");
    scaleElement.addEventListener("input", scaleWithInput);
    document.getElementById("grid").addEventListener("input", toggleGrid);
    loadLevel(0);
    function mouseOverPlayCanvas(_event) {
        let path = game.shapes.get(selectedShape).path();
        game.playCanvas.preview(_event.offsetX, _event.offsetY, path);
    }
    function mouseClickOnPlayCanvas(_event) {
        let path = game.shapes.get(selectedShape).path();
        game.playCanvas.draw(_event.offsetX, _event.offsetY, path);
    }
    function loadLevel(_id) {
        if (game.levels.length <= _id) {
            console.log("you won!");
            return;
        }
        game.currentLevel = _id;
        resetPlayCanvas();
        let level = game.levels[_id];
        game.targetCanvas.reset();
        game.targetCanvas.draw(game.targetCanvas.canvas.width / 2, game.targetCanvas.canvas.height / 2, level.orderPath());
        const shapeWrapper = document.getElementById("shape-select");
        const newShapes = [];
        for (let shape of level.shapes) {
            let div = document.createElement("div");
            let canvas = document.createElement("canvas");
            canvas.width = 100;
            canvas.height = 100;
            div.appendChild(canvas);
            let ctx = canvas.getContext("2d");
            ctx.translate(50, 50);
            ctx.fill(game.shapes.get(shape).path());
            newShapes.push(div);
            div.addEventListener("click", () => {
                selectedShape = shape;
                newShapes.forEach(d => d.classList.remove("selected"));
                div.classList.add("selected");
            });
        }
        shapeWrapper.replaceChildren(...newShapes);
        newShapes[0].dispatchEvent(new MouseEvent("click"));
    }
    function scaleWithMouse(_event) {
        let direction = Math.sign(_event.deltaY);
        setScale(currentScaleLevel + direction * 0.1);
        mouseOverPlayCanvas(_event);
    }
    function scaleWithInput(_event) {
        setScale(-_event.target.value);
        game.playCanvas.drawCurrent();
    }
    function setScale(_amt) {
        _amt = Math.round(_amt * 10) / 10;
        let nextScaleLevel = Math.min(Math.max(_amt, minScale), maxScale);
        if (!game.playCanvas.setScale(nextScaleLevel)) {
            console.log("can't scale!");
            // that didn't work!
        }
        else {
            currentScaleLevel = nextScaleLevel;
        }
        scaleElement.value = "" + -currentScaleLevel;
    }
    function resetPlayCanvas() {
        game.playCanvas.reset();
        scaleElement.value = "0";
    }
    function toggleGrid(_event) {
        game.playCanvas.enabledGrid = _event.target.checked;
    }
})(game || (game = {}));
//# sourceMappingURL=script.js.map