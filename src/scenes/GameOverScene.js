export class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  create() {
    const gameOverText = this.add.text(400, 300, "Game Over", {
      fontSize: "48px",
      color: "#ff0000",
    });
    gameOverText.setOrigin(0.5, 0.5);

    const restartButton = this.add.text(400, 350, "Restart", {
      fontSize: "24px",
      color: "#ffffff",
    });
    restartButton.setOrigin(0.5, 0.5);
    restartButton.setInteractive();

    restartButton.on("pointerdown", () => {
      this.scene.start("GameScene");
    });
  }
}
