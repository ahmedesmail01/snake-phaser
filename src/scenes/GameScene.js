// src/scenes/GameScene.js
class Snake {
  constructor(scene, x, y, length = 3, tileSize = 32) {
    this.scene = scene;
    this.tileSize = tileSize;
    this.direction = "right";
    this.parts = [];

    for (let i = 0; i < length; i++) {
      const key = i === 0 ? "head" : "segment";
      this.parts.push(scene.add.sprite(x - i * tileSize, y, key).setOrigin(0));
    }
  }

  setDirection(newDir) {
    const opposites = { left: "right", right: "left", up: "down", down: "up" };
    if (opposites[newDir] === this.direction) return;
    this.direction = newDir;
  }

  move() {
    // remember old positions
    const oldPos = this.parts.map((p) => ({ x: p.x, y: p.y }));
    const head = this.parts[0];

    // advance head
    switch (this.direction) {
      case "right":
        head.x += this.tileSize;
        break;
      case "left":
        head.x -= this.tileSize;
        break;
      case "up":
        head.y -= this.tileSize;
        break;
      case "down":
        head.y += this.tileSize;
        break;
    }

    // wrap‐around
    const maxW = this.scene.scale.width;
    const maxH = this.scene.scale.height;
    if (head.x >= maxW) head.x = 0;
    else if (head.x < 0) head.x = maxW - this.tileSize;
    if (head.y >= maxH) head.y = 0;
    else if (head.y < 0) head.y = maxH - this.tileSize;

    // shift body
    for (let i = 1; i < this.parts.length; i++) {
      this.parts[i].x = oldPos[i - 1].x;
      this.parts[i].y = oldPos[i - 1].y;
    }
  }

  grow() {
    const tail = this.parts[this.parts.length - 1];
    this.parts.push(
      this.scene.add.sprite(tail.x, tail.y, "segment").setOrigin(0)
    );
  }

  bodyParts() {
    return this.parts.slice(1);
  }
}

export class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  preload() {
    this.load.image("segment", "assets/segment.png");
    this.load.image("head", "assets/snakeHead.png");
    this.load.image("food", "assets/food.png");
  }

  create() {
    const ts = 32;

    // INIT MOVE INTERVAL & MINIMUM
    this.moveInterval = 150; // starting ms between steps
    this.minMoveInterval = 50; // fastest speed cap
    this.speedStep = 10; // ms to subtract on each food

    // spawn snake
    this.snake = new Snake(this, 5 * ts, 5 * ts, 3, ts);

    // spawn food
    const cols = this.scale.width / ts;
    const rows = this.scale.height / ts;
    this.food = this.add
      .sprite(
        Phaser.Math.Between(0, cols - 1) * ts,
        Phaser.Math.Between(0, rows - 1) * ts,
        "food"
      )
      .setOrigin(0);

    // keyboard input
    this.input.keyboard.on("keydown", (e) => {
      if (e.key === "ArrowUp") this.snake.setDirection("up");
      if (e.key === "ArrowDown") this.snake.setDirection("down");
      if (e.key === "ArrowLeft") this.snake.setDirection("left");
      if (e.key === "ArrowRight") this.snake.setDirection("right");
    });

    this.lastMoveTime = 0;
  }

  update(time) {
    // WAIT FOR NEXT STEP
    if (time < this.lastMoveTime + this.moveInterval) return;
    this.lastMoveTime = time;

    // 1) move the snake
    this.snake.move();

    // 2) did we eat?
    const headRect = this.snake.parts[0].getBounds();
    const foodRect = this.food.getBounds();
    if (Phaser.Geom.Intersects.RectangleToRectangle(headRect, foodRect)) {
      // grow snake
      this.snake.grow();

      // speed up, clamped to minMoveInterval
      this.moveInterval = Math.max(
        this.minMoveInterval,
        this.moveInterval - this.speedStep
      );

      // reposition food
      const ts = this.snake.tileSize;
      const cols = this.scale.width / ts;
      const rows = this.scale.height / ts;
      this.food.setPosition(
        Phaser.Math.Between(0, cols - 1) * ts,
        Phaser.Math.Between(0, rows - 1) * ts
      );
    }

    // 3) self-collision on exact tile‐match
    const head = this.snake.parts[0];
    for (let part of this.snake.bodyParts()) {
      if (head.x === part.x && head.y === part.y) {
        return this.scene.start("GameOverScene");
      }
    }
  }
}
