function rectangularCollision({ rect1, rect2 }) {
  if (rect1.turnedLeft === false) {
    return (
      rect1.attackBox.position.x + rect1.attackBox.width >= rect2.position.x &&
      rect1.position.x <= rect2.position.x + rect2.width &&
      rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y &&
      rect1.attackBox.position.y <= rect2.position.y + rect2.height
    );
  } else if (rect1.turnedLeft === true) {
    return (
      rect1.attackBox.position.x <= rect2.position.x + rect2.width &&
      rect1.position.x + rect1.width >= rect2.position.x &&
      rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y &&
      rect1.attackBox.position.y <= rect2.position.y + rect2.height
    );
  }
}

function rectangularCollision2({ rect1, rect2 }) {
  if (rect1.turnedLeft === true) {
    return (
      rect1.attackBox.position.x + rect1.attackBox.width >= rect2.position.x &&
      rect1.position.x <= rect2.position.x + rect2.width &&
      rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y &&
      rect1.attackBox.position.y <= rect2.position.y + rect2.height
    );
  } else if (rect1.turnedLeft === false) {
    return (
      rect1.attackBox.position.x <= rect2.position.x + rect2.width &&
      rect1.position.x + rect1.width >= rect2.position.x &&
      rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y &&
      rect1.attackBox.position.y <= rect2.position.y + rect2.height
    );
  }
}

function determineWinner({ player, enemy, timerID }) {
  clearTimeout(timerID);
  document.querySelector("#display").style.display = "flex";
  if (player.health === enemy.health) {
    k_death.play();
    w_death.play();
    document.querySelector("#display").innerText =
      "Tie\n\nPress Enter to restart!!!";
    player.switchSprite("death");
    enemy.switchSprite("death");
    document.querySelector("#player2").style.width = "0%";
    document.querySelector("#player1").style.width = "0%";
  } else if (player.health > enemy.health) {
    k_death.play()
    document.querySelector("#display").innerText =
      "Player 1 Wins!!!\n\nPress Enter to restart!!!";
    enemy.switchSprite("death");
  } else {
    w_death.play();
    document.querySelector("#display").innerText =
      "Player 2 Wins!!!\n\nPress Enter to restart!!!";
    player.switchSprite("death");
  }
  restart();
}

function restart() {
  addEventListener("keydown", function (e) {
    if (e.key === "Enter") this.location.reload();
  });
}

let timer = 60;
let timerID;
function decreaseTimer() {
  timerID = setTimeout(decreaseTimer, 1000);
  if (timer >= 0) {
    document.querySelector("#timer").innerHTML = timer;
    timer--;
  }
  if (timer === -1) {
    determineWinner({ player, enemy, timerID });
  }
}
