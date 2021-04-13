// this class just stores the position of the mouse or finger in case of touch input on the canvas,
// it is needed to repeatedly draw the canvas on new inputs

export class CanvasStore {
    private steps: Array<{ x: number, y: number, drag: boolean }>

    constructor() {
        this.steps = new Array();
    }

    public values(): Array<{ x: number, y: number, drag: boolean }> {
        return this.steps;
    }

    public push(x: number, y: number, drag: boolean) {
        this.steps.push({ x, y, drag })
    }
    
    public clear(): void {
        this.steps = new Array();
    }
}
