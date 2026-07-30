class BsSidebarAccount extends qx.ui.basic.Atom {
  static events = {
    action: "qx.event.type.Data",
  };

  private __htmlButton: qx.ui.embed.Html;
  private __name: string;
  private __username: string;
  private __avatarSrc: string;
  private __avatarFallback: string;
  private __className: string;
  private __collapsed = false;
  private __buttonEl: HTMLButtonElement | null = null;
  private __avatarEl: HTMLImageElement | null = null;
  private __avatarFallbackEl: HTMLSpanElement | null = null;
  private __hasImageError = false;
  private __isMenuOpen = false;
  private __outsideClickHandler: ((ev: MouseEvent) => void) | null = null;
  private __rootClickHandler: ((ev: MouseEvent) => void) | null = null;
  private __boundRootEl: HTMLElement | null = null;
  private __chevronUpDownIcon: InlineSvgIcon;
  private __chevronUpDownHTML: string;
  private __menuPopup: qx.ui.popup.Popup;
  private __menuContainer: qx.ui.container.Composite;
  private __menuAnimToken = 0;
  private __resizeObserver: ResizeObserver | null = null;

  constructor(
    name?: string,
    username?: string,
    avatarSrc?: string,
    avatarFallback?: string,
    className?: string,
  ) {
    super();

    this._setLayout(new qx.ui.layout.Grow());
    this.setAllowGrowX(true);

    this.__htmlButton = new qx.ui.embed.Html("");
    this.__htmlButton.setAllowGrowX(true);

    this.__menuPopup = new qx.ui.popup.Popup(new qx.ui.layout.Grow());
    this.__menuPopup.setAutoHide(false);
    this.__menuPopup.setDomMove(true);
    this.__menuPopup.setZIndex(100000);
    this.__menuPopup.setAllowGrowX(false);
    this.__menuPopup.setAllowGrowY(true);
    this.__menuPopup.setPadding(0);
    this.__menuPopup.setBackgroundColor("transparent");
    this.__menuPopup.setDecorator(
      new qx.ui.decoration.Decorator().set({
        width: 1,
        style: "solid",
        color: AppColors.border(),
        radius: 10,
        shadowVerticalLength: 2,
        shadowBlurRadius: 10,
        shadowColor: AppColors.overlay(0.1),
      }),
    );

    this.__menuContainer = new qx.ui.container.Composite(
      new qx.ui.layout.VBox(0),
    );
    this.__menuContainer.set({
      minWidth: 180,
      padding: 4,
      backgroundColor: AppColors.sidebar(),
      textColor: AppColors.foreground(),
    });
    this.__menuPopup.add(this.__menuContainer);
    this.__buildMenuWidgets();

    this.__chevronUpDownIcon = new InlineSvgIcon("chevrons-up-down", 16);
    this.__chevronUpDownHTML = this.__chevronUpDownIcon.getHtml();
    this.__chevronUpDownIcon.addListener("changeHtml", () => {
      this.__chevronUpDownHTML = this.__chevronUpDownIcon.getHtml();
      this.__renderButton();
    });

    this.__name = name ?? "";
    this.__username = username ?? "";
    this.__avatarSrc = avatarSrc ?? "";
    this.__avatarFallback = avatarFallback ?? "";
    this.__className = className ?? "";

    this.__renderButton();
    this._add(this.__htmlButton);

    this.__htmlButton.addListener("appear", () => {
      this.__bindNativeButton();
      this.__setupResizeObserver();
    });

    this.__menuPopup.addListener("disappear", () => {
      if (!this.__isMenuOpen) return;
      this.__isMenuOpen = false;
      this.__renderButton();
    });

    this.addListener("disappear", () => {
      this.__isMenuOpen = false;
      this.__unbindOutsideClick();
      this.__unbindNativeButton();
      this.__menuPopup.hide();
      this.__renderButton();
    });
  }

  private __bindNativeButton(): void {
    const root = this.__htmlButton.getContentElement().getDomElement();
    if (!root) return;

    if (this.__boundRootEl !== root) {
      this.__unbindNativeButton();
      this.__rootClickHandler = (ev: MouseEvent) => {
        const target = ev.target as Element | null;
        if (!target) return;
        const trigger = target.closest("[data-account-trigger]");
        if (!trigger) return;

        ev.preventDefault();
        ev.stopPropagation();
        this.__toggleMenu();
      };
      root.addEventListener("click", this.__rootClickHandler);
      this.__boundRootEl = root;
    }

    const btn = root?.querySelector("[data-account-trigger]") ?? null;
    this.__buttonEl = btn as HTMLButtonElement | null;
    if (!this.__buttonEl) return;

    this.__avatarEl =
      (root?.querySelector("img") as HTMLImageElement | null) ?? null;
    this.__avatarFallbackEl =
      (root?.querySelector(
        "[data-avatar-fallback]",
      ) as HTMLSpanElement | null) ?? null;

    if (this.__avatarEl) {
      this.__avatarEl.onerror = () => {
        this.__hasImageError = true;
        this.__syncAvatarFallback();
      };

      this.__avatarEl.onload = () => {
        this.__hasImageError = false;
        this.__syncAvatarFallback();
      };
    }

    this.__syncAvatarFallback();
  }

  private __unbindNativeButton(): void {
    if (this.__boundRootEl && this.__rootClickHandler) {
      this.__boundRootEl.removeEventListener("click", this.__rootClickHandler);
    }
    this.__boundRootEl = null;
    this.__rootClickHandler = null;
  }

  private __toggleMenu(): void {
    if (this.__isMenuOpen) {
      this.__closeMenu();
      return;
    }
    this.__openMenu();
  }

  private __closeMenu(): void {
    if (!this.__isMenuOpen) return;
    this.__isMenuOpen = false;
    this.__unbindOutsideClick();
    const token = ++this.__menuAnimToken;
    this.__setPopupAnimationStyles({
      opacity: "0",
      transform: "translateY(-4px) scale(0.98)",
      transition: "opacity 100ms ease, transform 120ms ease",
      pointerEvents: "none",
    });
    qx.event.Timer.once(
      () => {
        if (token !== this.__menuAnimToken) return;
        this.__menuPopup.hide();
        this.__renderButton();
      },
      this,
      120,
    );
  }

  private __openMenu(): void {
    const token = ++this.__menuAnimToken;

    if (!this.__collapsed) {
      const triggerRoot = this.__htmlButton.getContentElement().getDomElement();
      const triggerEl = triggerRoot?.querySelector("[data-account-trigger]") as HTMLButtonElement | null;
      if (triggerEl) {
        (this.__menuPopup as any).setWidth(triggerEl.offsetWidth);
      }
    } else {
      (this.__menuPopup as any).setWidth(Math.round(window.innerWidth / 2 + 40));
    }

    this.__menuPopup.show();
    this.__isMenuOpen = true;
    this.__renderButton();
    this.__bindOutsideClick();
    this.__placeMenuPopup();
    this.__setPopupAnimationStyles({
      opacity: "0",
      transform: "translateY(-6px) scale(0.985)",
      transition:
        "opacity 120ms ease, transform 140ms cubic-bezier(0.16, 1, 0.3, 1)",
      pointerEvents: "auto",
      transformOrigin: this.__collapsed ? "top right" : "top left",
    });
    qx.event.Timer.once(
      () => {
        if (token !== this.__menuAnimToken) return;
        this.__placeMenuPopup();
        this.__setPopupAnimationStyles({
          opacity: "1",
          transform: "translateY(0) scale(1)",
        });
      },
      this,
      0,
    );
  }

  private __setPopupAnimationStyles(styles: Record<string, string>): void {
    const popupElement = this.__menuPopup.getContentElement() as any;
    if (!popupElement?.setStyle) return;
    for (const key in styles) {
      if (!Object.prototype.hasOwnProperty.call(styles, key)) continue;
      popupElement.setStyle(key, styles[key]);
    }
  }

  private __bindOutsideClick(): void {
    if (this.__outsideClickHandler) return;

    this.__outsideClickHandler = (ev: MouseEvent) => {
      const target = ev.target as Node | null;
      if (!target) return;

      const triggerRoot = this.__htmlButton.getContentElement().getDomElement();
      const popupRoot = this.__menuPopup.getContentElement().getDomElement();
      const clickedTrigger = !!triggerRoot && triggerRoot.contains(target);
      const clickedPopup = !!popupRoot && popupRoot.contains(target);
      if (!clickedTrigger && !clickedPopup) this.__closeMenu();
    };

    document.addEventListener("mousedown", this.__outsideClickHandler, true);
  }

  private __unbindOutsideClick(): void {
    if (!this.__outsideClickHandler) return;
    document.removeEventListener("mousedown", this.__outsideClickHandler, true);
    this.__outsideClickHandler = null;
  }

  private __placeMenuPopup(): void {
    const triggerRoot = this.__htmlButton.getContentElement().getDomElement();
    const triggerEl =
      (triggerRoot?.querySelector(
        "[data-account-trigger]",
      ) as HTMLButtonElement | null) ?? null;
    if (!triggerEl) return;

    const triggerRect = triggerEl.getBoundingClientRect();
    const popupEl = this.__menuPopup.getContentElement().getDomElement();
    if (!popupEl) return;

    const popupRect = popupEl.getBoundingClientRect();
    const gap = 6;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left: number;
    let top: number;

    if (this.__collapsed) {
      const preferredLeft = Math.round(triggerRect.right - popupRect.width);
      left = Math.min(
        Math.max(8, preferredLeft),
        Math.max(8, viewportWidth - popupRect.width - 8),
      );
      const preferredTop = Math.round(triggerRect.bottom + gap);
      top = Math.min(
        Math.max(8, preferredTop),
        Math.max(8, viewportHeight - popupRect.height - 8),
      );
    } else {
      const preferredLeft = Math.round(triggerRect.left);
      left = Math.min(
        Math.max(8, preferredLeft),
        Math.max(8, viewportWidth - popupRect.width - 8),
      );

      const preferredTop = Math.round(triggerRect.top - popupRect.height - gap);
      const fallbackTop = Math.round(triggerRect.bottom + gap);
      const hasSpaceAbove = preferredTop >= 8;
      top = hasSpaceAbove
        ? preferredTop
        : Math.min(
            Math.max(8, fallbackTop),
            Math.max(8, viewportHeight - popupRect.height - 8),
          );
    }

    this.__menuPopup.moveTo(left, top);
  }

  private __buildMenuWidgets(): void {
    this.__menuContainer.add(
      this.__createMenuButton(
        "Change Password",
        new InlineSvgIcon("lock", 16),
        "change-password",
      ),
    );
    this.__menuContainer.add(
      this.__createMenuButton(
        "Multi-Factor Authentication",
        new InlineSvgIcon("shield", 16),
        "multi-factor-auth",
      ),
    );

    const separator = new qx.ui.core.Widget();
    separator.set({
      height: 1,
      marginTop: 4,
      marginBottom: 4,
      backgroundColor: AppColors.border(),
    });
    this.__menuContainer.add(separator);

    this.__menuContainer.add(
      this.__createMenuButton(
        "Log out",
        new InlineSvgIcon("log-out", 16),
        "logout-account",
      ),
    );
  }

  private __createMenuButton(
    label: string,
    icon: InlineSvgIcon,
    action: string,
  ): BsSidebarButton {
    const button = new BsSidebarButton(`${label}`, icon, "btn-sm-outline");
    button.setAllowGrowX(true);
    button.setHeight(40);

    button.onClick(() => {
      this.__closeMenu();

      if (action === "change-password") {
        showChangePasswordDialog();
        return;
      }
      if (action === "multi-factor-auth") {
        showMultiFactorAuthDialog();
        return;
      }

      const normalizedAction = action === "logout-account" ? "logout" : action;
      this.fireDataEvent("action", normalizedAction);
    });

    return button;
  }

  private __syncAvatarFallback(): void {
    if (!this.__avatarFallbackEl) return;
    const shouldShow = !this.__avatarSrc || this.__hasImageError;
    this.__avatarFallbackEl.style.display = shouldShow ? "flex" : "none";
  }

  private __setupResizeObserver(): void {
    const root = this.__htmlButton.getContentElement().getDomElement();
    if (!root) return;

    this.__resizeObserver = new ResizeObserver(() => {
      this.scheduleLayoutUpdate();
    });
    this.__resizeObserver.observe(root);

    this.addListener("disappear", () => {
      this.__resizeObserver?.disconnect();
    });
  }

  private __renderButton(): void {
    const name = HtmlUtils.escapeAttr(this.__name);
    const username = HtmlUtils.escapeAttr(this.__username);
    const avatarSrc = HtmlUtils.escapeAttr(this.__avatarSrc);
    const avatarFallback = HtmlUtils.escapeAttr(this.__avatarFallback);
    const chevronUpDown = this.__chevronUpDownHTML;

    const avatarHtml = `
      <span class="relative inline-flex size-8 shrink-0 rounded-full overflow-hidden border-2 border-sidebar-border">
        <img class="size-full object-cover" alt="${name}" src="${avatarSrc}" />
        <span class="absolute inset-0 hidden items-center justify-center bg-muted text-muted-foreground text-xs font-medium" data-avatar-fallback>
          ${avatarFallback}
        </span>
      </span>
    `;

    const textHtml = this.__collapsed
      ? ""
      : `
      <span class="min-w-0 flex-1 text-left">
        <span class="block truncate text-sm font-medium text-sidebar-foreground leading-tight">${name}</span>
        <span class="block truncate text-xs text-muted-foreground leading-tight">${username}</span>
      </span>
    `;

    const chevronHtml = this.__collapsed
      ? ""
      : `
      <span class="flex flex-col text-muted-foreground leading-none items-center justify-center">
        ${chevronUpDown}
      </span>
    `;

    const classes = [
      "w-full",
      "h-10",
      "flex",
      "items-center",
      "gap-2",
      "rounded-md",
      "btn-sm-ghost",
      this.__collapsed ? "px-0 py-0 justify-center" : "px-0.5 py-1.5 justify-start",
      this.__className,
    ]
      .filter(Boolean)
      .join(" ");

    this.__htmlButton.setHtml(`
      <div class="p-[0.5px] relative" data-account-root data-account-open="${this.__isMenuOpen ? "true" : "false"}">
        <button
          type="button"
          data-account-trigger
          aria-haspopup="menu"
          aria-expanded="${this.__isMenuOpen ? "true" : "false"}"
          class="${classes}"
        >
          ${avatarHtml}
          ${textHtml}
          ${chevronHtml}
        </button>
      </div>
    `);
    this.__bindNativeButton();
  }

  public setCollapsed(collapsed: boolean): this {
    this.__collapsed = collapsed;
    if (collapsed) this.__closeMenu();
    this.__renderButton();
    return this;
  }

  public setName(name: string): this {
    this.__name = name ?? "";
    this.__renderButton();
    return this;
  }

  public setUsername(username: string): this {
    this.__username = username ?? "";
    this.__renderButton();
    return this;
  }

  public setAvatar(src: string, fallback?: string): this {
    this.__avatarSrc = src ?? "";
    this.__hasImageError = false;
    if (typeof fallback === "string") this.__avatarFallback = fallback;
    this.__renderButton();
    return this;
  }

  public onAction(handler: (action: string) => void): this {
    this.addListener("action", (ev: qx.event.type.Data) => {
      handler((ev.getData() as string) ?? "");
    });
    return this;
  }
}
