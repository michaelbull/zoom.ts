export class Dimension {
    readonly left: number;
    readonly top: number;
    readonly width: number;
    readonly height: number;

    constructor(left: number, top: number, width: number, height: number) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }
}
