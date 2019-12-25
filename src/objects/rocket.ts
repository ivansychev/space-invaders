export class Rocket extends Phaser.GameObjects.Sprite {
    private rocketProperties: number;
    private destroyingTime: number = 300;
    private hit: boolean = false;

    /* Phaser body type workaround */
    body!: Phaser.Physics.Arcade.Body;

    public madeHit(): boolean {
        return this.hit;
    }

    constructor(params) {
        super(params.scene, params.x, params.y, params.key);

        this.initVariables(params);
        this.initImage();
        this.initPhysics();

        this.scene.add.existing(this);
    }

    private initVariables(params): void {
        this.rocketProperties = params.rocketProperties.speed;
    }

    private initImage(): void {
        this.setOrigin(0.5, 0.5);
    }

    private initPhysics(): void {
        this.scene.physics.world.enable(this);
        this.body.setVelocityY(this.rocketProperties);
        this.body.setSize(9, 13);
    }

    public initiateDestroySequence() {
        this.hit = true;
        this.body.setSize(40, 40);
    }

    update(): void {
        if (this.y < 0 || this.y > this.scene.sys.canvas.height) {
            this.destroy();
        } else if(this.hit){
            if(this.destroyingTime > 0) {
                this.body.setVelocityY(0);
                this.anims.play("rocketExplode",  true);
                this.destroyingTime -= 10;
            }else {
                this.destroy();
            }
        } else {
            this.anims.play("rocketFly", true);
        }
    }
}
