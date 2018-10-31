function AIController(gameManager){
    this.manager = gameManager;
}

AIController.prototype.makeAMove = function(grid,numOfRandomPlays){
    this.grid = grid;
    let move = this.selectMove(grid,numOfRandomPlays);
    this.grid.move(move,true);
    this.manager.actuate(this.grid);
}

AIController.prototype.selectMove = function(grid,numOfRandomPlays){
    let moves = new Array(4);
    for(let i=0;i<4;i++){
        moves[i] = this.getMoveScore(i, grid, numOfRandomPlays);
    }
    let max = 0;
    let index = 0;
    for(let i=0;i<moves.length;i++){
        if(max < moves[i]){
            max = moves[i];
            index = i;
        }
    }
    return index;
}

AIController.prototype.getMoveScore = function(move, grid, numOfRandomPlays){
    let total = 0;
    for(let i=0;i<numOfRandomPlays;i++){
        let newGrid = grid.copy();
        newGrid.move(move,true);
        total += this.playRandomly(newGrid);
    }
    return total;
}

AIController.prototype.playRandomly = function(grid){
    while(!grid.over){
        grid.move(Math.floor((Math.random() * 4)),true);
    }
    return grid.score;
}