import { Enemy } from "../objects/enemy";
import { Player } from "../objects/player";

export class EndlessScene extends Phaser.Scene {
    private enemies: Phaser.GameObjects.Group;
    private player: Player;
    private enemySpawnInterval: NodeJS.Timeout;

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

        this.spawnRandomEnemies();
        this.startRandomEnemySpawn();
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
            this.registry.set("score", { title: "Your Score", value: this.registry.get("points") })
            this.scene.stop("HUDScene");
            this.scene.start("MenuScene");
            clearTimeout(this.enemySpawnInterval)
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

    private getRandomPositiveInt(max): number {
        return Math.floor(Math.random() * Math.floor(max));
    }

    private randomEnemySpawnInterval(): number {
        return ((this.getRandomPositiveInt(5) * 1000) + 10000);
    }

    private spawnRandomEnemies(): void{
        const enemyTypes = ["octopus", "crab", "squid"];
        const enemyRowLength = this.getRandomPositiveInt(10);
        for (let y = 0; y < 1; y++) {
            for (let x = 0; x < enemyRowLength; x++) {
                let type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
                this.enemies.add(
                    new Enemy({
                        scene: this,
                        x: 20 + x * 15,
                        y: 10,
                        key: type,
                        rowLength: enemyRowLength,
                        poweredUp: Math.random() > 0.85,
                    })
                );
            }
        }
    }

    private startRandomEnemySpawn(): void{
        this.enemySpawnInterval = setTimeout(() => {
            this.spawnRandomEnemies();
            this.startRandomEnemySpawn();
        },  this.randomEnemySpawnInterval())
    }
}
