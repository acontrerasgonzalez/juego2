/*Roguelike in Javascript
*/
export class Roguelike{
	constructor(width = 30, height = 10){
		this.levelWidth = width; //The width of the level
		this.levelHeight = height; //The height of the level
		this.currentlevel = []; //The matrix of the game
		this.enemyturn = true; //Boolean to check if enemies move or not
		this.score = 100; //Score of the player
		this.hasPoints = []; //Boolean for enemy collision with bonuses
	}

	/*Generates the level matrix. Walls, items, player, exit and enemies.
	5 = wall [can't pass through them either players nor enemies]
	0 = player
	2 = enemy 
	* = pickup item [bonus points]
	6 = exit [level clear]
	*/
	createLevel(){
		let matrix = [];
		let row = [];
		this.score = 100;
		let objects = 0;
		let enemies = 0;
		let items = 0;
		let obj_per_row = 0;
		let enem_per_row = 0;
		let items_per_row = 0;
		for(let i=0;i<this.levelHeight;i++){  //Generate matrix
			row = [];
			obj_per_row = 0;
			enem_per_row = 0;
			let limit_per_row = Math.floor((Math.random() * (this.levelWidth-1 - this.levelWidth/2 + 1) + this.levelWidth/2));
			let limit_per_row_enem = 1;
			for(let j=0;j<this.levelWidth;j++){ //Generate each row
				if(i == 0 || i == this.levelHeight-1){ //Generate horizontal walls
					if(j == this.levelWidth-1)
						row[j] = "5";
					else
						row[j] = "5";
				}else if(j == 0){ //Generate vertical walls
					row[j] = "5";
				}else if(j == this.levelWidth-1){ //Generate vertical walls
					row[j] = "5";
				}else if(i == this.levelHeight-2 && j == this.levelWidth-2){ //Generate exit
					row[j] = "6";
				}else if(i == 1 && j == 1){ //Generate player
					row[j] = "0";
				}else{
					if((Math.random() * (20 - 0 + 1) + 0) >= 18 && objects < 80 && obj_per_row < limit_per_row && i != 2 && j != 2 && i != this.levelHeight-3 && j != this.levelWidth-3){ //Generate random walls
						row[j] = "5";
						objects++;
						obj_per_row++;
					}else if((Math.random() * (100 - 0 + 1) + 0) >= 85 && enemies < 4 && enem_per_row < limit_per_row_enem && i >= 4 && j >= 4 && i <= this.levelHeight-3 && j <= this.levelWidth-3){ //Generate random enemies
						row[j] = "2";
						enemies++;
						enem_per_row++;
					}else if((Math.random() * (100 - 0 + 1) + 0) >= 90 && items < 3 && items_per_row < 1 && i >= 4 && j >= 4 && i <= this.levelHeight-3 && j <= this.levelWidth-3){ //Generate random items
						row[j] = "*";
						items++;
						items_per_row++;
					}else{ //Fill the remaining places with empty space
						row[j] = "_";
					}
				}
			}
			matrix.push(row);
		}
		this.currentlevel = matrix;
	}

	//Returns player position in the matrix ([x,y]). Used for Move() function.
	getPlayerPosition(){
		let position = [-1, -1];
		for(let i=0;i<this.levelHeight;i++){
			for(let j=0;j<this.levelWidth;j++){
				if(this.currentlevel[i][j] == "0")
					position = [i,j];
			}
		}
		return position;
	}

	//Returns an array of enemy positions ([[x, y], ...]). Used for Move() function.
	getEnemyPosition(){
		let position = [];
		for(let i=0;i<this.levelHeight;i++){
			for(let j=0;j<this.levelWidth;j++){
				if(this.currentlevel[i][j] == "2")
					position.push([i,j]);
			}
		}
		return position;
	}

