
const TILE_FILLED_COLOR = "#171717";



class Tile {

    // States
    // 0 = unfilled
    // 1 = filled
    // 2 = X

    constructor(element) {
        this.element = element;
        this.baseColor = element.style.backgroundColor;
        this.state = 0;
    }

    changeTileState(_state) {
        this.state = _state;

        switch(_state) {
            case 0:
                this.element.innerHTML = "";
                this.element.style.backgroundColor = this.baseColor;
                break;
            case 1:
                this.element.innerHTML = "";
                this.element.style.backgroundColor = TILE_FILLED_COLOR;
                break;
            case 2:
                this.element.innerHTML = "<i class=\"fa-solid fa-xmark\"></i>";
                this.element.style.backgroundColor = this.baseColor;
                break;
        }
    }
    
}