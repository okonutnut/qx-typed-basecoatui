interface SidebarItem {
  label: string;
  icon?: InlineSvgIcon;
  action?: () => void;
  disabled?: boolean;
  hidden?: boolean;
  accessCode?: string;
  children?: SidebarItem[];
}

class FullscreenLayout extends qx.ui.container.Composite {
  static events = {
    login: "qx.event.type.Data",
  };

  private __config: AppConfig;
  private __card: qx.ui.container.Composite;
  private __loginLogo: qx.ui.basic.Image;
  private __usernameInput: BsInput;
  private __passwordInput: BsPassword;
  private __loginError: qx.ui.basic.Label;
  private __submitBtn: BsButton;
  private __applyBtn: BsButton;
  private __submitting = false;
  private __admissionFormControl: FormControl | null = null;

  constructor(config?: Partial<AppConfig>) {
    super(
      new qx.ui.layout.VBox(12).set({ alignX: "center", alignY: "middle" }),
    );
    this.__config = { ...DEFAULT_APP_CONFIG, ...config };
    this.setBackgroundColor(AppColors.background());

    this.__card = new qx.ui.container.Composite(new qx.ui.layout.VBox(0));
    this.__card.setWidth(350);
    this.__card.setAllowGrowX(false);

    this.__loginLogo = new qx.ui.basic.Image(this.__config.resources.logo);
    this.__loginLogo.setAlignX("center");
    this.__loginLogo.setMarginBottom(20);
    this.__loginLogo.set({
      scale: true,
      width: 64,
      height: 64,
    });
    this.__card.add(this.__loginLogo);

    const title = new qx.ui.basic.Label(this.__config.login.title);
    title.setTextAlign("center");
    title.setAlignX("center");
    title.setAllowGrowX(true);
    title.setFont(
      // @ts-ignore
      new qx.bom.Font(16, ["Inter", "sans-serif"]).set({ bold: true }),
    );
    title.setTextColor(AppColors.foreground());
    title.setMarginBottom(10);
    this.__card.add(title);

    const subTitle = new qx.ui.basic.Label(this.__config.login.subtitle);
    subTitle.setTextAlign("center");
    subTitle.setAlignX("center");
    subTitle.setAllowGrowX(true);
    subTitle.setFont(
      // @ts-ignore
      new qx.bom.Font(12, ["Inter", "sans-serif"]).set({ bold: true }),
    );
    subTitle.setTextColor(AppColors.foreground());
    subTitle.setMarginBottom(30);
    this.__card.add(subTitle);

    this.__usernameInput = new BsInput("", "Username");
    this.__passwordInput = new BsPassword("", "Password");
    this.__card.add(this.__usernameInput);
    this.__card.add(this.__passwordInput);

    this.__loginError = new qx.ui.basic.Label("");
    this.__loginError.setVisibility("excluded");
    this.__loginError.setTextAlign("center");
    this.__loginError.setTextColor(AppColors.destructive());
    this.__loginError.setMarginTop(4);
    this.__card.add(this.__loginError);

    this.__submitBtn = new BsButton("Sign in", undefined, {
      variant: "default",
      className: "w-full",
    });
    this.__submitBtn.setMarginTop(20);
    this.__submitBtn.setAllowGrowX(true);
    this.__card.add(this.__submitBtn);

    this.__submitBtn.onClick(() => this.__doLogin());

    const orLabel = new qx.ui.basic.Label("OR");
    orLabel.setTextAlign("center");
    orLabel.setAllowGrowX(true);
    orLabel.setTextColor(AppColors.mutedForeground());
    orLabel.setMarginTop(12);
    orLabel.setMarginBottom(4);
    this.__card.add(orLabel);

    this.__applyBtn = new BsButton("Apply for Admission", undefined, {
      variant: "outline",
      className: "w-full",
    });
    this.__applyBtn.setAllowGrowX(true);
    this.__card.add(this.__applyBtn);

    this.__applyBtn.onClick(() => this.__showAdmissionForm());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter") return;

      const activeElement = document.activeElement;
      const cardElement = this.__card.getContentElement().getDomElement();
      if (
        !activeElement ||
        !cardElement ||
        !cardElement.contains(activeElement)
      )
        return;

      event.preventDefault();
      this.__doLogin();
    };

    document.addEventListener("keydown", onKeyDown);
    this.addListenerOnce("disappear", () => {
      document.removeEventListener("keydown", onKeyDown);
    });

