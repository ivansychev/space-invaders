export class HUDScene extends Phaser.Scene {
  private bitmapTexts: Phaser.GameObjects.BitmapText[];
  private ammoProgress: Phaser.GameObjects.Graphics;
  private ammoRefillTimeout: NodeJS.Timeout;
  private ammoNeedsRefill: boolean = false;

  constructor() {
    super({
      key: "HUDScene"
    });
  }

  init(): void {
    this.bitmapTexts = [];
  }

  create(): void {

    this.bitmapTexts.push(
      this.add.bitmapText(
        10,
        this.scene.systems.canvas.height - 20,
        "font",
        `Lives: ${this.registry.get("lives")}`,
        8
      )
    );

    this.bitmapTexts.push(
      this.add.bitmapText(
        10,
        10,
        "font",
        `Points: ${this.registry.get("points")}`,
        8
      )
    );

    this.bitmapTexts.push(
        this.add.bitmapText(
            10,
            20,
            "font",
            this.registry.get("endless"),
            6
        )
    );

    this.bitmapTexts.push(
        this.add.bitmapText(
            this.scene.systems.canvas.width - 120,
            this.scene.systems.canvas.height - 20,
            "font",
            `${this.registry.get("rockets")}${this.registry.get("ammo")}`,
            8
        )
    );

    this.bitmapTexts[2].tint = 0xde4747;

    // create events
    const level = this.scene.get("GameScene");
    level.events.on("pointsChanged", this.updatePoints, this);
    level.events.on("livesChanged", this.updateLives, this);

    const endless = this.scene.get("EndlessScene");
    endless.events.on("pointsChanged", this.updatePoints, this);
    endless.events.on("livesChanged", this.updateLives, this);
    endless.events.on("ammoChanged", this.updateAmmo, this);

    this.ammoProgress = this.add.graphics();
  }

  private updatePoints() {
    this.bitmapTexts[1].setText(`Points: ${this.registry.get("points")}`);
  }

  private updateLives() {
    this.bitmapTexts[0].setText(`Lives: ${this.registry.get("lives")}`);
  }

  private updateAmmo() {
    if(this.registry.get("ammo") < 3){
      this.ammoNeedsRefill = true;
    }
    this.bitmapTexts[3].setText(`${this.registry.get("rockets")}${this.registry.get("ammo")}`);
  }

  update(): void{
    if(this.ammoNeedsRefill){
      this.ammoNeedsRefill = false;
      this.refillAmmo(10)
    }
  }

  private refillAmmo(seconds): void {
    this.ammoRefillTimeout = setTimeout(()=>{
      console.log(seconds)
      this.ammoProgress.fillRect(
          this.scene.systems.canvas.width - 117,
          this.scene.systems.canvas.height - 10,
          100 * ((10 - seconds + 1)/10), 1);

      if(seconds <= 1){
        this.ammoProgress.fillRect(
            this.scene.systems.canvas.width - 117,
            this.scene.systems.canvas.height - 10,
            100 * ((10 - seconds + 1)/10), 1);
        clearTimeout(this.ammoRefillTimeout)
      }else{
        this.refillAmmo(seconds - 1)
      }
    },1000)
  }
}