	//Updates positions in the matrix from player and enemies. Movement is set to the WASD keys.
	//Returns endgame to see if the game is finished (bool)
	Move(direction){
		let endgame = false;
		//get player position
		let current_pos = this.getPlayerPosition();
		//get enemy position
		let enemies = this.getEnemyPosition();
		//If player is not found that means game over
		if(current_pos[0] == -1 || current_pos[1] == -1){
			endgame = true;
			this.score = 0;
		}
		
		//Move according to player input
		if(direction == "a" || direction == "d" || direction == "w" || direction == "s" && !endgame){
			//Player move
			switch(direction){
				case "d":
					if(this.score > 0) this.score--;
					if(this.currentlevel[current_pos[0]][current_pos[1]+1] == "_"){
						this.currentlevel[current_pos[0]][current_pos[1]] = "_";
						this.currentlevel[current_pos[0]][current_pos[1]+1] = "0";
					}else if(this.currentlevel[current_pos[0]][current_pos[1]+1] == "6"){
						this.currentlevel[current_pos[0]][current_pos[1]] = "_";
						this.currentlevel[current_pos[0]][current_pos[1]+1] = "0";
						endgame = true;
					}else if(this.currentlevel[current_pos[0]][current_pos[1]+1] == "*"){
						this.currentlevel[current_pos[0]][current_pos[1]] = "_";
						this.currentlevel[current_pos[0]][current_pos[1]+1] = "0";
						this.score += 20;
					}
				break;
				case "a":
					if(this.score > 0) this.score--;
					if(this.currentlevel[current_pos[0]][current_pos[1]-1] == "_"){
						this.currentlevel[current_pos[0]][current_pos[1]] = "_";
						this.currentlevel[current_pos[0]][current_pos[1]-1] = "0";
					}else if(this.currentlevel[current_pos[0]][current_pos[1]-1] == "6"){
						this.currentlevel[current_pos[0]][current_pos[1]] = "_";
						this.currentlevel[current_pos[0]][current_pos[1]-1] = "0";
						endgame = true;
					}else if(this.currentlevel[current_pos[0]][current_pos[1]-1] == "*"){
						this.currentlevel[current_pos[0]][current_pos[1]] = "_";
						this.currentlevel[current_pos[0]][current_pos[1]-1] = "0";
						this.score += 20;
					}
				break;
				case "w":
					if(this.score > 0) this.score--;
					if(this.currentlevel[current_pos[0]-1][current_pos[1]] == "_"){
						this.currentlevel[current_pos[0]][current_pos[1]] = "_";
						this.currentlevel[current_pos[0]-1][current_pos[1]] = "0";
					}else if(this.currentlevel[current_pos[0]-1][current_pos[1]] == "6"){
						this.currentlevel[current_pos[0]][current_pos[1]] = "_";
						this.currentlevel[current_pos[0]-1][current_pos[1]] = "0";
						endgame = true;
					}else if(this.currentlevel[current_pos[0]-1][current_pos[1]] == "*"){
						this.currentlevel[current_pos[0]][current_pos[1]] = "_";
						this.currentlevel[current_pos[0]-1][current_pos[1]] = "0";
						this.score += 20;
					}
				break;
				case "s":
					if(this.score > 0) this.score--;
					if(this.currentlevel[current_pos[0]+1][current_pos[1]] == "_"){
						this.currentlevel[current_pos[0]][current_pos[1]] = "_";
						this.currentlevel[current_pos[0]+1][current_pos[1]] = "0";
					}else if(this.currentlevel[current_pos[0]+1][current_pos[1]] == "6"){
						this.currentlevel[current_pos[0]][current_pos[1]] = "_";
						this.currentlevel[current_pos[0]+1][current_pos[1]] = "0";
						endgame = true;
					}else if(this.currentlevel[current_pos[0]+1][current_pos[1]] == "*"){
						this.currentlevel[current_pos[0]][current_pos[1]] = "_";
						this.currentlevel[current_pos[0]+1][current_pos[1]] = "0";
						this.score += 20;
					}
				break;
			}

			//Enemies move
			current_pos = this.getPlayerPosition();
			if(this.enemyturn){ //Check if the enemies wait or move
				for(let i=0;i<enemies.length;i++){
					if(Math.abs(current_pos[0]-enemies[i][0]) > Math.abs(current_pos[1]-enemies[i][1])){
						if(enemies[i][0] < current_pos[0]){
							if(this.currentlevel[enemies[i][0]+1][enemies[i][1]] == "_" || this.currentlevel[enemies[i][0]+1][enemies[i][1]] == "0"){
								if(!this.hasPoints[i]){
									if(this.currentlevel[enemies[i][0]+1][enemies[i][1]] == "0")
										endgame = true;
									this.currentlevel[enemies[i][0]+1][enemies[i][1]] = "2";
									this.currentlevel[enemies[i][0]][enemies[i][1]] = "_";
								}else{
									if(this.currentlevel[enemies[i][0]+1][enemies[i][1]] == "0")
										endgame = true;
									this.currentlevel[enemies[i][0]+1][enemies[i][1]] = "2";
									this.currentlevel[enemies[i][0]][enemies[i][1]] = "*";
									this.hasPoints[i] = false;
								}
							}else if(this.currentlevel[enemies[i][0]+1][enemies[i][1]] == "*"){
								this.currentlevel[enemies[i][0]+1][enemies[i][1]] = "2";
								this.currentlevel[enemies[i][0]][enemies[i][1]] = "_";
								this.hasPoints[i]=true;
							}
						}else if(enemies[i][0] > current_pos[0]){
							if(this.currentlevel[enemies[i][0]-1][enemies[i][1]] == "_" || this.currentlevel[enemies[i][0]-1][enemies[i][1]] == "0"){
								if(!this.hasPoints[i]){
									if(this.currentlevel[enemies[i][0]-1][enemies[i][1]] == "0")
										endgame = true;
									this.currentlevel[enemies[i][0]-1][enemies[i][1]] = "2";
									this.currentlevel[enemies[i][0]][enemies[i][1]] = "_";
								}else{
									if(this.currentlevel[enemies[i][0]-1][enemies[i][1]] == "0")
										endgame = true;
									this.currentlevel[enemies[i][0]-1][enemies[i][1]] = "2";
									this.currentlevel[enemies[i][0]][enemies[i][1]] = "*";
									this.hasPoints[i] = false;
								}
							}else if(this.currentlevel[enemies[i][0]-1][enemies[i][1]] == "*"){
								this.currentlevel[enemies[i][0]-1][enemies[i][1]] = "2";
								this.currentlevel[enemies[i][0]][enemies[i][1]] = "_";
								this.hasPoints[i]=true;
							}
						}
					}else if(Math.abs(current_pos[0]-enemies[i][0]) <= Math.abs(current_pos[1]-enemies[i][1])){
						if(enemies[i][1] < current_pos[1]){
							if(this.currentlevel[enemies[i][0]][enemies[i][1]+1] == "_" || this.currentlevel[enemies[i][0]][enemies[i][1]+1] == "0"){
								if(!this.hasPoints[i]){
									if(this.currentlevel[enemies[i][0]][enemies[i][1]+1] == "0")
										endgame = true;
									this.currentlevel[enemies[i][0]][enemies[i][1]+1] = "2";
									this.currentlevel[enemies[i][0]][enemies[i][1]] = "_";
								}else{
									if(this.currentlevel[enemies[i][0]][enemies[i][1]+1] == "0")
										endgame = true;
									this.currentlevel[enemies[i][0]][enemies[i][1]+1] = "2";
									this.currentlevel[enemies[i][0]][enemies[i][1]] = "*";
									this.hasPoints[i] = false;
								}
							}else if(this.currentlevel[enemies[i][0]][enemies[i][1]+1] == "*"){
								this.currentlevel[enemies[i][0]][enemies[i][1]+1] = "2";
								this.currentlevel[enemies[i][0]][enemies[i][1]] = "_";
								this.hasPoints[i]=true;
							}
						}else if(enemies[i][1] > current_pos[1]){
							if(this.currentlevel[enemies[i][0]][enemies[i][1]-1] == "_" || this.currentlevel[enemies[i][0]][enemies[i][1]-1] == "0"){
								if(!this.hasPoints[i]){
									if(this.currentlevel[enemies[i][0]][enemies[i][1]-1] == "0")
										endgame = true;
									this.currentlevel[enemies[i][0]][enemies[i][1]-1] = "2";
									this.currentlevel[enemies[i][0]][enemies[i][1]] = "_";
								}else{
									if(this.currentlevel[enemies[i][0]][enemies[i][1]-1] == "0")
										endgame = true;
									this.currentlevel[enemies[i][0]][enemies[i][1]-1] = "2";
									this.currentlevel[enemies[i][0]][enemies[i][1]] = "*";
									this.hasPoints[i] = false;
								}	
							}else if(this.currentlevel[enemies[i][0]][enemies[i][1]-1] == "*"){
								this.currentlevel[enemies[i][0]][enemies[i][1]-1] = "2";
								this.currentlevel[enemies[i][0]][enemies[i][1]] = "_";
								this.hasPoints[i]=true;
							}
						}
					}
				}
				this.enemyturn = false;
			}else{
				this.enemyturn = true;
			}
		}
		return endgame;
	}
}
