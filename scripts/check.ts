namespace game {
    const overlay: HTMLElement = document.getElementById("level-completed-overlay")!;
    const canvas: HTMLCanvasElement = overlay.querySelector("canvas")!
    const context: CanvasRenderingContext2D = canvas.getContext("2d")!;
    let currentImage: ImageData;

    const canvasCheck1: HTMLCanvasElement = document.createElement("canvas");
    const canvasCheck2: HTMLCanvasElement = document.createElement("canvas");
    const contextCheckOriginal = canvasCheck1.getContext("2d")!;
    const contextCheckPlayer = canvasCheck2.getContext("2d")!;
    let checkImageOriginal: ImageData;
    let checkImagePlayer: ImageData;

    const scanPercentage: HTMLElement = document.getElementById("level-completed-scan")!;
    const resultPercentage: HTMLElement = document.getElementById("level-completed-result")!;
    const resultTime: HTMLElement = document.getElementById("level-completed-time")!;
    const resultSteps: HTMLElement = document.getElementById("level-completed-steps")!;
    const resultText: HTMLElement = document.getElementById("result-text")!;
    const buttonNext: HTMLButtonElement = <HTMLButtonElement>document.getElementById("button-next")!;

    buttonNext.addEventListener("click", nextLevel);
    document.getElementById("button-retry")!.addEventListener("click", retry);

    export function checkCompletion() {
        canvas.width = canvasCheck1.width = canvasCheck2.width = playCanvas.canvas.width;
        canvas.height = canvasCheck1.height = canvasCheck2.height = playCanvas.canvas.height;
        overlay.classList.remove("hidden");
        resultPercentage.parentElement!.classList.add("hidden");
        resultTime.parentElement!.classList.add("hidden");
        resultSteps.parentElement!.classList.add("hidden");
        resultText.classList.add("hidden");
        buttonNext.disabled = true;

        drawInitial();
        initCheck();
    }

    function drawInitial() {
        context.reset();
        contextCheckOriginal.reset();
        contextCheckPlayer.reset();

        context.fillStyle = "rgba(0, 0, 0, 0.5)";
        // original
        targetCanvas.drawCenter = false;
        targetCanvas.drawCurrent(context, false);
        targetCanvas.drawCurrent(contextCheckOriginal, true);
        targetCanvas.drawCenter = true;

        //current
        playCanvas.drawCenter = false;
        playCanvas.drawCurrent(context, false);
        playCanvas.drawCurrent(contextCheckPlayer, true);
        playCanvas.drawCenter = true;
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
        scanPercentage.innerText = `${Math.min(100, Math.round(check.currentY / canvas.height * 100 * 10) / 10)}%`
        if (check.currentY > canvas.height) return checkCompleted();
        requestAnimationFrame(nextCheckStep);

        for (let y: number = 0; y < linesPerFrame; y++) {
            if (y + check.currentY >= canvas.height) {
                break;
            }
            for (let x: number = 0; x < canvas.width; x++) {
                let pos = (y + check.currentY) * (canvas.width * 4) + x * 4;
                if (pos < 0) continue;
                let alphaOriginal = checkImageOriginal.data[pos + 3];
                let alphaPlayer = checkImagePlayer.data[pos + 3];
                if (alphaOriginal === 0 && alphaPlayer === 0) continue;
                if (alphaOriginal > 0 && alphaPlayer > 0) {
                    //correct
                    setPixel(pos, currentImage, 62, 203, 52);
                    check.correct++;
                } else {
                    //wrong
                    setPixel(pos, currentImage, 203, 52, 62);
                    check.incorrect++;
                }
            }
        }

        context.fillStyle = "green";
        context.fillRect(0, check.currentY, canvas.width, linesPerFrame);
        check.currentY += linesPerFrame;
    }

    function setPixel(pos: number, imageData: ImageData, r: number, g: number, b: number, a?: number) {
        imageData.data[pos + 0] = r;
        imageData.data[pos + 1] = g;
        imageData.data[pos + 2] = b;
        if (a !== undefined) {
            imageData.data[pos + 3] = a;
        }
    }

    function checkCompleted() {
        let percentage = check.correct / (check.correct + check.incorrect);

        console.log(check, percentage);
        resultPercentage.innerText = `${Math.round(percentage * 100 * 10) / 10}%`;

        if (percentage < 0.70) {
            resultText.innerText = "FAILED";
            resultText.classList.add("red-dot");
            resultText.classList.remove("yellow-dot", "green-dot");
        }
        else if (percentage < 0.85) {
            resultText.classList.add("yellow-dot");
            resultText.classList.remove("red-dot", "green-dot");
            resultText.innerText = "Let's hope the customer doesn't notice the slight differences...";
        }
        else if (percentage < 0.90) {
            resultText.classList.add("yellow-dot");
            resultText.classList.remove("red-dot", "green-dot");
            resultText.innerText = "I'd say close enough but that's just not true. I know you can do better.";
        }
        else if (percentage < 0.95) {
            resultText.classList.add("green-dot");
            resultText.classList.remove("red-dot", "yellow-dot");
            resultText.innerText = "That's really good! Almost perfect!";
        }
        else {
            resultText.classList.add("green-dot");
            resultText.classList.remove("red-dot", "yellow-dot");
            resultText.innerText = "Amazing!";
        }
        
        resultPercentage.parentElement!.classList.remove("hidden");
        setTimeout(()=>{
            resultTime.parentElement!.classList.remove("hidden");
        }, 500);
        setTimeout(()=>{
            resultSteps.parentElement!.classList.remove("hidden");
        }, 1000);
        setTimeout(()=>{
            resultText.classList.remove("hidden");
            if(percentage >= 0.70) {
                buttonNext.disabled = false;
            }
        }, 1500);
    }

    function nextLevel(){
        loadLevel(currentLevel + 1);
        overlay.classList.add("hidden");
    }
    
    function retry(){
        overlay.classList.add("hidden");
        resetPlayCanvas();
    }
}