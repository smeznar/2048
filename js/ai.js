function AIController(gameManager){
    this.manager = gameManager;
    this.numOfRandomPlays = 100;
}

AIController.prototype.makeAMove = function(grid){
    this.grid = grid;
    let move = this.selectMove();
    this.grid.move(move,true);
    this.manager.actuate(this.grid);
}

AIController.prototype.selectMove = function(){
    let moves = new Array(4);
    for(i=0;i<moves.length;i++){
        moves[i] = Math.floor((Math.random() * 100) + 1);
    }
    let max = 0;
    let index = 0;
    for(i=0;i<moves.length;i++){
        if(max < moves[i]){
            max = moves[i];
            index = i;
        }
    }
    return index;
}