    this.add(this.__card);
  }

  private async __doLogin(): Promise<void> {
    if (this.__submitting) return;
    this.__submitting = true;
    this.__submitBtn.setEnabled(false);
    this.__loginError.setVisibility("excluded");

    const code = this.__usernameInput.getValue().trim();
    const password = this.__passwordInput.getValue();

    if (!code || !password) {
      this.__loginError.setValue("Enter username and password");
      this.__loginError.setVisibility("visible");
      this.__submitting = false;
      this.__submitBtn.setEnabled(true);
      return;
    }

    try {
      const userData = await loginUser(code, password);
      if (!userData) {
        this.__loginError.setValue("Invalid username or password");
        this.__loginError.setVisibility("visible");
        this.__submitting = false;
        this.__submitBtn.setEnabled(true);
        return;
      }
      this.fireDataEvent("login", userData);
    } catch (err: any) {
      this.__loginError.setValue(err.message ?? "Login failed");
      this.__loginError.setVisibility("visible");
      this.__submitting = false;
      this.__submitBtn.setEnabled(true);
    }
  }

  private __showAdmissionForm(): void {
    this.remove(this.__card);

    const fullscreenRoot = new qx.ui.container.Composite(new qx.ui.layout.VBox(0));
    fullscreenRoot.setBackgroundColor(AppColors.background());

    const header = new qx.ui.container.Composite(new qx.ui.layout.HBox(0).set({
      alignX: "center",
    }));
    header.setPadding(16, 24, 16, 24);
    header.setBackgroundColor(AppColors.card());
    header.setDecorator(
      new qx.ui.decoration.Decorator().set({
        width: [0, 0, 1, 0],
        style: "solid",
        color: AppColors.border(),
      }),
    );

    const headerTitle = new qx.ui.basic.Label("Apply for Admission");
    headerTitle.setFont(
      // @ts-ignore
      new qx.bom.Font(18, ["Inter", "sans-serif"]).set({ bold: true }),
    );
    headerTitle.setTextColor(AppColors.foreground());
    header.add(headerTitle);

    fullscreenRoot.add(header);

    const centerArea = new qx.ui.container.Composite(new qx.ui.layout.VBox(0).set({ alignX: "center" }));
    centerArea.setAllowGrowX(true);

    const formCard = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
    formCard.setPadding(16);
    formCard.setWidth(400);

    const formContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox(12));
    formContainer.setAllowGrowX(true);

    formCard.add(formContainer);
    centerArea.add(formCard);
    fullscreenRoot.add(centerArea, { flex: 1 });

    this.__admissionFormControl = buildAdmissionDataForm(formContainer);

    queryList("Course").then((courses: any[]) => {
      this.__admissionFormControl?.setReferenceData(
        "courses",
        courses.map((c: any) => ({ value: c.id, label: `${c.code} - ${c.name}` })),
      );
    });

    const errLabel = new qx.ui.basic.Label("");
    errLabel.setTextColor(AppColors.destructive());
    errLabel.setVisibility("excluded");
    errLabel.setTextAlign("center");
    fullscreenRoot.add(errLabel);

    const btnRow = new qx.ui.container.Composite(new qx.ui.layout.HBox(12).set({ alignX: "center" }));
    btnRow.setPadding(15);
    btnRow.setAllowGrowX(true);
    btnRow.setDecorator(
      new qx.ui.decoration.Decorator().set({
        width: [1, 0, 0, 0],
        style: "solid",
        color: AppColors.border(),
      }),
    );

    const backBtn = new BsButton("Back to Login", undefined, { variant: "outline", className: "!w-[150px]" });
    const submitBtn = new BsButton("Submit Application", undefined, { variant: "default", className: "!w-[150px]" });

    btnRow.add(backBtn);
    btnRow.add(submitBtn);
    fullscreenRoot.add(btnRow);

    this.add(fullscreenRoot, { flex: 1 });

    backBtn.onClick(() => this.__showLoginForm());

    submitBtn.onClick(async () => {
      if (!this.__admissionFormControl) return;
      submitBtn.setEnabled(false);
      errLabel.setVisibility("excluded");
      try {
        const values = this.__admissionFormControl.getValues();
        await createEntity("AdmissionData", values);
        BsToast.show({
          title: "Success",
          description: "Admission application submitted. An administrator will review your application.",
          category: "success",
        });
        this.__showLoginForm();
      } catch (err: any) {
        errLabel.setValue(err.message ?? "Failed to submit application");
        errLabel.setVisibility("visible");
        submitBtn.setEnabled(true);
      }
    });
  }

  private __showLoginForm(): void {
    this.__admissionFormControl = null;
    this.removeAll();
    this.add(this.__card);

    this.__card.removeAll();

    this.__card.add(this.__loginLogo);
    const title = new qx.ui.basic.Label(this.__config.login.title);
    title.setTextAlign("center");
    title.setAlignX("center");
    title.setAllowGrowX(true);
    title.setFont(
      // @ts-ignore
      new qx.bom.Font(16, ["Inter", "sans-serif"]).set({ bold: true }),
    );
    title.setTextColor(AppColors.foreground());
    this.__card.add(title);

    const subTitle = new qx.ui.basic.Label(this.__config.login.subtitle);
    subTitle.setTextAlign("center");
    subTitle.setAlignX("center");
    subTitle.setAllowGrowX(true);
    subTitle.setFont(
      // @ts-ignore
      new qx.bom.Font(12, ["Inter", "sans-serif"]),
    );
    subTitle.setTextColor(AppColors.foreground());
    subTitle.setMarginBottom(30);
    this.__card.add(subTitle);

    this.__card.add(this.__usernameInput);
    this.__card.add(this.__passwordInput);
    this.__card.add(this.__loginError);
    this.__card.add(this.__submitBtn);

    const orLabel = new qx.ui.basic.Label("OR");
    orLabel.setTextAlign("center");
    orLabel.setAllowGrowX(true);
    orLabel.setTextColor(AppColors.mutedForeground());
    orLabel.setMarginTop(12);
    orLabel.setMarginBottom(4);
    this.__card.add(orLabel);

    this.__card.add(this.__applyBtn);
  }

  setLogo(path: string): void {
    this.__loginLogo.setSource(path);
  }
}

