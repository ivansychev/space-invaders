export class MenuScene extends Phaser.Scene {
  private startKey: Phaser.Input.Keyboard.Key;
  private startKey_Endless: Phaser.Input.Keyboard.Key;
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

    this.startKey_Endless = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.R
    );

    this.startKey.isDown = false;
    this.initRegistry();
  }

  create(): void {
      this.bitmapTexts.push(
          this.add.bitmapText(
              this.sys.canvas.width / 2 - 75,
              35,
              "font",
              this.registry.get("score").title ? `${this.registry.get("score").title}: ${this.registry.get("score").value}` : "",
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
              this.sys.canvas.height - 50,
              "font",
              "PRESS S TO PLAY",
              10
          )
      );

      this.bitmapTexts.push(
          this.add.bitmapText(
              this.sys.canvas.width / 2 - 100,
              this.sys.canvas.height - 20,
              "font",
              "*PRESS R FOR ENDLESS MODE",
              8
        )
    );

    this.bitmapTexts[3].tint = 0xde4747;
    this.blinkMenu(1000, 500);
  }

  update(): void {
      if (this.startKey.isDown) {
          clearTimeout(this.interval);
          this.bitmapTexts = [];
          this.scene.start("HUDScene");
          this.scene.start("GameScene");
          this.scene.bringToTop("HUDScene");
          this.scene.stop("MenuScene")
      }

      if (this.startKey_Endless.isDown) {
          clearTimeout(this.interval);
          this.bitmapTexts = [];
          this.registry.set("endless", "*endless mode");
          this.registry.set("rockets", "rockets: ");
          this.registry.set("ammo", 3);
          this.scene.start("HUDScene");
          this.scene.start("EndlessScene");
          this.scene.bringToTop("HUDScene");
          this.scene.stop("MenuScene")
      }
  }

  private blinkMenu(timeout, alt): void {
      this.interval = setTimeout(()=>{
          this.bitmapTexts[2].text ? this.bitmapTexts[2].setText("") : this.bitmapTexts[2].setText("PRESS S TO PLAY");
          this.bitmapTexts[3].text ? this.bitmapTexts[3].setText("") : this.bitmapTexts[3].setText("*PRESS R FOR ENDLESS MODE");
          this.blinkMenu(alt, timeout);
      },timeout)
  }

  /**
   * Build-in global game data manager to exchange data between scenes.
   * Here we initialize our variables with a key.
   */
  private initRegistry(): void {
      this.registry.set("rockets", "");
      this.registry.set("ammo", "");
      this.registry.set("endless", "");
      this.registry.set("points", 0);
      this.registry.set("lives", 3);
      this.registry.set("level", 1);
  }
}
