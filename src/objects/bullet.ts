export class Bullet extends Phaser.GameObjects.Image {
  private bulletSpeed: number;

  /* Phaser body type workaround */
  body!: Phaser.Physics.Arcade.Body;

  constructor(params) {
    super(params.scene, params.x, params.y, params.key);

    this.initVariables(params);
    this.initImage();
    this.initPhysics();

    this.scene.add.existing(this);
  }

  private initVariables(params): void {
    this.bulletSpeed = params.bulletProperties.speed;
  }

  private initImage(): void {
    this.setOrigin(0.5, 0.5);
  }

  private initPhysics(): void {
    this.scene.physics.world.enable(this);
    this.body.setVelocityY(this.bulletSpeed);
    this.body.setSize(1, 8);
  }

  update(): void {
    if (this.y < 0 || this.y > this.scene.sys.canvas.height) {
      this.destroy();
    }
  }
}
