import { Enemy } from "../objects/enemy";
import { Player } from "../objects/player";

export class GameScene extends Phaser.Scene {
  private enemies: Phaser.GameObjects.Group;
  private player: Player;

  constructor() {
    super({
      key: "GameScene"
    });
  }

  init(): void {
    this.enemies = this.add.group({ runChildUpdate: true });
  }

  create(): void {
    this.player = new Player({
      scene: this,
      x: this.sys.canvas.width / 2,
      y: this.sys.canvas.height - 40,
      key: "player",
      endlessMode: false
    });

    const rowLength = 10;

    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < rowLength; x++) {
        let type;
        if (y === 0) {
          type = "squid";
        } else if (y === 1 || y === 2) {
          type = "crab";
        } else {
          type = "octopus";
        }

        this.enemies.add(
          new Enemy({
            scene: this,
            x: 20 + x * 15,
            y: 50 + y * 15,
            key: type,
            rowLength: 10
          })
        );
      }
    }
  }

  update(): void {
    if (this.player.active) {
      this.player.update();

      this.enemies.children.each((enemy: Enemy) => {
        enemy.update();
        if (enemy.getBullets().getLength() > 0) {
          this.physics.overlap(
            enemy.getBullets(),
            this.player,
            this.bulletHitPlayer,
            null,
            this
          );
        }
      }, this);

      this.checkCollisions();
      this.checkCollisionWithEnemy();
    }

    if (this.registry.get("lives") < 0) {
      this.registry.set("status", { title: "Game Over!", offsetX: 50 })
      this.registry.set("score", { title: null, value: null })
      this.scene.stop("HUDScene");
      this.scene.start("MenuScene");
    }

    if(this.enemies.getLength() === 0){
      this.registry.set("status", { title: "You Win!", offsetX: 40 })
      this.registry.set("score", { title: "Your Score", value: this.registry.get("points") })
      this.scene.stop("HUDScene");
      this.scene.start("MenuScene");
    }
  }

  private checkCollisions(): void {
    this.physics.overlap(
        this.player.getBullets(),
        this.enemies,
        this.bulletHitEnemy,
        null,
        this
    );
  }

  private checkCollisionWithEnemy(): void {
    this.physics.overlap(
        this.player,
        this.enemies,
        this.enemyCollidesWithPlayer,
        null,
        this
    );
  }

  private bulletHitEnemy(bullet, enemy): void {
    bullet.destroy();
    enemy.gotHurt();
  }

  private bulletHitPlayer(bullet, player): void {
    bullet.destroy();
    player.gotHurt();
  }

  private enemyCollidesWithPlayer(player): void {
    player.gotKilled();
  }
}
