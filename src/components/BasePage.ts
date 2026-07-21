class BasePage extends qx.ui.container.Composite {
  protected __responsiveWidth = 0;
  protected __responsiveHeight = 0;
  protected __halfResponsiveWidth = 0;
  protected __halfResponsiveHeight = 0;

  constructor() {
    super();
    this.setPadding(10);
    this.__refreshResponsiveValues();
    qx.event.Registration.addListener(window, "resize", this._onResize, this);

    console.log("BasePage initialized with responsive width:", this.__responsiveWidth, "and height:", this.__responsiveHeight);

    console.log("Half responsive width:", this.__halfResponsiveWidth, "and half responsive height:", this.__halfResponsiveHeight);
  }

  public getResponsiveWidth(): number {
    return this.__responsiveWidth;
  }

  public getResponsiveHeight(): number {
    return this.__responsiveHeight;
  }

  public getHalfResponsiveWidth(): number {
    return this.__halfResponsiveWidth;
  }

  public getHalfResponsiveHeight(): number {
    return this.__halfResponsiveHeight;
  }

  /**
   * Called on window resize. Subclasses can override this to update their layouts.
   * Remember to call super._onResize() in the override.
   */
  protected _onResize(): void {
    this.__refreshResponsiveValues();
  }

  private __refreshResponsiveValues(): void {
    this.__responsiveWidth = qx.bom.Viewport.getWidth();
    this.__responsiveHeight = qx.bom.Viewport.getHeight();
    this.__halfResponsiveWidth = this.__responsiveWidth / 2;
    this.__halfResponsiveHeight = this.__responsiveHeight / 2;
  }

  protected __isMobile(): boolean {
    console.log("Checking if mobile. Current responsive width:", this.__responsiveWidth);
    return this.__responsiveWidth < 768;
  }
}