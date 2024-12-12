
const TILE_FILLED_COLOR = "#171717";
const NUMBER_BASE_COLOR = "#171717";
const NUMBER_FILLED_COLOR = "#2b7555";
const NUMBER_ERROR_COLOR = "#d41b06";



class Tile {

    // States
    // 0 = unfilled
    // 1 = filled
    // 2 = X

    constructor(x, y, element, level) {
		this.x = x;
		this.y = y;
        this.element = element;
        this.level = level;
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
		
		this.level["grid"][this.x][this.y] = this.state;
    }
    
}


class Number {
	// States
	// 0: Regular
	// 1: Filled
	// 2: Line Error
	
	constructor(number, element) {
		this.element = element;
		this.number = number;
		this.state = 0;
	}
	
	setState(state) {
		this.state = state;
		
		switch(this.state) {
			case 0: 
				this.element.style.color = NUMBER_BASE_COLOR;
				break;
			case 1:
				this.element.style.color = NUMBER_FILLED_COLOR;
				break;
			case 2:
				this.element.style.color = NUMBER_ERROR_COLOR;
				break;
		}
		
	}
}