class Sidebar extends qx.ui.container.Composite {
  static events = {
    select: "qx.event.type.Data",
    action: "qx.event.type.Data",
  };

  private __collapsed = false;
  private __drawerMode = false;
  private __schoolLogo: qx.ui.basic.Image;
  private __header: qx.ui.basic.Label;
  private __appVersion: qx.ui.basic.Label;
  private __searchInput: BsInput;
  private __backContainer: qx.ui.container.Composite;
  private __itemsViewport: qx.ui.container.Scroll;
  private __listContainer: qx.ui.container.Composite | null = null;
  private __footer: BsSidebarAccount;
  private __backButton!: BsSidebarButton;
  private __buttons: BsSidebarButton[] = [];
  private __buttonStates = new Map<string, BsSidebarButton>();
  private __rootItems: SidebarItem[];
  private __activeLeafLabel: string | null = null;
  private __searchQuery = "";
  private __isAnimating = false;
  private __hasRendered = false;
  private __stack: Array<{ label: string; items: SidebarItem[] }> = [];
  private __config: AppConfig;

  constructor(
    sidebarItems: SidebarItem[],
    initialActiveLabel?: string,
    config?: Partial<AppConfig>,
  ) {
    super(new qx.ui.layout.VBox(0).set({ alignX: "center" }));
    this.__config = { ...DEFAULT_APP_CONFIG, ...config };

    this.__rootItems = sidebarItems;
    this.__activeLeafLabel =
      initialActiveLabel ?? this.__findFirstLeafLabel(sidebarItems);
    this.setWidth(this.__config.sidebar.width);
    this.setAlignX("center");
    this.setBackgroundColor(AppColors.sidebar());
    this.setDecorator(
      new qx.ui.decoration.Decorator().set({
        widthRight: 1,
        styleRight: "solid",
        colorRight: AppColors.sidebarBorder(),
      }),
    );

    const schoolLogo = new qx.ui.basic.Image(this.__config.resources.logo);
    schoolLogo.set({
      scale: true,
      width: 42,
      height: 42,
    });
    this.__schoolLogo = schoolLogo;
    this.add(schoolLogo);

    const header = new qx.ui.basic.Label(this.__config.appName);
    this.__header = header;
    header.setFont(
      //@ts-ignore
      new qx.bom.Font(12).set({ bold: true }),
    );
    header.setTextAlign("center");
    header.setPadding(5);
    header.setTextColor(AppColors.sidebarForeground());
    this.add(header);

    const appVersion = new qx.ui.basic.Label(this.__config.appVersion);
    this.__appVersion = appVersion;
    appVersion.setTextColor(AppColors.sidebarForeground());
    appVersion.setTextAlign("center");
    appVersion.setOpacity(0.7);
    appVersion.setFont(
      // @ts-ignore
      new qx.bom.Font(10, ["Inter", "sans-serif"]),
    );
    appVersion.setMarginTop(6);
    appVersion.setMarginBottom(12);
    this.add(appVersion);

    this.__searchInput = new BsInput("", "Search pages...", "w-full input-sm");
    this.__searchInput.setLeadingHtml(
      '<img src="' + InlineSvgIcon.iconsBaseUrl + 'search.svg" alt="" width="16" height="16" style="display:block;opacity:0.7" />',
    );
    this.__searchInput.setAllowGrowX(true);
    this.__searchInput.onInput((value) => {
      this.__searchQuery = value.trim();
      this.__renderVisibleItems(false);
    });
    this.__searchInput.setTabIndex(20);
    this.add(this.__searchInput);

    this.__backContainer = new qx.ui.container.Composite(
      new qx.ui.layout.VBox(0),
    );
    this.__backContainer.setAllowGrowX(true);
    const backButton = new BsSidebarButton(
      "Back",
      new InlineSvgIcon("arrow-left", 16),
    );
    backButton.setAllowGrowX(true);
    backButton.setWidth(this.__config.sidebar.width);
    backButton.setCentered(true);
    this.__backButton = backButton;
    backButton.onClick(() => {
      if (this.__stack.length === 0 || this.__isAnimating) return;
      this.__stack.pop();
      this.__renderVisibleItems(true);
    });
    this.__backContainer.add(backButton);
    this.add(this.__backContainer);

    this.__itemsViewport = new qx.ui.container.Scroll();
    this.__itemsViewport.setAllowGrowX(true);
    this.__itemsViewport.setAllowGrowY(true);
    this.__itemsViewport.setMinHeight(10);
    this.add(this.__itemsViewport, { flex: 1 });

    const footer = new BsSidebarAccount(
      this.__config.user.name,
      this.__config.user.role,
      this.__config.resources.userAvatar,
      "RB",
    );
    this.__footer = footer;
    this.__footer.onAction((action) => {
      if (action === "logout" && this.__config.callbacks.onLogout) {
        this.__config.callbacks.onLogout();
        this.fireDataEvent("action", action);
      } else {
        const pageAction = action === "change-password"
          ? "Change Password"
          : action === "multi-factor-auth"
            ? "Multi-Factor Authentication"
            : action;
        this.fireDataEvent("action", pageAction);
      }
    });
    this.add(footer);

    this.__renderVisibleItems(false);
  }

