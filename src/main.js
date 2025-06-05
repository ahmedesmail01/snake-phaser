import { GameOverScene } from "./scenes/GameOverScene.js";
import { GameScene } from "./scenes/GameScene.js";
import { Start } from "./scenes/Start.js";

const config = {
  type: Phaser.AUTO,
  title: "Overlord Rising",
  description: "",
  parent: "game-container",
  width: 1280,
  height: 720,
  backgroundColor: "#000000",
  pixelArt: false,
  scene: [Start, GameScene, GameOverScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
};

new Phaser.Game(config);
