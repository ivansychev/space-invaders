import { Bullet } from "./bullet";

export class Enemy extends Phaser.GameObjects.Sprite {
  private bullets: Phaser.GameObjects.Group;
  private dyingTime: number;
  private enemyTint: number;
  private enemyType: string;
  private hurtingTime: number;
  private isHurt: boolean;
  private lives: number;
  private moveTween: Phaser.Tweens.Tween;
  private reloadTime: number;
  private valueKill: number;
  private rowLength: number;
  private poweredUp: boolean;
  private bulletSpeed: number = 100;

  /* Phaser body type workaround */
  body!: Phaser.Physics.Arcade.Body;

  public getBullets(): Phaser.GameObjects.Group {
    return this.bullets;
  }

  constructor(params) {
    super(params.scene, params.x, params.y, params.key);

    this.initVariables(params);
    this.initImage();
    this.initPhysics();

    this.initTweens();

    this.scene.add.existing(this);
  }

  private initVariables(params): void {
    this.bullets = this.scene.add.group({
      runChildUpdate: true
    });
    this.enemyType = params.key;
    this.hurtingTime = 200;
    this.isHurt = false;
    this.rowLength = params.rowLength;
    this.poweredUp = params.poweredUp;

    if(this.poweredUp){
      switch (this.enemyType) {
        case "octopus":
          this.dyingTime = 160;
          this.enemyTint = 0xc93c3c;
          this.lives = 2;
          this.reloadTime = 80;
          this.valueKill = 100;
          this.bulletSpeed = 200;
          break;

        case "crab":
          this.dyingTime = 180;
          this.enemyTint = 0xd16634;
          this.lives = 3;
          this.reloadTime = 120;
          this.valueKill = 150;
          this.bulletSpeed = 250;
          break;

        case "squid":
          this.dyingTime = 200;
          this.enemyTint = 0xdb0700;
          this.lives = 4;
          this.reloadTime = 140;
          this.valueKill = 200;
          this.bulletSpeed = 300;
          break;
      }
    }else {
      switch (this.enemyType) {
        case "octopus":
          this.dyingTime = 100;
          this.enemyTint = 0xffffff;
          this.lives = 1;
          this.reloadTime = 6000;
          this.valueKill = 20;
          break;

        case "crab":
          this.dyingTime = 120;
          this.enemyTint = 0x42a4aa;
          this.lives = 2;
          this.reloadTime = 8000;
          this.valueKill = 40;
          break;

        case "squid":
          this.dyingTime = 140;
          this.enemyTint = 0x4a4e4d;
          this.lives = 2;
          this.reloadTime = 5000;
          this.valueKill = 60;
          break;
      }
    }
  }

  private initImage(): void {
    this.setOrigin(0.5, 0.5);
    this.setActive(true);
    this.setTint(this.enemyTint);
  }

  private initPhysics(): void {
    this.scene.physics.world.enable(this);
    this.body.setSize(12, 8);
  }

  private initTweens(): void {
    this.moveTween = this.scene.tweens.add({
      targets: this,
      props:{
        x: {
          value: this.x + 120 + (10 - this.rowLength) * 15,
          duration: 5000,
          ease: 'Power0',
          repeat: -1 }
      },
      yoyo: true,
      onYoyo: () => {
        this.y += 15;
      },
    });
  }

  update(): void {
    if (this.active) {
      this.anims.play(this.enemyType + "Fly", true);

      if (Phaser.Math.RND.between(0, this.reloadTime) === 0) {
        this.bullets.add(
          new Bullet({
            scene: this.scene,
            x: this.x,
            y: this.y,
            key: "bullet",
            bulletProperties: {
              speed: this.bulletSpeed
            }
          })
        );
      }

      if (this.isHurt) {
        this.setTint(0xfc8a75);
        this.setScale(0.8);
        this.setAlpha(0.8);
        if (this.hurtingTime > 0) {
          this.hurtingTime -= 10;
        } else {
          this.setTint(this.enemyTint);
          this.setScale(1);
          this.setAlpha(1);
          this.isHurt = false;
          this.hurtingTime = 200;
        }
      }
    } else {
      this.anims.play(this.enemyType + "Dead");

      if (this.dyingTime > 0) {
        this.dyingTime -= 10;
      } else {
        this.addPoints();
        this.destroy();
      }
    }
  }

  public gotHurt(): void {
    this.lives -= 1;
    if (this.lives === 0) {
      this.setActive(false);
    } else {
      this.isHurt = true;
    }
  }

  private addPoints(): void {
    let getCurrentPoints = this.scene.registry.get("points");
    this.scene.registry.set("points", getCurrentPoints + this.valueKill);
    this.scene.events.emit("pointsChanged");
  }
}
