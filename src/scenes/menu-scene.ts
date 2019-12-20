export class MenuScene extends Phaser.Scene {
  private startKey: Phaser.Input.Keyboard.Key;
  private bitmapTexts: Phaser.GameObjects.BitmapText[] = [];
  private interval: NodeJS.Timeout;

  constructor() {
    super({
      key: "MenuScene"
    });
  }

  init(): void {
    this.startKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.S
    );
    this.startKey.isDown = false;
    this.initRegistry();
  }

  create(): void {
   this.bitmapTexts.push(
      this.add.bitmapText(
        this.sys.canvas.width / 2 - 75,
        this.sys.canvas.height - 40,
        "font",
          "PRESS S TO PLAY",
        10
      )
    );

    this.bitmapTexts.push(
      this.add.bitmapText(
        this.sys.canvas.width / 2 - this.registry.get("status").offsetX,
        this.sys.canvas.height / 2 - 10,
        "font",
          this.registry.get("status").title,
        10
      )
    );

    this.bitmapTexts.push(
        this.add.bitmapText(
            this.sys.canvas.width / 2 - 75,
            35,
            "font",
            this.registry.get("score").title ? `${this.registry.get("score").title}: ${this.registry.get("score").value}` : "",
            10
        )
    );

    this.interval = setInterval(()=>{
      this.bitmapTexts[0].text ? this.bitmapTexts[0].setText("") : this.bitmapTexts[0].setText("PRESS S TO PLAY")
    },700)
  }

  update(): void {
    if (this.startKey.isDown) {
      clearInterval(this.interval);
      this.bitmapTexts = [];
      this.scene.start("HUDScene");
      this.scene.start("GameScene");
      this.scene.bringToTop("HUDScene");
      this.scene.stop("MenuScene")
    }
  }

  /**
   * Build-in global game data manager to exchange data between scenes.
   * Here we initialize our variables with a key.
   */
  private initRegistry(): void {
    this.registry.set("points", 0);
    this.registry.set("lives", 3);
    this.registry.set("level", 1);
  }
}
