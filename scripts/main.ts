///<reference path="canvas.ts"/>
///<reference path="level.ts"/>

namespace game {
    export const playCanvas = new Canvas("play-canvas");
    export const targetCanvas = new Canvas("target-canvas");
    export let currentLevel: number = 0;
    targetCanvas.drawCenter = true;
    let selectedShape: SHAPE = SHAPE.SQUARE;
    let currentScaleLevel: number = 0;
    const maxScale: number = 1;
    const minScale: number = -1;
    const scaleStep: number = 0.25;
    let cutout: boolean = false;

    playCanvas.canvas.addEventListener("mousemove", mouseOverPlayCanvas);
    playCanvas.canvas.addEventListener("click", mouseClickOnPlayCanvas);
    playCanvas.canvas.addEventListener("mouseleave", () => playCanvas.preview(0, 0, new Path2D(), false));
    playCanvas.canvas.addEventListener("wheel", <EventListener>scaleWithMouse);
    playCanvas.drawCenter = true;

    document.getElementById("play-reset")?.addEventListener("click", resetPlayCanvas);
    document.getElementById("play-done")?.addEventListener("click", checkCompletion);

    document.getElementById("cutout")!.addEventListener("input", <EventListener>toggleCutout);
    document.getElementById("grid")!.addEventListener("input", <EventListener>toggleGrid);
    document.getElementById("grid")!.dispatchEvent(new InputEvent("input"));

    setupScaleUI();

    loadLevel(0);

    function setupScaleUI() {
        const scaleElement: HTMLInputElement = <HTMLInputElement>document.getElementById("scale-ui")!;
        for (let i: number = maxScale; i >= minScale; i -= scaleStep) {
            let span = document.createElement("span");
            span.classList.add("scale-dot");
            span.dataset.scale = i.toString();
            span.addEventListener("click", <EventListener>scaleWithInput);
            scaleElement.appendChild(span);
        }
    }

    function updateScaleUI() {
        document.querySelectorAll(".scale-dot").forEach(el => {
            let scale = Number((<HTMLElement>el).dataset.scale);
            if(scale >= currentScaleLevel) {
                el.classList.add("filled");
            } else {
                el.classList.remove("filled");
            }
        })
    }

    function mouseOverPlayCanvas(_event: MouseEvent) {
        let path = shapes.get(selectedShape)!.path();
        playCanvas.preview(_event.offsetX, _event.offsetY, path, cutout);
    }

    function mouseClickOnPlayCanvas(_event: MouseEvent) {
        let path = shapes.get(selectedShape)!.path();
        playCanvas.draw(_event.offsetX, _event.offsetY, path, cutout);
    }

    function loadLevel(_id: number) {
        if (levels.length <= _id) {
            console.log("you won!");
            return;
        }
        currentLevel = _id;
        resetPlayCanvas();

        let level = levels[_id];

        targetCanvas.reset();
        targetCanvas.drawingSteps = level.steps;
        targetCanvas.drawCurrent();

        const shapeWrapper: HTMLElement = document.getElementById("shapes")!;
        const newShapes: HTMLElement[] = [];
        for (let shape of level.shapes) {
            let div = document.createElement("div");
            let canvas = document.createElement("canvas");
            canvas.width = shapeSize * 1.5;
            canvas.height = shapeSize * 1.5;
            div.appendChild(canvas);
            let ctx = canvas.getContext("2d")!;
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.fill(shapes.get(shape)!.path())
            newShapes.push(div);
            div.addEventListener("click", () => {
                selectedShape = shape;
                newShapes.forEach(d => d.classList.remove("selected"));
                div.classList.add("selected");
            });
        }
        shapeWrapper.replaceChildren(...newShapes);
        newShapes[0].dispatchEvent(new MouseEvent("click"));

        let cutoutCheckbox: HTMLInputElement = <HTMLInputElement>document.getElementById("cutout")!;
        cutoutCheckbox.checked = false;
        cutoutCheckbox.disabled = !level.cutout;
    }

    function scaleWithMouse(_event: WheelEvent) {
        let direction = Math.sign(_event.deltaY);
        setScale(currentScaleLevel + direction * scaleStep);
        mouseOverPlayCanvas(_event);
    }

    function scaleWithInput(_event: InputEvent) {
        setScale(+(<HTMLElement>_event.target).dataset.scale!)
        playCanvas.drawCurrent();
        updateScaleUI();
    }

    function setScale(_amt: number) {
        _amt = Math.round(_amt * 10) / 10;
        let nextScaleLevel = Math.min(Math.max(_amt, minScale), maxScale);
        if (!playCanvas.setScale(nextScaleLevel)) {
            console.log("can't scale!");
            // that didn't work!
        } else {
            currentScaleLevel = nextScaleLevel;
        }
        updateScaleUI();
    }

    function resetPlayCanvas() {
        playCanvas.reset();
        currentScaleLevel = 0;
        updateScaleUI();
    }

    function toggleGrid(_event: InputEvent) {
        playCanvas.enabledGrid = (<HTMLInputElement>_event.target).checked;
    }
    function toggleCutout(_event: InputEvent) {
        cutout = (<HTMLInputElement>_event.target).checked;
    }
}