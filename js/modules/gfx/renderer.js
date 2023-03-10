export class Renderer {
    constructor(canvas, stack) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.stack = stack;
    }

    render() {
        this.stack.forEach(element => {
            if (element.particleSystem) {
                element.particleSystem.render(this.context);
            }
            
            switch (element.renderMode) {
                default:
                case "rect":
                    this.createRect(element);
                    break;

                case "circle":
                    this.createCircle(element);
                    break;

                case "sprite":
                    this.createImage(element);
                    break;

                case "text":
                    this.createText(element);
                    break;
            }
        });
    }

    createRect({ x, y, width, height, color }) {
        this.context.fillStyle = color;
        this.context.fillRect(x, y, width, height);
    }

    createCircle({ x, y, width, color }) {
        this.context.fillStyle = color;
        this.context.beginPath();
        this.context.arc(x, y, width, 0, 2 * Math.PI);
        this.context.fill();
    }

    createImage({ x, y, width, height, sprite }) {
        const image = document.getElementById(sprite.id);
        this.context.drawImage(image, x, y, width, height);
    }

    createText({x, y, color, font, text}) {
        this.context.font = font;
        this.context.fillStyle = color;
        this.context.fillText(text, x, y);
    }

    clearScreen(x = 0, y = 0, width = this.canvas.width, height = this.canvas.height) {
        this.context.clearRect(x, y, width, height);
    }
}