  private __findFirstLeafLabel(items: SidebarItem[]): string | null {
    for (const item of items) {
      if (item.children && item.children.length > 0) {
        const nestedLabel = this.__findFirstLeafLabel(item.children);
        if (nestedLabel) return nestedLabel;
      } else {
        return item.label;
      }
    }
    return null;
  }

  private __getCurrentLevelItems(): SidebarItem[] {
    if (this.__stack.length === 0) return this.__rootItems;
    return this.__stack[this.__stack.length - 1].items;
  }

  private __collectLeafEntries(
    source: SidebarItem[],
    path: string[] = [],
    out: Array<{ item: SidebarItem; path: string[] }> = [],
  ): Array<{ item: SidebarItem; path: string[] }> {
    source.forEach((item) => {
      const nextPath = [...path, item.label];
      if (item.children && item.children.length > 0) {
        this.__collectLeafEntries(item.children, nextPath, out);
      } else {
        out.push({ item, path: nextPath });
      }
    });
    return out;
  }

  private __setPathFromLeaf(path: string[]): void {
    const nextStack: Array<{ label: string; items: SidebarItem[] }> = [];
    let source = this.__rootItems;

    for (let i = 0; i < path.length - 1; i++) {
      const label = path[i];
      const match = source.find((entry) => entry.label === label);
      if (!match || !match.children || match.children.length === 0) break;

      nextStack.push({ label: match.label, items: match.children });
      source = match.children;
    }

    this.__stack = nextStack;
  }

  private __syncBackVisibility(): void {
    const shouldShow =
      !this.__collapsed &&
      this.__searchQuery.length === 0 &&
      this.__stack.length > 0;
    if (shouldShow) {
      const parentLabel = this.__stack[this.__stack.length - 1].label;
      this.__backButton.setText(parentLabel);
      this.__backContainer.show();
    } else {
      this.__backContainer.exclude();
    }
  }

  private __renderVisibleItems(animated: boolean): void {
    this.__syncBackVisibility();

    const nextList = new qx.ui.container.Composite(new qx.ui.layout.VBox(0));
    nextList.setAllowGrowX(true);

    this.__buttons = [];
    this.__buttonStates.clear();

    if (this.__searchQuery.length > 0) {
      const query = this.__searchQuery.toLowerCase();
      const matches = this.__collectLeafEntries(this.__rootItems).filter(
        ({ item, path }) => {
          const haystack = `${path.join(" ")} ${item.label}`.toLowerCase();
          return haystack.includes(query);
        },
      );

      matches.forEach(({ item, path }) => {
        const parentTrail = path.slice(0, path.length - 1).join(" / ");
        const displayLabel = parentTrail
          ? `${item.label} - ${parentTrail}`
          : item.label;
        const row = this.__createListRow();
        const button = this.__createSidebarButton(
          displayLabel,
          item.icon,
          false,
        );

        if (item.disabled) {
          button.setEnabled(false);
        } else if (item.action) {
          button.onClick(() => {
            item.action!();
          });
        } else {
          button.onClick(() => {
            this.__activeLeafLabel = item.label;
            this.__searchQuery = "";
            this.__searchInput.setValue("");
            this.__setPathFromLeaf(path);
            this.fireDataEvent("select", item.label);
            this.__renderVisibleItems(false);
          });
        }

        row.add(button, { flex: 1 });
        nextList.add(row);
      });
    } else {
      const currentItems = this.__getCurrentLevelItems();

      currentItems.forEach((item) => {
        const hasChildren = !!item.children && item.children.length > 0;
        const row = this.__createListRow();
        const button = this.__createSidebarButton(
          item.label,
          item.icon,
          hasChildren,
        );

        if (item.disabled) {
          button.setEnabled(false);
        } else if (hasChildren) {
          button.onClick(() => {
            if (this.__isAnimating || !item.children) return;
            this.__stack.push({ label: item.label, items: item.children });
            this.__renderVisibleItems(true);
          });
        } else if (item.action) {
          button.onClick(() => {
            item.action!();
          });
        } else {
          button.setActive(item.label === this.__activeLeafLabel);
          button.onClick(() => {
            this.__activeLeafLabel = item.label;
            this.fireDataEvent("select", item.label);
            this.__buttonStates.forEach((entry, label) => {
              entry.setActive(label === item.label);
            });
          });
        }

        row.add(button, { flex: 1 });
        nextList.add(row);
      });
    }

    if (!this.__listContainer || !animated || this.__collapsed) {
      this.__itemsViewport.getChildren().slice().forEach((c: any) => this.__itemsViewport.remove(c))
      this.__itemsViewport.add(nextList);
      this.__listContainer = nextList;
      return;
    }

    const previousList = this.__listContainer;
    this.__isAnimating = true;

    const wrapper = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
    wrapper.setAllowGrowX(true);
    wrapper.setAllowGrowY(true);

    this.__itemsViewport.getChildren().slice().forEach((c: any) => this.__itemsViewport.remove(c))
    this.__itemsViewport.add(wrapper);
    wrapper.add(previousList);
    wrapper.add(nextList);

    this.__setDomStyles(nextList, {
      position: "absolute",
      top: "0",
      left: "0",
      right: "0",
      opacity: "0",
      transform: "translateX(30px)",
      transition:
        "opacity 280ms cubic-bezier(0.4, 0, 0.2, 1), transform 280ms cubic-bezier(0.4, 0, 0.2, 1)",
    });
    this.__setDomStyles(previousList, {
      position: "absolute",
      top: "0",
      left: "0",
      right: "0",
      opacity: "1",
      transform: "translateX(0px)",
      transition:
        "opacity 280ms cubic-bezier(0.4, 0, 0.2, 1), transform 280ms cubic-bezier(0.4, 0, 0.2, 1)",
    });

    qx.event.Timer.once(
      () => {
        this.__setDomStyles(previousList, {
          opacity: "0",
          transform: "translateX(-30px)",
        });
        this.__setDomStyles(nextList, {
          opacity: "1",
          transform: "translateX(0px)",
        });
      },
      this,
      20,
    );

    qx.event.Timer.once(
      () => {
        this.__setDomStyles(nextList, {
          position: "relative",
          transform: "none",
        });
        this.__itemsViewport.getChildren().slice().forEach((c: any) => this.__itemsViewport.remove(c))
        this.__itemsViewport.add(nextList);
        wrapper.dispose();
        this.__listContainer = nextList;
        this.__isAnimating = false;
      },
      this,
      320,
    );
  }

