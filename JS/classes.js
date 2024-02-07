class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMAX = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.height = 1024;
    this.width = 576;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMAX = framesMAX;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 20;
    this.offset = offset;
    this.attackLeft = false;
  }

  drawReverse() {
    c.drawImage(
      this.image,
      (this.framesMAX - this.framesCurrent - 1) *
        (this.image.width / this.framesMAX),
      0,
      this.image.width / this.framesMAX,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMAX) * this.scale,
      this.image.height * this.scale
    );
  }

  draw() {
    c.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMAX),
      0,
      this.image.width / this.framesMAX,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMAX) * this.scale,
      this.image.height * this.scale
    );
  }

  animateFrames() {
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMAX - 1) {
        this.framesCurrent++;
      } else {
        if (this.attackLeft) {
          this.attackLeft = false;
        }
        this.framesCurrent = 0;
      }
    }
  }

  update() {
    this.draw();
    this.animateFrames();
  }
}

class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color = "red",
    imageSrc,
    scale = 1,
    framesMAX = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = { offset: {}, width: undefined, health: undefined },
    turnedLeft,
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMAX,
      offset,
    });
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 20;
    this.sprites = sprites;
    this.dead = false;
    this.willDie = false;
    this.turnedLeft = turnedLeft;

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }

  update() {
    if (this.attackLeft) {
      this.drawReverse();
    } else this.draw();
    if (!this.dead) this.animateFrames();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    // c.fillRect(
    //   this.attackBox.position.x,
    //   this.attackBox.position.y,
    //   this.attackBox.width,
    //   this.attackBox.height
    // );
    //  c.fillRect(
    //    this.position.x,
    //    this.position.y,
    //    this.width,
    //    this.height
    //  );

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height - 97) {
      this.velocity.y = 0;
      this.position.y = 330;
    } else {
      this.velocity.y += gravity;
    }
  }

  attack() {
    if (this.turnedLeft) this.switchSprite("attack1Left");
    else this.switchSprite("attack1");
    this.isAttacking = true;
  }

  takeHit() {
    this.health -= 10;
    if (this.health > 0) {
      this.switchSprite("takeHit");
    } else {
      this.willDie = true;
    }
  }

  switchSprite(sprite) {
    if (this.image === this.sprites.death.image) {
      if (this.framesCurrent === this.sprites.death.framesMAX - 1)
        this.dead = true;
      return;
    } else if (
      this.image === this.sprites.attack1.image &&
      this.framesCurrent < this.sprites.attack1.framesMAX - 1 &&
      this.willDie === false
    )
      return;
    else if (
      this.image === this.sprites.attack1Left.image &&
      this.framesCurrent < this.sprites.attack1Left.framesMAX - 1 &&
      this.willDie === false
    )
      return;
    else if (
      this.image === this.sprites.takeHit.image &&
      this.framesCurrent < this.sprites.takeHit.framesMAX - 1 &&
      this.willDie === false
    )
      return;
    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMAX = this.sprites.idle.framesMAX;
          this.framesCurrent = 0;
        }
        break;
      case "idleLeft":
        if (this.image !== this.sprites.idleLeft.image) {
          this.image = this.sprites.idleLeft.image;
          this.framesMAX = this.sprites.idleLeft.framesMAX;
          this.framesCurrent = 0;
        }
        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMAX = this.sprites.run.framesMAX;
          this.framesCurrent = 0;
        }
        break;
      case "runLeft":
        if (this.image !== this.sprites.runLeft.image) {
          this.image = this.sprites.runLeft.image;
          this.framesMAX = this.sprites.runLeft.framesMAX;
          this.framesCurrent = 0;
        }
        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesMAX = this.sprites.jump.framesMAX;
          this.framesCurrent = 0;
        }
        break;
      case "jumpLeft":
        if (this.image !== this.sprites.jumpLeft.image) {
          this.image = this.sprites.jumpLeft.image;
          this.framesMAX = this.sprites.jumpLeft.framesMAX;
          this.framesCurrent = 0;
        }
        break;
      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.framesMAX = this.sprites.fall.framesMAX;
          this.framesCurrent = 0;
        }
        break;
      case "fallLeft":
        if (this.image !== this.sprites.fallLeft.image) {
          this.image = this.sprites.fallLeft.image;
          this.framesMAX = this.sprites.fallLeft.framesMAX;
          this.framesCurrent = 0;
        }
        break;
      case "attack1":
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.framesMAX = this.sprites.attack1.framesMAX;
          this.framesCurrent = 0;
        }
        break;
      case "attack1Left":
        if (this.image !== this.sprites.attack1Left.image) {
          this.image = this.sprites.attack1Left.image;
          this.framesMAX = this.sprites.attack1Left.framesMAX;
          this.framesCurrent = 0;
        }
        break;
      case "takeHit":
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.framesMAX = this.sprites.takeHit.framesMAX;
          this.framesCurrent = 0;
        }
        break;
      case "death":
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.framesMAX = this.sprites.death.framesMAX;
          this.framesCurrent = 0;
        }
        break;
    }
  }
}
