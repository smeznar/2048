function AIController(gameManager, numOfRandomPlays = 100, typeOfSelection = 1){
    this.manager = gameManager;
    this.typeOfSelection = typeOfSelection;
    this.numOfRandomPlays = numOfRandomPlays;
}

moveBias = {
    2: [1,1,1,1],
    // Treba se razmislit
}

AIController.prototype.makeAMove = function(grid){
    this.grid = grid;
    let move = 0;
    if(this.typeOfSelection == 3){
        move = Math.floor(Math.random() * 4);
    } else {
        move = this.selectMove(grid);
    }
    this.grid.move(move,true);
    this.manager.actuate(this.grid);
}

AIController.prototype.selectMove = function(grid){
    let moves = new Array(4);
    for(let i=0;i<4;i++){
        moves[i] = this.getMoveScore(i, grid);
    }
    let minmax = 0;
    let index = 0;
    for(let i=0;i<moves.length;i++){
        if(minmax < moves[i]){
            minmax = moves[i];
            index = i;
        }
    }
    return index;
}

AIController.prototype.getMoveScore = function(move, grid){
    let total = 0;
    for(let i=0;i<this.numOfRandomPlays;i++){
        let newGrid = grid.copy();
        newGrid.move(move,true);
        if(grid.isDifferent(newGrid)){
            total += this.playRandomly(newGrid);
        } else {
            total += 0;
        }
    }
    return total;
}

AIController.prototype.playRandomly = function(grid){
    while(!grid.over){
        grid.move(Math.floor(Math.random() * 4),true);
    }
    return grid.score;
}