  private __createListRow(): qx.ui.container.Composite {
    const row = new qx.ui.container.Composite(
      new qx.ui.layout.HBox().set({ alignY: "middle" }),
    );
    row.set({
      allowGrowX: true,
      height: 40,
    });
    return row;
  }

  private __createSidebarButton(
    label: string,
    icon: InlineSvgIcon | undefined,
    hasChildren: boolean,
    className?: string,
  ): BsSidebarButton {
    const button = new BsSidebarButton(label, icon, className);
    button.setAllowGrowX(true);
    button.setCollapsed(this.__collapsed);
    button.setWidth(this.__collapsed ? this.__config.sidebar.collapsedWidth : this.__config.sidebar.width);
    if (hasChildren) {
      button.setTrailingHtml("&rsaquo;");
    }

    this.__buttons.push(button);
    this.__buttonStates.set(label, button);
    return button;
  }

  private __setDomStyles(
    widget: qx.ui.core.Widget,
    styles: Record<string, string>,
  ): void {
    const contentElement = widget.getContentElement() as any;
    if (!contentElement || !contentElement.setStyle) return;
    for (const key in styles) {
      if (!Object.prototype.hasOwnProperty.call(styles, key)) continue;
      contentElement.setStyle(key, styles[key]);
    }
  }

  public setCollapsed(collapsed: boolean): void {
    this.__collapsed = collapsed;
    const DURATION = 280;
    const EASING = "cubic-bezier(0.4, 0, 0.2, 1)";
    const skipAnimation = !this.__hasRendered;
    this.__hasRendered = true;

    const w = this.__config.sidebar.width;
    const startWidth = collapsed ? w : 0;
    const endWidth = collapsed ? 0 : w;
    const startOpacity = collapsed ? "1" : "0";
    const endOpacity = collapsed ? "0" : "1";

    this.__footer.setCollapsed(collapsed);

    if (skipAnimation) {
      this.setWidth(endWidth);
      this.setMinWidth(endWidth);
      this.__setDomStyles(this, {
        overflow: collapsed ? "hidden" : "visible",
        opacity: endOpacity,
      });
      this.show();
      if (!collapsed) this.__applyChromeMode();
      return;
    }

    this.setWidth(startWidth);
    this.setMinWidth(startWidth);
    this.__setDomStyles(this, {
      overflow: "hidden",
      willChange: "width, opacity",
      transition: "none",
      width: startWidth + "px",
      opacity: startOpacity,
    });
    if (!collapsed) this.show();

    requestAnimationFrame(() => {
      this.__setDomStyles(this, {
        transition: `width ${DURATION}ms ${EASING}, opacity ${DURATION}ms ${EASING}`,
        width: endWidth + "px",
        opacity: endOpacity,
      });

      qx.event.Timer.once(() => {
        this.setWidth(endWidth);
        this.setMinWidth(endWidth);
        this.__setDomStyles(this, {
          overflow: collapsed ? "hidden" : "visible",
          transition: "none",
          willChange: "auto",
        });
        if (!collapsed) this.__applyChromeMode();
      }, this, DURATION + 20);
    });
  }

