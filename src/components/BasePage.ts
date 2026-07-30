class BasePage extends qx.ui.container.Composite {
  protected __responsiveWidth = 0;
  protected __responsiveHeight = 0;
  protected __halfResponsiveWidth = 0;
  protected __halfResponsiveHeight = 0;
  private __resizeTimer: number | null = null;

  constructor() {
    super();
    this.setPadding(10);
    this.__refreshResponsiveValues();
    qx.event.Registration.addListener(
      window,
      "resize",
      this.__onWindowResize,
      this,
    );
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

  // Debounce so a window drag doesn't trigger dozens of layout passes.
  private __onWindowResize = (): void => {
    if (this.__resizeTimer !== null) {
      window.clearTimeout(this.__resizeTimer);
    }
    this.__resizeTimer = window.setTimeout(() => {
      this.__resizeTimer = null;
      this._onResize();
    }, 100);
  };

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
    return this.__responsiveWidth < 768;
  }
}