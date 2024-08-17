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

    playCanvas.canvas.addEventListener("mousemove", mouseOverPlayCanvas);
    playCanvas.canvas.addEventListener("click", mouseClickOnPlayCanvas);
    playCanvas.canvas.addEventListener("mouseleave", () => playCanvas.preview(0, 0, new Path2D()));
    playCanvas.canvas.addEventListener("wheel", <EventListener>scaleWithMouse);
    playCanvas.drawCenter = true;
    
    document.getElementById("play-reset")?.addEventListener("click", resetPlayCanvas);
    document.getElementById("play-done")?.addEventListener("click", checkCompletion);
    const scaleElement: HTMLInputElement = <HTMLInputElement>document.getElementById("scale")!;
    scaleElement.addEventListener("input", <EventListener>scaleWithInput);
    
    document.getElementById("grid")!.addEventListener("input", <EventListener>toggleGrid);

    loadLevel(0);

    function mouseOverPlayCanvas(_event: MouseEvent) {
        let path = shapes.get(selectedShape)!.path();
        playCanvas.preview(_event.offsetX, _event.offsetY, path);
    }

    function mouseClickOnPlayCanvas(_event: MouseEvent) {
        let path = shapes.get(selectedShape)!.path();
        playCanvas.draw(_event.offsetX, _event.offsetY, path);
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
        targetCanvas.draw(targetCanvas.canvas.width / 2, targetCanvas.canvas.height / 2, level.orderPath());

        const shapeWrapper: HTMLElement = document.getElementById("shape-select")!;
        const newShapes: HTMLElement[] = [];
        for (let shape of level.shapes) {
            let div = document.createElement("div");
            let canvas = document.createElement("canvas");
            canvas.width = 100;
            canvas.height = 100;
            div.appendChild(canvas);
            let ctx = canvas.getContext("2d")!;
            ctx.translate(50, 50);
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
    }

    function scaleWithMouse(_event: WheelEvent){
        let direction = Math.sign(_event.deltaY);
        setScale(currentScaleLevel + direction * 0.1);
        mouseOverPlayCanvas(_event);
    }
    
    function scaleWithInput(_event: InputEvent){
        setScale(-(<HTMLInputElement>_event.target).value)
        playCanvas.drawCurrent();
    }
    
    function setScale(_amt: number){
        _amt = Math.round(_amt * 10) / 10;
        let nextScaleLevel = Math.min(Math.max(_amt, minScale), maxScale);
        if(!playCanvas.setScale(nextScaleLevel)){
            console.log("can't scale!");
            // that didn't work!
        } else {
            currentScaleLevel = nextScaleLevel;
        }
        scaleElement.value = "" + -currentScaleLevel;
    }

    function resetPlayCanvas(){
        playCanvas.reset();
        scaleElement.value = "0";
    }

    function toggleGrid(_event: InputEvent) {
        playCanvas.enabledGrid = (<HTMLInputElement>_event.target).checked;
    }
}