  public setDrawerMode(enabled: boolean): void {
    this.__drawerMode = enabled;
    if (this.__collapsed) return;
    this.__applyChromeMode();
    this.__renderVisibleItems(false);
  }

  private __applyChromeMode(): void {
    if (this.__drawerMode) {
      this.setPadding(8, 0, 8, 8);
      this.setDecorator(
        new qx.ui.decoration.Decorator().set({
          widthRight: 0,
        }),
      );
      this.__schoolLogo.exclude();
      this.__header.exclude();
      this.__appVersion.exclude();
      this.__footer.exclude();
      this.__searchInput.show();
      this.__syncBackVisibility();
      return;
    }

    this.setPadding(5, 5, 0, 10);
    this.setDecorator(
      new qx.ui.decoration.Decorator().set({
        widthRight: 1,
        styleRight: "solid",
        colorRight: AppColors.sidebarBorder(),
      }),
    );
    this.__schoolLogo.show();
    this.__header.show();
    this.__appVersion.show();
    this.__footer.show();
    this.__searchInput.show();
    this.__syncBackVisibility();
  }

  public isCollapsed(): boolean {
    return this.__collapsed;
  }

  setLogo(path: string): void {
    this.__schoolLogo.setSource(path);
  }
}

class Navbar extends qx.ui.container.Composite {
  static events = {
    toggleSidebar: "qx.event.type.Event",
    action: "qx.event.type.Data",
  };

  private __titleLabel: qx.ui.basic.Label;
  private __actionsPopup: qx.ui.popup.Popup;
  private __isActionsOpen = false;
  private __config: AppConfig;

  constructor(
    pageTitle?: string,
    onToggleSidebar?: () => void,
    config?: Partial<AppConfig>,
  ) {
    super(new qx.ui.layout.HBox(2));
    this.__config = { ...DEFAULT_APP_CONFIG, ...config };
    this.setAlignY("middle");
    this.setPadding(8);
    this.setHeight(55);
    this.setBackgroundColor(AppColors.background());
    this.setDecorator(
      new qx.ui.decoration.Decorator().set({
        widthBottom: 1,
        styleBottom: "solid",
        colorBottom: AppColors.border(),
      }),
    );

    // SIDEBAR TRIGGER
    const collapseSidebarBtn = new BsButton("", new InlineSvgIcon("menu", 16), {
      size: "sm-icon",
      variant: "ghost",
      className: "!w-[50px]"
    });
    collapseSidebarBtn.setWidth(50);
    collapseSidebarBtn.onClick(() => {
      this.fireEvent("toggleSidebar");
      if (onToggleSidebar) onToggleSidebar();
    });
    this.add(collapseSidebarBtn);

    // PAGE TITLE
    this.__titleLabel = new qx.ui.basic.Label(pageTitle ?? "Dashboard");
    this.__titleLabel.setTextColor(AppColors.foreground());
    this.__titleLabel.setFont(
      // @ts-ignore
      new qx.bom.Font(18).set({ bold: true }),
    );
    this.__titleLabel.setAlignY("middle");
    this.add(this.__titleLabel);

    const spacer = new qx.ui.core.Spacer();
    this.add(spacer, { flex: 1 });

    // OTHER ACTIONS
    const otherActionsBtn = new BsButton("", new InlineSvgIcon("ellipsis", 8), {
      size: "sm-icon",
      variant: "ghost",
      className: "!w-[50px]"
    });
    otherActionsBtn.setWidth(50);
    otherActionsBtn.onClick(() => this.__toggleActionsPopup(otherActionsBtn));
    this.add(otherActionsBtn);

    this.__actionsPopup = new qx.ui.popup.Popup(new qx.ui.layout.Grow());
    this.__actionsPopup.setAutoHide(true);
    this.__actionsPopup.setDomMove(true);
    this.__actionsPopup.setZIndex(100000);
    this.__actionsPopup.setAllowGrowX(false);
    this.__actionsPopup.setAllowGrowY(true);
    this.__actionsPopup.setPadding(0);
    this.__actionsPopup.setBackgroundColor("transparent");
    this.__actionsPopup.setDecorator(
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

    const actionsMenu = new qx.ui.container.Composite(new qx.ui.layout.VBox(0));
    actionsMenu.set({
      minWidth: 160,
      padding: 2,
      backgroundColor: AppColors.background(),
      textColor: AppColors.foreground(),
    });

    actionsMenu.add(
      this.__createActionsMenuButton(
        "Change Log",
        new InlineSvgIcon("file-text", 16),
        "change-log",
      ),
    );
    actionsMenu.add(
      this.__createActionsMenuButton(
        "Support",
        new InlineSvgIcon("help-circle", 16),
        "support",
      ),
    );
    actionsMenu.add(
      this.__createActionsMenuButton(
        "About",
        new InlineSvgIcon("info", 16),
        "show-about-dialog",
      ),
    );
    this.addListener("action", (ev: qx.event.type.Data) => {
      const action = ev.getData() as string;
      if (action === "change-log" && this.__config.callbacks.onChangeLog) {
        this.__config.callbacks.onChangeLog();
      } else if (action === "support" && this.__config.callbacks.onSupport) {
        this.__config.callbacks.onSupport();
      } else if (action === "show-about-dialog" && this.__config.callbacks.onAbout) {
        this.__config.callbacks.onAbout();
      }
    });

    this.__actionsPopup.add(actionsMenu);

    this.__actionsPopup.addListener("disappear", () => {
      this.__isActionsOpen = false;
    });

    this.addListenerOnce("disappear", () => {
      this.__actionsPopup.hide();
    });
  }

  private __createActionsMenuButton(
    label: string,
    icon: InlineSvgIcon,
    action: string,
  ): BsSidebarButton {
    const button = new BsSidebarButton(label, icon, "btn-sm-outline");
    button.setAllowGrowX(true);
    button.setHeight(40);
    button.onClick(() => {
      this.fireDataEvent("action", action);
      this.__closeActionsPopup();
    });
    return button;
  }

  private __toggleActionsPopup(target: qx.ui.core.Widget): void {
    if (this.__isActionsOpen) {
      this.__closeActionsPopup();
      return;
    }

    this.__actionsPopup.show();
    this.__isActionsOpen = true;
    this.__actionsPopup.placeToWidget(target, true);
    qx.event.Timer.once(
      () => this.__actionsPopup.placeToWidget(target, true),
      this,
      0,
    );
  }

  private __closeActionsPopup(): void {
    if (!this.__isActionsOpen) return;
    this.__isActionsOpen = false;
    this.__actionsPopup.hide();
  }

  public setPageTitle(value: string): void {
    this.__titleLabel.setValue(value);
  }

  public setTitle(value: string): void {
    this.setPageTitle(value);
  }
}

class MainLayout extends qx.ui.container.Composite {
  static events = {
    logout: "qx.event.type.Event",
  };

