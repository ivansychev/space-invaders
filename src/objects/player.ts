import { Bullet } from "./bullet";
import { Rocket } from "./rocket";

export class Player extends Phaser.GameObjects.Image {
  private bullets: Phaser.GameObjects.Group;
  private rockets: Phaser.GameObjects.Group;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private flyingSpeed: number;
  private lastShoot: number;
  private shootingKey: Phaser.Input.Keyboard.Key;
  private rocketKey: Phaser.Input.Keyboard.Key;
  private endlessMode: boolean;

  /* Phaser body type workaround */
  body!: Phaser.Physics.Arcade.Body;

  public getBullets(): Phaser.GameObjects.Group {
    return this.bullets;
  }

  public getRockets(): Phaser.GameObjects.Group {
    return this.rockets;
  }

  constructor(params) {
    super(params.scene, params.x, params.y, params.key);

    this.initVariables(params);
    this.initImage();
    this.initInput();
    this.initPhysics();

    this.scene.add.existing(this);
  }

  private initVariables(params): void {
    this.bullets = this.scene.add.group({
      runChildUpdate: true
    });
    this.rockets = this.scene.add.group({
      runChildUpdate: true
    });
    this.lastShoot = 0;
    this.flyingSpeed = 100;
    this.endlessMode = params.endlessMode
  }

  private initImage(): void {
    this.setOrigin(0.5, 0.5);
  }

  private initInput(): void {
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.shootingKey = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    if(this.endlessMode){
      this.rocketKey = this.scene.input.keyboard.addKey(
          Phaser.Input.Keyboard.KeyCodes.R
      );
    }
  }

  private initPhysics(): void {
    this.scene.physics.world.enable(this);
    this.body.setSize(13, 8);
  }

  update(): void {
    this.handleFlying();
    this.handleShooting();
    if(this.endlessMode){
      this.handleRocketing();
    }
  }

  private handleFlying(): void {
    if (
      this.cursors.right.isDown &&
      this.x < this.scene.sys.canvas.width - this.width
    ) {
      this.body.setVelocityX(this.flyingSpeed);
    } else if (this.cursors.left.isDown && this.x > this.width) {
      this.body.setVelocityX(-this.flyingSpeed);
    } else {
      this.body.setVelocityX(0);
    }
  }

  private handleShooting(): void {
    if (this.shootingKey.isDown && this.scene.time.now > this.lastShoot) {
      if (this.bullets.getLength() < 1) {
        this.bullets.add(
          new Bullet({
            scene: this.scene,
            x: this.x,
            y: this.y - this.height,
            key: "bullet",
            bulletProperties: {
              speed: -300
            }
          })
        );

        this.lastShoot = this.scene.time.now + 500;
      }
    }
  }

  private handleRocketing(): void{
    if (this.rocketKey.isDown && this.scene.time.now > this.lastShoot) {
      if (this.rockets.getLength() < 1 && this.scene.registry.get('ammo') > 0) {
        this.scene.registry.set('ammo', this.scene.registry.get('ammo') - 1);
        this.scene.events.emit("ammoChanged");
        this.rockets.add(
            new Rocket({
              scene: this.scene,
              x: this.x,
              y: this.y - this.height,
              key: "rocket",
              rocketProperties: {
                speed: -50
              }
            })
        );

        this.lastShoot = this.scene.time.now + 500;
      }
    }
  }

  public gotHurt() {
    // update lives
    let currentLives = this.scene.registry.get("lives");
    this.scene.registry.set("lives", currentLives - 1);
    this.scene.events.emit("livesChanged");

    // reset position
    this.x = this.scene.sys.canvas.width / 2;
    this.y = this.scene.sys.canvas.height - 40;
  }

  public gotKilled(): void {
    this.scene.registry.set("lives", -1);
    this.scene.events.emit("livesChanged");
  }
}
