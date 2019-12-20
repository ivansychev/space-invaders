import { Enemy } from "../objects/enemy";
import { Player } from "../objects/player";

export class EndlessScene extends Phaser.Scene {
    private enemies: Phaser.GameObjects.Group;
    private player: Player;

    constructor() {
        super({
            key: "EndlessScene"
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
            key: "player"
        });
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
        }

        if (this.registry.get("lives") < 0) {
            this.registry.set("status", { title: "Game Over!", offsetX: 50 })
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

    private bulletHitEnemy(bullet, enemy): void {
        bullet.destroy();
        enemy.gotHurt();
    }

    private bulletHitPlayer(bullet, player): void {
        bullet.destroy();
        player.gotHurt();
    }
}