  private __sidebar: Sidebar;
  private __mobileSchoolLogo: qx.ui.basic.Image;

  constructor(
    content: qx.ui.core.Widget,
    sidebarItems: SidebarItem[],
    pageMap: Map<string, () => qx.ui.core.Widget>,
    pageTitle?: string,
    config?: Partial<AppConfig>,
  ) {
    super();
    this.setLayout(new qx.ui.layout.Grow());
    this.setBackgroundColor(AppColors.background());

    const cfg = { ...DEFAULT_APP_CONFIG, ...config };
    InlineSvgIcon.iconsBaseUrl = cfg.resources.iconsBaseUrl;

    const MOBILE_BREAKPOINT = 768;
    let isSidebarCollapsed = false;
    let isMobileMode = qx.bom.Viewport.getWidth() < MOBILE_BREAKPOINT;
    let sidebarDrawer: BsDrawer | null = null;

    this.__sidebar = new Sidebar(sidebarItems, pageTitle, cfg);

    const contentContainer = new qx.ui.container.Composite(
      new qx.ui.layout.VBox(),
    );
    contentContainer.setBackgroundColor(AppColors.background());

    const mobileTopBar = new qx.ui.container.Composite(
      new qx.ui.layout.HBox().set({ alignY: "middle" }),
    );
    mobileTopBar.set({
      paddingTop: 8,
      paddingRight: 6,
      paddingBottom: 8,
      paddingLeft: 10,
      minHeight: 48,
      backgroundColor: AppColors.background(),
    });
    mobileTopBar.setDecorator(
      new qx.ui.decoration.Decorator().set({
        widthBottom: 1,
        styleBottom: "solid",
        colorBottom: AppColors.border(),
      }),
    );

    this.__mobileSchoolLogo = new qx.ui.basic.Image(cfg.resources.logo);
    this.__mobileSchoolLogo.set({
      scale: true,
      width: 32,
      height: 32,
    });
    mobileTopBar.add(this.__mobileSchoolLogo);
    mobileTopBar.add(new qx.ui.core.Spacer(), { flex: 1 });

    const mobileAccount = new BsSidebarAccount(
      cfg.user.name,
      cfg.user.role,
      cfg.resources.userAvatar,
      "RB",
      "px-0 py-0",
    );
    mobileAccount.setCollapsed(true);
    mobileAccount.setAllowGrowX(false);
    mobileAccount.setAlignY("middle");
    mobileAccount.onAction((action) => {
      if (action === "logout") this.fireEvent("logout");
    });
    const mobileAccountSlot = new qx.ui.container.Composite(
      new qx.ui.layout.Grow(),
    );
    mobileAccountSlot.setAllowGrowX(false);
    mobileAccountSlot.setAlignY("middle");
    mobileAccountSlot.setWidth(40);
    mobileAccountSlot.setHeight(40);
    mobileAccountSlot.add(mobileAccount);
    mobileTopBar.add(mobileAccountSlot);
    mobileTopBar.exclude();

    const desktopShell = new qx.ui.container.Composite(new qx.ui.layout.HBox());

    const mountDesktop = () => {
      sidebarDrawer?.close();
      this.__sidebar.setDrawerMode(false);
      mobileTopBar.exclude();

      desktopShell.removeAll();
      desktopShell.add(this.__sidebar);
      desktopShell.add(contentContainer, { flex: 1 });

      this.removeAll();
      this.add(desktopShell);
    };

    const mountMobile = () => {
      this.__sidebar.setCollapsed(false);
      this.__sidebar.setDrawerMode(true);
      mobileTopBar.show();
      sidebarDrawer = new BsDrawer(contentContainer, this.__sidebar);

      this.removeAll();
      this.add(sidebarDrawer);
    };

    const navbar = new Navbar(pageTitle, () => {
      if (isMobileMode) {
        sidebarDrawer?.toggle();
      } else {
        isSidebarCollapsed = !isSidebarCollapsed;
        this.__sidebar.setCollapsed(isSidebarCollapsed);
      }
    }, cfg);
    contentContainer.add(mobileTopBar);
    contentContainer.add(navbar);

    const pageCache = new Map<string, qx.ui.core.Widget>();
    if (pageTitle) {
      pageCache.set(pageTitle, content);
    }

    const getPage = (label: string): qx.ui.core.Widget | null => {
      const cached = pageCache.get(label);
      if (cached) return cached;

      const factory = pageMap.get(label);
      if (!factory) return null;

      const page = factory();
      pageCache.set(label, page);
      return page;
    };

    const tabView = new qx.ui.tabview.TabView("top");
    tabView.setContentPadding(0);
    tabView.setAllowGrowX(true);

    const tabBarStyle = document.createElement("style");
    tabBarStyle.textContent = `
      .qx-tabview {
        max-width: 100dvw;
      }
      .qx-tabview-bar {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
      }
      .qx-tabview-bar::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(tabBarStyle);

    const styleTabButton = (button: any, isSelected: boolean) => {
      if (isSelected) {
        button.setDecorator(
          new qx.ui.decoration.Decorator().set({
            widthBottom: 2,
            styleBottom: "solid",
            colorBottom: AppColors.primary(),
          }),
        );
      } else {
        button.resetDecorator();
      }
    };

    tabView.addListener("changeSelection", () => {
      const selected = tabView.getSelection();
      tabView.getChildren().forEach((page: qx.ui.tabview.Page) => {
        const btn = page.getButton() as any;
        if (btn) styleTabButton(btn, selected.indexOf(page) !== -1);
      });
    });

    const createTabPage = (
      pageWidget: qx.ui.core.Widget,
      label: string,
    ): qx.ui.tabview.Page => {
      const tabPage = new qx.ui.tabview.Page(label);
      tabPage.setLayout(new qx.ui.layout.Grow());

      const pageScroll = new qx.ui.container.Scroll();
      pageScroll.add(pageWidget);
      tabPage.add(pageScroll, { edge: 0 });

      const button = tabPage.getButton() as any;
      if (button && typeof button.setShowCloseButton === "function") {
        button.setShowCloseButton(true);
      }

      tabPage.addListener("close", () => {
        tabView.remove(tabPage);
        pageCache.delete(label);
      });

      return tabPage;
    };

    if (pageTitle) {
      const initialTab = createTabPage(content, pageTitle);
      tabView.add(initialTab);
      tabView.setSelection([initialTab]);
    }

    (globalThis as any).setContent = (contentOrFactory: any, title: string) => {
      const existing = tabView.getChildren().find(
        (p: qx.ui.tabview.Page) => p.getLabel() === title,
      );
      if (existing) {
        tabView.setSelection([existing]);
        if (title) navbar.setPageTitle(title);
        if (isMobileMode) sidebarDrawer?.close();
        return;
      }

      const nextPage =
        typeof contentOrFactory === "function"
          ? contentOrFactory()
          : contentOrFactory;

      const tabPage = createTabPage(nextPage, title || "Page");
      tabView.add(tabPage);
      tabView.setSelection([tabPage]);
      navbar.setPageTitle(title);

      if (isMobileMode) sidebarDrawer?.close();
    };

    this.__sidebar.addListener("select", (ev: qx.event.type.Data) => {
      const label = ev.getData() as string;
      const nextPage = getPage(label);
      if (!nextPage) return;

      (globalThis as any).setContent(nextPage, label);
    });

    this.__sidebar.addListener("action", (ev: qx.event.type.Data) => {
      const action = ev.getData() as string;
      if (action === "logout") {
        this.fireEvent("logout");
      } else {
        const page = getPage(action);
        if (page) {
          (globalThis as any).setContent(page, action);
        }
      }
    });

    contentContainer.add(tabView, { flex: 1, edge: 0 });

    const syncResponsiveMode = () => {
      const nextIsMobile = qx.bom.Viewport.getWidth() < MOBILE_BREAKPOINT;
      if (nextIsMobile === isMobileMode && this.getChildren().length > 0)
        return;

      isMobileMode = nextIsMobile;
      if (isMobileMode) {
        mountMobile();
      } else {
        mountDesktop();
        this.__sidebar.setCollapsed(isSidebarCollapsed);
      }
    };

    qx.event.Registration.addListener(window, "resize", () => {
      syncResponsiveMode();
    });

    syncResponsiveMode();
  }

  setLogo(path: string): void {
    this.__sidebar.setLogo(path);
    this.__mobileSchoolLogo.setSource(path);
  }
}
