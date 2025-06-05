// src/scenes/Start.js
export class Start extends Phaser.Scene {
  constructor() {
    super("Start");
  }

  preload() {
    // UI assets
    this.load.image("background", "assets/space.png");
    this.load.image("logo", "assets/phaser.png");
    this.load.spritesheet("ship", "assets/spaceship.png", {
      frameWidth: 176,
      frameHeight: 96,
    });

    this.load.image("segment", "assets/segment.svg");
    this.load.image("head", "assets/snakeHead.svg");
    this.load.image("food", "assets/strawberry.svg");
  }

  create() {
    // tile‐scrolling background
    this.background = this.add.tileSprite(640, 360, 1280, 720, "background");

    // logo + tween
    const logo = this.add.image(640, 200, "logo");
    this.tweens.add({
      targets: logo,
      y: 400,
      duration: 1500,
      ease: "Sine.inOut",
      yoyo: true,
      loop: -1,
    });

    // animating ship
    const ship = this.add.sprite(640, 360, "ship");
    ship.anims.create({
      key: "fly",
      frames: this.anims.generateFrameNumbers("ship", {
        start: 0,
        end: 2,
      }),
      frameRate: 15,
      repeat: -1,
    });
    ship.play("fly");

    // “Click to start” text
    this.add
      .text(640, 500, "Click to Play", {
        fontSize: "32px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    // start the game on pointer or SPACE
    this.input.once("pointerdown", () => {
      this.scene.start("GameScene");
    });
    this.input.keyboard.once(
      "keydown-SPACE",
      () => this.scene.start("GameScene"),
      this
    );
  }

  update() {
    this.background.tilePositionX += 2;
  }
}
