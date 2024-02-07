const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;
let i = 1;
let a = 1;
let startGame = false;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.3;

let bgAudio = new Audio("Sounds/bg.mp3");
let w_hurt = new Audio("Sounds/warrior_hurt.mp3");
let k_hurt = new Audio("Sounds/kenji_hurt.mp3");
let w_death = new Audio("Sounds/warrior_death.mp3");
let k_death = new Audio("Sounds/kenji_death.mp3");
bgAudio.loop = true;
bgAudio.volume = 0.2;

const backGround = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "Images/background.png",
});

const shop = new Sprite({
  position: {
    x: 625,
    y: 128,
  },
  imageSrc: "Images/shop.png",
  scale: 2.75,
  framesMAX: 6,
});

const player = new Fighter({
  position: {
    x: 0,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "Images/warrior/Idle.png",
  scale: 3.7,
  framesMAX: 10,
  offset: {
    x: 0,
    y: 222,
  },
  sprites: {
    idle: {
      imageSrc: "Images/warrior/Idle.png",
      framesMAX: 10,
    },
    idleLeft: {
      imageSrc: "Images/warrior/Idle_left.png",
      framesMAX: 10,
    },
    run: {
      imageSrc: "Images/warrior/Run.png",
      framesMAX: 8,
    },
    runLeft: {
      imageSrc: "Images/warrior/Run_left.png",
      framesMAX: 8,
    },
    jump: {
      imageSrc: "Images/warrior/Jump.png",
      framesMAX: 3,
    },
    jumpLeft: {
      imageSrc: "Images/warrior/Jump_left.png",
      framesMAX: 3,
    },
    fall: {
      imageSrc: "Images/warrior/Fall.png",
      framesMAX: 3,
    },
    fallLeft: {
      imageSrc: "Images/warrior/Fall_left.png",
      framesMAX: 3,
    },
    attack1: {
      imageSrc: "Images/warrior/Attack3.png",
      framesMAX: 8,
    },
    attack1Left: {
      imageSrc: "Images/warrior/Attack3_left.png",
      framesMAX: 8,
    },
    takeHit: {
      imageSrc: "Images/warrior/Take hit.png",
      framesMAX: 3,
    },
    death: {
      imageSrc: "Images/warrior/Death.png",
      framesMAX: 7,
    },
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 160,
    height: 50,
  },
  turnedLeft: false,
});

const enemy = new Fighter({
  position: {
    x: 550,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
  },
  imageSrc: "Images/kenji/Idle.png",
  scale: 3,
  framesMAX: 4,
  offset: {
    x: 0,
    y: 235,
  },
  sprites: {
    idle: {
      imageSrc: "Images/kenji/Idle.png",
      framesMAX: 4,
    },
    run: {
      imageSrc: "Images/kenji/Run.png",
      framesMAX: 8,
    },
    jump: {
      imageSrc: "Images/kenji/Jump.png",
      framesMAX: 2,
    },
    fall: {
      imageSrc: "Images/kenji/Fall.png",
      framesMAX: 2,
    },
    attack1: {
      imageSrc: "Images/kenji/Attack1.png",
      framesMAX: 4,
    },
    idleLeft: {
      imageSrc: "Images/kenji/Idle_left.png",
      framesMAX: 4,
    },
    runLeft: {
      imageSrc: "Images/kenji/Run_left.png",
      framesMAX: 8,
    },
    jumpLeft: {
      imageSrc: "Images/kenji/Jump_left.png",
      framesMAX: 2,
    },
    fallLeft: {
      imageSrc: "Images/kenji/Fall_left.png",
      framesMAX: 2,
    },
    attack1Left: {
      imageSrc: "Images/kenji/Attack1_left.png",
      framesMAX: 4,
    },
    takeHit: {
      imageSrc: "Images/kenji/Take hit.png",
      framesMAX: 3,
    },
    death: {
      imageSrc: "Images/kenji/Death.png",
      framesMAX: 7,
    },
  },
  attackBox: {
    offset: {
      x: -175,
      y: 50,
    },
    width: 170,
    height: 50,
  },
  turnedLeft: false,
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  backGround.update();
  shop.update();
  if (startGame) {
    enemy.update();
    player.update();
    if (a) {
      decreaseTimer();
      a = 0;
    }
  } else {
    c.fillStyle = "rgb(0,0,0, 0.5)";
    c.fillRect(0, 0, canvas.width, canvas.height);
  }

  player.velocity.x = 0;
  // player movement
  if (keys.a.pressed && player.lastKey === "a" && player.position.x > -220) {
    player.velocity.x = -2;
    // console.log(player.position.x);
    player.switchSprite("runLeft");
  } else if (
    keys.d.pressed &&
    player.lastKey === "d" &&
    player.position.x + player.width < 750
  ) {
    player.velocity.x = 2;
    // console.log(player.position.x)
    player.switchSprite("run");
  } else {
    if (player.turnedLeft) player.switchSprite("idleLeft");
    else player.switchSprite("idle");
  }

  if (player.velocity.y < 0) {
    if (player.turnedLeft) player.switchSprite("jumpLeft");
    else player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    if (player.turnedLeft) player.switchSprite("fallLeft");
    else player.switchSprite("fall");
  }

  enemy.velocity.x = 0;
  // enemy movement
  if (
    keys.ArrowLeft.pressed &&
    enemy.lastKey === "ArrowLeft" &&
    enemy.position.x > -255 
  ) {
    enemy.velocity.x = -2;
    enemy.switchSprite("run");
  } else if (
    keys.ArrowRight.pressed &&
    enemy.lastKey === "ArrowRight" &&
    enemy.position.x + enemy.width < 750
  ) {
    enemy.velocity.x = 2;
    enemy.switchSprite("runLeft");
  } else {
    if (enemy.turnedLeft) enemy.switchSprite("idleLeft");
    else enemy.switchSprite("idle");
  }

  if (enemy.velocity.y < 0) {
    if (enemy.turnedLeft) enemy.switchSprite("jumpLeft");
    else enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    if (enemy.turnedLeft) enemy.switchSprite("fallLeft");
    else enemy.switchSprite("fall");
  }

  //Detect for collision
  if (
    rectangularCollision({ rect1: player, rect2: enemy }) &&
    player.isAttacking &&
    player.framesCurrent === 4 &&
    i
  ) {
    k_hurt.load();
    k_hurt.play();
    enemy.takeHit();
    if (player.attackLeft)
      if (enemy.position.x - 100 <= -255) enemy.position.x = -255;
      else enemy.position.x -= 100;
    if (!player.attackLeft) {
      if (enemy.position.x + enemy.width + 100 >= 750) enemy.position.x = 750 - enemy.width;
      else enemy.position.x += 100;
    }
    
    player.isAttacking = false;
    gsap.to("#player2", {
      width: enemy.health + "%",
    });
  }

  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  if (
    rectangularCollision2({ rect1: enemy, rect2: player }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2 &&
    i
  ) {
    w_hurt.load();
    w_hurt.play();
    player.takeHit();
    enemy.isAttacking = false;
    gsap.to("#player1", {
      width: player.health + "%",
    });
  }

  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }
  //end game
  if (enemy.health <= 0 || player.health <= 0) {
    c.fillStyle = "rgb(0,0,0, 0.5)";
    c.fillRect(0, 0, canvas.width, canvas.height);
  }
  if ((enemy.health <= 0 || player.health <= 0) && i) {
    determineWinner({ player, enemy, timerID });
    i = 0;
  }
}

alert("For left Player:\nleft: A\nright:D\njump: W\attack: Space\nFor right Player:\nleft: Arrowleft\nright:Arrowright\njump: Arrowup\attack: Arrowdown")
animate();

window.addEventListener("keydown", (e) => {
  if (!player.dead) {
    switch (e.key) {
      case "d":
        player.turnedLeft = false;
        keys.d.pressed = true;
        player.lastKey = "d";
        player.attackLeft = false;
        player.attackBox.offset = {
          x: 90,
          y: 50,
        };
        break;
      case "a":
        player.turnedLeft = true;
        keys.a.pressed = true;
        player.lastKey = "a";
        player.attackBox.offset = {
          x: -180,
          y: 50,
        };
        break;
      case "w":
        if (player.velocity.y === 0) player.velocity.y = -10;
        break;
      case " ":
        if (player.turnedLeft) player.attackLeft = true;
        player.attack();
        break;
      case "Enter":
        bgAudio.play();
        startGame = true;
        document.querySelector("#display").style.display = "none";
        break;
    }
  }
  if (!enemy.dead) {
    switch (e.key) {
      case "ArrowDown":
        if (enemy.turnedLeft) enemy.attackLeft = true;
        enemy.attack();
        break;
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.turnedLeft = true;
        enemy.lastKey = "ArrowRight";
        enemy.attackBox.offset = {
          x: 56,
          y: 50,
        };
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.turnedLeft = false;
        enemy.lastKey = "ArrowLeft";
        enemy.attackBox.offset = {
          x: -175,
          y: 50,
        };
        break;
      case "ArrowUp":
        if (enemy.velocity.y === 0) enemy.velocity.y = -10;
        break;
    }
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;

    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});


