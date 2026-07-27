"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class AppColors {
    static cssVar(cssVarName, fallback) {
        return `var(${cssVarName}, ${fallback})`;
    }
    static primary() {
        return this.cssVar("--color-primary", "oklch(0.5854 0.2041 277.1173)");
    }
    static background() {
        return this.cssVar("--color-background", "oklch(0.9842 0.0034 247.8575)");
    }
    static card() {
        return this.cssVar("--color-card", "oklch(1.0000 0 0)");
    }
    static foreground() {
        return this.cssVar("--color-foreground", "oklch(0.2795 0.0368 260.0310)");
    }
    static border() {
        return this.cssVar("--color-border", "oklch(0.8717 0.0093 258.3382)");
    }
    static sidebar() {
        return this.cssVar("--color-sidebar", "oklch(0.9670 0.0029 264.5419)");
    }
    static sidebarForeground() {
        return this.cssVar("--color-sidebar-foreground", "oklch(0.2795 0.0368 260.0310)");
    }
    static sidebarBorder() {
        return this.cssVar("--color-sidebar-border", "oklch(0.8717 0.0093 258.3382)");
    }
    static accent() {
        return this.cssVar("--color-accent", "oklch(0.9299 0.0334 272.7879)");
    }
    static accentForeground() {
        return this.cssVar("--color-accent-foreground", "oklch(0.3729 0.0306 259.7328)");
    }
    static destructive() {
        return this.cssVar("--color-destructive", "oklch(0.6368 0.2078 25.3313)");
    }
    static mutedForeground() {
        return this.cssVar("--color-muted-foreground", "oklch(0.5510 0.0234 264.3637)");
    }
    static overlay(alpha = 0.35) {
        return `color-mix(in oklch, var(--color-foreground, oklch(0.2795 0.0368 260.0310)) ${alpha * 100}%, transparent)`;
    }
}
function qooxdooMain(app) {
    const root = app.getRoot();
    const appManager = new AppManager(root, {
        appName: "Admission System",
        appVersion: "1.0.0",
        user: { name: "John Doe", role: "TECHSUP" },
        login: {
            title: "Admission System",
            subtitle: "1.0.0",
        },
        callbacks: {
            onLogout: () => appManager.setLayout("fullscreen"),
            onAbout: () => showAboutDialog(),
        },
    }, AppPages.ROUTE_DEFINITIONS);
    appManager.start();
}
qx.registry.registerMainMethod(qooxdooMain);
const DEFAULT_APP_CONFIG = {
    appName: "APP_NAME",
    appVersion: "APP_VERSION",
    appLogo: "",
    resources: {
        logo: "resource/app/app_logo.png",
        userAvatar: "resource/app/user.png",
        iconsBaseUrl: "resource/app/icons/",
    },
    user: {
        name: "User",
        role: "Role",
    },
    login: {
        title: "Company Name",
        subtitle: "Location",
    },
    callbacks: {
        onNoLogo: () => "resource/app/app_logo.png",
        onLogout: () => { },
    },
    sidebar: {
        width: 300,
        collapsedWidth: 56,
    },
};
class AppManager {
    constructor(root, config, routes) {
        var _a, _b;
        this.__mainLayout = null;
        this.__fullscreenLayout = null;
        this.__currentMode = "main";
        this.__root = root;
        this.__config = Object.assign(Object.assign(Object.assign({}, DEFAULT_APP_CONFIG), config), { resources: Object.assign(Object.assign({}, DEFAULT_APP_CONFIG.resources), config === null || config === void 0 ? void 0 : config.resources), user: Object.assign(Object.assign({}, DEFAULT_APP_CONFIG.user), config === null || config === void 0 ? void 0 : config.user), login: Object.assign(Object.assign({}, DEFAULT_APP_CONFIG.login), config === null || config === void 0 ? void 0 : config.login), callbacks: Object.assign(Object.assign({}, DEFAULT_APP_CONFIG.callbacks), config === null || config === void 0 ? void 0 : config.callbacks), sidebar: Object.assign(Object.assign({}, DEFAULT_APP_CONFIG.sidebar), config === null || config === void 0 ? void 0 : config.sidebar) });
        this.__routes = routes !== null && routes !== void 0 ? routes : [];
        this.__config.resources.logo =
            this.__config.appLogo ||
                ((_b = (_a = this.__config.callbacks).onNoLogo) === null || _b === void 0 ? void 0 : _b.call(_a)) ||
                DEFAULT_APP_CONFIG.resources.logo;
        InlineSvgIcon.iconsBaseUrl = this.__config.resources.iconsBaseUrl;
    }
    __extractPageMap() {
        const map = new Map();
        const processRoute = (route) => {
            var _a;
            if (route.element) {
                map.set(route.label, route.element);
            }
            (_a = route.children) === null || _a === void 0 ? void 0 : _a.forEach(processRoute);
        };
        this.__routes.forEach(processRoute);
        return map;
    }
    __createMainLayout() {
        const pageMap = this.__extractPageMap();
        let sidebarItems = AppPages.manipulateSidebarItems(AppPages.createSidebarItems(this.__routes), pageMap);
        const accessCode = this.__config.user.accessCode;
        if (accessCode) {
            sidebarItems = AppPages.filterByAccessCode(sidebarItems, accessCode);
        }
        const initialPage = new PlaceholderPage("Admission System — Select an entity from the sidebar to begin");
        const mainLayout = new MainLayout(initialPage, sidebarItems, pageMap, "Dashboard", this.__config);
        mainLayout.addListener("logout", () => {
            this.setLayout("fullscreen");
        });
        return mainLayout;
    }
    __createFullscreenLayout() {
        const layout = new FullscreenLayout(this.__config);
        layout.addListener("login", (ev) => {
            const userData = ev.getData();
            if (userData) {
                this.__config.user.name = userData.name;
                this.__config.user.role = userData.role;
                this.__config.user.accessCode = userData.accessCode;
            }
            this.setLayout("main");
        });
        return layout;
    }
    setLayout(mode) {
        this.__currentMode = mode;
        this.__root.removeAll();
        if (mode === "main") {
            this.__mainLayout = this.__createMainLayout();
            this.__root.add(this.__mainLayout, { edge: 0 });
        }
        else {
            this.__fullscreenLayout = this.__createFullscreenLayout();
            this.__root.add(this.__fullscreenLayout, { edge: 0 });
        }
    }
    setLogo(path) {
        this.__config.resources.logo = path;
        if (this.__currentMode === "main" && this.__mainLayout) {
            this.__mainLayout.setLogo(path);
        }
        else if (this.__currentMode === "fullscreen" && this.__fullscreenLayout) {
            this.__fullscreenLayout.setLogo(path);
        }
    }
    start(initialMode = "fullscreen") {
        globalThis.appManager = this;
        this.setLayout(initialMode);
    }
}
class AppPages {
    static createSidebarItems(definitions = AppPages.ROUTE_DEFINITIONS) {
        const createItems = (items) => {
            return items.map((definition) => ({
                label: definition.label,
                icon: definition.iconName
                    ? new InlineSvgIcon(definition.iconName, 16)
                    : undefined,
                action: definition.action,
                disabled: definition.disabled,
                hidden: definition.hidden,
                accessCode: definition.accessCode,
                children: definition.children
                    ? createItems(definition.children)
                    : undefined,
            }));
        };
        return createItems(definitions);
    }
    static filterByAccessCode(items, accessCodes) {
        const codes = accessCodes.split(",").map((c) => c.trim()).filter(Boolean);
        const isAdmin = codes.indexOf("AL") !== -1;
        return items.map((item) => (Object.assign(Object.assign({}, item), { disabled: item.accessCode
                ? (codes.indexOf(item.accessCode) === -1 && !isAdmin)
                : item.disabled, children: item.children
                ? AppPages.filterByAccessCode(item.children, accessCodes)
                : undefined })));
    }
    static manipulateSidebarItems(items, pageMap) {
        const normalizeItems = (source) => {
            const normalizedItems = [];
            source.forEach((item) => {
                if (item.hidden)
                    return;
                const normalizedLabel = item.label.trim();
                const normalizedChildren = item.children
                    ? normalizeItems(item.children)
                    : undefined;
                const isLeaf = !normalizedChildren || normalizedChildren.length === 0;
                if (isLeaf && !pageMap.has(normalizedLabel))
                    return;
                normalizedItems.push(Object.assign(Object.assign({}, item), { label: normalizedLabel, children: normalizedChildren && normalizedChildren.length > 0
                        ? normalizedChildren
                        : undefined }));
            });
            return normalizedItems;
        };
        return normalizeItems(items);
    }
}
AppPages.ROUTE_DEFINITIONS = [
    { label: "Access Levels", iconName: "shield", accessCode: "AL", element: () => new CrudPage("AccessLevel") },
    { label: "Courses", iconName: "book", accessCode: "C", element: () => new CrudPage("Course") },
    { label: "Users", iconName: "users", accessCode: "U", element: () => new CrudPage("User") },
    { label: "Personal Profiles", iconName: "id-card", accessCode: "PP", element: () => new CrudPage("PersonalProfile") },
    { label: "Family Backgrounds", iconName: "user-round", accessCode: "FB", element: () => new CrudPage("FamilyBackground") },
    { label: "Admission Applications", iconName: "clipboard-list", accessCode: "AA", element: () => new CrudPage("AdmissionApplication") }
];
class BasePage extends qx.ui.container.Composite {
    constructor() {
        super();
        this.__responsiveWidth = 0;
        this.__responsiveHeight = 0;
        this.__halfResponsiveWidth = 0;
        this.__halfResponsiveHeight = 0;
        this.setPadding(10);
        this.__refreshResponsiveValues();
        qx.event.Registration.addListener(window, "resize", this._onResize, this);
    }
    getResponsiveWidth() {
        return this.__responsiveWidth;
    }
    getResponsiveHeight() {
        return this.__responsiveHeight;
    }
    getHalfResponsiveWidth() {
        return this.__halfResponsiveWidth;
    }
    getHalfResponsiveHeight() {
        return this.__halfResponsiveHeight;
    }
    /**
     * Called on window resize. Subclasses can override this to update their layouts.
     * Remember to call super._onResize() in the override.
     */
    _onResize() {
        this.__refreshResponsiveValues();
    }
    __refreshResponsiveValues() {
        this.__responsiveWidth = qx.bom.Viewport.getWidth();
        this.__responsiveHeight = qx.bom.Viewport.getHeight();
        this.__halfResponsiveWidth = this.__responsiveWidth / 2;
        this.__halfResponsiveHeight = this.__responsiveHeight / 2;
    }
    __isMobile() {
        console.log("Checking if mobile. Current responsive width:", this.__responsiveWidth);
        return this.__responsiveWidth < 768;
    }
}
class PlaceholderPage extends BasePage {
    constructor(pageName) {
        super();
        this.setLayout(new qx.ui.layout.VBox().set({ alignX: "center", alignY: "middle" }));
        const label = new qx.ui.basic.Label(pageName);
        label.setFont(
        // @ts-ignore
        new qx.bom.Font(24).set({ bold: true }));
        label.setTextColor(AppColors.foreground());
        this.add(label);
    }
}
class InlineSvgIcon extends qx.ui.embed.Html {
    constructor(name, size = 20) {
        super("");
        this.__name = name;
        this.__size = size;
        this.set({
            width: size,
            height: size,
            minWidth: size,
            minHeight: size,
            selectable: false,
        });
        this.__loadAndRender();
    }
    setIcon(name) {
        this.__name = name;
        this.__loadAndRender();
    }
    setSize(size) {
        this.__size = size;
        this.setWidth(size);
        this.setHeight(size);
        this.setMinWidth(size);
        this.setMinHeight(size);
        this.__loadAndRender();
    }
    __loadAndRender() {
        const url = InlineSvgIcon.iconsBaseUrl + this.__name + ".svg";
        fetch(url)
            .then((r) => r.text())
            .then((svg) => {
            // Force width/height and make sure it uses currentColor
            // (If your SVG already has stroke="currentColor", this is harmless.)
            let out = svg;
            // Ensure currentColor (covers hardcoded strokes)
            out = out.replace(/stroke="[^"]*"/g, `stroke="currentColor"`);
            // Ensure sizing on root <svg> only (do not touch child element sizes)
            out = out.replace(/<svg\b[^>]*>/, (tag) => {
                const cleanedTag = tag
                    .replace(/\swidth="[^"]*"/g, "")
                    .replace(/\sheight="[^"]*"/g, "")
                    .replace(/\sstyle="[^"]*"/g, "");
                return cleanedTag.replace("<svg", `<svg width="${this.__size}" height="${this.__size}" style="display:block;"`);
            });
            this.setHtml(out);
            // Qooxdoo nudge after DOM update
            this.invalidateLayoutCache();
        })
            .catch(() => this.setHtml(""));
    }
}
InlineSvgIcon.iconsBaseUrl = "resource/app/icons/";
class FullscreenLayout extends qx.ui.container.Composite {
    constructor(config) {
        super(new qx.ui.layout.VBox(12).set({ alignX: "center", alignY: "middle" }));
        this.__submitting = false;
        this.__admissionFormControl = null;
        this.__config = Object.assign(Object.assign({}, DEFAULT_APP_CONFIG), config);
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
        new qx.bom.Font(16, ["Inter", "sans-serif"]).set({ bold: true }));
        title.setTextColor(AppColors.foreground());
        title.setMarginBottom(10);
        this.__card.add(title);
        const subTitle = new qx.ui.basic.Label(this.__config.login.subtitle);
        subTitle.setTextAlign("center");
        subTitle.setAlignX("center");
        subTitle.setAllowGrowX(true);
        subTitle.setFont(
        // @ts-ignore
        new qx.bom.Font(12, ["Inter", "sans-serif"]).set({ bold: true }));
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
        const onKeyDown = (event) => {
            if (event.key !== "Enter")
                return;
            const activeElement = document.activeElement;
            const cardElement = this.__card.getContentElement().getDomElement();
            if (!activeElement ||
                !cardElement ||
                !cardElement.contains(activeElement))
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
    __doLogin() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (this.__submitting)
                return;
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
                const userData = yield loginUser(code, password);
                if (!userData) {
                    this.__loginError.setValue("Invalid username or password");
                    this.__loginError.setVisibility("visible");
                    this.__submitting = false;
                    this.__submitBtn.setEnabled(true);
                    return;
                }
                this.fireDataEvent("login", userData);
            }
            catch (err) {
                this.__loginError.setValue((_a = err.message) !== null && _a !== void 0 ? _a : "Login failed");
                this.__loginError.setVisibility("visible");
                this.__submitting = false;
                this.__submitBtn.setEnabled(true);
            }
        });
    }
    __showAdmissionForm() {
        this.remove(this.__card);
        const fullscreenRoot = new qx.ui.container.Composite(new qx.ui.layout.VBox(0));
        fullscreenRoot.setBackgroundColor(AppColors.background());
        const header = new qx.ui.container.Composite(new qx.ui.layout.HBox(0).set({
            alignX: "center",
        }));
        header.setPadding(16, 24, 16, 24);
        header.setBackgroundColor(AppColors.card());
        header.setDecorator(new qx.ui.decoration.Decorator().set({
            width: [0, 0, 1, 0],
            style: "solid",
            color: AppColors.border(),
        }));
        const headerTitle = new qx.ui.basic.Label("Apply for Admission");
        headerTitle.setFont(
        // @ts-ignore
        new qx.bom.Font(18, ["Inter", "sans-serif"]).set({ bold: true }));
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
        queryList("Course").then((courses) => {
            var _a;
            (_a = this.__admissionFormControl) === null || _a === void 0 ? void 0 : _a.setReferenceData("courses", courses.map((c) => ({ value: c.id, label: `${c.code} - ${c.name}` })));
        });
        const errLabel = new qx.ui.basic.Label("");
        errLabel.setTextColor(AppColors.destructive());
        errLabel.setVisibility("excluded");
        errLabel.setTextAlign("center");
        fullscreenRoot.add(errLabel);
        const btnRow = new qx.ui.container.Composite(new qx.ui.layout.HBox(12).set({ alignX: "center" }));
        btnRow.setPadding(15);
        btnRow.setAllowGrowX(true);
        btnRow.setDecorator(new qx.ui.decoration.Decorator().set({
            width: [1, 0, 0, 0],
            style: "solid",
            color: AppColors.border(),
        }));
        const backBtn = new BsButton("Back to Login", undefined, { variant: "outline", className: "!w-[150px]" });
        const submitBtn = new BsButton("Submit Application", undefined, { variant: "default", className: "!w-[150px]" });
        btnRow.add(backBtn);
        btnRow.add(submitBtn);
        fullscreenRoot.add(btnRow);
        this.add(fullscreenRoot, { flex: 1 });
        backBtn.onClick(() => this.__showLoginForm());
        submitBtn.onClick(() => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!this.__admissionFormControl)
                return;
            submitBtn.setEnabled(false);
            errLabel.setVisibility("excluded");
            try {
                const values = this.__admissionFormControl.getValues();
                yield createEntity("AdmissionData", values);
                BsToast.show({
                    title: "Success",
                    description: "Admission application submitted. An administrator will review your application.",
                    category: "success",
                });
                this.__showLoginForm();
            }
            catch (err) {
                errLabel.setValue((_a = err.message) !== null && _a !== void 0 ? _a : "Failed to submit application");
                errLabel.setVisibility("visible");
                submitBtn.setEnabled(true);
            }
        }));
    }
    __showLoginForm() {
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
        new qx.bom.Font(16, ["Inter", "sans-serif"]).set({ bold: true }));
        title.setTextColor(AppColors.foreground());
        this.__card.add(title);
        const subTitle = new qx.ui.basic.Label(this.__config.login.subtitle);
        subTitle.setTextAlign("center");
        subTitle.setAlignX("center");
        subTitle.setAllowGrowX(true);
        subTitle.setFont(
        // @ts-ignore
        new qx.bom.Font(12, ["Inter", "sans-serif"]));
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
    setLogo(path) {
        this.__loginLogo.setSource(path);
    }
}
FullscreenLayout.events = {
    login: "qx.event.type.Data",
};
class Sidebar extends qx.ui.container.Composite {
    constructor(sidebarItems, initialActiveLabel, config) {
        super(new qx.ui.layout.VBox(0).set({ alignX: "center" }));
        this.__collapsed = false;
        this.__drawerMode = false;
        this.__listContainer = null;
        this.__buttons = [];
        this.__buttonStates = new Map();
        this.__activeLeafLabel = null;
        this.__searchQuery = "";
        this.__isAnimating = false;
        this.__hasRendered = false;
        this.__stack = [];
        this.__config = Object.assign(Object.assign({}, DEFAULT_APP_CONFIG), config);
        this.__rootItems = sidebarItems;
        this.__activeLeafLabel =
            initialActiveLabel !== null && initialActiveLabel !== void 0 ? initialActiveLabel : this.__findFirstLeafLabel(sidebarItems);
        this.setWidth(this.__config.sidebar.width);
        this.setAlignX("center");
        this.setBackgroundColor(AppColors.sidebar());
        this.setDecorator(new qx.ui.decoration.Decorator().set({
            widthRight: 1,
            styleRight: "solid",
            colorRight: AppColors.sidebarBorder(),
        }));
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
        new qx.bom.Font(12).set({ bold: true }));
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
        new qx.bom.Font(10, ["Inter", "sans-serif"]));
        appVersion.setMarginTop(6);
        appVersion.setMarginBottom(12);
        this.add(appVersion);
        this.__searchInput = new BsInput("", "Search pages...", "w-full input-sm");
        this.__searchInput.setLeadingHtml('<img src="' + InlineSvgIcon.iconsBaseUrl + 'search.svg" alt="" width="16" height="16" style="display:block;opacity:0.7" />');
        this.__searchInput.setAllowGrowX(true);
        this.__searchInput.onInput((value) => {
            this.__searchQuery = value.trim();
            this.__renderVisibleItems(false);
        });
        this.__searchInput.setTabIndex(20);
        this.add(this.__searchInput);
        this.__backContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox(0));
        this.__backContainer.setAllowGrowX(true);
        const backButton = new BsSidebarButton("Back", new InlineSvgIcon("arrow-left", 16));
        backButton.setAllowGrowX(true);
        backButton.setWidth(this.__config.sidebar.width);
        backButton.setCentered(true);
        this.__backButton = backButton;
        backButton.onClick(() => {
            if (this.__stack.length === 0 || this.__isAnimating)
                return;
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
        const footer = new BsSidebarAccount(this.__config.user.name, this.__config.user.role, this.__config.resources.userAvatar, "RB");
        this.__footer = footer;
        this.__footer.onAction((action) => {
            if (action === "logout" && this.__config.callbacks.onLogout) {
                this.__config.callbacks.onLogout();
                this.fireDataEvent("action", action);
            }
            else {
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
    __findFirstLeafLabel(items) {
        for (const item of items) {
            if (item.children && item.children.length > 0) {
                const nestedLabel = this.__findFirstLeafLabel(item.children);
                if (nestedLabel)
                    return nestedLabel;
            }
            else {
                return item.label;
            }
        }
        return null;
    }
    __getCurrentLevelItems() {
        if (this.__stack.length === 0)
            return this.__rootItems;
        return this.__stack[this.__stack.length - 1].items;
    }
    __collectLeafEntries(source, path = [], out = []) {
        source.forEach((item) => {
            const nextPath = [...path, item.label];
            if (item.children && item.children.length > 0) {
                this.__collectLeafEntries(item.children, nextPath, out);
            }
            else {
                out.push({ item, path: nextPath });
            }
        });
        return out;
    }
    __setPathFromLeaf(path) {
        const nextStack = [];
        let source = this.__rootItems;
        for (let i = 0; i < path.length - 1; i++) {
            const label = path[i];
            const match = source.find((entry) => entry.label === label);
            if (!match || !match.children || match.children.length === 0)
                break;
            nextStack.push({ label: match.label, items: match.children });
            source = match.children;
        }
        this.__stack = nextStack;
    }
    __syncBackVisibility() {
        const shouldShow = !this.__collapsed &&
            this.__searchQuery.length === 0 &&
            this.__stack.length > 0;
        if (shouldShow) {
            const parentLabel = this.__stack[this.__stack.length - 1].label;
            this.__backButton.setText(parentLabel);
            this.__backContainer.show();
        }
        else {
            this.__backContainer.exclude();
        }
    }
    __renderVisibleItems(animated) {
        this.__syncBackVisibility();
        const nextList = new qx.ui.container.Composite(new qx.ui.layout.VBox(0));
        nextList.setAllowGrowX(true);
        this.__buttons = [];
        this.__buttonStates.clear();
        if (this.__searchQuery.length > 0) {
            const query = this.__searchQuery.toLowerCase();
            const matches = this.__collectLeafEntries(this.__rootItems).filter(({ item, path }) => {
                const haystack = `${path.join(" ")} ${item.label}`.toLowerCase();
                return haystack.includes(query);
            });
            matches.forEach(({ item, path }) => {
                const parentTrail = path.slice(0, path.length - 1).join(" / ");
                const displayLabel = parentTrail
                    ? `${item.label} - ${parentTrail}`
                    : item.label;
                const row = this.__createListRow();
                const button = this.__createSidebarButton(displayLabel, item.icon, false);
                if (item.disabled) {
                    button.setEnabled(false);
                }
                else if (item.action) {
                    button.onClick(() => {
                        item.action();
                    });
                }
                else {
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
        }
        else {
            const currentItems = this.__getCurrentLevelItems();
            currentItems.forEach((item) => {
                const hasChildren = !!item.children && item.children.length > 0;
                const row = this.__createListRow();
                const button = this.__createSidebarButton(item.label, item.icon, hasChildren);
                if (item.disabled) {
                    button.setEnabled(false);
                }
                else if (hasChildren) {
                    button.onClick(() => {
                        if (this.__isAnimating || !item.children)
                            return;
                        this.__stack.push({ label: item.label, items: item.children });
                        this.__renderVisibleItems(true);
                    });
                }
                else if (item.action) {
                    button.onClick(() => {
                        item.action();
                    });
                }
                else {
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
            this.__itemsViewport.getChildren().slice().forEach((c) => this.__itemsViewport.remove(c));
            this.__itemsViewport.add(nextList);
            this.__listContainer = nextList;
            return;
        }
        const previousList = this.__listContainer;
        this.__isAnimating = true;
        const wrapper = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
        wrapper.setAllowGrowX(true);
        wrapper.setAllowGrowY(true);
        this.__itemsViewport.getChildren().slice().forEach((c) => this.__itemsViewport.remove(c));
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
            transition: "opacity 280ms cubic-bezier(0.4, 0, 0.2, 1), transform 280ms cubic-bezier(0.4, 0, 0.2, 1)",
        });
        this.__setDomStyles(previousList, {
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            opacity: "1",
            transform: "translateX(0px)",
            transition: "opacity 280ms cubic-bezier(0.4, 0, 0.2, 1), transform 280ms cubic-bezier(0.4, 0, 0.2, 1)",
        });
        qx.event.Timer.once(() => {
            this.__setDomStyles(previousList, {
                opacity: "0",
                transform: "translateX(-30px)",
            });
            this.__setDomStyles(nextList, {
                opacity: "1",
                transform: "translateX(0px)",
            });
        }, this, 20);
        qx.event.Timer.once(() => {
            this.__setDomStyles(nextList, {
                position: "relative",
                transform: "none",
            });
            this.__itemsViewport.getChildren().slice().forEach((c) => this.__itemsViewport.remove(c));
            this.__itemsViewport.add(nextList);
            wrapper.dispose();
            this.__listContainer = nextList;
            this.__isAnimating = false;
        }, this, 320);
    }
    __createListRow() {
        const row = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({ alignY: "middle" }));
        row.set({
            allowGrowX: true,
            height: 40,
        });
        return row;
    }
    __createSidebarButton(label, icon, hasChildren, className) {
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
    __setDomStyles(widget, styles) {
        const contentElement = widget.getContentElement();
        if (!contentElement || !contentElement.setStyle)
            return;
        for (const key in styles) {
            if (!Object.prototype.hasOwnProperty.call(styles, key))
                continue;
            contentElement.setStyle(key, styles[key]);
        }
    }
    setCollapsed(collapsed) {
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
            if (!collapsed)
                this.__applyChromeMode();
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
        if (!collapsed)
            this.show();
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
                if (!collapsed)
                    this.__applyChromeMode();
            }, this, DURATION + 20);
        });
    }
    setDrawerMode(enabled) {
        this.__drawerMode = enabled;
        if (this.__collapsed)
            return;
        this.__applyChromeMode();
        this.__renderVisibleItems(false);
    }
    __applyChromeMode() {
        if (this.__drawerMode) {
            this.setPadding(8, 0, 8, 8);
            this.setDecorator(new qx.ui.decoration.Decorator().set({
                widthRight: 0,
            }));
            this.__schoolLogo.exclude();
            this.__header.exclude();
            this.__appVersion.exclude();
            this.__footer.exclude();
            this.__searchInput.show();
            this.__syncBackVisibility();
            return;
        }
        this.setPadding(5, 5, 0, 10);
        this.setDecorator(new qx.ui.decoration.Decorator().set({
            widthRight: 1,
            styleRight: "solid",
            colorRight: AppColors.sidebarBorder(),
        }));
        this.__schoolLogo.show();
        this.__header.show();
        this.__appVersion.show();
        this.__footer.show();
        this.__searchInput.show();
        this.__syncBackVisibility();
    }
    isCollapsed() {
        return this.__collapsed;
    }
    setLogo(path) {
        this.__schoolLogo.setSource(path);
    }
}
Sidebar.events = {
    select: "qx.event.type.Data",
    action: "qx.event.type.Data",
};
class Navbar extends qx.ui.container.Composite {
    constructor(pageTitle, onToggleSidebar, config) {
        super(new qx.ui.layout.HBox(2));
        this.__isActionsOpen = false;
        this.__config = Object.assign(Object.assign({}, DEFAULT_APP_CONFIG), config);
        this.setAlignY("middle");
        this.setPadding(8);
        this.setHeight(55);
        this.setBackgroundColor(AppColors.background());
        this.setDecorator(new qx.ui.decoration.Decorator().set({
            widthBottom: 1,
            styleBottom: "solid",
            colorBottom: AppColors.border(),
        }));
        // SIDEBAR TRIGGER
        const collapseSidebarBtn = new BsButton("", new InlineSvgIcon("menu", 16), {
            size: "sm-icon",
            variant: "ghost",
            className: "!w-[50px]"
        });
        collapseSidebarBtn.setWidth(50);
        collapseSidebarBtn.onClick(() => {
            this.fireEvent("toggleSidebar");
            if (onToggleSidebar)
                onToggleSidebar();
        });
        this.add(collapseSidebarBtn);
        // PAGE TITLE
        this.__titleLabel = new qx.ui.basic.Label(pageTitle !== null && pageTitle !== void 0 ? pageTitle : "Dashboard");
        this.__titleLabel.setTextColor(AppColors.foreground());
        this.__titleLabel.setFont(
        // @ts-ignore
        new qx.bom.Font(18).set({ bold: true }));
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
        this.__actionsPopup.setDecorator(new qx.ui.decoration.Decorator().set({
            width: 1,
            style: "solid",
            color: AppColors.border(),
            radius: 10,
            shadowVerticalLength: 2,
            shadowBlurRadius: 10,
            shadowColor: AppColors.overlay(0.1),
        }));
        const actionsMenu = new qx.ui.container.Composite(new qx.ui.layout.VBox(0));
        actionsMenu.set({
            minWidth: 160,
            padding: 2,
            backgroundColor: AppColors.background(),
            textColor: AppColors.foreground(),
        });
        actionsMenu.add(this.__createActionsMenuButton("Change Log", new InlineSvgIcon("file-text", 16), "change-log"));
        actionsMenu.add(this.__createActionsMenuButton("Support", new InlineSvgIcon("help-circle", 16), "support"));
        actionsMenu.add(this.__createActionsMenuButton("About", new InlineSvgIcon("info", 16), "show-about-dialog"));
        this.addListener("action", (ev) => {
            const action = ev.getData();
            if (action === "change-log" && this.__config.callbacks.onChangeLog) {
                this.__config.callbacks.onChangeLog();
            }
            else if (action === "support" && this.__config.callbacks.onSupport) {
                this.__config.callbacks.onSupport();
            }
            else if (action === "show-about-dialog" && this.__config.callbacks.onAbout) {
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
    __createActionsMenuButton(label, icon, action) {
        const button = new BsSidebarButton(label, icon, "btn-sm-outline");
        button.setAllowGrowX(true);
        button.setHeight(40);
        button.onClick(() => {
            this.fireDataEvent("action", action);
            this.__closeActionsPopup();
        });
        return button;
    }
    __toggleActionsPopup(target) {
        if (this.__isActionsOpen) {
            this.__closeActionsPopup();
            return;
        }
        this.__actionsPopup.show();
        this.__isActionsOpen = true;
        this.__actionsPopup.placeToWidget(target, true);
        qx.event.Timer.once(() => this.__actionsPopup.placeToWidget(target, true), this, 0);
    }
    __closeActionsPopup() {
        if (!this.__isActionsOpen)
            return;
        this.__isActionsOpen = false;
        this.__actionsPopup.hide();
    }
    setPageTitle(value) {
        this.__titleLabel.setValue(value);
    }
    setTitle(value) {
        this.setPageTitle(value);
    }
}
Navbar.events = {
    toggleSidebar: "qx.event.type.Event",
    action: "qx.event.type.Data",
};
class MainLayout extends qx.ui.container.Composite {
    constructor(content, sidebarItems, pageMap, pageTitle, config) {
        super();
        this.setLayout(new qx.ui.layout.Grow());
        this.setBackgroundColor(AppColors.background());
        const cfg = Object.assign(Object.assign({}, DEFAULT_APP_CONFIG), config);
        InlineSvgIcon.iconsBaseUrl = cfg.resources.iconsBaseUrl;
        const MOBILE_BREAKPOINT = 768;
        let isSidebarCollapsed = false;
        let isMobileMode = qx.bom.Viewport.getWidth() < MOBILE_BREAKPOINT;
        let sidebarDrawer = null;
        this.__sidebar = new Sidebar(sidebarItems, pageTitle, cfg);
        const contentContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox());
        contentContainer.setBackgroundColor(AppColors.background());
        const mobileTopBar = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({ alignY: "middle" }));
        mobileTopBar.set({
            paddingTop: 8,
            paddingRight: 6,
            paddingBottom: 8,
            paddingLeft: 10,
            minHeight: 48,
            backgroundColor: AppColors.background(),
        });
        mobileTopBar.setDecorator(new qx.ui.decoration.Decorator().set({
            widthBottom: 1,
            styleBottom: "solid",
            colorBottom: AppColors.border(),
        }));
        this.__mobileSchoolLogo = new qx.ui.basic.Image(cfg.resources.logo);
        this.__mobileSchoolLogo.set({
            scale: true,
            width: 32,
            height: 32,
        });
        mobileTopBar.add(this.__mobileSchoolLogo);
        mobileTopBar.add(new qx.ui.core.Spacer(), { flex: 1 });
        const mobileAccount = new BsSidebarAccount(cfg.user.name, cfg.user.role, cfg.resources.userAvatar, "RB", "px-0 py-0");
        mobileAccount.setCollapsed(true);
        mobileAccount.setAllowGrowX(false);
        mobileAccount.setAlignY("middle");
        mobileAccount.onAction((action) => {
            if (action === "logout")
                this.fireEvent("logout");
        });
        const mobileAccountSlot = new qx.ui.container.Composite(new qx.ui.layout.Grow());
        mobileAccountSlot.setAllowGrowX(false);
        mobileAccountSlot.setAlignY("middle");
        mobileAccountSlot.setWidth(40);
        mobileAccountSlot.setHeight(40);
        mobileAccountSlot.add(mobileAccount);
        mobileTopBar.add(mobileAccountSlot);
        mobileTopBar.exclude();
        const desktopShell = new qx.ui.container.Composite(new qx.ui.layout.HBox());
        const mountDesktop = () => {
            sidebarDrawer === null || sidebarDrawer === void 0 ? void 0 : sidebarDrawer.close();
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
                sidebarDrawer === null || sidebarDrawer === void 0 ? void 0 : sidebarDrawer.toggle();
            }
            else {
                isSidebarCollapsed = !isSidebarCollapsed;
                this.__sidebar.setCollapsed(isSidebarCollapsed);
            }
        }, cfg);
        contentContainer.add(mobileTopBar);
        contentContainer.add(navbar);
        const pageCache = new Map();
        if (pageTitle) {
            pageCache.set(pageTitle, content);
        }
        const getPage = (label) => {
            const cached = pageCache.get(label);
            if (cached)
                return cached;
            const factory = pageMap.get(label);
            if (!factory)
                return null;
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
        const styleTabButton = (button, isSelected) => {
            if (isSelected) {
                button.setDecorator(new qx.ui.decoration.Decorator().set({
                    widthBottom: 2,
                    styleBottom: "solid",
                    colorBottom: AppColors.primary(),
                }));
            }
            else {
                button.resetDecorator();
            }
        };
        tabView.addListener("changeSelection", () => {
            const selected = tabView.getSelection();
            tabView.getChildren().forEach((page) => {
                const btn = page.getButton();
                if (btn)
                    styleTabButton(btn, selected.indexOf(page) !== -1);
            });
        });
        const createTabPage = (pageWidget, label) => {
            const tabPage = new qx.ui.tabview.Page(label);
            tabPage.setLayout(new qx.ui.layout.Grow());
            const pageScroll = new qx.ui.container.Scroll();
            pageScroll.add(pageWidget);
            tabPage.add(pageScroll, { edge: 0 });
            const button = tabPage.getButton();
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
        globalThis.setContent = (contentOrFactory, title) => {
            const existing = tabView.getChildren().find((p) => p.getLabel() === title);
            if (existing) {
                tabView.setSelection([existing]);
                if (title)
                    navbar.setPageTitle(title);
                if (isMobileMode)
                    sidebarDrawer === null || sidebarDrawer === void 0 ? void 0 : sidebarDrawer.close();
                return;
            }
            const nextPage = typeof contentOrFactory === "function"
                ? contentOrFactory()
                : contentOrFactory;
            const tabPage = createTabPage(nextPage, title || "Page");
            tabView.add(tabPage);
            tabView.setSelection([tabPage]);
            navbar.setPageTitle(title);
            if (isMobileMode)
                sidebarDrawer === null || sidebarDrawer === void 0 ? void 0 : sidebarDrawer.close();
        };
        this.__sidebar.addListener("select", (ev) => {
            const label = ev.getData();
            const nextPage = getPage(label);
            if (!nextPage)
                return;
            globalThis.setContent(nextPage, label);
        });
        this.__sidebar.addListener("action", (ev) => {
            const action = ev.getData();
            if (action === "logout") {
                this.fireEvent("logout");
            }
            else {
                const page = getPage(action);
                if (page) {
                    globalThis.setContent(page, action);
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
            }
            else {
                mountDesktop();
                this.__sidebar.setCollapsed(isSidebarCollapsed);
            }
        };
        qx.event.Registration.addListener(window, "resize", () => {
            syncResponsiveMode();
        });
        syncResponsiveMode();
    }
    setLogo(path) {
        this.__sidebar.setLogo(path);
        this.__mobileSchoolLogo.setSource(path);
    }
}
MainLayout.events = {
    logout: "qx.event.type.Event",
};
function showAboutDialog() {
    const aboutContent = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
    aboutContent.setBackgroundColor(AppColors.background());
    const aboutTable = new qx.ui.container.Composite(new qx.ui.layout.Grid(8, 14));
    aboutTable.setBackgroundColor(AppColors.background());
    const tableLayout = aboutTable.getLayout();
    tableLayout.setColumnFlex(1, 1);
    const headerLabel = new qx.ui.basic.Label("SIAS Online v3.7.3.2").set({
        font: new qx.bom.Font("16", ["Inter", "sans-serif"]).set({ bold: true }),
        textColor: AppColors.primary(),
    });
    const headerTitle = new qx.ui.basic.Label("Copyright @ 2014 - 2020 Digital Software").set({
        font: new qx.bom.Font("14", ["Inter", "sans-serif"]).set({ bold: true }),
    });
    aboutTable.add(new qx.ui.basic.Label("Chief Architect"), {
        row: 1,
        column: 0,
    });
    aboutTable.add(new qx.ui.basic.Label("Thomas C. Saddul, BSMath, MCS, MSIT").set({
        font: new qx.bom.Font("14", ["Inter", "sans-serif"]).set({ bold: true }),
    }), {
        row: 1,
        column: 1,
    });
    aboutTable.add(new qx.ui.basic.Label("Website"), { row: 2, column: 0 });
    aboutTable.add(new qx.ui.basic.Label("https://www.digisoftph.com").set({
        rich: true,
        font: new qx.bom.Font("14", ["Inter", "sans-serif"]).set({ bold: true }),
    }), { row: 2, column: 1 });
    aboutTable.add(new qx.ui.basic.Label("Facebook"), { row: 3, column: 0 });
    aboutTable.add(new qx.ui.basic.Label("https://www.facebook.com/digisoftph").set({
        rich: true,
        font: new qx.bom.Font("14", ["Inter", "sans-serif"]).set({ bold: true }),
    }), { row: 3, column: 1 });
    aboutContent.add(headerLabel);
    aboutContent.add(headerTitle);
    aboutContent.add(aboutTable);
    BsAlertDialog.show({
        title: "About",
        children: aboutContent,
        cancelLabel: "Okay",
        footerButtons: "cancel",
    });
}
/**
 * Singleton modal dialog. One shared <dialog> element is reused for every
 * invocation — content, title, and buttons are swapped dynamically.
 * Footer buttons use event delegation via data-action attributes.
 */
class BsAlertDialog {
    constructor() { }
    static show(config) {
        var _a, _b, _c, _d;
        const dialog = BsAlertDialog.__getOrCreateDialog();
        // Dispose previous qooxdoo widget tree
        BsAlertDialog.__disposeBody();
        // Title
        BsAlertDialog.__titleEl.textContent = config.title;
        // Body
        const body = BsAlertDialog.__body;
        body.style.width = "100%";
        if (config.children) {
            dialog.removeAttribute("aria-describedby");
            const bodyHost = document.createElement("div");
            bodyHost.style.width = "100%";
            bodyHost.style.boxSizing = "border-box";
            body.appendChild(bodyHost);
            BsAlertDialog.__bodyRoot = new qx.ui.root.Inline(bodyHost);
            const vbox = new qx.ui.layout.VBox();
            vbox.setAlignX("stretch");
            BsAlertDialog.__bodyRoot.setLayout(vbox);
            BsAlertDialog.__bodyRoot.add(config.children);
        }
        else if (config.description) {
            dialog.setAttribute("aria-describedby", "bs-dialog-desc");
            const p = document.createElement("p");
            p.id = "bs-dialog-desc";
            p.textContent = config.description;
            body.appendChild(p);
        }
        // Footer buttons (rebuilt each time for correct labels)
        const footer = BsAlertDialog.__footer;
        footer.innerHTML = "";
        const buttons = (_a = config.footerButtons) !== null && _a !== void 0 ? _a : "ok-cancel";
        const cancelLabel = (_b = config.cancelLabel) !== null && _b !== void 0 ? _b : "Cancel";
        const continueLabel = (_c = config.continueLabel) !== null && _c !== void 0 ? _c : "Continue";
        if (buttons === "ok-cancel" || buttons === "cancel") {
            const cancelBtn = document.createElement("button");
            cancelBtn.className = "btn-sm-outline";
            cancelBtn.textContent = cancelLabel;
            cancelBtn.type = "button";
            cancelBtn.dataset.action = "cancel";
            footer.appendChild(cancelBtn);
        }
        if (buttons === "ok-cancel" || buttons === "ok") {
            const continueBtn = document.createElement("button");
            continueBtn.className = "btn-sm-primary";
            continueBtn.textContent = continueLabel;
            continueBtn.type = "button";
            continueBtn.dataset.action = "continue";
            footer.appendChild(continueBtn);
        }
        BsAlertDialog.__onContinue = (_d = config.onContinue) !== null && _d !== void 0 ? _d : null;
        dialog.showModal();
    }
    static __disposeBody() {
        if (BsAlertDialog.__bodyRoot) {
            BsAlertDialog.__bodyRoot.removeAll();
            BsAlertDialog.__bodyRoot.destroy();
            BsAlertDialog.__bodyRoot = null;
        }
        BsAlertDialog.__body.innerHTML = "";
    }
    static __getOrCreateDialog() {
        if (BsAlertDialog.__dialog)
            return BsAlertDialog.__dialog;
        const dialog = document.createElement("dialog");
        dialog.id = "bs-global-dialog";
        dialog.className = "dialog";
        dialog.setAttribute("aria-labelledby", "bs-dialog-title");
        dialog.style.maxWidth = "500px";
        dialog.style.width = "90%";
        const wrapper = document.createElement("div");
        wrapper.style.width = "100%";
        const header = document.createElement("header");
        const title = document.createElement("h2");
        title.id = "bs-dialog-title";
        header.appendChild(title);
        const body = document.createElement("div");
        body.style.width = "100%";
        const footer = document.createElement("footer");
        wrapper.appendChild(header);
        wrapper.appendChild(body);
        wrapper.appendChild(footer);
        dialog.appendChild(wrapper);
        document.body.appendChild(dialog);
        // Event delegation — single handler for all footer button clicks
        footer.addEventListener("click", (e) => {
            var _a;
            const target = e.target.closest("button[data-action]");
            if (!target)
                return;
            const action = target.dataset.action;
            if (action === "cancel") {
                dialog.close();
            }
            else if (action === "continue") {
                dialog.close();
                (_a = BsAlertDialog.__onContinue) === null || _a === void 0 ? void 0 : _a.call(BsAlertDialog);
            }
        });
        BsAlertDialog.__dialog = dialog;
        BsAlertDialog.__titleEl = title;
        BsAlertDialog.__body = body;
        BsAlertDialog.__footer = footer;
        return dialog;
    }
}
BsAlertDialog.__dialog = null;
BsAlertDialog.__titleEl = null;
BsAlertDialog.__body = null;
BsAlertDialog.__footer = null;
BsAlertDialog.__bodyRoot = null;
BsAlertDialog.__onContinue = null;
class BsAvatar extends qx.ui.basic.Atom {
    constructor(src, alt, fallback, className, shape = "full") {
        super();
        this.__imgEl = null;
        this.__fallbackEl = null;
        this.__wrapperEl = null;
        this.__hasImageError = false;
        this.__resizeObserver = null;
        this.__cachedContentWidth = 32;
        this.__cachedContentHeight = 32;
        this._setLayout(new qx.ui.layout.Grow());
        this.__src = src !== null && src !== void 0 ? src : "";
        this.__alt = alt !== null && alt !== void 0 ? alt : "User avatar";
        this.__fallback = fallback !== null && fallback !== void 0 ? fallback : "?";
        this.__className = className !== null && className !== void 0 ? className : "";
        this.__shape = shape;
        this.__htmlAvatar = new qx.ui.embed.Html("");
        this.__render();
        this._add(this.__htmlAvatar);
        this.__htmlAvatar.addListenerOnce("appear", () => {
            this.__bindDom();
            this.__setupResizeObserver();
        });
    }
    __escape(value) {
        return value
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }
    __resolveShapeClass() {
        if (this.__shape === "rounded")
            return "rounded-md";
        if (this.__shape === "square")
            return "rounded-none";
        return "rounded-full";
    }
    __bindDom() {
        var _a, _b;
        const root = this.__htmlAvatar.getContentElement().getDomElement();
        this.__imgEl = (_a = root === null || root === void 0 ? void 0 : root.querySelector("img")) !== null && _a !== void 0 ? _a : null;
        this.__fallbackEl =
            (_b = root === null || root === void 0 ? void 0 : root.querySelector("[data-avatar-fallback]")) !== null && _b !== void 0 ? _b : null;
        this.__wrapperEl = root === null || root === void 0 ? void 0 : root.firstElementChild;
        if (!this.__imgEl)
            return;
        this.__imgEl.onerror = () => {
            this.__hasImageError = true;
            this.__syncVisibility();
        };
        this.__imgEl.onload = () => {
            this.__hasImageError = false;
            this.__syncVisibility();
        };
        this.__syncVisibility();
    }
    __syncVisibility() {
        if (!this.__fallbackEl)
            return;
        const shouldShowFallback = !this.__src || this.__hasImageError;
        this.__fallbackEl.style.display = shouldShowFallback ? "flex" : "none";
        if (this.__imgEl) {
            this.__imgEl.style.display = shouldShowFallback ? "none" : "block";
        }
        if (this.__wrapperEl) {
            this.__wrapperEl.classList.toggle("border", shouldShowFallback);
            this.__wrapperEl.classList.toggle("border-border", shouldShowFallback);
        }
    }
    __setupResizeObserver() {
        const root = this.__htmlAvatar.getContentElement().getDomElement();
        if (!root)
            return;
        this.__resizeObserver = new ResizeObserver(([entry]) => {
            const target = entry.target;
            this.__cachedContentWidth = Math.round(target.scrollWidth || entry.contentRect.width);
            this.__cachedContentHeight = Math.round(target.scrollHeight || entry.contentRect.height);
            this.scheduleLayoutUpdate();
        });
        this.__resizeObserver.observe(root);
        this.addListener("disappear", () => {
            var _a;
            (_a = this.__resizeObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
        });
    }
    // @ts-ignore
    _getContentHint() {
        var _a;
        if (this.__cachedContentWidth > 0 && this.__cachedContentHeight > 0) {
            return { width: this.__cachedContentWidth, height: this.__cachedContentHeight };
        }
        const contentEl = (_a = this.__htmlAvatar.getContentElement()) === null || _a === void 0 ? void 0 : _a.getDomElement();
        if (contentEl) {
            return { width: contentEl.scrollWidth || 0, height: contentEl.scrollHeight || 0 };
        }
        return { width: 0, height: 0 };
    }
    __render() {
        const src = this.__escape(this.__src);
        const alt = this.__escape(this.__alt);
        const fallback = this.__escape(this.__fallback);
        const shapeClass = this.__resolveShapeClass();
        const wrapperClass = [
            "relative",
            "inline-flex",
            "size-8",
            "shrink-0",
            "overflow-hidden",
            shapeClass,
            this.__className,
        ]
            .filter(Boolean)
            .join(" ");
        const imageClass = ["size-full", "object-cover", shapeClass]
            .filter(Boolean)
            .join(" ");
        const fallbackClass = [
            "absolute",
            "inset-0",
            "flex",
            "items-center",
            "justify-center",
            "bg-muted",
            "text-muted-foreground",
            "text-xs",
            "font-medium",
            shapeClass,
        ]
            .filter(Boolean)
            .join(" ");
        this.__htmlAvatar.setHtml(`
      <span class="${wrapperClass}">
        <img
          class="${imageClass}"
          alt="${alt}"
          src="${src}"
        />
        <span class="${fallbackClass}" data-avatar-fallback>
          ${fallback}
        </span>
      </span>
    `);
        qx.event.Timer.once(() => this.__bindDom(), this, 0);
    }
    setSrc(src) {
        this.__src = src !== null && src !== void 0 ? src : "";
        this.__hasImageError = false;
        this.__render();
        return this;
    }
    setAlt(alt) {
        this.__alt = alt !== null && alt !== void 0 ? alt : "User avatar";
        this.__render();
        return this;
    }
    setFallback(fallback) {
        this.__fallback = fallback !== null && fallback !== void 0 ? fallback : "?";
        this.__render();
        return this;
    }
    setShape(shape) {
        this.__shape = shape;
        this.__render();
        return this;
    }
}
class BsButton extends qx.ui.basic.Atom {
    constructor(text, icon, options) {
        var _a, _b, _c;
        super();
        this.__variant = "default";
        this.__size = "default";
        this.__buttonEl = null;
        this.__resizeObserver = null;
        this.__cachedContentWidth = 0;
        this.__cachedContentHeight = 0;
        this._setLayout(new qx.ui.layout.Grow());
        this.setAllowGrowX(true);
        this.setFocusable(true);
        this.__iconHtml = icon ? icon.getHtml() : "";
        this.__buttonText = text !== null && text !== void 0 ? text : "";
        this.__className = (_a = options === null || options === void 0 ? void 0 : options.className) !== null && _a !== void 0 ? _a : "";
        this.__variant = (_b = options === null || options === void 0 ? void 0 : options.variant) !== null && _b !== void 0 ? _b : "default";
        this.__size = (_c = options === null || options === void 0 ? void 0 : options.size) !== null && _c !== void 0 ? _c : "default";
        this.__htmlButton = new qx.ui.embed.Html("");
        this.__renderButton();
        this._add(this.__htmlButton);
        this.__htmlButton.addListener("tap", () => this.fireEvent("execute"));
        this.__htmlButton.addListenerOnce("appear", () => {
            this.__bindNativeButton();
            this.__setupResizeObserver();
        });
        this.addListener("focusin", () => { var _a; return (_a = this.__buttonEl) === null || _a === void 0 ? void 0 : _a.focus(); });
        this.addListener("changeTabIndex", () => this.__syncTabIndex());
        this.addListener("changeEnabled", () => this.__syncDisabled());
        if (icon) {
            icon.addListener("changeHtml", () => {
                this.__iconHtml = icon.getHtml();
                this.__renderButton();
            });
        }
    }
    __bindNativeButton() {
        var _a;
        const root = this.__htmlButton.getContentElement().getDomElement();
        this.__buttonEl =
            (_a = root === null || root === void 0 ? void 0 : root.querySelector("button")) !== null && _a !== void 0 ? _a : null;
        if (!this.__buttonEl)
            return;
        this.__syncTabIndex();
        this.__syncMinWidth();
        this.__syncDisabled();
    }
    __syncMinWidth() {
        if (!this.__buttonEl)
            return;
        const width = this.__buttonEl.offsetWidth;
        if (width > 0) {
            this.setMinWidth(width);
        }
    }
    __syncTabIndex() {
        if (!this.__buttonEl)
            return;
        this.__buttonEl.setAttribute("tabindex", "-1");
    }
    __syncDisabled() {
        if (!this.__buttonEl)
            return;
        if (this.getEnabled()) {
            this.__buttonEl.removeAttribute("disabled");
        }
        else {
            this.__buttonEl.setAttribute("disabled", "true");
        }
    }
    __setupResizeObserver() {
        const root = this.__htmlButton.getContentElement().getDomElement();
        if (!root)
            return;
        this.__resizeObserver = new ResizeObserver(([entry]) => {
            const target = entry.target;
            this.__cachedContentWidth = Math.round(target.scrollWidth || entry.contentRect.width);
            this.__cachedContentHeight = Math.round(target.scrollHeight || entry.contentRect.height);
            this.scheduleLayoutUpdate();
        });
        this.__resizeObserver.observe(root);
        this.addListener("disappear", () => {
            var _a;
            (_a = this.__resizeObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
        });
    }
    // @ts-ignore
    _getContentHint() {
        var _a;
        if (this.__cachedContentWidth > 0 && this.__cachedContentHeight > 0) {
            return { width: this.__cachedContentWidth, height: this.__cachedContentHeight };
        }
        const contentEl = (_a = this.__htmlButton.getContentElement()) === null || _a === void 0 ? void 0 : _a.getDomElement();
        if (contentEl) {
            return { width: contentEl.scrollWidth || 0, height: contentEl.scrollHeight || 0 };
        }
        return { width: 0, height: 0 };
    }
    __renderButton() {
        const isIconSize = this.__size === "icon" || this.__size === "sm-icon";
        const iconPart = this.__iconHtml
            ? `<span class="${isIconSize ? "" : "me-2"}">${this.__iconHtml}</span>`
            : "";
        const tabIndexAttr = 'tabindex="-1"';
        const variantClass = this.__resolveVariantClass();
        const sizeClass = this.__resolveSizeClass();
        const classes = [variantClass, sizeClass, this.__className]
            .filter(Boolean)
            .join(" ");
        this.__htmlButton.setHtml(`
      <center class="p-1 h-full flex items-center justify-center">
        <button type="button" class="w-[120px] ${classes}" ${tabIndexAttr} style="user-select:none">
          ${iconPart}
          ${this.__buttonText}
        </button>
      </center>
    `);
        qx.event.Timer.once(() => this.__bindNativeButton(), this, 0);
    }
    __resolveVariantClass() {
        const variantMap = {
            default: "primary",
            secondary: "secondary",
            destructive: "destructive",
            outline: "outline",
            ghost: "ghost",
            link: "link",
        };
        const variantSuffix = variantMap[this.__variant];
        const isIconSize = this.__size === "icon" ||
            this.__size === "sm-icon" ||
            this.__size === "lg-icon";
        const sizePrefix = isIconSize ? "icon" : this.__size;
        if (sizePrefix === "default") {
            return `btn-${variantSuffix}`;
        }
        return `btn-${sizePrefix}-${variantSuffix}`;
    }
    __resolveSizeClass() {
        return "";
    }
    getVariant() {
        return this.__variant;
    }
    getSize() {
        return this.__size;
    }
    setButtonIcon(icon) {
        this.__iconHtml = icon.getHtml();
        this.__renderButton();
        return this;
    }
    setText(value) {
        this.__buttonText = value !== null && value !== void 0 ? value : "";
        this.__renderButton();
        return this;
    }
    onClick(handler) {
        this.addListener("execute", handler);
        return this;
    }
}
BsButton.events = {
    execute: "qx.event.type.Event",
};
class BsCard extends qx.ui.container.Composite {
    constructor(options) {
        super(new qx.ui.layout.VBox());
        this.__content = null;
        this.__resizeObserver = null;
        this.setAllowGrowX(true);
        this.setAllowGrowY(false);
        this.setBackgroundColor("var(--card)");
        this.setDecorator(new qx.ui.decoration.Decorator().set({
            radius: 8,
            style: "solid",
            width: 1,
            color: "var(--border)",
        }));
    }
    setContent(widget, options) {
        if (this.__content) {
            this.__content.dispose();
        }
        const layout = new qx.ui.layout.VBox();
        this.__content = new qx.ui.container.Composite(layout);
        this.__content.setAllowGrowX(true);
        this.__content.setPadding(24);
        if ((options === null || options === void 0 ? void 0 : options.width) !== undefined && options.width !== null) {
            this.__content.setWidth(options.width);
        }
        if ((options === null || options === void 0 ? void 0 : options.height) !== undefined && options.height !== null) {
            this.__content.setHeight(options.height);
        }
        this._add(this.__content);
        this.__content.addListenerOnce("appear", () => {
            var _a, _b;
            const el = (_b = (_a = this.__content) === null || _a === void 0 ? void 0 : _a.getContentElement()) === null || _b === void 0 ? void 0 : _b.getDomElement();
            if (el) {
                el.style.overflow = "auto";
            }
        });
        this.__content.add(widget);
        this.__setupResizeObserver();
        return this;
    }
    removeContent() {
        if (this.__content) {
            this._remove(this.__content);
            this.__content.dispose();
            this.__content = null;
        }
        return this;
    }
    __setupResizeObserver() {
        var _a, _b, _c, _d;
        if (!this.__content)
            return;
        const root = (_d = (_b = (_a = this.__content).getContentElement) === null || _b === void 0 ? void 0 : (_c = _b.call(_a)).getDomElement) === null || _d === void 0 ? void 0 : _d.call(_c);
        if (!root) {
            qx.event.Timer.once(() => this.__setupResizeObserver(), this, 50);
            return;
        }
        this.__resizeObserver = new ResizeObserver(() => {
            this.scheduleLayoutUpdate();
        });
        this.__resizeObserver.observe(root);
        this.addListener("disappear", () => {
            var _a;
            (_a = this.__resizeObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
        });
    }
}
class BsCheckbox extends qx.ui.basic.Atom {
    constructor(checked = false, disabled = false) {
        super();
        this.__inputEl = null;
        this._setLayout(new qx.ui.layout.Grow());
        this.setAllowGrowX(true);
        this.setFocusable(true);
        this.__checked = checked;
        this.__disabled = disabled;
        this.__htmlEmbed = new qx.ui.embed.Html("");
        this.__htmlEmbed.setAllowGrowX(true);
        this.__render();
        this._add(this.__htmlEmbed);
        this.__htmlEmbed.addListenerOnce("appear", () => {
            var _a;
            const root = this.__htmlEmbed.getContentElement().getDomElement();
            this.__inputEl = (_a = root === null || root === void 0 ? void 0 : root.querySelector("input")) !== null && _a !== void 0 ? _a : null;
            if (!this.__inputEl)
                return;
            this.__inputEl.addEventListener("change", () => {
                var _a, _b;
                const next = (_b = (_a = this.__inputEl) === null || _a === void 0 ? void 0 : _a.checked) !== null && _b !== void 0 ? _b : false;
                this.__checked = next;
                this.fireDataEvent("changeValue", next);
            });
        });
        this.addListener("focusin", () => {
            var _a;
            (_a = this.__inputEl) === null || _a === void 0 ? void 0 : _a.focus();
        });
    }
    // @ts-ignore
    _getContentHint() {
        return { width: 24, height: 24 };
    }
    isChecked() {
        var _a, _b;
        return (_b = (_a = this.__inputEl) === null || _a === void 0 ? void 0 : _a.checked) !== null && _b !== void 0 ? _b : this.__checked;
    }
    setChecked(value) {
        this.__checked = value;
        if (this.__inputEl)
            this.__inputEl.checked = value;
        else
            this.__render();
        return this;
    }
    setDisabled(value) {
        this.__disabled = value;
        if (this.__inputEl)
            this.__inputEl.disabled = value;
        else
            this.__render();
        return this;
    }
    onToggle(handler) {
        this.addListener("changeValue", (ev) => {
            var _a;
            handler((_a = ev.getData()) !== null && _a !== void 0 ? _a : false);
        });
        return this;
    }
    __render() {
        const checkedAttr = this.__checked ? "checked" : "";
        const disabledAttr = this.__disabled ? "disabled" : "";
        this.__htmlEmbed.setHtml(`
      <div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;">
        <input
          type="checkbox"
          class="input"
          ${checkedAttr}
          ${disabledAttr}
        />
      </div>
    `);
    }
}
BsCheckbox.events = {
    changeValue: "qx.event.type.Data",
};
class BsCombobox extends qx.ui.basic.Atom {
    constructor(options = [], placeholder, className, direction) {
        super();
        this.__value = "";
        this.__triggerEl = null;
        this.__searchInputEl = null;
        this.__displayEl = null;
        this.__resizeObserver = null;
        this.__outsideClickHandler = null;
        this.__optionWidgets = [];
        this.__filteredOptions = [];
        this.__isOpen = false;
        this.__direction = "bottom";
        this.__disabled = false;
        this.__cachedContentWidth = 0;
        this.__cachedContentHeight = 0;
        this.__togglePopup = () => {
            if (this.__disabled)
                return;
            if (this.__isOpen) {
                this.__closePopup();
            }
            else {
                this.__openPopup();
            }
        };
        this._setLayout(new qx.ui.layout.Grow());
        this.setAllowGrowX(true);
        this.setFocusable(true);
        this.__options = options;
        this.__placeholder = placeholder !== null && placeholder !== void 0 ? placeholder : "Search...";
        this.__className = className !== null && className !== void 0 ? className : "";
        this.__direction = direction !== null && direction !== void 0 ? direction : "bottom";
        this.__filteredOptions = [...this.__options];
        this.__htmlTrigger = new qx.ui.embed.Html("");
        this.__htmlTrigger.setAllowGrowX(true);
        this.__setupPopup();
        this.__renderTrigger();
        this._add(this.__htmlTrigger);
        this.__htmlTrigger.addListenerOnce("appear", () => {
            this.__bindTrigger();
            this.__setupResizeObserver();
        });
        this.addListener("disappear", () => {
            this.__closePopup();
            this.__unbindOutsideClick();
        });
        this.addListener("focusin", () => { var _a; return (_a = this.__triggerEl) === null || _a === void 0 ? void 0 : _a.focus(); });
    }
    __setupPopup() {
        this.__popup = new qx.ui.popup.Popup(new qx.ui.layout.VBox(0));
        this.__popup.setAutoHide(false);
        this.__popup.setDomMove(true);
        this.__popup.setZIndex(100000);
        this.__popup.setAllowGrowX(false);
        this.__popup.setAllowGrowY(true);
        this.__popup.setPadding(0);
        this.__popup.setBackgroundColor("transparent");
        this.__popup.setDecorator(new qx.ui.decoration.Decorator().set({
            width: 1,
            style: "solid",
            color: "var(--border)",
            radius: 8,
            shadowVerticalLength: 4,
            shadowBlurRadius: 12,
            shadowColor: "rgba(0,0,0,0.1)",
        }));
        this.__popupContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox(0));
        this.__popupContainer.setMargin(2);
        this.__popupContainer.set({
            backgroundColor: "var(--card)",
            textColor: "var(--foreground)",
        });
        this.__popup.add(this.__popupContainer);
        this.__buildPopupContent();
    }
    __buildPopupContent() {
        const separator = new qx.ui.core.Widget();
        separator.setHeight(1);
        separator.setBackgroundColor("var(--border)");
        const searchContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox(8).set({ alignY: "middle" }));
        searchContainer.setAlignY("middle");
        const searchInput = new BsInput("", this.__placeholder);
        searchInput.setValue("");
        searchInput.setLeadingHtml('<img src="resource/app/icons/search.svg" alt="" width="16" height="16" style="display:block;opacity:0.7" />');
        searchInput.onInput((value) => {
            this.__filteredOptions = this.__options.filter((opt) => opt.label.toLowerCase().includes(value.toLowerCase()) ||
                opt.value.toLowerCase().includes(value.toLowerCase()));
            this.__renderOptions();
        });
        this.__searchContainer = searchContainer;
        searchContainer.add(searchInput, { flex: 1 });
        const listContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox(0));
        listContainer.set({
            maxHeight: 250,
        });
        listContainer.getContentElement().setStyle("overflow-y", "auto");
        listContainer.getContentElement().setStyle("overflow-x", "hidden");
        this.__listContainer = listContainer;
        this.__popupContainer.add(searchContainer);
        this.__popupContainer.add(separator);
        this.__popupContainer.add(listContainer);
        this.__renderOptions();
    }
    __renderOptions() {
        this.__listContainer.removeAll();
        this.__optionWidgets = [];
        if (this.__filteredOptions.length === 0) {
            const emptyLabel = new qx.ui.basic.Label("No result found.");
            emptyLabel.setTextColor("var(--muted-foreground)");
            emptyLabel.setPadding(8);
            this.__listContainer.add(emptyLabel);
            return;
        }
        this.__filteredOptions.forEach((opt) => {
            const btn = new BsButton(opt.label, undefined, {
                variant: "ghost",
                className: "w-full justify-start text-left",
            });
            btn.setHeight(36);
            btn.setPaddingLeft(8);
            btn.setPaddingRight(8);
            btn.onClick(() => {
                this.__selectOption(opt);
            });
            this.__optionWidgets.push(btn);
            this.__listContainer.add(btn);
        });
    }
    __selectOption(opt) {
        this.__value = opt.value;
        this.__updateDisplay();
        this.__closePopup();
        this.fireDataEvent("changeValue", this.__value);
    }
    __updateDisplay() {
        var _a;
        if (!this.__displayEl)
            return;
        const selected = this.__options.find((o) => o.value === this.__value);
        this.__displayEl.textContent = (_a = selected === null || selected === void 0 ? void 0 : selected.label) !== null && _a !== void 0 ? _a : "";
        if (this.__searchInputEl) {
            this.__searchInputEl.value = "";
        }
        this.__filteredOptions = [...this.__options];
        this.__renderOptions();
    }
    __bindTrigger() {
        const root = this.__htmlTrigger.getContentElement().getDomElement();
        if (!root)
            return;
        if (this.__triggerEl) {
            this.__triggerEl.removeEventListener("click", this.__togglePopup);
        }
        this.__triggerEl = root === null || root === void 0 ? void 0 : root.querySelector("button");
        this.__displayEl = root === null || root === void 0 ? void 0 : root.querySelector(".truncate");
        if (!this.__triggerEl)
            return;
        this.__triggerEl.addEventListener("click", this.__togglePopup);
    }
    __openPopup() {
        this.__isOpen = true;
        this.__popup.show();
        this.__placePopup();
        this.__bindOutsideClick();
        this.__updateTriggerAria(true);
        qx.event.Timer.once(() => {
            this.__placePopup();
            const children = this.__searchContainer.getChildren();
            const searchInput = children.length > 1 ? children[1] : null;
            if (searchInput && searchInput.focus) {
                searchInput.focus();
            }
        }, this, 50);
    }
    __closePopup() {
        this.__isOpen = false;
        this.__unbindOutsideClick();
        this.__popup.hide();
        this.__updateTriggerAria(false);
        this.__filteredOptions = [...this.__options];
        this.__renderOptions();
    }
    __updateTriggerAria(expanded) {
        if (this.__triggerEl) {
            this.__triggerEl.setAttribute("aria-expanded", expanded ? "true" : "false");
        }
    }
    __placePopup() {
        var _a;
        const triggerRoot = this.__htmlTrigger.getContentElement().getDomElement();
        if (!triggerRoot)
            return;
        const buttonEl = triggerRoot.querySelector("button");
        const triggerRect = (_a = buttonEl === null || buttonEl === void 0 ? void 0 : buttonEl.getBoundingClientRect()) !== null && _a !== void 0 ? _a : triggerRoot.getBoundingClientRect();
        const popupEl = this.__popup.getContentElement().getDomElement();
        if (!popupEl)
            return;
        this.__popupContainer.setWidth(triggerRect.width);
        const popupRect = popupEl.getBoundingClientRect();
        const gap = 2;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        let left;
        let top;
        const dir = this.__direction;
        if (dir === "left") {
            const preferredLeft = Math.round(triggerRect.left - popupRect.width - gap);
            left = Math.min(Math.max(8, preferredLeft), Math.max(8, viewportWidth - popupRect.width - 8));
            top = Math.round(triggerRect.top);
        }
        else if (dir === "right") {
            const preferredLeft = Math.round(triggerRect.right + gap);
            left = Math.min(Math.max(8, preferredLeft), Math.max(8, viewportWidth - popupRect.width - 8));
            top = Math.round(triggerRect.top);
        }
        else if (dir === "top") {
            const preferredLeft = Math.round(triggerRect.left);
            left = Math.min(Math.max(8, preferredLeft), Math.max(8, viewportWidth - popupRect.width - 8));
            top = Math.round(triggerRect.top - popupRect.height - gap);
        }
        else {
            const preferredLeft = Math.round(triggerRect.left);
            left = Math.min(Math.max(8, preferredLeft), Math.max(8, viewportWidth - popupRect.width - 8));
            top = Math.round(triggerRect.bottom + gap);
        }
        if (dir === "left" || dir === "right") {
            const preferredTop = Math.round(triggerRect.top);
            const hasSpaceBelow = preferredTop + popupRect.height <= viewportHeight - 8;
            const hasSpaceAbove = preferredTop >= 8;
            if (!hasSpaceBelow && hasSpaceAbove) {
                top = Math.max(8, viewportHeight - popupRect.height - 8);
            }
            else if (!hasSpaceBelow && !hasSpaceAbove) {
                top = 8;
            }
        }
        else {
            if (dir === "top") {
                const hasSpaceAbove = top >= 8;
                if (!hasSpaceAbove) {
                    top = Math.round(triggerRect.bottom + gap);
                }
            }
            else {
                const hasSpaceBelow = top + popupRect.height <= viewportHeight - 8;
                if (!hasSpaceBelow) {
                    const preferredTopAlt = Math.round(triggerRect.top - popupRect.height - gap);
                    if (preferredTopAlt >= 8) {
                        top = preferredTopAlt;
                    }
                }
            }
        }
        this.__popup.moveTo(left, top);
    }
    __bindOutsideClick() {
        if (this.__outsideClickHandler)
            return;
        this.__outsideClickHandler = (ev) => {
            const target = ev.target;
            if (!target)
                return;
            const triggerRoot = this.__htmlTrigger
                .getContentElement()
                .getDomElement();
            const popupRoot = this.__popup.getContentElement().getDomElement();
            const clickedTrigger = !!triggerRoot && triggerRoot.contains(target);
            const clickedPopup = !!popupRoot && popupRoot.contains(target);
            if (!clickedTrigger && !clickedPopup)
                this.__closePopup();
        };
        document.addEventListener("mousedown", this.__outsideClickHandler, true);
    }
    __unbindOutsideClick() {
        if (!this.__outsideClickHandler)
            return;
        document.removeEventListener("mousedown", this.__outsideClickHandler, true);
        this.__outsideClickHandler = null;
    }
    __renderTrigger() {
        const selected = this.__options.find((o) => o.value === this.__value);
        const displayText = selected ? this.__escape(selected.label) : this.__escape(this.__placeholder);
        const disabledAttr = this.__disabled ? "disabled" : "";
        const disabledClass = this.__disabled ? "opacity-50 cursor-not-allowed" : "";
        const classes = ["btn-outline", "w-full", this.__className, disabledClass]
            .filter(Boolean)
            .join(" ");
        this.__htmlTrigger.setHtml(`
      <div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;">
        <button type="button" class="${classes}" aria-haspopup="listbox" aria-expanded="false" ${disabledAttr}>
          <span class="truncate ${!selected ? "text-muted-foreground" : ""}">${displayText}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevrons-up-down text-muted-foreground opacity-50 shrink-0">
            <path d="m7 15 5 5 5-5" />
            <path d="m7 9 5-5 5 5" />
          </svg>
        </button>
      </div>
    `);
    }
    __escape(value) {
        return value
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }
    __setupResizeObserver() {
        const root = this.__htmlTrigger.getContentElement().getDomElement();
        if (!root)
            return;
        this.__resizeObserver = new ResizeObserver(([entry]) => {
            const target = entry.target;
            this.__cachedContentWidth = Math.round(target.scrollWidth || entry.contentRect.width);
            this.__cachedContentHeight = Math.round(target.scrollHeight || entry.contentRect.height);
            this.scheduleLayoutUpdate();
        });
        this.__resizeObserver.observe(root);
        this.addListener("disappear", () => {
            var _a;
            (_a = this.__resizeObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
        });
    }
    // @ts-ignore
    _getContentHint() {
        var _a;
        if (this.__cachedContentWidth > 0 && this.__cachedContentHeight > 0) {
            return { width: this.__cachedContentWidth, height: this.__cachedContentHeight };
        }
        const contentEl = (_a = this.__htmlTrigger.getContentElement()) === null || _a === void 0 ? void 0 : _a.getDomElement();
        if (contentEl) {
            return { width: contentEl.scrollWidth || 0, height: contentEl.scrollHeight || 0 };
        }
        return { width: 0, height: 0 };
    }
    getValue() {
        return this.__value;
    }
    setValue(value) {
        this.__value = value;
        this.__updateDisplay();
        return this;
    }
    setOptions(options) {
        this.__options = options;
        this.__filteredOptions = [...options];
        if (this.__value && !options.find((o) => o.value === this.__value)) {
            this.__value = "";
            this.__updateDisplay();
        }
        this.__renderOptions();
        return this;
    }
    setEnabled(enabled) {
        this.__disabled = !enabled;
        return this;
    }
    onChange(handler) {
        this.addListener("changeValue", (ev) => {
            var _a;
            handler((_a = ev.getData()) !== null && _a !== void 0 ? _a : "");
        });
        return this;
    }
}
BsCombobox.events = {
    changeValue: "qx.event.type.Data",
};
class BsDateField extends qx.ui.basic.Atom {
    constructor() {
        super();
        this.__html = null;
        this.__inputElement = null;
        this.__iconButton = null;
        this.__popoverElement = null;
        this.__calendarElement = null;
        this.__isOpen = false;
        this.__selectedDate = null;
        this.__popoverContainer = null;
        this.__updatePositionHandler = null;
        this.__clickHandler = null;
        this.__calendarClickHandler = null;
        this.__value = null;
        this.__disabled = false;
        this.__resizeObserver = null;
        this.__cachedContentWidth = 0;
        this.__cachedContentHeight = 0;
        // Set a layout so children get measured and laid out
        this._setLayout(new qx.ui.layout.Canvas());
        this.setAllowGrowX(true);
        // Generate unique ID for the component
        this.__dateId = `date-${qx.core.Id.getInstance().toHashCode()}`;
        this.__isOpen = false;
        this.__currentMonth = new Date().getMonth();
        this.__currentYear = new Date().getFullYear();
        // Create HTML with Basecoat input structure (similar to TextField)
        this.__html = new qx.ui.embed.Html(`
      <div style="margin: 0; padding: 0; min-width: 0; display: flex; align-items: center; height: 100%; position: relative; width: 100%;">
        <input 
          type="text" 
          class="input" 
          id="${this.__dateId}-trigger" 
          style="width: 100%; padding-right: calc(var(--spacing) * 8); cursor: text;"
          aria-haspopup="dialog" 
          aria-expanded="false" 
          aria-controls="${this.__dateId}-calendar"
          placeholder="MM/DD/YYYY"
          maxlength="10"
        />
        <button 
          type="button" 
          id="${this.__dateId}-icon-btn"
          style="position: absolute; right: calc(var(--spacing) * 1); top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: calc(var(--spacing) * 0.5); display: flex; align-items: center; pointer-events: auto; z-index: 1;"
          aria-label="Open calendar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.5;">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
            <line x1="16" x2="16" y1="2" y2="6"></line>
            <line x1="8" x2="8" y1="2" y2="6"></line>
            <line x1="3" x2="21" y1="10" y2="10"></line>
          </svg>
        </button>
        <div 
          id="${this.__dateId}-popover" 
          data-basecoat-ignore="true"
          aria-hidden="true"
          style="display: none !important; visibility: hidden !important; position: absolute; top: 100%; left: 0; margin-top: 2px; z-index: 10001; width: auto !important; min-width: 0 !important; max-width: none !important; background-color: var(--popover); color: var(--popover-foreground); border-radius: calc(var(--radius) - 2px); border: 1px solid var(--border); box-shadow: var(--shadow-md);"
        >
          <div id="${this.__dateId}-calendar" role="dialog" aria-label="Calendar" style="padding: calc(var(--spacing) * 0.75); box-sizing: border-box; width: 100% !important; min-width: 0 !important; max-width: 100% !important; pointer-events: auto !important;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: calc(var(--spacing) * 0.75);">
              <button type="button" id="${this.__dateId}-prev-month" style="background: none; border: none; cursor: pointer; padding: calc(var(--spacing) * 0.5); display: flex; align-items: center; color: var(--foreground); pointer-events: auto; z-index: 10; position: relative;">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m15 18-6-6 6-6"></path>
                </svg>
              </button>
              <div id="${this.__dateId}-month-year" style="font-weight: 500; font-size: var(--text-sm);"></div>
              <button type="button" id="${this.__dateId}-next-month" style="background: none; border: none; cursor: pointer; padding: calc(var(--spacing) * 0.5); display: flex; align-items: center; color: var(--foreground); pointer-events: auto; z-index: 10; position: relative;">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
              </button>
            </div>
            <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: calc(var(--spacing) * 0.15); margin-bottom: calc(var(--spacing) * 0.4);">
              <div style="text-align: center; font-size: var(--text-xs); font-weight: 500; color: var(--muted-foreground); padding: calc(var(--spacing) * 0.25);">Sun</div>
              <div style="text-align: center; font-size: var(--text-xs); font-weight: 500; color: var(--muted-foreground); padding: calc(var(--spacing) * 0.25);">Mon</div>
              <div style="text-align: center; font-size: var(--text-xs); font-weight: 500; color: var(--muted-foreground); padding: calc(var(--spacing) * 0.25);">Tue</div>
              <div style="text-align: center; font-size: var(--text-xs); font-weight: 500; color: var(--muted-foreground); padding: calc(var(--spacing) * 0.25);">Wed</div>
              <div style="text-align: center; font-size: var(--text-xs); font-weight: 500; color: var(--muted-foreground); padding: calc(var(--spacing) * 0.25);">Thu</div>
              <div style="text-align: center; font-size: var(--text-xs); font-weight: 500; color: var(--muted-foreground); padding: calc(var(--spacing) * 0.25);">Fri</div>
              <div style="text-align: center; font-size: var(--text-xs); font-weight: 500; color: var(--muted-foreground); padding: calc(var(--spacing) * 0.25);">Sat</div>
            </div>
            <div id="${this.__dateId}-days" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: calc(var(--spacing) * 0.15);"></div>
          </div>
        </div>
        <input type="hidden" name="${this.__dateId}-value" value="" />
      </div>
    `);
        // Add child with layout properties
        this._add(this.__html, { edge: 0 });
        // Listen to enabled property changes
        this.addListener("changeEnabled", (e) => {
            this.__applyEnabled(e.getData());
        }, this);
        // Hook DOM events after the element appears
        this.__html.addListenerOnce("appear", () => {
            const widgetElement = this.getContentElement();
            if (widgetElement) {
                widgetElement.setStyle("overflow", "visible");
                widgetElement.setStyle("z-index", "1");
                widgetElement.setStyle("min-width", "0");
            }
            // Ensure container respects widget width
            const container = this.__getContainerElement();
            if (container) {
                container.style.minWidth = "0";
            }
            this.__setupDatePickerEvents();
            this.__renderCalendar();
            this.__applyEnabled(!this.__disabled);
            const initialValue = this.__value;
            if (initialValue) {
                this.__applyValue(initialValue);
            }
            // Make widget content element delegate focus to input
            if (widgetElement) {
                const domElement = widgetElement.getDomElement();
                if (domElement) {
                    // When widget receives focus, delegate to input
                    domElement.addEventListener("focusin", (e) => {
                        const input = this.__inputElement;
                        if (input && e.target === domElement) {
                            input.focus();
                        }
                    });
                }
            }
            this.__setupResizeObserver();
        });
    }
    /**
     * Setup event listeners for the date picker
     */
    __setupDatePickerEvents() {
        const container = this.__getContainerElement();
        if (!container)
            return;
        this.__inputElement = container.querySelector(`#${this.__dateId}-trigger`);
        this.__iconButton = container.querySelector(`#${this.__dateId}-icon-btn`);
        this.__popoverElement = container.querySelector(`#${this.__dateId}-popover`);
        this.__calendarElement = container.querySelector(`#${this.__dateId}-calendar`);
        if (!this.__inputElement || !this.__popoverElement || !this.__calendarElement) {
            return;
        }
        // Exclude qooxdoo widget content element from tab order
        const widgetElement = this.getContentElement();
        if (widgetElement) {
            const domElement = widgetElement.getDomElement();
            if (domElement) {
                domElement.setAttribute("tabindex", "-1");
            }
        }
        // Exclude wrapper div from tab order so tabbing goes directly to input
        const wrapperDiv = container.querySelector("div");
        if (wrapperDiv) {
            wrapperDiv.setAttribute("tabindex", "-1");
        }
        // Ensure input is focusable - remove any tabindex that might prevent tab navigation
        if (this.__inputElement.hasAttribute("tabindex") && this.__inputElement.getAttribute("tabindex") === "-1") {
            this.__inputElement.removeAttribute("tabindex");
        }
        // Ensure input is explicitly in tab order
        this.__inputElement.removeAttribute("tabindex"); // Remove any existing tabindex
        // Native inputs are focusable by default - no tabindex needed
        // Handle Tab key to prevent widget wrapper from interfering
        this.__inputElement.addEventListener("keydown", (e) => {
            if (e.key === "Tab") {
                // Allow Tab to work normally - don't prevent default
                // This ensures tab navigation works properly
                e.stopPropagation(); // Prevent widget wrapper from handling it
            }
        });
        // Input click - allow direct typing, don't open calendar
        // The calendar icon button will handle opening the calendar
        // Handle direct date input with strict formatting
        this.__inputElement.addEventListener("input", (e) => {
            this.__formatDateInput(e.target);
            this.__handleDateInput(e.target.value);
        });
        // Prevent invalid characters (only digits and slashes)
        this.__inputElement.addEventListener("keypress", (e) => {
            const char = String.fromCharCode(e.which || e.keyCode);
            // Allow digits, slashes, and control keys
            if (!/[0-9/]/.test(char) && !/[0-8]/.test(e.key) &&
                e.key !== 'Backspace' && e.key !== 'Delete' &&
                e.key !== 'Tab' && e.key !== 'ArrowLeft' &&
                e.key !== 'ArrowRight' && e.key !== 'ArrowUp' &&
                e.key !== 'ArrowDown' && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
            }
        });
        // Prevent paste of invalid content
        this.__inputElement.addEventListener("paste", (e) => {
            e.preventDefault();
            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
            // Remove all non-digit characters except slashes
            const cleaned = pastedText.replace(/[^\d/]/g, '');
            // Format the cleaned input
            const formatted = this.__formatDateString(cleaned);
            this.__inputElement.value = formatted;
            this.__handleDateInput(formatted);
        });
        // Icon button click to toggle calendar
        if (this.__iconButton) {
            this.__iconButton.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!this.__disabled) {
                    this.__toggleCalendar();
                }
            }, true);
        }
        // Previous/Next month buttons
        const prevBtn = container.querySelector(`#${this.__dateId}-prev-month`);
        const nextBtn = container.querySelector(`#${this.__dateId}-next-month`);
        if (prevBtn) {
            prevBtn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.__changeMonth(-1);
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.__changeMonth(1);
            });
        }
        // Click outside to close
        this.__clickHandler = (e) => {
            var _a, _b;
            if (!this.__isOpen)
                return;
            const target = e.target;
            // Check if click is on navigation buttons - if so, don't close
            const prevBtnEl = (_a = this.__popoverElement) === null || _a === void 0 ? void 0 : _a.querySelector(`#${this.__dateId}-prev-month`);
            const nextBtnEl = (_b = this.__popoverElement) === null || _b === void 0 ? void 0 : _b.querySelector(`#${this.__dateId}-next-month`);
            if ((prevBtnEl && (prevBtnEl === target || prevBtnEl.contains(target))) ||
                (nextBtnEl && (nextBtnEl === target || nextBtnEl.contains(target)))) {
                return; // Let the button handler process it
            }
            const isInCalendar = this.__calendarElement && this.__calendarElement.contains(target);
            const isInInput = this.__inputElement && this.__inputElement.contains(target);
            const isInIcon = this.__iconButton && this.__iconButton.contains(target);
            if (!isInCalendar && !isInInput && !isInIcon) {
                this.__closeCalendar();
            }
        };
    }
    /**
     * Get the container DOM element
     */
    __getContainerElement() {
        if (this.__html && this.__html.getContentElement()) {
            return this.__html.getContentElement().getDomElement();
        }
        return null;
    }
    /**
     * Update popover position (for scroll/resize)
     */
    __updatePopoverPosition() {
        if (!this.__isOpen || !this.__inputElement || !this.__popoverElement) {
            return;
        }
        const buttonRect = this.__inputElement.getBoundingClientRect();
        const top = buttonRect.bottom + window.scrollY + 2;
        const left = buttonRect.left + window.scrollX;
        const width = buttonRect.width;
        this.__popoverElement.style.setProperty("top", `${top}px`, "important");
        this.__popoverElement.style.setProperty("left", `${left}px`, "important");
        this.__popoverElement.style.setProperty("width", `${width}px`, "important");
        // Make calendar match popover width
        if (this.__popoverElement) {
            const calendarElement = this.__popoverElement.querySelector(`#${this.__dateId}-calendar`);
            if (calendarElement) {
                calendarElement.style.setProperty("width", `${width}px`, "important");
                calendarElement.style.setProperty("max-width", `${width}px`, "important");
                calendarElement.style.setProperty("min-width", `${width}px`, "important");
            }
        }
    }
    /**
     * Toggle calendar open/closed
     */
    __toggleCalendar() {
        if (this.__isOpen) {
            this.__closeCalendar();
        }
        else {
            this.__openCalendar();
        }
    }
    /**
     * Open the calendar
     */
    __openCalendar() {
        if (!this.__popoverElement || !this.__inputElement) {
            return;
        }
        // Ensure __popoverElement is a DOM element
        if (typeof this.__popoverElement.querySelector !== 'function') {
            console.error('DateField: _popoverElement is not a valid DOM element');
            return;
        }
        this.__isOpen = true;
        // Move popover to body to escape overflow constraints
        if (!this.__popoverContainer) {
            this.__popoverContainer = document.createElement("div");
            this.__popoverContainer.className = "datefield-popover-container";
            this.__popoverContainer.setAttribute("data-basecoat-ignore", "true");
            this.__popoverContainer.style.position = "fixed";
            this.__popoverContainer.style.pointerEvents = "none";
            this.__popoverContainer.style.zIndex = "10000";
            this.__popoverContainer.style.top = "0";
            this.__popoverContainer.style.left = "0";
            document.body.appendChild(this.__popoverContainer);
        }
        if (this.__popoverElement.parentNode !== this.__popoverContainer) {
            this.__popoverContainer.appendChild(this.__popoverElement);
        }
        this.__popoverElement.style.pointerEvents = "auto";
        // Re-query calendar element after moving to body (in case reference is stale)
        if (this.__popoverElement) {
            this.__calendarElement = this.__popoverElement.querySelector(`#${this.__dateId}-calendar`);
        }
        // Use event delegation on the calendar element for navigation buttons
        if (this.__calendarElement) {
            // Remove old listener if exists
            if (this.__calendarClickHandler) {
                this.__calendarElement.removeEventListener("click", this.__calendarClickHandler);
            }
            // Add new event delegation handler
            this.__calendarClickHandler = (e) => {
                let target = e.target;
                // Traverse up to find the button if clicking on SVG or path
                while (target && target !== this.__calendarElement) {
                    if (target.id === `${this.__dateId}-prev-month`) {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        this.__changeMonth(-1);
                        return;
                    }
                    if (target.id === `${this.__dateId}-next-month`) {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        this.__changeMonth(1);
                        return;
                    }
                    target = target.parentElement;
                }
            };
            this.__calendarElement.addEventListener("click", this.__calendarClickHandler, true);
        }
        // Remove aria-hidden
        this.__popoverElement.removeAttribute("aria-hidden");
        // Position popover
        this.__popoverElement.style.position = "fixed";
        this.__popoverElement.style.zIndex = "10001";
        this.__popoverElement.style.setProperty("transition", "none", "important");
        this.__popoverElement.style.setProperty("transform", "none", "important");
        this.__popoverElement.style.setProperty("scale", "1", "important");
        this.__popoverElement.style.setProperty("opacity", "1", "important");
        this.__popoverElement.style.setProperty("display", "none", "important");
        this.__updatePopoverPosition();
        this.__popoverElement.style.setProperty("display", "block", "important");
        this.__popoverElement.style.setProperty("visibility", "visible", "important");
        this.__inputElement.setAttribute("aria-expanded", "true");
        // Add scroll/resize listeners
        this.__updatePositionHandler = this.__updatePopoverPosition.bind(this);
        window.addEventListener("scroll", this.__updatePositionHandler, true);
        window.addEventListener("resize", this.__updatePositionHandler);
        // Add click outside listener
        if (this.__clickHandler) {
            setTimeout(() => {
                document.addEventListener("click", this.__clickHandler, true);
            }, 0);
        }
        // Render calendar for current month
        this.__renderCalendar();
    }
    /**
     * Close the calendar
     */
    __closeCalendar() {
        if (!this.__popoverElement || !this.__inputElement) {
            return;
        }
        this.__isOpen = false;
        // Remove scroll/resize listeners
        if (this.__updatePositionHandler) {
            window.removeEventListener("scroll", this.__updatePositionHandler, true);
            window.removeEventListener("resize", this.__updatePositionHandler);
            this.__updatePositionHandler = null;
        }
        // Remove document click listener
        if (this.__clickHandler) {
            document.removeEventListener("click", this.__clickHandler, true);
            this.__clickHandler = null;
        }
        // Remove calendar click handler
        if (this.__calendarClickHandler && this.__calendarElement) {
            this.__calendarElement.removeEventListener("click", this.__calendarClickHandler, true);
            this.__calendarClickHandler = null;
        }
        this.__popoverElement.setAttribute("aria-hidden", "true");
        this.__popoverElement.style.setProperty("display", "none", "important");
        this.__popoverElement.style.setProperty("visibility", "hidden", "important");
        this.__inputElement.setAttribute("aria-expanded", "false");
        // Move popover back to original container
        const container = this.__getContainerElement();
        if (container && this.__popoverElement.parentNode === this.__popoverContainer) {
            container.appendChild(this.__popoverElement);
        }
    }
    /**
     * Change month
     */
    __changeMonth(delta) {
        this.__currentMonth += delta;
        if (this.__currentMonth < 0) {
            this.__currentMonth = 11;
            this.__currentYear--;
        }
        else if (this.__currentMonth > 11) {
            this.__currentMonth = 0;
            this.__currentYear++;
        }
        this.__renderCalendar();
    }
    /**
     * Render the calendar grid
     */
    __renderCalendar() {
        // Query from popover element to work both before and after moving to body
        // If popoverElement exists (after setup), use it; otherwise use container
        let searchRoot = null;
        if (this.__popoverElement) {
            searchRoot = this.__popoverElement;
        }
        else {
            const container = this.__getContainerElement();
            if (container) {
                searchRoot = container;
            }
        }
        if (!searchRoot)
            return;
        const daysContainer = searchRoot.querySelector(`#${this.__dateId}-days`);
        const monthYearDisplay = searchRoot.querySelector(`#${this.__dateId}-month-year`);
        if (!daysContainer || !monthYearDisplay)
            return;
        // Update month/year display
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        monthYearDisplay.textContent = `${monthNames[this.__currentMonth]} ${this.__currentYear}`;
        // Clear days container
        daysContainer.innerHTML = "";
        // Get first day of month and number of days
        const firstDay = new Date(this.__currentYear, this.__currentMonth, 1).getDay();
        const daysInMonth = new Date(this.__currentYear, this.__currentMonth + 1, 0).getDate();
        const today = new Date();
        const selectedDate = this.__selectedDate;
        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            const cell = document.createElement("div");
            cell.style.padding = "calc(var(--spacing) * 0.25)";
            daysContainer.appendChild(cell);
        }
        // Add day cells
        for (let day = 1; day <= daysInMonth; day++) {
            const cell = document.createElement("button");
            cell.type = "button";
            cell.textContent = day.toString();
            cell.style.cssText = `
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        background: transparent;
        cursor: pointer;
        border-radius: calc(var(--radius) - 4px);
        font-size: var(--text-xs);
        transition: all 0.2s;
        padding: calc(var(--spacing) * 0.25);
        min-width: 0;
      `;
            const cellDate = new Date(this.__currentYear, this.__currentMonth, day);
            const isToday = cellDate.toDateString() === today.toDateString();
            const isSelected = selectedDate && cellDate.toDateString() === selectedDate.toDateString();
            if (isSelected) {
                cell.style.backgroundColor = "var(--primary)";
                cell.style.color = "var(--primary-foreground)";
            }
            else if (isToday) {
                cell.style.border = "1px solid var(--ring)";
            }
            cell.addEventListener("mouseenter", () => {
                if (!isSelected) {
                    cell.style.backgroundColor = "var(--accent)";
                    cell.style.color = "var(--accent-foreground)";
                }
            });
            cell.addEventListener("mouseleave", () => {
                if (!isSelected) {
                    cell.style.backgroundColor = "transparent";
                    cell.style.color = "";
                    if (isToday) {
                        cell.style.border = "1px solid var(--ring)";
                    }
                    else {
                        cell.style.border = "none";
                    }
                }
            });
            cell.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.__selectDate(cellDate);
            });
            daysContainer.appendChild(cell);
        }
    }
    /**
     * Select a date
     */
    __selectDate(date) {
        this.__selectedDate = date;
        this.setValue(date);
        this.__updateDisplay();
        this.__closeCalendar();
    }
    /**
     * Update the display text
     */
    __updateDisplay() {
        if (!this.__inputElement)
            return;
        if (this.__selectedDate) {
            const month = this.__pad2(this.__selectedDate.getMonth() + 1);
            const day = this.__pad2(this.__selectedDate.getDate());
            const year = this.__selectedDate.getFullYear();
            this.__inputElement.value = `${month}/${day}/${year}`;
        }
        else {
            this.__inputElement.value = "";
        }
    }
    /**
     * Handle direct date input from user
     */
    __handleDateInput(value) {
        if (!value || value.trim() === "") {
            this.__selectedDate = null;
            this.setValue(null);
            return;
        }
        // Parse MM/DD/YYYY format
        const date = this.__parseDateInput(value);
        if (date && !isNaN(date.getTime())) {
            this.__selectedDate = date;
            this.setValue(date);
            // Update calendar to show the entered month/year
            this.__currentMonth = date.getMonth();
            this.__currentYear = date.getFullYear();
            if (this.__isOpen) {
                this.__renderCalendar();
            }
        }
    }
    /**
     * Format date string to MM/DD/YYYY format
     */
    __formatDateString(digits) {
        let formatted = '';
        if (digits.length > 0) {
            formatted = digits.substring(0, 2);
        }
        if (digits.length > 2) {
            formatted += '/' + digits.substring(2, 4);
        }
        if (digits.length > 4) {
            formatted += '/' + digits.substring(4, 8);
        }
        return formatted;
    }
    /**
     * Format date input as user types (strict MM/DD/YYYY)
     */
    __formatDateInput(input) {
        var _a;
        let value = input.value;
        const cursorPos = (_a = input.selectionStart) !== null && _a !== void 0 ? _a : 0;
        // Remove all non-digit characters
        let digits = value.replace(/[^\d]/g, '');
        // Limit to 8 digits (MMDDYYYY)
        if (digits.length > 8) {
            digits = digits.substring(0, 8);
        }
        // Format with slashes: MM/DD/YYYY
        const formatted = this.__formatDateString(digits);
        // Validate month (01-12)
        if (digits.length >= 2) {
            const month = parseInt(digits.substring(0, 2), 10);
            if (month > 12) {
                // Invalid month, keep only first digit
                digits = digits.substring(0, 1);
                const newFormatted = this.__formatDateString(digits);
                input.value = newFormatted;
                setTimeout(() => {
                    input.setSelectionRange(newFormatted.length, newFormatted.length);
                }, 0);
                return;
            }
        }
        // Validate day (01-31) - basic check
        if (digits.length >= 4) {
            const day = parseInt(digits.substring(2, 4), 10);
            if (day > 31) {
                // Invalid day, keep only first 3 digits
                digits = digits.substring(0, 3);
                const newFormatted = this.__formatDateString(digits);
                input.value = newFormatted;
                setTimeout(() => {
                    input.setSelectionRange(newFormatted.length, newFormatted.length);
                }, 0);
                return;
            }
        }
        // Update value if changed
        if (input.value !== formatted) {
            input.value = formatted;
            // Adjust cursor position after formatting
            let newCursorPos = cursorPos;
            const oldLength = value.length;
            const newLength = formatted.length;
            // If a slash was added, move cursor forward
            if (newLength > oldLength) {
                newCursorPos = cursorPos + (newLength - oldLength);
            }
            else if (newLength < oldLength) {
                // If characters were removed, adjust cursor
                newCursorPos = Math.max(0, cursorPos - (oldLength - newLength));
            }
            // Ensure cursor doesn't go beyond the formatted string
            newCursorPos = Math.min(newCursorPos, formatted.length);
            setTimeout(() => {
                input.setSelectionRange(newCursorPos, newCursorPos);
            }, 0);
        }
    }
    /**
     * Parse MM/DD/YYYY string to Date object
     */
    __parseDateInput(value) {
        if (!value)
            return null;
        // Remove any non-digit characters except slashes
        const cleaned = value.replace(/[^\d/]/g, '');
        const parts = cleaned.split('/');
        if (parts.length !== 3)
            return null;
        const month = parseInt(parts[0], 10);
        const day = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);
        // Validate ranges
        if (isNaN(month) || month < 1 || month > 12)
            return null;
        if (isNaN(day) || day < 1 || day > 31)
            return null;
        if (isNaN(year) || year < 1900 || year > 2100)
            return null;
        // Create date and validate (handles invalid dates like Feb 30)
        const date = new Date(year, month - 1, day);
        if (date.getMonth() !== month - 1 || date.getDate() !== day || date.getFullYear() !== year) {
            return null; // Invalid date
        }
        return date;
    }
    /**
     * Convert Date object to YYYY-MM-DD string
     */
    __dateToString(date) {
        if (!date || !(date instanceof Date)) {
            return "";
        }
        const year = date.getFullYear();
        const month = this.__pad2(date.getMonth() + 1);
        const day = this.__pad2(date.getDate());
        return `${year}-${month}-${day}`;
    }
    /**
     * Pad number to two digits without using String.padStart (ES2017)
     */
    __pad2(n) {
        return n < 10 ? `0${n}` : String(n);
    }
    /**
     * Apply value changes
     */
    __applyValue(value) {
        if (value && value instanceof Date) {
            this.__selectedDate = value;
            this.__currentMonth = value.getMonth();
            this.__currentYear = value.getFullYear();
            this.__updateDisplay();
            if (this.__isOpen) {
                this.__renderCalendar();
            }
        }
        else {
            this.__selectedDate = null;
            this.__updateDisplay();
        }
    }
    /**
     * Apply enabled state
     */
    __applyEnabled(enabled) {
        if (this.__inputElement) {
            this.__inputElement.disabled = !enabled;
        }
        if (this.__iconButton) {
            this.__iconButton.disabled = !enabled;
            this.__iconButton.style.pointerEvents = enabled ? "auto" : "none";
            this.__iconButton.style.opacity = enabled ? "1" : "0.5";
        }
    }
    /**
     * Get the current value
     */
    getValue() {
        return this.__selectedDate || null;
    }
    /**
     * Set the date value
     */
    setValue(value) {
        this.__value = value;
        this.fireDataEvent("changeValue", value);
        this.__applyValue(value);
        return this;
    }
    /**
     * Set enabled state
     */
    setEnabled(enabled) {
        this.__disabled = !enabled;
        this.__applyEnabled(enabled);
        return this;
    }
    /**
     * Listen to value changes
     */
    onChange(handler) {
        this.addListener("changeValue", (ev) => {
            handler(ev.getData());
        });
        return this;
    }
    /**
     * Get the current value (alias)
     */
    getValueDate() {
        return this.__selectedDate || null;
    }
    /**
     * Reset the date field value
     */
    resetValue() {
        this.setValue(null);
        return this;
    }
    /**
     * Set focus on the date field
     */
    focus() {
        if (this.__inputElement) {
            this.__inputElement.focus();
        }
    }
    /**
     * Remove focus from the date field
     */
    blur() {
        if (this.__inputElement) {
            this.__inputElement.blur();
        }
        this.__closeCalendar();
    }
    /**
     * Destructor
     */
    destruct() {
        var _a;
        this.__closeCalendar();
        (_a = this.__resizeObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
        if (this.__popoverContainer && this.__popoverContainer.parentNode) {
            this.__popoverContainer.parentNode.removeChild(this.__popoverContainer);
        }
        super.destruct();
    }
    __setupResizeObserver() {
        const container = this.__getContainerElement();
        if (!container)
            return;
        this.__resizeObserver = new ResizeObserver(([entry]) => {
            const target = entry.target;
            this.__cachedContentWidth = Math.round(target.scrollWidth || entry.contentRect.width);
            this.__cachedContentHeight = Math.round(target.scrollHeight || entry.contentRect.height);
            this.scheduleLayoutUpdate();
        });
        this.__resizeObserver.observe(container);
        this.addListener("disappear", () => {
            var _a;
            (_a = this.__resizeObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
        });
    }
    // @ts-ignore
    _getContentHint() {
        var _a, _b;
        if (this.__cachedContentWidth > 0 && this.__cachedContentHeight > 0) {
            return { width: this.__cachedContentWidth, height: this.__cachedContentHeight };
        }
        const contentEl = (_b = (_a = this.__html) === null || _a === void 0 ? void 0 : _a.getContentElement()) === null || _b === void 0 ? void 0 : _b.getDomElement();
        if (contentEl) {
            return { width: contentEl.scrollWidth || 0, height: contentEl.scrollHeight || 0 };
        }
        return { width: 0, height: 0 };
    }
}
BsDateField.events = {
    changeValue: "qx.event.type.Data",
};
class BsDrawer extends qx.ui.container.Composite {
    constructor(content, drawerPanel) {
        var _a, _b;
        super(new qx.ui.layout.Canvas());
        this.__open = false;
        this.__disposed = false;
        this.__isAnimating = false;
        this.__animationToken = 0;
        this.__dragStartY = null;
        this.__dragOffset = 0;
        this.add(content, { left: 0, right: 0, top: 0, bottom: 0 });
        this.__backdrop = new qx.ui.core.Widget();
        this.__backdrop.set({
            backgroundColor: AppColors.overlay(0.45),
            zIndex: 20,
        });
        this.__backdrop.addListener("tap", () => this.close());
        this.add(this.__backdrop, { left: 0, right: 0, top: 0, bottom: 0 });
        this.__drawerPanel = drawerPanel;
        (_b = (_a = this.__drawerPanel).resetWidth) === null || _b === void 0 ? void 0 : _b.call(_a);
        this.__drawerPanel.setAllowGrowX(true);
        this.__drawerPanel.setAllowGrowY(true);
        const handleRow = new qx.ui.container.Composite(new qx.ui.layout.HBox());
        handleRow.set({
            alignY: "middle",
            paddingTop: 10,
            paddingBottom: 8,
        });
        const spacerLeft = new qx.ui.core.Spacer();
        const spacerRight = new qx.ui.core.Spacer();
        this.__dragHandle = new qx.ui.core.Widget();
        this.__dragHandle.set({
            width: 56,
            height: 6,
            backgroundColor: AppColors.primary(),
            cursor: "ns-resize",
        });
        this.__dragHandle.setDecorator(new qx.ui.decoration.Decorator().set({
            radius: 999,
        }));
        handleRow.add(spacerLeft, { flex: 1 });
        handleRow.add(this.__dragHandle);
        handleRow.add(spacerRight, { flex: 1 });
        this.__bodyScroll = new qx.ui.container.Scroll();
        this.__bodyScroll.add(this.__drawerPanel);
        const sheetHeight = Math.floor(qx.bom.Viewport.getHeight() * 0.5);
        this.__sheet = new qx.ui.container.Composite(new qx.ui.layout.VBox());
        this.__sheet.set({
            zIndex: 30,
            minHeight: sheetHeight,
            maxHeight: sheetHeight,
        });
        this.__sheet.add(handleRow);
        this.__sheet.add(this.__bodyScroll, { flex: 1 });
        this.add(this.__sheet, { left: 0, right: 0, bottom: 0 });
        this.__sheet.setDecorator(new qx.ui.decoration.Decorator().set({
            radiusTopLeft: 16,
            radiusTopRight: 16,
            shadowBlurRadius: 45,
            shadowVerticalLength: -20,
            shadowColor: "rgba(0,0,0,0.22)",
        }));
        this.__sheet.setBackgroundColor(AppColors.sidebar());
        // Start hidden off-screen
        this.__hideImmediate();
        this.__wireDragToClose();
    }
    __hideImmediate() {
        this.__setDomStyles(this.__backdrop, {
            opacity: "0",
            visibility: "hidden",
            pointerEvents: "none",
            transition: "none",
        });
        this.__setDomStyles(this.__sheet, {
            transform: "translateY(110%)",
            visibility: "hidden",
            pointerEvents: "none",
            transition: "none",
            willChange: "transform",
        });
    }
    open() {
        if (this.__open || this.__disposed)
            return;
        this.__open = true;
        this.__isAnimating = true;
        const token = ++this.__animationToken;
        // Make visible at off-screen position, no transition yet
        this.__setDomStyles(this.__backdrop, {
            visibility: "visible",
            pointerEvents: "auto",
            opacity: "0",
            transition: "none",
        });
        this.__setDomStyles(this.__sheet, {
            visibility: "visible",
            pointerEvents: "auto",
            transform: "translateY(110%)",
            transition: "none",
        });
        // Force reflow so the browser registers the initial position
        this.__forceReflow();
        // Now enable transitions and animate to final position
        this.__setDomStyles(this.__backdrop, {
            opacity: "1",
            transition: "opacity 200ms ease",
        });
        this.__setDomStyles(this.__sheet, {
            transform: "translateY(0px)",
            transition: "transform 260ms cubic-bezier(0.16, 1, 0.3, 1)",
        });
        qx.event.Timer.once(() => {
            if (token !== this.__animationToken)
                return;
            this.__isAnimating = false;
        }, this, 280);
    }
    close() {
        if (!this.__open || this.__disposed)
            return;
        this.__open = false;
        this.__isAnimating = true;
        const token = ++this.__animationToken;
        this.__setDomStyles(this.__backdrop, {
            opacity: "0",
            transition: "opacity 180ms ease",
        });
        this.__setDomStyles(this.__sheet, {
            transform: "translateY(110%)",
            transition: "transform 220ms cubic-bezier(0.4, 0, 1, 1)",
        });
        qx.event.Timer.once(() => {
            if (token !== this.__animationToken)
                return;
            this.__setDomStyles(this.__backdrop, {
                visibility: "hidden",
                pointerEvents: "none",
            });
            this.__setDomStyles(this.__sheet, {
                visibility: "hidden",
                pointerEvents: "none",
            });
            this.__isAnimating = false;
            this.__dragStartY = null;
            this.__dragOffset = 0;
            this.fireEvent("close");
        }, this, 240);
    }
    toggle() {
        this.__open ? this.close() : this.open();
    }
    isOpen() {
        return this.__open;
    }
    __forceReflow() {
        const el = this.__sheet
            .getContentElement()
            .getDomElement();
        if (el)
            el.offsetHeight;
    }
    __wireDragToClose() {
        this.__dragHandle.addListener("pointerdown", (ev) => {
            if (!this.__open || this.__isAnimating)
                return;
            this.__dragStartY = ev.getDocumentTop();
            this.__dragOffset = 0;
            this.__setDomStyles(this.__sheet, {
                transition: "none",
            });
            ev.stopPropagation();
        });
        this.addListener("pointermove", (ev) => {
            if (this.__dragStartY === null || !this.__open || this.__isAnimating)
                return;
            const y = ev.getDocumentTop();
            const delta = Math.max(0, y - this.__dragStartY);
            this.__dragOffset = delta;
            this.__setDomStyles(this.__sheet, {
                transform: `translateY(${delta}px)`,
            });
            const fadeProgress = Math.min(1, delta / Math.max(1, this.__getPanelHeight() * 0.8));
            this.__setDomStyles(this.__backdrop, {
                opacity: `${1 - fadeProgress}`,
            });
        });
        const finishDrag = (ev) => {
            if (this.__dragStartY === null)
                return;
            const shouldClose = this.__dragOffset > Math.max(80, this.__getPanelHeight() * 0.22);
            this.__dragStartY = null;
            if (ev)
                ev.stopPropagation();
            if (shouldClose) {
                this.close();
                return;
            }
            this.__setDomStyles(this.__sheet, {
                transition: "transform 180ms cubic-bezier(0.22, 1, 0.36, 1)",
                transform: "translateY(0px)",
            });
            this.__setDomStyles(this.__backdrop, {
                transition: "opacity 180ms ease",
                opacity: "1",
            });
            this.__dragOffset = 0;
        };
        this.addListener("pointerup", finishDrag);
        this.addListener("pointercancel", finishDrag);
    }
    __getPanelHeight() {
        var _a;
        const element = this.__sheet
            .getContentElement()
            .getDomElement();
        return (_a = element === null || element === void 0 ? void 0 : element.offsetHeight) !== null && _a !== void 0 ? _a : qx.bom.Viewport.getHeight() * 0.5;
    }
    __setDomStyles(widget, styles) {
        if (this.__disposed)
            return;
        const contentElement = widget.getContentElement();
        if (!contentElement || !contentElement.setStyle)
            return;
        for (const key in styles) {
            if (!Object.prototype.hasOwnProperty.call(styles, key))
                continue;
            contentElement.setStyle(key, styles[key]);
        }
    }
    dispose() {
        this.__disposed = true;
        super.dispose();
    }
}
BsDrawer.events = {
    close: "qx.event.type.Event",
};
class BsInput extends qx.ui.basic.Atom {
    constructor(value, placeholder, className, type) {
        super();
        this.__leadingHtml = "";
        this.__inputEl = null;
        this.__resizeObserver = null;
        this.__cachedContentWidth = 0;
        this.__cachedContentHeight = 0;
        this._setLayout(new qx.ui.layout.Grow());
        this.setAllowGrowX(true);
        // important for qooxdoo focus manager
        this.setFocusable(true);
        this.__value = value !== null && value !== void 0 ? value : "";
        this.__placeholder = placeholder !== null && placeholder !== void 0 ? placeholder : "";
        this.__className = className !== null && className !== void 0 ? className : "";
        this.__type = type !== null && type !== void 0 ? type : "text";
        this.__htmlInput = new qx.ui.embed.Html("");
        this.__htmlInput.setAllowGrowX(true);
        this.__render();
        this._add(this.__htmlInput);
        this.__htmlInput.addListenerOnce("appear", () => {
            var _a;
            const root = this.__htmlInput.getContentElement().getDomElement();
            this.__inputEl = (_a = root === null || root === void 0 ? void 0 : root.querySelector("input")) !== null && _a !== void 0 ? _a : null;
            if (!this.__inputEl)
                return;
            this.__syncTabIndex();
            this.__inputEl.addEventListener("input", () => {
                var _a, _b;
                const next = (_b = (_a = this.__inputEl) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "";
                const prev = this.__value;
                this.__value = next;
                this.fireDataEvent("input", next);
                if (prev !== next)
                    this.fireDataEvent("changeValue", next);
            });
            this.__setupResizeObserver();
        });
        // when widget gets focus from Tab, move focus to native input
        this.addListener("focusin", () => {
            var _a;
            (_a = this.__inputEl) === null || _a === void 0 ? void 0 : _a.focus();
        });
        // keep native tabindex in sync
        this.addListener("changeTabIndex", () => {
            this.__syncTabIndex();
        });
    }
    __syncTabIndex() {
        if (!this.__inputEl)
            return;
        this.__inputEl.setAttribute("tabindex", "1");
    }
    __setupResizeObserver() {
        const root = this.__htmlInput.getContentElement().getDomElement();
        if (!root)
            return;
        this.__resizeObserver = new ResizeObserver(([entry]) => {
            const target = entry.target;
            this.__cachedContentWidth = Math.round(target.scrollWidth || entry.contentRect.width);
            this.__cachedContentHeight = Math.round(target.scrollHeight || entry.contentRect.height);
            this.scheduleLayoutUpdate();
        });
        this.__resizeObserver.observe(root);
        this.addListener("disappear", () => {
            var _a;
            (_a = this.__resizeObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
        });
    }
    // @ts-ignore
    _getContentHint() {
        var _a;
        if (this.__cachedContentWidth > 0 && this.__cachedContentHeight > 0) {
            return { width: this.__cachedContentWidth, height: this.__cachedContentHeight };
        }
        const contentEl = (_a = this.__htmlInput.getContentElement()) === null || _a === void 0 ? void 0 : _a.getDomElement();
        if (contentEl) {
            return { width: contentEl.scrollWidth || 0, height: contentEl.scrollHeight || 0 };
        }
        return { width: 0, height: 0 };
    }
    __escapeAttr(value) {
        return value
            .replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }
    __render() {
        const hasLeadingIcon = this.__leadingHtml.length > 0;
        const classes = [
            "input",
            "bg-card",
            "text-foreground",
            "border-border",
            "placeholder:text-muted-foreground",
            hasLeadingIcon ? "pl-9" : "",
            this.__className,
        ]
            .filter(Boolean)
            .join(" ");
        const value = this.__escapeAttr(this.__value);
        const placeholder = this.__escapeAttr(this.__placeholder);
        const tabIndexAttr = 'tabindex="-1"';
        this.__htmlInput.setHtml(`
        <div class="relative p-1">
            ${hasLeadingIcon
            ? `<span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">${this.__leadingHtml}</span>`
            : ""}
            <input
            type="${this.__escapeAttr(this.__type)}"
            class="${classes}"
            value="${value}"
            placeholder="${placeholder}"
            ${tabIndexAttr}
            />
        </div>
    `);
    }
    getValue() {
        var _a, _b;
        return (_b = (_a = this.__inputEl) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : this.__value;
    }
    setValue(value) {
        this.__value = value !== null && value !== void 0 ? value : "";
        if (this.__inputEl)
            this.__inputEl.value = this.__value;
        else
            this.__render();
        return this;
    }
    getType() {
        return this.__type;
    }
    setPlaceholder(value) {
        this.__placeholder = value !== null && value !== void 0 ? value : "";
        if (this.__inputEl)
            this.__inputEl.placeholder = this.__placeholder;
        else
            this.__render();
        return this;
    }
    setType(value) {
        this.__type = value !== null && value !== void 0 ? value : "text";
        this.__render();
        return this;
    }
    setLeadingHtml(html) {
        this.__leadingHtml = html !== null && html !== void 0 ? html : "";
        this.__render();
        return this;
    }
    onInput(handler) {
        this.addListener("input", (ev) => {
            var _a;
            handler((_a = ev.getData()) !== null && _a !== void 0 ? _a : "");
        });
        return this;
    }
}
BsInput.events = {
    input: "qx.event.type.Data",
    changeValue: "qx.event.type.Data",
};
class BsInputGroup extends qx.ui.container.Composite {
    constructor(labelText, placeholder, initialValue, inputClassName) {
        super(new qx.ui.layout.VBox(3));
        this.__resizeObserver = null;
        this.setAllowGrowX(true);
        this.setAllowGrowY(true);
        this.__label = new qx.ui.basic.Label(labelText);
        this.__input = new BsInput(initialValue !== null && initialValue !== void 0 ? initialValue : "", placeholder !== null && placeholder !== void 0 ? placeholder : "", inputClassName);
        this.__input.setAllowGrowX(true);
        this.__input.setAllowGrowY(true);
        this.__error = new qx.ui.basic.Label("");
        this.__error.setVisibility("excluded");
        this.add(this.__label);
        this.add(this.__input);
        this.add(this.__error);
        this.__setupResizeObserver();
    }
    __setupResizeObserver() {
        var _a, _b, _c;
        const root = (_c = (_a = this.getContentElement) === null || _a === void 0 ? void 0 : (_b = _a.call(this)).getDomElement) === null || _c === void 0 ? void 0 : _c.call(_b);
        if (!root) {
            qx.event.Timer.once(() => this.__setupResizeObserver(), this, 50);
            return;
        }
        this.__resizeObserver = new ResizeObserver(() => {
            this.scheduleLayoutUpdate();
        });
        this.__resizeObserver.observe(root);
        this.addListener("disappear", () => {
            var _a;
            (_a = this.__resizeObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
        });
    }
    onInput(handler) {
        this.__input.onInput(handler);
        return this;
    }
    getValue() {
        var _a;
        return (_a = this.__input.getValue()) !== null && _a !== void 0 ? _a : "";
    }
    setValue(value) {
        this.__input.setValue(value);
        return this;
    }
    setError(message) {
        const text = (message !== null && message !== void 0 ? message : "").trim();
        this.__error.setValue(text);
        if (text) {
            this.__error.show();
        }
        else {
            this.__error.exclude();
        }
        return this;
    }
    clearError() {
        return this.setError("");
    }
    getInputWidget() {
        return this.__input;
    }
    setInputTabIndex(value) {
        this.__input.setTabIndex(value);
        return this;
    }
    resetInputTabIndex() {
        this.__input.resetTabIndex();
        return this;
    }
}
class BsLabel extends qx.ui.basic.Atom {
    constructor(text, forId, className) {
        super();
        this.__resizeObserver = null;
        this.__cachedContentWidth = 0;
        this.__cachedContentHeight = 0;
        this._setLayout(new qx.ui.layout.Grow());
        this.__text = text !== null && text !== void 0 ? text : "";
        this.__for = forId !== null && forId !== void 0 ? forId : "";
        this.__className = className !== null && className !== void 0 ? className : "";
        this.__disabled = false;
        this.__children = [];
        this.__htmlLabel = new qx.ui.embed.Html("");
        this._add(this.__htmlLabel);
        this.__render();
        this.__htmlLabel.addListenerOnce("appear", () => {
            this.__setupResizeObserver();
        });
    }
    __escapeAttr(value) {
        return value
            .replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }
    __render() {
        const classes = ["label", this.__className]
            .filter(Boolean)
            .join(" ");
        const forAttr = this.__for ? `for="${this.__for}"` : "";
        const text = this.__escapeAttr(this.__text);
        this.__htmlLabel.setHtml(`<label class="${classes}" ${forAttr}>${text}</label>`);
    }
    getText() {
        return this.__text;
    }
    setText(value) {
        this.__text = value !== null && value !== void 0 ? value : "";
        this.__render();
        return this;
    }
    setFor(value) {
        this.__for = value !== null && value !== void 0 ? value : "";
        this.__render();
        return this;
    }
    setDisabled(value) {
        this.__disabled = value !== null && value !== void 0 ? value : false;
        this.__render();
        return this;
    }
    __setupResizeObserver() {
        const root = this.__htmlLabel.getContentElement().getDomElement();
        if (!root)
            return;
        this.__resizeObserver = new ResizeObserver(([entry]) => {
            const target = entry.target;
            this.__cachedContentWidth = Math.round(target.scrollWidth || entry.contentRect.width);
            this.__cachedContentHeight = Math.round(target.scrollHeight || entry.contentRect.height);
            this.scheduleLayoutUpdate();
        });
        this.__resizeObserver.observe(root);
        this.addListener("disappear", () => {
            var _a;
            (_a = this.__resizeObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
        });
    }
    // @ts-ignore
    _getContentHint() {
        var _a;
        if (this.__cachedContentWidth > 0 && this.__cachedContentHeight > 0) {
            return { width: this.__cachedContentWidth, height: this.__cachedContentHeight };
        }
        const contentEl = (_a = this.__htmlLabel.getContentElement()) === null || _a === void 0 ? void 0 : _a.getDomElement();
        if (contentEl) {
            return { width: contentEl.scrollWidth || 0, height: contentEl.scrollHeight || 0 };
        }
        return { width: 0, height: 0 };
    }
}
class BsPassword extends qx.ui.basic.Atom {
    constructor(value, placeholder, className) {
        super();
        this.__inputEl = null;
        this.__resizeObserver = null;
        this.__cachedContentWidth = 0;
        this.__cachedContentHeight = 0;
        this._setLayout(new qx.ui.layout.Grow());
        this.setAllowGrowX(true);
        this.setFocusable(true);
        this.__value = value !== null && value !== void 0 ? value : "";
        this.__placeholder = placeholder !== null && placeholder !== void 0 ? placeholder : "";
        this.__className = className !== null && className !== void 0 ? className : "";
        this.__htmlInput = new qx.ui.embed.Html("");
        this.__htmlInput.setAllowGrowX(true);
        this.__render();
        this._add(this.__htmlInput);
        this.__htmlInput.addListenerOnce("appear", () => {
            var _a;
            const root = this.__htmlInput.getContentElement().getDomElement();
            this.__inputEl = (_a = root === null || root === void 0 ? void 0 : root.querySelector("input")) !== null && _a !== void 0 ? _a : null;
            if (!this.__inputEl)
                return;
            this.__syncTabIndex();
            this.__inputEl.addEventListener("input", () => {
                var _a, _b;
                const next = (_b = (_a = this.__inputEl) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "";
                const prev = this.__value;
                this.__value = next;
                this.fireDataEvent("input", next);
                if (prev !== next)
                    this.fireDataEvent("changeValue", next);
            });
            this.__setupResizeObserver();
        });
        this.addListener("focusin", () => {
            var _a;
            (_a = this.__inputEl) === null || _a === void 0 ? void 0 : _a.focus();
        });
        this.addListener("changeTabIndex", () => {
            this.__syncTabIndex();
        });
    }
    __syncTabIndex() {
        if (!this.__inputEl)
            return;
        this.__inputEl.setAttribute("tabindex", "1");
    }
    __setupResizeObserver() {
        const root = this.__htmlInput.getContentElement().getDomElement();
        if (!root)
            return;
        this.__resizeObserver = new ResizeObserver(([entry]) => {
            const target = entry.target;
            this.__cachedContentWidth = Math.round(target.scrollWidth || entry.contentRect.width);
            this.__cachedContentHeight = Math.round(target.scrollHeight || entry.contentRect.height);
            this.scheduleLayoutUpdate();
        });
        this.__resizeObserver.observe(root);
        this.addListener("disappear", () => {
            var _a;
            (_a = this.__resizeObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
        });
    }
    // @ts-ignore
    _getContentHint() {
        var _a;
        if (this.__cachedContentWidth > 0 && this.__cachedContentHeight > 0) {
            return { width: this.__cachedContentWidth, height: this.__cachedContentHeight };
        }
        const contentEl = (_a = this.__htmlInput.getContentElement()) === null || _a === void 0 ? void 0 : _a.getDomElement();
        if (contentEl) {
            return { width: contentEl.scrollWidth || 0, height: contentEl.scrollHeight || 0 };
        }
        return { width: 0, height: 0 };
    }
    __escapeAttr(value) {
        return value
            .replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }
    __render() {
        const classes = [
            "input",
            "bg-card",
            "text-foreground",
            "border-border",
            "placeholder:text-muted-foreground",
            this.__className,
        ]
            .filter(Boolean)
            .join(" ");
        const value = this.__escapeAttr(this.__value);
        const placeholder = this.__escapeAttr(this.__placeholder);
        const tabIndexAttr = 'tabindex="-1"';
        this.__htmlInput.setHtml(`
        <div class="p-1">
            <input
            type="password"
            class="${classes}"
            value="${value}"
            placeholder="${placeholder}"
            ${tabIndexAttr}
            />
        </div>
    `);
    }
    getValue() {
        var _a, _b;
        return (_b = (_a = this.__inputEl) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : this.__value;
    }
    setValue(value) {
        this.__value = value !== null && value !== void 0 ? value : "";
        if (this.__inputEl)
            this.__inputEl.value = this.__value;
        else
            this.__render();
        return this;
    }
    setPlaceholder(value) {
        this.__placeholder = value !== null && value !== void 0 ? value : "";
        if (this.__inputEl)
            this.__inputEl.placeholder = this.__placeholder;
        else
            this.__render();
        return this;
    }
    onInput(handler) {
        this.addListener("input", (ev) => {
            var _a;
            handler((_a = ev.getData()) !== null && _a !== void 0 ? _a : "");
        });
        return this;
    }
}
BsPassword.events = {
    input: "qx.event.type.Data",
    changeValue: "qx.event.type.Data",
};
class BsRadioGroup extends qx.ui.basic.Atom {
    constructor(options, name, initialValue) {
        super();
        this.__fieldSetEl = null;
        this.__inputEls = [];
        this.__resizeObserver = null;
        this.__cachedContentWidth = 0;
        this.__cachedContentHeight = 0;
        this._setLayout(new qx.ui.layout.Grow());
        this.setAllowGrowX(true);
        this.__options = options !== null && options !== void 0 ? options : [];
        this.__name = name !== null && name !== void 0 ? name : `radio-group-${Math.random().toString(36).slice(2)}`;
        this.__value = initialValue !== null && initialValue !== void 0 ? initialValue : "";
        this.__disabled = false;
        this.__htmlEmbed = new qx.ui.embed.Html("");
        this._add(this.__htmlEmbed);
        this.__render();
        this.__htmlEmbed.addListenerOnce("appear", () => {
            this.__initInputListeners();
            this.__setupResizeObserver();
        });
    }
    __render() {
        const disabledAttr = this.__disabled ? "disabled" : "";
        const optionsHtml = this.__options
            .map((opt) => `
        <label class="font-normal${opt.disabled ? " opacity-50" : ""}">
          <input
            type="radio"
            name="${this.__name}"
            value="${opt.value}"
            class="input"
            ${opt.disabled ? "disabled" : ""}
            ${this.__value === opt.value ? "checked" : ""}
          />
          ${opt.label}
        </label>
      `)
            .join("");
        this.__htmlEmbed.setHtml(`
      <fieldset class="grid gap-3">
        ${optionsHtml}
      </fieldset>
    `);
    }
    __initInputListeners() {
        const root = this.__htmlEmbed.getContentElement().getDomElement();
        if (!root)
            return;
        this.__fieldSetEl = root.querySelector("fieldset");
        this.__inputEls = Array.from(root.querySelectorAll('input[type="radio"]'));
        this.__inputEls.forEach((input) => {
            input.addEventListener("change", () => {
                if (input.checked) {
                    this.__value = input.value;
                    this.fireDataEvent("changeValue", input.value);
                }
            });
        });
    }
    getValue() {
        return this.__value;
    }
    setValue(value) {
        this.__value = value;
        this.__inputEls.forEach((input) => {
            input.checked = input.value === value;
        });
        return this;
    }
    setOptions(options) {
        this.__options = options;
        this.__render();
        this.__htmlEmbed.addListenerOnce("appear", () => {
            this.__initInputListeners();
        });
        return this;
    }
    getOptions() {
        return this.__options;
    }
    setEnabled(enabled) {
        this.__disabled = !enabled;
        if (this.__fieldSetEl) {
            this.__fieldSetEl.disabled = this.__disabled;
        }
        return this;
    }
    isEnabled() {
        return !this.__disabled;
    }
    onChangeValue(handler) {
        this.addListener("changeValue", (ev) => {
            var _a;
            handler((_a = ev.getData()) !== null && _a !== void 0 ? _a : "");
        });
        return this;
    }
    __setupResizeObserver() {
        const root = this.__htmlEmbed.getContentElement().getDomElement();
        if (!root)
            return;
        this.__resizeObserver = new ResizeObserver(([entry]) => {
            const target = entry.target;
            this.__cachedContentWidth = Math.round(target.scrollWidth || entry.contentRect.width);
            this.__cachedContentHeight = Math.round(target.scrollHeight || entry.contentRect.height);
            this.scheduleLayoutUpdate();
        });
        this.__resizeObserver.observe(root);
        this.addListener("disappear", () => {
            var _a;
            (_a = this.__resizeObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
        });
    }
    // @ts-ignore
    _getContentHint() {
        var _a;
        if (this.__cachedContentWidth > 0 && this.__cachedContentHeight > 0) {
            return { width: this.__cachedContentWidth, height: this.__cachedContentHeight };
        }
        const contentEl = (_a = this.__htmlEmbed.getContentElement()) === null || _a === void 0 ? void 0 : _a.getDomElement();
        if (contentEl) {
            return { width: contentEl.scrollWidth || 0, height: contentEl.scrollHeight || 0 };
        }
        return { width: 0, height: 0 };
    }
}
BsRadioGroup.events = {
    changeValue: "qx.event.type.Data",
};
class BsSelect extends qx.ui.basic.Atom {
    constructor(options = [], className) {
        super();
        this.__value = "";
        this.__selectEl = null;
        this.__resizeObserver = null;
        this.__cachedContentWidth = 0;
        this.__cachedContentHeight = 0;
        this._setLayout(new qx.ui.layout.Grow());
        this.setAllowGrowX(true);
        this.setFocusable(true);
        this.__options = options;
        this.__className = className !== null && className !== void 0 ? className : "";
        this.__htmlSelect = new qx.ui.embed.Html("");
        this.__htmlSelect.setAllowGrowX(true);
        this.__render();
        this._add(this.__htmlSelect);
        this.__htmlSelect.addListenerOnce("appear", () => {
            this.__bindNativeSelect();
            this.__setupResizeObserver();
        });
        this.addListener("focusin", () => { var _a; return (_a = this.__selectEl) === null || _a === void 0 ? void 0 : _a.focus(); });
        this.addListener("changeTabIndex", () => this.__syncTabIndex());
    }
    __escape(value) {
        return value
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }
    __syncTabIndex() {
        if (!this.__selectEl)
            return;
        this.__selectEl.setAttribute("tabindex", "-1");
    }
    __setupResizeObserver() {
        const root = this.__htmlSelect.getContentElement().getDomElement();
        if (!root)
            return;
        this.__resizeObserver = new ResizeObserver(([entry]) => {
            const target = entry.target;
            this.__cachedContentWidth = Math.round(target.scrollWidth || entry.contentRect.width);
            this.__cachedContentHeight = Math.round(target.scrollHeight || entry.contentRect.height);
            this.scheduleLayoutUpdate();
        });
        this.__resizeObserver.observe(root);
        this.addListener("disappear", () => {
            var _a;
            (_a = this.__resizeObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
        });
    }
    // @ts-ignore
    _getContentHint() {
        var _a;
        if (this.__cachedContentWidth > 0 && this.__cachedContentHeight > 0) {
            return { width: this.__cachedContentWidth, height: this.__cachedContentHeight };
        }
        const contentEl = (_a = this.__htmlSelect.getContentElement()) === null || _a === void 0 ? void 0 : _a.getDomElement();
        if (contentEl) {
            return { width: contentEl.scrollWidth || 0, height: contentEl.scrollHeight || 0 };
        }
        return { width: 0, height: 0 };
    }
    __bindNativeSelect() {
        var _a;
        const root = this.__htmlSelect.getContentElement().getDomElement();
        this.__selectEl =
            (_a = root === null || root === void 0 ? void 0 : root.querySelector("select")) !== null && _a !== void 0 ? _a : null;
        if (!this.__selectEl)
            return;
        this.__syncTabIndex();
        this.__selectEl.onchange = () => {
            var _a, _b;
            this.__value = (_b = (_a = this.__selectEl) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "";
            this.fireDataEvent("changeValue", this.__value);
        };
    }
    __render() {
        const optionsHtml = [
            `<option value="">Select an option</option>`,
            ...this.__options.map((opt) => {
                const v = this.__escape(opt);
                const selected = this.__value === opt ? "selected" : "";
                return `<option value="${v}" ${selected}>${v}</option>`;
            }),
        ].join("");
        const tabIndexAttr = 'tabindex="-1"';
        const classes = ["select", this.__className].filter(Boolean).join(" ");
        this.__htmlSelect.setHtml(`
      <div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;">
        <select class="w-full ${classes}" ${tabIndexAttr}>
          ${optionsHtml}
        </select>
      </div>
    `);
        qx.event.Timer.once(() => this.__bindNativeSelect(), this, 0);
    }
    getSelectedValue() {
        var _a, _b;
        return (_b = (_a = this.__selectEl) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : this.__value;
    }
    setSelectedByLabel(label) {
        this.__value = this.__options.indexOf(label) !== -1 ? label : "";
        if (this.__selectEl)
            this.__selectEl.value = this.__value;
        else
            this.__render();
        return this;
    }
    resetSelection() {
        this.__value = "";
        if (this.__selectEl)
            this.__selectEl.value = "";
        else
            this.__render();
        return this;
    }
    onChange(handler) {
        this.addListener("changeValue", (ev) => {
            var _a;
            handler((_a = ev.getData()) !== null && _a !== void 0 ? _a : "");
        });
        return this;
    }
}
BsSelect.events = {
    changeValue: "qx.event.type.Data",
};
class BsSeparator extends qx.ui.basic.Atom {
    constructor(orientation = "horizontal", decorative = true, className, label) {
        super();
        this.__resizeObserver = null;
        this.__cachedContentWidth = 0;
        this.__cachedContentHeight = 0;
        this._setLayout(new qx.ui.layout.Grow());
        this.setAllowGrowX(true);
        this.setAllowGrowY(true);
        this.__orientation = orientation;
        this.__decorative = decorative;
        this.__className = className !== null && className !== void 0 ? className : "";
        this.__label = label !== null && label !== void 0 ? label : "";
        this.__htmlSeparator = new qx.ui.embed.Html("");
        this.__htmlSeparator.setAllowGrowX(true);
        this.__render();
        this._add(this.__htmlSeparator);
        this.__setupResizeObserver();
    }
    __setupResizeObserver() {
        const root = this.__htmlSeparator.getContentElement().getDomElement();
        if (!root) {
            qx.event.Timer.once(() => this.__setupResizeObserver(), this, 50);
            return;
        }
        this.__resizeObserver = new ResizeObserver(([entry]) => {
            const target = entry.target;
            this.__cachedContentWidth = Math.round(target.scrollWidth || entry.contentRect.width);
            this.__cachedContentHeight = Math.round(target.scrollHeight || entry.contentRect.height);
            this.scheduleLayoutUpdate();
        });
        this.__resizeObserver.observe(root);
        this.addListener("disappear", () => {
            var _a;
            (_a = this.__resizeObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
        });
    }
    // @ts-ignore
    _getContentHint() {
        var _a;
        if (this.__cachedContentWidth > 0 && this.__cachedContentHeight > 0) {
            return { width: this.__cachedContentWidth, height: this.__cachedContentHeight };
        }
        const contentEl = (_a = this.__htmlSeparator.getContentElement()) === null || _a === void 0 ? void 0 : _a.getDomElement();
        if (contentEl) {
            return { width: contentEl.scrollWidth || 0, height: contentEl.scrollHeight || 0 };
        }
        return { width: 0, height: 0 };
    }
    __escapeHtml(value) {
        return value
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }
    __render() {
        const isHorizontal = this.__orientation === "horizontal";
        const baseClasses = isHorizontal
            ? "divider w-full"
            : "divider divider-horizontal h-full";
        const roleAttr = this.__decorative ? "" : 'role="separator"';
        const ariaOrientation = this.__decorative
            ? ""
            : `aria-orientation="${this.__orientation}"`;
        const content = this.__label ? this.__escapeHtml(this.__label) : "";
        this.__htmlSeparator.setHtml(`
      <div class="${baseClasses} ${this.__className}" ${roleAttr} ${ariaOrientation}>
        ${content}
      </div>
    `);
    }
    setLabel(value) {
        this.__label = value !== null && value !== void 0 ? value : "";
        this.__render();
        return this;
    }
}
class BsSidebarAccount extends qx.ui.basic.Atom {
    constructor(name, username, avatarSrc, avatarFallback, className) {
        super();
        this.__collapsed = false;
        this.__buttonEl = null;
        this.__avatarEl = null;
        this.__avatarFallbackEl = null;
        this.__hasImageError = false;
        this.__isMenuOpen = false;
        this.__outsideClickHandler = null;
        this.__rootClickHandler = null;
        this.__boundRootEl = null;
        this.__menuAnimToken = 0;
        this.__resizeObserver = null;
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
        this.__menuPopup.setDecorator(new qx.ui.decoration.Decorator().set({
            width: 1,
            style: "solid",
            color: AppColors.border(),
            radius: 10,
            shadowVerticalLength: 2,
            shadowBlurRadius: 10,
            shadowColor: AppColors.overlay(0.1),
        }));
        this.__menuContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox(0));
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
        this.__name = name !== null && name !== void 0 ? name : "";
        this.__username = username !== null && username !== void 0 ? username : "";
        this.__avatarSrc = avatarSrc !== null && avatarSrc !== void 0 ? avatarSrc : "";
        this.__avatarFallback = avatarFallback !== null && avatarFallback !== void 0 ? avatarFallback : "";
        this.__className = className !== null && className !== void 0 ? className : "";
        this.__renderButton();
        this._add(this.__htmlButton);
        this.__htmlButton.addListener("appear", () => {
            this.__bindNativeButton();
            this.__setupResizeObserver();
        });
        this.__menuPopup.addListener("disappear", () => {
            if (!this.__isMenuOpen)
                return;
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
    __escape(value) {
        return value
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }
    __bindNativeButton() {
        var _a, _b, _c;
        const root = this.__htmlButton.getContentElement().getDomElement();
        if (!root)
            return;
        if (this.__boundRootEl !== root) {
            this.__unbindNativeButton();
            this.__rootClickHandler = (ev) => {
                const target = ev.target;
                if (!target)
                    return;
                const trigger = target.closest("[data-account-trigger]");
                if (!trigger)
                    return;
                ev.preventDefault();
                ev.stopPropagation();
                this.__toggleMenu();
            };
            root.addEventListener("click", this.__rootClickHandler);
            this.__boundRootEl = root;
        }
        const btn = (_a = root === null || root === void 0 ? void 0 : root.querySelector("[data-account-trigger]")) !== null && _a !== void 0 ? _a : null;
        this.__buttonEl = btn;
        if (!this.__buttonEl)
            return;
        this.__avatarEl =
            (_b = root === null || root === void 0 ? void 0 : root.querySelector("img")) !== null && _b !== void 0 ? _b : null;
        this.__avatarFallbackEl =
            (_c = root === null || root === void 0 ? void 0 : root.querySelector("[data-avatar-fallback]")) !== null && _c !== void 0 ? _c : null;
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
    __unbindNativeButton() {
        if (this.__boundRootEl && this.__rootClickHandler) {
            this.__boundRootEl.removeEventListener("click", this.__rootClickHandler);
        }
        this.__boundRootEl = null;
        this.__rootClickHandler = null;
    }
    __toggleMenu() {
        if (this.__isMenuOpen) {
            this.__closeMenu();
            return;
        }
        this.__openMenu();
    }
    __closeMenu() {
        if (!this.__isMenuOpen)
            return;
        this.__isMenuOpen = false;
        this.__unbindOutsideClick();
        const token = ++this.__menuAnimToken;
        this.__setPopupAnimationStyles({
            opacity: "0",
            transform: "translateY(-4px) scale(0.98)",
            transition: "opacity 100ms ease, transform 120ms ease",
            pointerEvents: "none",
        });
        qx.event.Timer.once(() => {
            if (token !== this.__menuAnimToken)
                return;
            this.__menuPopup.hide();
            this.__renderButton();
        }, this, 120);
    }
    __openMenu() {
        const token = ++this.__menuAnimToken;
        if (!this.__collapsed) {
            const triggerRoot = this.__htmlButton.getContentElement().getDomElement();
            const triggerEl = triggerRoot === null || triggerRoot === void 0 ? void 0 : triggerRoot.querySelector("[data-account-trigger]");
            if (triggerEl) {
                this.__menuPopup.setWidth(triggerEl.offsetWidth);
            }
        }
        else {
            this.__menuPopup.setWidth(Math.round(window.innerWidth / 2 + 40));
        }
        this.__menuPopup.show();
        this.__isMenuOpen = true;
        this.__renderButton();
        this.__bindOutsideClick();
        this.__placeMenuPopup();
        this.__setPopupAnimationStyles({
            opacity: "0",
            transform: "translateY(-6px) scale(0.985)",
            transition: "opacity 120ms ease, transform 140ms cubic-bezier(0.16, 1, 0.3, 1)",
            pointerEvents: "auto",
            transformOrigin: this.__collapsed ? "top right" : "top left",
        });
        qx.event.Timer.once(() => {
            if (token !== this.__menuAnimToken)
                return;
            this.__placeMenuPopup();
            this.__setPopupAnimationStyles({
                opacity: "1",
                transform: "translateY(0) scale(1)",
            });
        }, this, 0);
    }
    __setPopupAnimationStyles(styles) {
        const popupElement = this.__menuPopup.getContentElement();
        if (!(popupElement === null || popupElement === void 0 ? void 0 : popupElement.setStyle))
            return;
        for (const key in styles) {
            if (!Object.prototype.hasOwnProperty.call(styles, key))
                continue;
            popupElement.setStyle(key, styles[key]);
        }
    }
    __bindOutsideClick() {
        if (this.__outsideClickHandler)
            return;
        this.__outsideClickHandler = (ev) => {
            const target = ev.target;
            if (!target)
                return;
            const triggerRoot = this.__htmlButton.getContentElement().getDomElement();
            const popupRoot = this.__menuPopup.getContentElement().getDomElement();
            const clickedTrigger = !!triggerRoot && triggerRoot.contains(target);
            const clickedPopup = !!popupRoot && popupRoot.contains(target);
            if (!clickedTrigger && !clickedPopup)
                this.__closeMenu();
        };
        document.addEventListener("mousedown", this.__outsideClickHandler, true);
    }
    __unbindOutsideClick() {
        if (!this.__outsideClickHandler)
            return;
        document.removeEventListener("mousedown", this.__outsideClickHandler, true);
        this.__outsideClickHandler = null;
    }
    __placeMenuPopup() {
        var _a;
        const triggerRoot = this.__htmlButton.getContentElement().getDomElement();
        const triggerEl = (_a = triggerRoot === null || triggerRoot === void 0 ? void 0 : triggerRoot.querySelector("[data-account-trigger]")) !== null && _a !== void 0 ? _a : null;
        if (!triggerEl)
            return;
        const triggerRect = triggerEl.getBoundingClientRect();
        const popupEl = this.__menuPopup.getContentElement().getDomElement();
        if (!popupEl)
            return;
        const popupRect = popupEl.getBoundingClientRect();
        const gap = 6;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        let left;
        let top;
        if (this.__collapsed) {
            const preferredLeft = Math.round(triggerRect.right - popupRect.width);
            left = Math.min(Math.max(8, preferredLeft), Math.max(8, viewportWidth - popupRect.width - 8));
            const preferredTop = Math.round(triggerRect.bottom + gap);
            top = Math.min(Math.max(8, preferredTop), Math.max(8, viewportHeight - popupRect.height - 8));
        }
        else {
            const preferredLeft = Math.round(triggerRect.left);
            left = Math.min(Math.max(8, preferredLeft), Math.max(8, viewportWidth - popupRect.width - 8));
            const preferredTop = Math.round(triggerRect.top - popupRect.height - gap);
            const fallbackTop = Math.round(triggerRect.bottom + gap);
            const hasSpaceAbove = preferredTop >= 8;
            top = hasSpaceAbove
                ? preferredTop
                : Math.min(Math.max(8, fallbackTop), Math.max(8, viewportHeight - popupRect.height - 8));
        }
        this.__menuPopup.moveTo(left, top);
    }
    __buildMenuWidgets() {
        this.__menuContainer.add(this.__createMenuButton("Change Password", new InlineSvgIcon("lock", 16), "change-password"));
        this.__menuContainer.add(this.__createMenuButton("Multi-Factor Authentication", new InlineSvgIcon("shield", 16), "multi-factor-auth"));
        const separator = new qx.ui.core.Widget();
        separator.set({
            height: 1,
            marginTop: 4,
            marginBottom: 4,
            backgroundColor: AppColors.border(),
        });
        this.__menuContainer.add(separator);
        this.__menuContainer.add(this.__createMenuButton("Log out", new InlineSvgIcon("log-out", 16), "logout-account"));
    }
    __createMenuButton(label, icon, action) {
        const button = new BsSidebarButton(`${label}`, icon, "btn-sm-outline");
        button.setAllowGrowX(true);
        button.setHeight(40);
        button.onClick(() => {
            const normalizedAction = action === "logout-account" ? "logout" : action;
            this.fireDataEvent("action", normalizedAction);
            this.__closeMenu();
        });
        return button;
    }
    __syncAvatarFallback() {
        if (!this.__avatarFallbackEl)
            return;
        const shouldShow = !this.__avatarSrc || this.__hasImageError;
        this.__avatarFallbackEl.style.display = shouldShow ? "flex" : "none";
    }
    __setupResizeObserver() {
        const root = this.__htmlButton.getContentElement().getDomElement();
        if (!root)
            return;
        this.__resizeObserver = new ResizeObserver(() => {
            this.scheduleLayoutUpdate();
        });
        this.__resizeObserver.observe(root);
        this.addListener("disappear", () => {
            var _a;
            (_a = this.__resizeObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
        });
    }
    __renderButton() {
        const name = this.__escape(this.__name);
        const username = this.__escape(this.__username);
        const avatarSrc = this.__escape(this.__avatarSrc);
        const avatarFallback = this.__escape(this.__avatarFallback);
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
    setCollapsed(collapsed) {
        this.__collapsed = collapsed;
        if (collapsed)
            this.__closeMenu();
        this.__renderButton();
        return this;
    }
    setName(name) {
        this.__name = name !== null && name !== void 0 ? name : "";
        this.__renderButton();
        return this;
    }
    setUsername(username) {
        this.__username = username !== null && username !== void 0 ? username : "";
        this.__renderButton();
        return this;
    }
    setAvatar(src, fallback) {
        this.__avatarSrc = src !== null && src !== void 0 ? src : "";
        this.__hasImageError = false;
        if (typeof fallback === "string")
            this.__avatarFallback = fallback;
        this.__renderButton();
        return this;
    }
    onAction(handler) {
        this.addListener("action", (ev) => {
            var _a;
            handler((_a = ev.getData()) !== null && _a !== void 0 ? _a : "");
        });
        return this;
    }
}
BsSidebarAccount.events = {
    action: "qx.event.type.Data",
};
class BsSidebarButton extends qx.ui.basic.Atom {
    constructor(text, icon, className) {
        super();
        this.__trailingHtml = "";
        this.__active = false;
        this.__collapsed = false;
        this.__centered = false;
        this.__buttonEl = null;
        this.__renderPending = false;
        this.__enabled = true;
        this.__resizeObserver = null;
        this._setLayout(new qx.ui.layout.Grow());
        this.setAllowGrowX(true);
        this.__htmlButton = new qx.ui.embed.Html("");
        this.__htmlButton.setAllowGrowX(true);
        this.__iconHtml = icon ? icon.getHtml() : "";
        this.__buttonText = text !== null && text !== void 0 ? text : "";
        this.__className = className !== null && className !== void 0 ? className : "";
        this.__renderButton();
        this._add(this.__htmlButton);
        this.__htmlButton.addListener("tap", () => this.fireEvent("execute"));
        this.__htmlButton.addListenerOnce("appear", () => {
            this.__bindNativeButton();
            this.__setupResizeObserver();
        });
        if (icon) {
            icon.addListener("changeHtml", () => {
                this.__iconHtml = icon.getHtml();
                this.__renderButton();
            });
        }
    }
    __bindNativeButton() {
        var _a;
        const root = this.__htmlButton.getContentElement().getDomElement();
        const btn = (_a = root === null || root === void 0 ? void 0 : root.querySelector("button")) !== null && _a !== void 0 ? _a : null;
        this.__buttonEl = btn;
        if (!this.__buttonEl)
            return;
    }
    __setupResizeObserver() {
        const root = this.__htmlButton.getContentElement().getDomElement();
        if (!root)
            return;
        this.__resizeObserver = new ResizeObserver(() => {
            this.scheduleLayoutUpdate();
        });
        this.__resizeObserver.observe(root);
        this.addListener("disappear", () => {
            var _a;
            (_a = this.__resizeObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
        });
    }
    __renderButton() {
        const iconPart = this.__iconHtml ? `<span>${this.__iconHtml}</span>` : "";
        const textPart = this.__collapsed ? "" : this.__buttonText;
        const trailingPart = !this.__collapsed && this.__trailingHtml
            ? `<span style="margin-left:auto;opacity:0.75;line-height:1">${this.__trailingHtml}</span>`
            : "";
        const activeClass = this.__active
            ? "font-semibold btn-sm-primary text-sidebar-accent-foreground"
            : this.__enabled
                ? "btn-sm-ghost text-sidebar-foreground"
                : "btn-sm-ghost text-sidebar-foreground opacity-50 cursor-not-allowed";
        const layoutClass = this.__collapsed
            ? "justify-center"
            : this.__centered
                ? "justify-center relative"
                : "justify-start";
        const classes = [
            "w-full",
            "items-center",
            "gap-2",
            "transition",
            "duration-200",
            "ease-in-out",
            "border-sidebar-border",
            "select-none",
            layoutClass,
            activeClass,
            this.__className,
        ]
            .filter(Boolean)
            .join(" ");
        const centeredIconPart = this.__centered && this.__iconHtml
            ? `<span style="position:absolute;left:8px;display:flex;align-items:center">${this.__iconHtml}</span>`
            : iconPart;
        this.__htmlButton.setHtml(`
      <div class="p-1">
        <button
          type="button"
          class="${classes}"
          style="user-select:none"
        >
          ${centeredIconPart}
          ${textPart}
          ${trailingPart}
        </button>
      </div>
    `);
        qx.event.Timer.once(() => this.__bindNativeButton(), this, 0);
    }
    setActive(active) {
        if (this.__active === active)
            return this;
        this.__active = active;
        this.__scheduleRender();
        return this;
    }
    setCollapsed(collapsed) {
        if (this.__collapsed === collapsed)
            return this;
        this.__collapsed = collapsed;
        this.__scheduleRender();
        return this;
    }
    onClick(handler) {
        this.addListener("execute", handler);
        return this;
    }
    setText(text) {
        if (this.__buttonText === text)
            return this;
        this.__buttonText = text;
        this.__scheduleRender();
        return this;
    }
    setCentered(centered) {
        if (this.__centered === centered)
            return this;
        this.__centered = centered;
        this.__scheduleRender();
        return this;
    }
    setTrailingHtml(html) {
        if (this.__trailingHtml === html)
            return this;
        this.__trailingHtml = html;
        this.__scheduleRender();
        return this;
    }
    setClassName(className) {
        if (this.__className === className)
            return this;
        this.__className = className;
        this.__scheduleRender();
        return this;
    }
    setEnabled(enabled) {
        if (this.__enabled === enabled)
            return this;
        this.__enabled = enabled;
        this.__scheduleRender();
        return this;
    }
    isEnabled() {
        return this.__enabled;
    }
    __scheduleRender() {
        if (this.__renderPending)
            return;
        this.__renderPending = true;
        queueMicrotask(() => {
            this.__renderPending = false;
            this.__renderButton();
        });
    }
}
BsSidebarButton.events = {
    execute: "qx.event.type.Event",
};
class BsSlider extends qx.ui.basic.Atom {
    constructor(min, max, value, step) {
        super();
        this.__inputEl = null;
        this.__resizeObserver = null;
        this.__cachedContentWidth = 0;
        this.__cachedContentHeight = 0;
        this._setLayout(new qx.ui.layout.Grow());
        this.setAllowGrowX(true);
        this.setFocusable(true);
        this.__min = min !== null && min !== void 0 ? min : 0;
        this.__max = max !== null && max !== void 0 ? max : 100;
        this.__value = value !== null && value !== void 0 ? value : 50;
        this.__step = step !== null && step !== void 0 ? step : 1;
        this.__disabled = false;
        this.__htmlEmbed = new qx.ui.embed.Html("");
        this.__htmlEmbed.setAllowGrowX(true);
        this.__render();
        this._add(this.__htmlEmbed);
        this.__htmlEmbed.addListenerOnce("appear", () => {
            const root = this.__htmlEmbed.getContentElement().getDomElement();
            this.__inputEl = root === null || root === void 0 ? void 0 : root.querySelector("input");
            if (!this.__inputEl)
                return;
            this.__syncTabIndex();
            this.__updateSliderTrack();
            this.__inputEl.addEventListener("input", () => {
                var _a, _b;
                const newValue = parseFloat((_b = (_a = this.__inputEl) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "0");
                this.__value = newValue;
                this.__updateSliderTrack();
                this.fireDataEvent("input", newValue);
                this.fireDataEvent("changeValue", newValue);
            });
            this.__inputEl.addEventListener("change", () => {
                var _a, _b;
                const newValue = parseFloat((_b = (_a = this.__inputEl) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "0");
                this.__value = newValue;
                this.__updateSliderTrack();
                this.fireDataEvent("changeValue", newValue);
            });
            this.__setupResizeObserver();
        });
        this.addListener("focusin", () => {
            var _a;
            (_a = this.__inputEl) === null || _a === void 0 ? void 0 : _a.focus();
        });
        this.addListener("changeTabIndex", () => {
            this.__syncTabIndex();
        });
    }
    __syncTabIndex() {
        if (!this.__inputEl)
            return;
        this.__inputEl.setAttribute("tabindex", "1");
    }
    __setupResizeObserver() {
        const root = this.__htmlEmbed.getContentElement().getDomElement();
        if (!root)
            return;
        this.__resizeObserver = new ResizeObserver(([entry]) => {
            const target = entry.target;
            this.__cachedContentWidth = Math.round(target.scrollWidth || entry.contentRect.width);
            this.__cachedContentHeight = Math.round(target.scrollHeight || entry.contentRect.height);
            this.scheduleLayoutUpdate();
        });
        this.__resizeObserver.observe(root);
        this.addListener("disappear", () => {
            var _a;
            (_a = this.__resizeObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
        });
    }
    // @ts-ignore
    _getContentHint() {
        var _a;
        if (this.__cachedContentWidth > 0 && this.__cachedContentHeight > 0) {
            return { width: this.__cachedContentWidth, height: this.__cachedContentHeight };
        }
        const contentEl = (_a = this.__htmlEmbed.getContentElement()) === null || _a === void 0 ? void 0 : _a.getDomElement();
        if (contentEl) {
            return { width: contentEl.scrollWidth || 0, height: contentEl.scrollHeight || 0 };
        }
        return { width: 0, height: 0 };
    }
    __updateSliderTrack() {
        if (!this.__inputEl)
            return;
        const min = this.__min;
        const max = this.__max;
        const val = this.__value;
        const percent = max === min ? 0 : ((val - min) / (max - min)) * 100;
        this.__inputEl.style.setProperty("--slider-value", `${percent}%`);
    }
    __render() {
        const disabledAttr = this.__disabled ? "disabled" : "";
        const tabIndexAttr = 'tabindex="-1"';
        this.__htmlEmbed.setHtml(`
      <div class="w-full py-3 px-1">
        <input
          type="range"
          class="input w-full"
          min="${this.__min}"
          max="${this.__max}"
          value="${this.__value}"
          step="${this.__step}"
          ${disabledAttr}
          ${tabIndexAttr}
        />
      </div>
    `);
        this.__updateSliderTrack();
    }
    getValue() {
        return this.__value;
    }
    setValue(value) {
        this.__value = value;
        if (this.__inputEl) {
            this.__inputEl.value = String(value);
            this.__updateSliderTrack();
        }
        else {
            this.__render();
        }
        return this;
    }
    setMin(value) {
        this.__min = value;
        if (this.__inputEl) {
            this.__inputEl.min = String(value);
            this.__updateSliderTrack();
        }
        else {
            this.__render();
        }
        return this;
    }
    setMax(value) {
        this.__max = value;
        if (this.__inputEl) {
            this.__inputEl.max = String(value);
            this.__updateSliderTrack();
        }
        else {
            this.__render();
        }
        return this;
    }
    setStep(value) {
        this.__step = value;
        if (this.__inputEl) {
            this.__inputEl.step = String(value);
        }
        else {
            this.__render();
        }
        return this;
    }
    setEnabled(enabled) {
        this.__disabled = !enabled;
        if (this.__inputEl) {
            this.__inputEl.disabled = this.__disabled;
        }
        else {
            this.__render();
        }
        return this;
    }
    isEnabled() {
        return !this.__disabled;
    }
    onInput(handler) {
        this.addListener("input", (ev) => {
            var _a;
            handler((_a = ev.getData()) !== null && _a !== void 0 ? _a : 0);
        });
        return this;
    }
    onChangeValue(handler) {
        this.addListener("changeValue", (ev) => {
            var _a;
            handler((_a = ev.getData()) !== null && _a !== void 0 ? _a : 0);
        });
        return this;
    }
}
BsSlider.events = {
    input: "qx.event.type.Data",
    changeValue: "qx.event.type.Data",
};
class BsSwitch extends qx.ui.basic.Atom {
    constructor(checked = false, disabled = false, size = "default") {
        super();
        this.__inputEl = null;
        this._setLayout(new qx.ui.layout.Grow());
        this.setAllowGrowX(true);
        this.setFocusable(true);
        this.__checked = checked;
        this.__disabled = disabled;
        this.__size = size;
        this.__htmlEmbed = new qx.ui.embed.Html("");
        this.__htmlEmbed.setAllowGrowX(true);
        this.__render();
        this._add(this.__htmlEmbed);
        this.__htmlEmbed.addListenerOnce("appear", () => {
            var _a;
            const root = this.__htmlEmbed.getContentElement().getDomElement();
            this.__inputEl = (_a = root === null || root === void 0 ? void 0 : root.querySelector("input")) !== null && _a !== void 0 ? _a : null;
            if (!this.__inputEl)
                return;
            this.__inputEl.addEventListener("change", () => {
                var _a, _b;
                const next = (_b = (_a = this.__inputEl) === null || _a === void 0 ? void 0 : _a.checked) !== null && _b !== void 0 ? _b : false;
                this.__checked = next;
                this.fireDataEvent("changeValue", next);
            });
        });
        this.addListener("focusin", () => {
            var _a;
            (_a = this.__inputEl) === null || _a === void 0 ? void 0 : _a.focus();
        });
    }
    // @ts-ignore
    _getContentHint() {
        return { width: 60, height: 32 };
    }
    isChecked() {
        var _a, _b;
        return (_b = (_a = this.__inputEl) === null || _a === void 0 ? void 0 : _a.checked) !== null && _b !== void 0 ? _b : this.__checked;
    }
    setChecked(value) {
        this.__checked = value;
        if (this.__inputEl)
            this.__inputEl.checked = value;
        else
            this.__render();
        return this;
    }
    setDisabled(value) {
        this.__disabled = value;
        if (this.__inputEl)
            this.__inputEl.disabled = value;
        else
            this.__render();
        return this;
    }
    setSize(value) {
        this.__size = value;
        this.__render();
        return this;
    }
    onToggle(handler) {
        this.addListener("changeValue", (ev) => {
            var _a;
            handler((_a = ev.getData()) !== null && _a !== void 0 ? _a : false);
        });
        return this;
    }
    __render() {
        const checkedAttr = this.__checked ? "checked" : "";
        const disabledAttr = this.__disabled ? "disabled" : "";
        const sizeAttr = this.__size === "sm" ? 'data-size="sm"' : "";
        this.__htmlEmbed.setHtml(`
      <input
        type="checkbox"
        role="switch"
        class="input"
        ${checkedAttr}
        ${disabledAttr}
        ${sizeAttr}
      />
    `);
    }
}
BsSwitch.events = {
    changeValue: "qx.event.type.Data",
};
class BsTextarea extends qx.ui.basic.Atom {
    constructor(value, placeholder, className, rows = 4) {
        super();
        this.__textareaEl = null;
        this.__resizeObserver = null;
        this.__cachedContentWidth = 0;
        this.__cachedContentHeight = 0;
        this._setLayout(new qx.ui.layout.Grow());
        this.setAllowGrowX(true);
        this.setAllowGrowY(true);
        this.setFocusable(true);
        this.__value = value !== null && value !== void 0 ? value : "";
        this.__placeholder = placeholder !== null && placeholder !== void 0 ? placeholder : "";
        this.__className = className !== null && className !== void 0 ? className : "";
        this.__rows = rows;
        this.__htmlTextarea = new qx.ui.embed.Html("");
        this.__htmlTextarea.setAllowGrowX(true);
        this.__htmlTextarea.setAllowGrowY(true);
        this.__render();
        this._add(this.__htmlTextarea);
        this.setMinHeight(110);
        this.__htmlTextarea.addListenerOnce("appear", () => {
            this.__bindNativeTextarea();
            this.__setupResizeObserver();
        });
        this.addListener("focusin", () => { var _a; return (_a = this.__textareaEl) === null || _a === void 0 ? void 0 : _a.focus(); });
        this.addListener("changeTabIndex", () => this.__syncTabIndex());
    }
    __bindNativeTextarea() {
        var _a;
        const root = this.__htmlTextarea.getContentElement().getDomElement();
        this.__textareaEl =
            (_a = root === null || root === void 0 ? void 0 : root.querySelector("textarea")) !== null && _a !== void 0 ? _a : null;
        if (!this.__textareaEl)
            return;
        this.__syncTabIndex();
        this.__textareaEl.oninput = () => {
            var _a, _b;
            const next = (_b = (_a = this.__textareaEl) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "";
            const prev = this.__value;
            this.__value = next;
            this.fireDataEvent("input", next);
            if (prev !== next)
                this.fireDataEvent("changeValue", next);
        };
    }
    __syncTabIndex() {
        if (!this.__textareaEl)
            return;
        this.__textareaEl.setAttribute("tabindex", "-1");
    }
    __setupResizeObserver() {
        const root = this.__htmlTextarea.getContentElement().getDomElement();
        if (!root)
            return;
        this.__resizeObserver = new ResizeObserver(([entry]) => {
            const target = entry.target;
            this.__cachedContentWidth = Math.round(target.scrollWidth || entry.contentRect.width);
            this.__cachedContentHeight = Math.round(target.scrollHeight || entry.contentRect.height);
            this.scheduleLayoutUpdate();
        });
        this.__resizeObserver.observe(root);
        this.addListener("disappear", () => {
            var _a;
            (_a = this.__resizeObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
        });
    }
    // @ts-ignore
    _getContentHint() {
        var _a;
        if (this.__cachedContentWidth > 0 && this.__cachedContentHeight > 0) {
            return { width: this.__cachedContentWidth, height: this.__cachedContentHeight };
        }
        const contentEl = (_a = this.__htmlTextarea.getContentElement()) === null || _a === void 0 ? void 0 : _a.getDomElement();
        if (contentEl) {
            return { width: contentEl.scrollWidth || 0, height: contentEl.scrollHeight || 0 };
        }
        return { width: 0, height: 0 };
    }
    __escapeAttr(value) {
        return value
            .replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }
    __render() {
        const classes = [
            "textarea",
            "bg-card",
            "text-foreground",
            "border-border",
            "placeholder:text-muted-foreground",
            this.__className,
        ]
            .filter(Boolean)
            .join(" ");
        const value = this.__escapeAttr(this.__value);
        const placeholder = this.__escapeAttr(this.__placeholder);
        const tabIndexAttr = 'tabindex="-1"';
        const rowsStyle = `min-height: ${this.__rows * 24}px;`;
        this.__htmlTextarea.setHtml(`
      <div class="p-1">
        <textarea
          class="${classes}"
          placeholder="${placeholder}"
          rows="${this.__rows}"
          style="${rowsStyle}"
          ${tabIndexAttr}
        >${value}</textarea>
      </div>
    `);
        qx.event.Timer.once(() => this.__bindNativeTextarea(), this, 0);
    }
    getValue() {
        var _a, _b;
        return (_b = (_a = this.__textareaEl) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : this.__value;
    }
    setValue(value) {
        this.__value = value !== null && value !== void 0 ? value : "";
        if (this.__textareaEl)
            this.__textareaEl.value = this.__value;
        else
            this.__render();
        return this;
    }
    setPlaceholder(value) {
        this.__placeholder = value !== null && value !== void 0 ? value : "";
        if (this.__textareaEl)
            this.__textareaEl.placeholder = this.__placeholder;
        else
            this.__render();
        return this;
    }
    setRows(rows) {
        this.__rows = rows;
        if (this.__textareaEl)
            this.__textareaEl.rows = rows;
        else
            this.__render();
        return this;
    }
    onInput(handler) {
        this.addListener("input", (ev) => {
            var _a;
            handler((_a = ev.getData()) !== null && _a !== void 0 ? _a : "");
        });
        return this;
    }
}
BsTextarea.events = {
    input: "qx.event.type.Data",
    changeValue: "qx.event.type.Data",
};
class BsToast {
    constructor() { }
    static show(config) {
        var _a;
        const toaster = BsToast.__getOrCreateToaster();
        const toast = BsToast.__createToastElement(config);
        toaster.appendChild(toast);
        const duration = (_a = config.duration) !== null && _a !== void 0 ? _a : (config.category === "error" ? 5000 : 3000);
        const toastId = BsToast.__toastId++;
        const close = () => {
            var _a;
            clearTimeout((_a = BsToast.__toasts.get(toastId)) === null || _a === void 0 ? void 0 : _a.timeout);
            BsToast.__toasts.delete(toastId);
            toast.remove();
        };
        const timeout = window.setTimeout(close, duration);
        BsToast.__toasts.set(toastId, { timeout, close });
    }
    static info(title, description) {
        BsToast.show({ title, description, category: "info" });
    }
    static success(title, description) {
        BsToast.show({ title, description, category: "success" });
    }
    static warning(title, description) {
        BsToast.show({ title, description, category: "warning" });
    }
    static error(title, description) {
        BsToast.show({ title, description, category: "error" });
    }
    static __createToastElement(config) {
        var _a;
        const toast = document.createElement("div");
        toast.className = `toast`;
        toast.setAttribute("role", "status");
        toast.setAttribute("aria-atomic", "true");
        toast.setAttribute("aria-hidden", "false");
        if (config.category) {
            toast.setAttribute("data-category", config.category);
        }
        if (config.duration) {
            toast.setAttribute("data-duration", config.duration.toString());
        }
        const content = document.createElement("div");
        content.className = "toast-content";
        if (config.category) {
            const icon = BsToast.__getCategoryIcon(config.category);
            content.appendChild(icon);
        }
        const section = document.createElement("section");
        const title = document.createElement("h2");
        title.textContent = config.title;
        section.appendChild(title);
        if (config.description) {
            const desc = document.createElement("p");
            desc.textContent = config.description;
            section.appendChild(desc);
        }
        content.appendChild(section);
        if (config.action) {
            const footer = document.createElement("footer");
            if (config.action.href) {
                const link = document.createElement("a");
                link.href = config.action.href;
                link.className = "btn btn-sm-primary";
                link.textContent = config.action.label;
                footer.appendChild(link);
            }
            else if (config.action.onclick) {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "btn btn-sm-primary";
                btn.textContent = config.action.label;
                btn.onclick = (e) => {
                    e.preventDefault();
                    config.action.onclick(() => {
                        toast.remove();
                    });
                };
                footer.appendChild(btn);
            }
            content.appendChild(footer);
        }
        if (config.cancel) {
            const footer = content.querySelector("footer") || document.createElement("footer");
            footer.className = "";
            const cancelBtn = document.createElement("button");
            cancelBtn.type = "button";
            cancelBtn.className = "btn btn-sm-outline";
            cancelBtn.textContent = (_a = config.cancel.label) !== null && _a !== void 0 ? _a : "Dismiss";
            if (config.cancel.onclick) {
                cancelBtn.onclick = (e) => {
                    e.preventDefault();
                    config.cancel.onclick();
                    toast.remove();
                };
            }
            else {
                cancelBtn.onclick = (e) => {
                    e.preventDefault();
                    toast.remove();
                };
            }
            footer.appendChild(cancelBtn);
            if (!content.querySelector("footer")) {
                content.appendChild(footer);
            }
        }
        toast.appendChild(content);
        return toast;
    }
    static __getCategoryIcon(category) {
        const iconContainer = document.createElement("div");
        iconContainer.setAttribute("aria-hidden", "true");
        const icons = {
            success: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`,
            info: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
            warning: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
            error: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`,
        };
        iconContainer.innerHTML = icons[category];
        return iconContainer;
    }
    static __getOrCreateToaster() {
        if (BsToast.__toaster)
            return BsToast.__toaster;
        const toaster = document.createElement("div");
        toaster.id = "bs-toaster";
        toaster.className = "toaster";
        toaster.setAttribute("data-align", "end");
        document.body.appendChild(toaster);
        BsToast.__toaster = toaster;
        return toaster;
    }
}
BsToast.__toaster = null;
BsToast.__toasts = new Map();
BsToast.__toastId = 0;
function __createFieldRow(container, label, input) {
    const field = new qx.ui.container.Composite(new qx.ui.layout.VBox(4));
    field.setAllowGrowX(true);
    const lbl = new qx.ui.basic.Label(label);
    lbl.setTextColor("var(--foreground)");
    field.add(lbl);
    field.add(input);
    container.add(field);
}
function __buildEntrySubForm(prefix, container) {
    const fields = {};
    const card = new BsCard();
    const inner = new qx.ui.container.Composite(new qx.ui.layout.VBox(8));
    inner.setPadding(8);
    const title = new qx.ui.basic.Label(prefix);
    title.setFont(
    // @ts-ignore
    new qx.bom.Font(14).set({ bold: true }));
    title.setTextColor("var(--foreground)");
    inner.add(title);
    const names = ["lastName", "firstName", "middleName"];
    names.forEach((n) => {
        const f = new BsInputGroup(n.replace(/([A-Z])/g, " $1").trim(), `Enter ${n}`);
        fields[`${prefix}_${n}`] = f;
        inner.add(f);
    });
    const phone = new BsInputGroup("Phone", "Enter phone");
    fields[`${prefix}_phone`] = phone;
    inner.add(phone);
    const occupation = new BsInputGroup("Occupation", "Enter occupation");
    fields[`${prefix}_occupation`] = occupation;
    inner.add(occupation);
    const income = new BsInputGroup("Annual Income", "Enter annual income");
    fields[`${prefix}_anualIncome`] = income;
    inner.add(income);
    card.setContent(inner);
    container.add(card);
    return fields;
}
function buildAccessLevelForm(parent) {
    const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
    container.setPadding(8);
    container.setAllowGrowX(true);
    const codeField = new BsInputGroup("Code", "e.g. ADMIN");
    const codeInput = codeField.getInputWidget();
    codeInput.addListenerOnce("appear", () => {
        const rootEl = codeInput.getContentElement().getDomElement();
        if (!rootEl)
            return;
        const inputEl = rootEl.querySelector("input");
        if (!inputEl)
            return;
        inputEl.addEventListener("blur", () => {
            const v = inputEl.value.toUpperCase();
            if (inputEl.value !== v) {
                inputEl.value = v;
                codeInput.setValue(v);
            }
        });
    });
    const codesLabel = new qx.ui.basic.Label("Access Codes");
    codesLabel.setTextColor("var(--foreground)");
    const codesText = new BsTextarea("", "Selected access codes", "", 3);
    codesText.addListenerOnce("appear", () => {
        qx.event.Timer.once(() => {
            const ta = codesText.__textareaEl;
            if (ta)
                ta.readOnly = true;
        }, codesText, 50);
    });
    const codeLabels = {
        AL: "AL: Access Levels",
        C: "C: Courses",
        U: "U: Users",
        PP: "PP: Personal Profiles",
        FB: "FB: Family Backgrounds",
        AD: "AD: Admission Data",
        AA: "AA: Admission Applications",
    };
    const allCodes = Object.keys(codeLabels);
    const selectedCodes = [];
    const updateCombobox = () => {
        const available = allCodes.filter((c) => selectedCodes.indexOf(c) === -1);
        codesSelect.setOptions(available.map((c) => ({ value: c, label: codeLabels[c] })));
    };
    const codesSelect = new BsCombobox(allCodes.map((c) => ({ value: c, label: codeLabels[c] })), "Select page to add...");
    codesSelect.onChange((value) => {
        if (!value)
            return;
        if (selectedCodes.indexOf(value) === -1) {
            selectedCodes.push(value);
            codesText.setValue(selectedCodes.join(", "));
            updateCombobox();
        }
    });
    container.add(codeField);
    container.add(codesLabel);
    container.add(codesText);
    container.add(codesSelect);
    parent.add(container, { flex: 1 });
    return {
        getValues: () => ({
            code: codeField.getValue(),
            name: selectedCodes.join(", "),
        }),
        setValues: (d) => {
            var _a, _b;
            codeField.setValue((_a = d.code) !== null && _a !== void 0 ? _a : "");
            selectedCodes.length = 0;
            const codes = ((_b = d.name) !== null && _b !== void 0 ? _b : "").split(",").map((c) => c.trim()).filter(Boolean);
            codes.forEach((c) => selectedCodes.push(c));
            codesText.setValue(selectedCodes.join(", "));
            updateCombobox();
        },
        reset: () => {
            codeField.setValue("");
            selectedCodes.length = 0;
            codesText.setValue("");
            updateCombobox();
        },
        setReferenceData: () => { },
    };
}
function buildCourseForm(parent) {
    const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
    container.setPadding(8);
    container.setAllowGrowX(true);
    const codeField = new BsInputGroup("Code", "e.g. BSCS");
    const nameField = new BsInputGroup("Name", "e.g. Bachelor of Science in Computer Science");
    container.add(codeField);
    container.add(nameField);
    parent.add(container, { flex: 1 });
    return {
        getValues: () => ({ code: codeField.getValue(), name: nameField.getValue() }),
        setValues: (d) => { var _a, _b; codeField.setValue((_a = d.code) !== null && _a !== void 0 ? _a : ""); nameField.setValue((_b = d.name) !== null && _b !== void 0 ? _b : ""); },
        reset: () => { codeField.setValue(""); nameField.setValue(""); },
        setReferenceData: () => { },
    };
}
function buildUserForm(parent) {
    const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
    container.setPadding(8);
    container.setAllowGrowX(true);
    const codeField = new BsInputGroup("Code", "e.g. USR001");
    const nameField = new BsInputGroup("Name", "Full name");
    const passwordField = new BsInputGroup("Password", "Enter password", "", "input");
    passwordField.getInputWidget().setType("password");
    const emailField = new BsInputGroup("Email", "email@example.com");
    const dobField = new BsDateField();
    const accessLevelSelect = new BsCombobox([], "Select access level");
    container.add(codeField);
    container.add(nameField);
    container.add(passwordField);
    container.add(emailField);
    __createFieldRow(container, "Date of Birth", dobField);
    __createFieldRow(container, "Access Level", accessLevelSelect);
    parent.add(container, { flex: 1 });
    return {
        getValues: () => ({
            code: codeField.getValue(),
            name: nameField.getValue(),
            password: passwordField.getValue(),
            email: emailField.getValue(),
            dateOfBirth: dobField.getValue() ? dobField.getValue().toISOString() : null,
            accessLevelId: accessLevelSelect.getValue(),
        }),
        setValues: (d) => {
            var _a, _b, _c, _d, _e, _f;
            codeField.setValue((_a = d.code) !== null && _a !== void 0 ? _a : "");
            nameField.setValue((_b = d.name) !== null && _b !== void 0 ? _b : "");
            passwordField.setValue((_c = d.password) !== null && _c !== void 0 ? _c : "");
            emailField.setValue((_d = d.email) !== null && _d !== void 0 ? _d : "");
            if (d.dateOfBirth)
                dobField.setValue(new Date(d.dateOfBirth));
            const levelId = (_e = d.accessLevelId) !== null && _e !== void 0 ? _e : (_f = d.accessLevel) === null || _f === void 0 ? void 0 : _f.id;
            if (levelId)
                accessLevelSelect.setValue(levelId);
        },
        reset: () => {
            codeField.setValue("");
            nameField.setValue("");
            passwordField.setValue("");
            emailField.setValue("");
            dobField.setValue(null);
            accessLevelSelect.setValue("");
        },
        setReferenceData: (key, items) => {
            if (key === "accessLevels")
                accessLevelSelect.setOptions(items);
        },
    };
}
function buildPersonalProfileForm(parent) {
    const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
    container.setPadding(8);
    container.setAllowGrowX(true);
    const codeField = new BsInputGroup("Code", "e.g. PROF001");
    const nameField = new BsInputGroup("Name", "Full name (pre-computed)");
    const firstName = new BsInputGroup("First Name", "First name");
    const middleName = new BsInputGroup("Middle Name", "Middle name");
    const lastName = new BsInputGroup("Last Name", "Last name");
    const extName = new BsInputGroup("Extension Name", "e.g. Jr., III");
    const emailField = new BsInputGroup("Email", "email@example.com");
    const phoneField = new BsInputGroup("Phone", "Contact number");
    const sexSelect = new BsSelect(["Male", "Female"], "select");
    const dobField = new BsDateField();
    const birthPlace = new BsInputGroup("Birth Place", "Place of birth");
    const municipality = new BsInputGroup("Municipality", "Municipality/City");
    const barangay = new BsInputGroup("Barangay", "Barangay");
    const street = new BsInputGroup("Street", "Street address");
    const citizenship = new BsInputGroup("Citizenship", "e.g. Filipino");
    const addrEmail = new BsInputGroup("Address Email", "Alternate email");
    const addrPhone = new BsInputGroup("Address Phone", "Alternate phone");
    container.add(codeField);
    container.add(nameField);
    container.add(firstName);
    container.add(middleName);
    container.add(lastName);
    container.add(extName);
    container.add(emailField);
    container.add(phoneField);
    __createFieldRow(container, "Sex", sexSelect);
    __createFieldRow(container, "Date of Birth", dobField);
    container.add(birthPlace);
    container.add(municipality);
    container.add(barangay);
    container.add(street);
    container.add(citizenship);
    container.add(addrEmail);
    container.add(addrPhone);
    parent.add(container, { flex: 1 });
    return {
        getValues: () => ({
            code: codeField.getValue(),
            name: nameField.getValue(),
            firstName: firstName.getValue(),
            middleName: middleName.getValue(),
            lastName: lastName.getValue(),
            extentionName: extName.getValue(),
            email: emailField.getValue(),
            phone: phoneField.getValue(),
            sex: sexSelect.getSelectedValue(),
            dateOfBirth: dobField.getValue() ? dobField.getValue().toISOString() : null,
            birthPlace: birthPlace.getValue(),
            municipality: municipality.getValue(),
            barangay: barangay.getValue(),
            street: street.getValue(),
            citizenship: citizenship.getValue(),
            addressEmail: addrEmail.getValue(),
            addressPhone: addrPhone.getValue(),
        }),
        setValues: (d) => {
            const set = (f, v) => f.setValue(v !== null && v !== void 0 ? v : "");
            set(codeField, d.code);
            set(nameField, d.name);
            set(firstName, d.firstName);
            set(middleName, d.middleName);
            set(lastName, d.lastName);
            set(extName, d.extentionName);
            set(emailField, d.email);
            set(phoneField, d.phone);
            if (d.sex)
                sexSelect.setSelectedByLabel(d.sex);
            if (d.dateOfBirth)
                dobField.setValue(new Date(d.dateOfBirth));
            set(birthPlace, d.birthPlace);
            set(municipality, d.municipality);
            set(barangay, d.barangay);
            set(street, d.street);
            set(citizenship, d.citizenship);
            set(addrEmail, d.addressEmail);
            set(addrPhone, d.addressPhone);
        },
        reset: () => {
            const fields = [codeField, nameField, firstName, middleName, lastName, extName,
                emailField, phoneField, birthPlace, municipality, barangay, street,
                citizenship, addrEmail, addrPhone];
            fields.forEach((f) => f.setValue(""));
            sexSelect.resetSelection();
            dobField.setValue(null);
        },
        setReferenceData: () => { },
    };
}
function buildFamilyBackgroundForm(parent) {
    const scroll = new qx.ui.container.Scroll();
    scroll.setAllowGrowY(true);
    const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
    container.setPadding(8);
    container.setAllowGrowX(true);
    const codeField = new BsInputGroup("Code", "e.g. FAM001");
    const nameField = new BsInputGroup("Name", "Family name identifier");
    container.add(codeField);
    container.add(nameField);
    const fatherFields = __buildEntrySubForm("Father", container);
    const motherFields = __buildEntrySubForm("Mother", container);
    const guardianFields = __buildEntrySubForm("Guardian", container);
    scroll.add(container);
    parent.add(scroll, { flex: 1 });
    const collectEntry = (fields, prefix) => ({
        lastName: fields[`${prefix}_lastName`].getValue(),
        firstName: fields[`${prefix}_firstName`].getValue(),
        middleName: fields[`${prefix}_middleName`].getValue(),
        phone: fields[`${prefix}_phone`].getValue(),
        occupation: fields[`${prefix}_occupation`].getValue(),
        anualIncome: fields[`${prefix}_anualIncome`].getValue(),
    });
    const setEntry = (fields, prefix, data) => {
        var _a, _b, _c, _d, _e, _f;
        if (!data)
            return;
        fields[`${prefix}_lastName`].setValue((_a = data.lastName) !== null && _a !== void 0 ? _a : "");
        fields[`${prefix}_firstName`].setValue((_b = data.firstName) !== null && _b !== void 0 ? _b : "");
        fields[`${prefix}_middleName`].setValue((_c = data.middleName) !== null && _c !== void 0 ? _c : "");
        fields[`${prefix}_phone`].setValue((_d = data.phone) !== null && _d !== void 0 ? _d : "");
        fields[`${prefix}_occupation`].setValue((_e = data.occupation) !== null && _e !== void 0 ? _e : "");
        fields[`${prefix}_anualIncome`].setValue((_f = data.anualIncome) !== null && _f !== void 0 ? _f : "");
    };
    const resetEntry = (fields, prefix) => {
        const keys = ["lastName", "firstName", "middleName", "phone", "occupation", "anualIncome"];
        keys.forEach((k) => fields[`${prefix}_${k}`].setValue(""));
    };
    return {
        getValues: () => ({
            code: codeField.getValue(),
            name: nameField.getValue(),
            father: collectEntry(fatherFields, "Father"),
            mother: collectEntry(motherFields, "Mother"),
            guardian: collectEntry(guardianFields, "Guardian"),
        }),
        setValues: (d) => {
            var _a, _b;
            codeField.setValue((_a = d.code) !== null && _a !== void 0 ? _a : "");
            nameField.setValue((_b = d.name) !== null && _b !== void 0 ? _b : "");
            setEntry(fatherFields, "Father", d.father);
            setEntry(motherFields, "Mother", d.mother);
            setEntry(guardianFields, "Guardian", d.guardian);
        },
        reset: () => {
            codeField.setValue("");
            nameField.setValue("");
            resetEntry(fatherFields, "Father");
            resetEntry(motherFields, "Mother");
            resetEntry(guardianFields, "Guardian");
        },
        setReferenceData: () => { },
    };
}
function generateGuid() {
    const hex = () => ((Math.random() * 16) | 0).toString(16);
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
}
function buildAdmissionDataForm(parent) {
    const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
    container.setPaddingBottom(8);
    container.setAllowGrowX(true);
    const codeField = new BsInputGroup("Control Number");
    const nameField = new BsInputGroup("Name");
    const lrnField = new BsInputGroup("LRN");
    const levelSelect = new BsSelect(["College", "Senior High", "Junior High"], "select");
    const typeSelect = new BsSelect(["New", "Transferee", "Returning"], "select");
    const yearLevelField = new BsInputGroup("Year Level");
    yearLevelField.getInputWidget().setType("number");
    const courseSelect = new BsCombobox([], "Select course");
    const newApplicationRow = new qx.ui.container.Composite(new qx.ui.layout.HBox(12).set({ alignY: "middle" }));
    newApplicationRow.setAllowGrowX(true);
    const newApplicationLabel = new qx.ui.basic.Label("New Application");
    newApplicationLabel.setTextColor("var(--foreground)");
    const newApplicationCheckbox = new BsCheckbox();
    newApplicationRow.add(newApplicationCheckbox);
    newApplicationRow.add(newApplicationLabel, { flex: 1 });
    container.add(newApplicationRow);
    newApplicationCheckbox.onToggle(function (checked) {
        if (checked) {
            const guid = generateGuid();
            codeField.setValue(guid);
        }
    });
    container.add(codeField);
    container.add(nameField);
    container.add(lrnField);
    __createFieldRow(container, "Level", levelSelect);
    __createFieldRow(container, "Type", typeSelect);
    container.add(yearLevelField);
    __createFieldRow(container, "Course", courseSelect);
    parent.add(container, { flex: 1 });
    return {
        getValues: () => ({
            code: codeField.getValue(),
            name: nameField.getValue(),
            lrn: lrnField.getValue(),
            level: levelSelect.getSelectedValue(),
            type: typeSelect.getSelectedValue(),
            yearLevel: parseInt(yearLevelField.getValue(), 10) || 0,
            courseId: courseSelect.getValue(),
        }),
        setValues: (d) => {
            var _a, _b, _c, _d, _e, _f, _g;
            codeField.setValue((_a = d.code) !== null && _a !== void 0 ? _a : "");
            nameField.setValue((_b = d.name) !== null && _b !== void 0 ? _b : "");
            lrnField.setValue((_c = d.lrn) !== null && _c !== void 0 ? _c : "");
            if (d.level)
                levelSelect.setSelectedByLabel(d.level);
            if (d.type)
                typeSelect.setSelectedByLabel(d.type);
            yearLevelField.setValue((_e = (_d = d.yearLevel) === null || _d === void 0 ? void 0 : _d.toString()) !== null && _e !== void 0 ? _e : "");
            const cId = (_f = d.courseId) !== null && _f !== void 0 ? _f : (_g = d.course) === null || _g === void 0 ? void 0 : _g.id;
            if (cId)
                courseSelect.setValue(cId);
        },
        reset: () => {
            codeField.setValue("");
            nameField.setValue("");
            lrnField.setValue("");
            levelSelect.resetSelection();
            typeSelect.resetSelection();
            yearLevelField.setValue("");
            courseSelect.setValue("");
        },
        setReferenceData: (key, items) => {
            if (key === "courses")
                courseSelect.setOptions(items);
        },
    };
}
function buildAdmissionApplicationForm(parent) {
    const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
    container.setPadding(8);
    container.setAllowGrowX(true);
    const codeField = new BsInputGroup("Code");
    const nameField = new BsInputGroup("Name");
    container.add(codeField);
    container.add(nameField);
    parent.add(container, { flex: 1 });
    return {
        getValues: () => ({ code: codeField.getValue(), name: nameField.getValue() }),
        setValues: (d) => { var _a, _b; codeField.setValue((_a = d.code) !== null && _a !== void 0 ? _a : ""); nameField.setValue((_b = d.name) !== null && _b !== void 0 ? _b : ""); },
        reset: () => { codeField.setValue(""); nameField.setValue(""); },
        setReferenceData: () => { },
    };
}
function buildFormByEntity(entityType, parent) {
    switch (entityType) {
        case "AccessLevel": return buildAccessLevelForm(parent);
        case "Course": return buildCourseForm(parent);
        case "User": return buildUserForm(parent);
        case "PersonalProfile": return buildPersonalProfileForm(parent);
        case "FamilyBackground": return buildFamilyBackgroundForm(parent);
        case "AdmissionData": return buildAdmissionDataForm(parent);
        case "AdmissionApplication": return buildAdmissionApplicationForm(parent);
        default: throw new Error(`Unknown entity: ${entityType}`);
    }
}
function __buildTable(columns, columnLabels) {
    // @ts-ignore
    const model = new qx.ui.table.model.Simple();
    model.setColumns(columnLabels);
    const custom = {};
    // @ts-ignore
    const table = new qx.ui.table.Table(model, custom);
    // @ts-ignore
    table.setDecorator(null);
    table.setStatusBarVisible(false);
    // @ts-ignore
    table.setShowCellFocusIndicator(false);
    table.setAllowGrowX(true);
    table.setAllowGrowY(true);
    const tcm = table.getTableColumnModel();
    if (tcm) {
        for (let i = 0; i < columnLabels.length; i++) {
            // @ts-ignore
            tcm.setColumnWidth(i, 120, false);
        }
    }
    const __pad = (n) => n < 10 ? "0" + n : "" + n;
    const __fmtDate = (iso) => {
        const d = new Date(iso);
        if (isNaN(d.getTime()))
            return iso;
        return __pad(d.getMonth() + 1) + "/" + __pad(d.getDate()) + "/" + d.getFullYear() + " " + __pad(d.getHours()) + ":" + __pad(d.getMinutes());
    };
    let rawData = [];
    const loadData = (data) => {
        rawData = data;
        const rows = data.map((item) => columns.map((col) => {
            const val = item[col];
            if (val === null || val === undefined)
                return "";
            if (typeof val === "object" && val instanceof Date)
                return val.toLocaleDateString();
            if (typeof val === "object")
                return JSON.stringify(val);
            const s = String(val);
            if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(s))
                return __fmtDate(s);
            return s;
        }));
        // @ts-ignore
        model.setData(rows);
    };
    const selectHandlers = [];
    const emitSelectedRow = () => {
        var _a;
        // @ts-ignore
        const ranges = table.getSelectionModel().getSelectedRanges();
        if (ranges.length > 0) {
            const rowIndex = (_a = ranges[0].minIndex) !== null && _a !== void 0 ? _a : 0;
            if (rowIndex >= 0 && rowIndex < rawData.length) {
                const row = rawData[rowIndex];
                selectHandlers.forEach((h) => h(row));
            }
        }
    };
    // @ts-ignore
    table.addListener("tap", emitSelectedRow);
    const onRowSelect = (handler) => {
        selectHandlers.push(handler);
    };
    return { table, loadData, onRowSelect };
}
function __buildTableForEntity(entityType) {
    switch (entityType) {
        case "AccessLevel":
            return __buildTable(["id", "code", "name", "createdAt", "updatedAt"], ["ID", "Code", "Access Codes", "Created At", "Updated At"]);
        case "Course":
            return __buildTable(["id", "code", "name", "createdAt", "updatedAt"], ["ID", "Code", "Name", "Created At", "Updated At"]);
        case "User":
            return __buildTable(["id", "code", "name", "email", "dateOfBirth", "createdAt", "updatedAt"], ["ID", "Code", "Name", "Email", "Date of Birth", "Created At", "Updated At"]);
        case "PersonalProfile":
            return __buildTable(["id", "code", "name", "firstName", "lastName", "email", "phone", "sex", "createdAt"], ["ID", "Code", "Name", "First Name", "Last Name", "Email", "Phone", "Sex", "Created At"]);
        case "FamilyBackground":
            return __buildTable(["id", "code", "name", "createdAt", "updatedAt"], ["ID", "Code", "Name", "Created At", "Updated At"]);
        case "AdmissionData":
            return __buildTable(["code", "name", "lrn", "level", "type", "yearLevel", "status", "result", "createdAt"], ["Code", "Name", "LRN", "Level", "Type", "Year Level", "Status", "Result", "Created At"]);
        case "AdmissionApplication":
            return __buildTable(["id", "createdAt", "updatedAt"], ["ID", "Created At", "Updated At"]);
        default:
            return __buildTable(["id"], ["ID"]);
    }
}
function __entityLabel(entityType) {
    var _a;
    const map = {
        AccessLevel: "Access Levels",
        Course: "Courses",
        User: "Users",
        PersonalProfile: "Personal Profiles",
        FamilyBackground: "Family Backgrounds",
        AdmissionData: "Admission Data",
        AdmissionApplication: "Admission Applications",
    };
    return (_a = map[entityType]) !== null && _a !== void 0 ? _a : entityType;
}
class CrudPage extends BasePage {
    constructor(entityType) {
        super();
        this.__showingForm = true;
        this.__loading = false;
        this.__selectedId = null;
        this.__selectedRecord = null;
        this.__entityType = entityType;
        this.__entityLabel = __entityLabel(entityType);
        this.setLayout(new qx.ui.layout.VBox(0));
        const header = this.__createHeader();
        this.add(header);
        const stack = new qx.ui.container.Composite(new qx.ui.layout.Grow());
        this.add(stack, { flex: 1 });
        this.__formView = this.__createFormView();
        this.__tableView = this.__createTableView();
        stack.add(this.__formView);
        stack.add(this.__tableView);
        this.__tableView.exclude();
        this.__loadReferenceData();
        this.__loadTableData();
    }
    __createHeader() {
        const bar = new qx.ui.container.Composite(new qx.ui.layout.HBox(10));
        bar.setPadding(12);
        bar.setDecorator(new qx.ui.decoration.Decorator().set({
            widthBottom: 1, styleBottom: "solid", colorBottom: AppColors.border(),
        }));
        const title = new qx.ui.basic.Label(this.__entityLabel);
        title.setFont(
        // @ts-ignore
        new qx.bom.Font(18).set({ bold: true }));
        title.setTextColor(AppColors.foreground());
        const status = new qx.ui.basic.Label("Form View");
        status.setTextColor(AppColors.mutedForeground());
        status.setFont(
        // @ts-ignore
        new qx.bom.Font(12));
        this.__errorLabel = status;
        bar.add(title);
        bar.add(new qx.ui.core.Spacer(), { flex: 1 });
        bar.add(status);
        return bar;
    }
    __createFormView() {
        const wrapper = new qx.ui.container.Composite(new qx.ui.layout.VBox(0));
        const scroll = new qx.ui.container.Scroll();
        const formContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox(0));
        formContainer.setAllowGrowX(true);
        scroll.add(formContainer);
        wrapper.add(scroll, { flex: 1 });
        this.__formControl = buildFormByEntity(this.__entityType, formContainer);
        const btnRow = new qx.ui.container.Composite(new qx.ui.layout.HBox(10));
        btnRow.setPadding(12);
        this.__submitBtn = new BsButton("Create", undefined, { variant: "default" });
        this.__cancelEditBtn = new BsButton("Cancel", undefined, { variant: "ghost" });
        this.__cancelEditBtn.setVisibility("excluded");
        this.__toggleFormBtn = new BsButton("Show Table", undefined, { variant: "outline" });
        btnRow.add(this.__submitBtn);
        btnRow.add(this.__cancelEditBtn);
        btnRow.add(this.__toggleFormBtn);
        const errLabel = new qx.ui.basic.Label("");
        errLabel.setTextColor(AppColors.destructive());
        errLabel.setVisibility("excluded");
        btnRow.add(errLabel);
        this.__errorLabel = errLabel;
        wrapper.add(btnRow);
        this.__submitBtn.onClick(() => this.__handleSubmit());
        this.__cancelEditBtn.onClick(() => this.__cancelEdit());
        this.__toggleFormBtn.onClick(() => this.__toggleView());
        return wrapper;
    }
    __createTableView() {
        const wrapper = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
        wrapper.setPadding(12);
        this.__tableHandle = __buildTableForEntity(this.__entityType);
        wrapper.add(this.__tableHandle.table, { flex: 1 });
        this.__toggleTableBtn = new BsButton("Show Form", undefined, { variant: "outline" });
        this.__toggleTableBtn.setAllowGrowX(false);
        wrapper.add(this.__toggleTableBtn);
        this.__tableHandle.onRowSelect((rowData) => {
            this.__editRecord(rowData);
        });
        this.__toggleTableBtn.onClick(() => this.__toggleView());
        return wrapper;
    }
    __toggleView() {
        this.__showingForm = !this.__showingForm;
        if (this.__showingForm) {
            this.__formView.show();
            this.__tableView.exclude();
        }
        else {
            this.__formView.exclude();
            this.__tableView.show();
            this.__loadTableData();
        }
    }
    __handleSubmit() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (this.__loading)
                return;
            this.__loading = true;
            this.__submitBtn.setEnabled(false);
            this.__errorLabel.setVisibility("excluded");
            try {
                const values = this.__formControl.getValues();
                if (this.__selectedId) {
                    const result = yield updateEntity(this.__entityType, this.__selectedId, values);
                    BsToast.show({
                        title: "Success",
                        description: `${this.__entityLabel} updated successfully`,
                        category: "success",
                    });
                    this.__cancelEdit();
                }
                else {
                    const result = yield createEntity(this.__entityType, values);
                    BsToast.show({
                        title: "Success",
                        description: `${this.__entityLabel} created successfully`,
                        category: "success",
                    });
                    this.__formControl.reset();
                }
                if (!this.__showingForm) {
                    this.__loadTableData();
                }
            }
            catch (err) {
                this.__errorLabel.setValue((_a = err.message) !== null && _a !== void 0 ? _a : "An error occurred");
                this.__errorLabel.setVisibility("visible");
                BsToast.show({
                    title: "Error",
                    description: (_b = err.message) !== null && _b !== void 0 ? _b : `Failed to ${this.__selectedId ? "update" : "create"} record`,
                    category: "error",
                });
            }
            finally {
                this.__loading = false;
                this.__submitBtn.setEnabled(true);
            }
        });
    }
    __editRecord(rowData) {
        this.__selectedId = rowData.id;
        this.__selectedRecord = rowData;
        this.__formControl.setValues(rowData);
        this.__submitBtn.setText("Update");
        this.__cancelEditBtn.setVisibility("visible");
        if (!this.__showingForm) {
            this.__toggleView();
        }
    }
    __cancelEdit() {
        this.__selectedId = null;
        this.__selectedRecord = null;
        this.__formControl.reset();
        this.__submitBtn.setText("Create");
        this.__cancelEditBtn.setVisibility("excluded");
    }
    __loadTableData() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const data = yield queryList(this.__entityType);
                this.__tableHandle.loadData(data);
            }
            catch (err) {
                BsToast.show({
                    title: "Error Loading Data",
                    description: (_a = err.message) !== null && _a !== void 0 ? _a : "Failed to load table data",
                    category: "error",
                });
            }
        });
    }
    __loadReferenceData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.__entityType === "User") {
                    const levels = yield queryList("AccessLevel");
                    this.__formControl.setReferenceData("accessLevels", levels.map((l) => ({ value: l.id, label: `${l.code} - ${l.name}` })));
                }
                if (this.__entityType === "AdmissionData") {
                    const courses = yield queryList("Course");
                    this.__formControl.setReferenceData("courses", courses.map((c) => ({ value: c.id, label: `${c.code} - ${c.name}` })));
                }
            }
            catch (err) {
                console.warn("Failed to load reference data:", err.message);
            }
        });
    }
}
class AlertDialogPage extends BasePage {
    constructor() {
        super();
        this.setLayout(new qx.ui.layout.VBox(20));
        this.setPadding(20);
        this.add(this.createBasicSection());
        this.add(this.createWithDescriptionSection());
        this.add(this.createButtonVariationsSection());
        this.add(this.createWithChildrenSection());
    }
    __createTriggerButton(label, variant) {
        return new BsButton(label, undefined, { variant: variant !== null && variant !== void 0 ? variant : "default" });
    }
    createBasicSection() {
        const sectionTitle = new qx.ui.basic.Label("Basic Alert Dialog");
        sectionTitle.setFont(
        // @ts-ignore
        new qx.bom.Font(18).set({ bold: true }));
        sectionTitle.setTextColor("var(--foreground)");
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        const contentContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox(12).set({ alignX: "center" }));
        const descriptionLabel = new qx.ui.basic.Label("A simple alert dialog with title only.");
        contentContainer.add(descriptionLabel);
        const buttonRow = new qx.ui.container.Composite(new qx.ui.layout.HBox(12).set({ alignX: "center", alignY: "middle" }));
        const simpleAlertBtn = this.__createTriggerButton("Show Alert");
        simpleAlertBtn.addListener("execute", () => {
            BsAlertDialog.show({
                title: "Are you sure?",
                footerButtons: "ok",
                continueLabel: "OK",
            });
        });
        buttonRow.add(simpleAlertBtn);
        contentContainer.add(buttonRow);
        card.setContent(contentContainer);
        const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
        container.add(sectionTitle);
        container.add(card);
        return container;
    }
    createWithDescriptionSection() {
        const sectionTitle = new qx.ui.basic.Label("With Description");
        sectionTitle.setFont(
        // @ts-ignore
        new qx.bom.Font(18).set({ bold: true }));
        sectionTitle.setTextColor("var(--foreground)");
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        const contentContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox(12).set({ alignX: "center" }));
        const descriptionLabel = new qx.ui.basic.Label("Alert dialog with title and description text.");
        contentContainer.add(descriptionLabel);
        const buttonRow = new qx.ui.container.Composite(new qx.ui.layout.HBox(12).set({ alignX: "center", alignY: "middle" }));
        const withDescBtn = this.__createTriggerButton("Show with Description");
        withDescBtn.setWidth(160);
        withDescBtn.addListener("execute", () => {
            BsAlertDialog.show({
                title: "Delete Account",
                description: "This action cannot be undone. All your data will be permanently removed.",
                footerButtons: "ok-cancel",
                cancelLabel: "Cancel",
                continueLabel: "Delete",
                onContinue: () => {
                    console.log("Delete confirmed");
                },
            });
        });
        buttonRow.add(withDescBtn);
        contentContainer.add(buttonRow);
        card.setContent(contentContainer);
        const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
        container.add(sectionTitle);
        container.add(card);
        return container;
    }
    createButtonVariationsSection() {
        const sectionTitle = new qx.ui.basic.Label("Button Variations");
        sectionTitle.set({
            font: 
            // @ts-ignore
            new qx.bom.Font(18).set({ bold: true }),
            textColor: "var(--foreground)",
        });
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        const contentContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox(16).set({ alignX: "center" }));
        const descLabel = new qx.ui.basic.Label("Different footer button configurations.");
        contentContainer.add(descLabel);
        const row1 = new qx.ui.container.Composite(new qx.ui.layout.HBox(12).set({ alignX: "center", alignY: "middle" }));
        const okOnlyBtn = this.__createTriggerButton("OK Only");
        okOnlyBtn.addListener("execute", () => {
            BsAlertDialog.show({
                title: "Operation Complete",
                description: "The task has been completed successfully.",
                footerButtons: "ok",
            });
        });
        row1.add(okOnlyBtn);
        const okCancelBtn = this.__createTriggerButton("OK / Cancel");
        okCancelBtn.addListener("execute", () => {
            BsAlertDialog.show({
                title: "Save Changes?",
                description: "Do you want to save your changes?",
                footerButtons: "ok-cancel",
            });
        });
        row1.add(okCancelBtn);
        const cancelOnlyBtn = this.__createTriggerButton("Cancel Only");
        cancelOnlyBtn.addListener("execute", () => {
            BsAlertDialog.show({
                title: "Continue Operation?",
                description: "Do you want to continue with this operation?",
                footerButtons: "cancel",
                cancelLabel: "Continue",
            });
        });
        row1.add(cancelOnlyBtn);
        contentContainer.add(row1);
        const customLabelsRow = new qx.ui.container.Composite(new qx.ui.layout.HBox(12).set({ alignX: "center", alignY: "middle" }));
        const customLabelsBtn = this.__createTriggerButton("Custom Labels", "secondary");
        customLabelsBtn.setWidth(120);
        customLabelsBtn.addListener("execute", () => {
            BsAlertDialog.show({
                title: "Confirm Action",
                description: "Please confirm you want to proceed.",
                footerButtons: "ok-cancel",
                cancelLabel: "No, Go Back",
                continueLabel: "Yes, Proceed",
                onContinue: () => {
                    console.log("Custom label continue clicked");
                },
            });
        });
        customLabelsRow.add(customLabelsBtn);
        contentContainer.add(customLabelsRow);
        card.setContent(contentContainer);
        const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
        container.add(sectionTitle);
        container.add(card);
        return container;
    }
    createWithChildrenSection() {
        const sectionTitle = new qx.ui.basic.Label("With Qooxdoo Children");
        sectionTitle.setFont(
        // @ts-ignore
        new qx.bom.Font(18).set({ bold: true }));
        sectionTitle.setTextColor("var(--foreground)");
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        const contentContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox(12).set({ alignX: "center" }));
        const descriptionLabel = new qx.ui.basic.Label("Alert dialog with Qooxdoo widgets as body content.");
        contentContainer.add(descriptionLabel);
        const buttonRow = new qx.ui.container.Composite(new qx.ui.layout.HBox(12).set({ alignX: "center", alignY: "middle" }));
        const withChildrenBtn = this.__createTriggerButton("Show with Widget", "secondary");
        withChildrenBtn.setWidth(150);
        withChildrenBtn.addListener("execute", () => {
            const formContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox(12));
            formContainer.setLayoutProperties({ flex: 1 });
            formContainer.setWidth(0);
            formContainer.setMinWidth(0);
            formContainer.setAllowGrowX(true);
            const nameField = new qx.ui.container.Composite(new qx.ui.layout.VBox(4));
            nameField.setWidth(0);
            nameField.setMinWidth(0);
            nameField.setAllowGrowX(true);
            nameField.add(new BsLabel("Name:"));
            const nameInput = new BsInput("", "Enter your name");
            nameInput.setWidth(0);
            nameInput.setMinWidth(0);
            nameInput.setAllowGrowX(true);
            nameField.add(nameInput);
            const emailField = new qx.ui.container.Composite(new qx.ui.layout.VBox(4));
            emailField.setWidth(0);
            emailField.setMinWidth(0);
            emailField.setAllowGrowX(true);
            emailField.add(new BsLabel("Email:"));
            const emailInput = new BsInput("", "Enter your email");
            emailInput.setWidth(0);
            emailInput.setMinWidth(0);
            emailInput.setAllowGrowX(true);
            emailField.add(emailInput);
            formContainer.add(nameField);
            formContainer.add(emailField);
            BsAlertDialog.show({
                title: "Enter Details",
                footerButtons: "ok-cancel",
                cancelLabel: "Cancel",
                continueLabel: "Submit",
                onContinue: () => {
                    console.log("Name:", nameInput.getValue());
                    console.log("Email:", emailInput.getValue());
                },
                children: formContainer,
            });
        });
        buttonRow.add(withChildrenBtn);
        contentContainer.add(buttonRow);
        card.setContent(contentContainer);
        const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
        container.add(sectionTitle);
        container.add(card);
        return container;
    }
}
class AvatarPage extends BasePage {
    constructor() {
        super();
        this.setLayout(new qx.ui.layout.VBox(20));
        this.setPadding(20);
        this.add(this.createShapesSection());
        this.add(this.createFallbackSection());
        this.add(this.createSizesSection());
    }
    createShapesSection() {
        const sectionTitle = new qx.ui.basic.Label("Shapes");
        sectionTitle.setFont(
        // @ts-ignore
        new qx.bom.Font(18).set({ bold: true }));
        sectionTitle.setTextColor("var(--foreground)");
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        const shapesContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox(16).set({ alignX: "center", alignY: "middle" }));
        shapesContainer.add(new BsAvatar("resource/app/morty.png", "Morty", "M", "", "full"));
        shapesContainer.add(new BsAvatar("resource/app/morty.png", "Morty", "M", "", "rounded"));
        shapesContainer.add(new BsAvatar("resource/app/morty.png", "Morty", "M", "", "square"));
        card.setContent(shapesContainer);
        const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
        container.add(sectionTitle);
        container.add(card);
        return container;
    }
    createFallbackSection() {
        const sectionTitle = new qx.ui.basic.Label("Fallback");
        sectionTitle.setFont(
        // @ts-ignore
        new qx.bom.Font(18).set({ bold: true }));
        sectionTitle.setTextColor("var(--foreground)");
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        const fallbackContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox(16).set({ alignX: "center", alignY: "middle" }));
        fallbackContainer.add(new BsAvatar("resource/app/morty.png", "Morty", "M"));
        fallbackContainer.add(new BsAvatar(undefined, "User", "A"));
        fallbackContainer.add(new BsAvatar(undefined, "User", "B"));
        fallbackContainer.add(new BsAvatar(undefined, "User", "J D", "", "full"));
        card.setContent(fallbackContainer);
        const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
        container.add(sectionTitle);
        container.add(card);
        return container;
    }
    createSizesSection() {
        const sectionTitle = new qx.ui.basic.Label("Sizes");
        sectionTitle.setFont(
        // @ts-ignore
        new qx.bom.Font(18).set({ bold: true }));
        sectionTitle.setTextColor("var(--foreground)");
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        const sizesContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox(16).set({
            alignX: "center",
            alignY: "middle",
        }));
        sizesContainer.setHeight(100);
        sizesContainer.setAlignX("center");
        sizesContainer.setAlignY("middle");
        const small = new BsAvatar("resource/app/morty.png", "Morty", "M", "size-6");
        const defaultSize = new BsAvatar("resource/app/morty.png", "Morty", "M", "size-8");
        const large = new BsAvatar("resource/app/morty.png", "Morty", "M", "size-12");
        const xl = new BsAvatar("resource/app/morty.png", "Morty", "M", "size-16");
        sizesContainer.add(small);
        sizesContainer.add(defaultSize);
        sizesContainer.add(large);
        sizesContainer.add(xl);
        card.setContent(sizesContainer);
        const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
        container.add(sectionTitle);
        container.add(card);
        return container;
    }
}
class ButtonPage extends BasePage {
    constructor() {
        super();
        this.setLayout(new qx.ui.layout.VBox(20));
        this.add(this.createVariantSection());
        this.add(this.createSizeSection());
        this.add(this.createWithIconSection());
        this.add(this.createDisabledSection());
    }
    createVariantSection() {
        const sectionTitle = new qx.ui.basic.Label("Variants");
        sectionTitle.setFont(
        // @ts-ignore
        new qx.bom.Font(18).set({ bold: true }));
        sectionTitle.setTextColor("var(--foreground)");
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        const variantsContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox(12).set({ alignX: "center" }));
        const row1 = new qx.ui.container.Composite(new qx.ui.layout.HBox(12).set({ alignX: "center", alignY: "middle" }));
        row1.add(new BsButton("Default"));
        row1.add(new BsButton("Secondary", undefined, { variant: "secondary" }));
        row1.add(new BsButton("Destructive", undefined, { variant: "destructive" }));
        variantsContainer.add(row1);
        const row2 = new qx.ui.container.Composite(new qx.ui.layout.HBox(12).set({ alignX: "center", alignY: "middle" }));
        row2.add(new BsButton("Outline", undefined, { variant: "outline" }));
        row2.add(new BsButton("Ghost", undefined, { variant: "ghost" }));
        row2.add(new BsButton("Link", undefined, { variant: "link" }));
        variantsContainer.add(row2);
        card.setContent(variantsContainer);
        const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
        container.add(sectionTitle);
        container.add(card);
        return container;
    }
    createSizeSection() {
        const sectionTitle = new qx.ui.basic.Label("Sizes");
        sectionTitle.setFont(
        // @ts-ignore
        new qx.bom.Font(18).set({ bold: true }));
        sectionTitle.setTextColor("var(--foreground)");
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        const sizesContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox(16).set({ alignX: "center" }));
        const row1 = new qx.ui.container.Composite(new qx.ui.layout.HBox(12).set({ alignX: "center", alignY: "middle" }));
        row1.add(new BsButton("Small", undefined, { size: "sm" }));
        row1.add(new BsButton("Default", undefined, { size: "default" }));
        row1.add(new BsButton("Large", undefined, { size: "lg" }));
        sizesContainer.add(row1);
        const row2 = new qx.ui.container.Composite(new qx.ui.layout.HBox(12).set({ alignX: "center", alignY: "middle" }));
        row2.add(new BsButton(undefined, new InlineSvgIcon("search", 16), {
            size: "icon",
        }));
        row2.add(new BsButton(undefined, new InlineSvgIcon("search", 18), {
            size: "sm-icon",
        }));
        row2.add(new BsButton(undefined, new InlineSvgIcon("search", 20), {
            size: "lg-icon",
        }));
        sizesContainer.add(row2);
        card.setContent(sizesContainer);
        const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
        container.add(sectionTitle);
        container.add(card);
        return container;
    }
    createWithIconSection() {
        const sectionTitle = new qx.ui.basic.Label("With Icons");
        sectionTitle.setFont(
        // @ts-ignore
        new qx.bom.Font(18).set({ bold: true }));
        sectionTitle.setTextColor("var(--foreground)");
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        const iconContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox(12).set({ alignX: "center" }));
        const row1 = new qx.ui.container.Composite(new qx.ui.layout.HBox(12).set({ alignX: "center", alignY: "middle" }));
        row1.add(new BsButton("Search", new InlineSvgIcon("search", 16)));
        row1.add(new BsButton("Download", new InlineSvgIcon("download", 16)));
        row1.add(new BsButton("Settings", new InlineSvgIcon("settings", 16)));
        iconContainer.add(row1);
        const row2 = new qx.ui.container.Composite(new qx.ui.layout.HBox(12).set({ alignX: "center", alignY: "middle" }));
        row2.add(new BsButton("Email", new InlineSvgIcon("mail", 16), {
            variant: "outline",
        }));
        row2.add(new BsButton("User", new InlineSvgIcon("user", 16), {
            variant: "secondary",
        }));
        row2.add(new BsButton("Delete", new InlineSvgIcon("trash", 16), {
            variant: "destructive",
        }));
        iconContainer.add(row2);
        card.setContent(iconContainer);
        const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
        container.add(sectionTitle);
        container.add(card);
        return container;
    }
    createDisabledSection() {
        const sectionTitle = new qx.ui.basic.Label("Disabled State");
        sectionTitle.setFont(
        // @ts-ignore
        new qx.bom.Font(18).set({ bold: true }));
        sectionTitle.setTextColor("var(--foreground)");
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        const disabledContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox(12).set({ alignX: "center", alignY: "middle" }));
        const defaultDisabled = new BsButton("Disabled");
        defaultDisabled.setEnabled(false);
        disabledContainer.add(defaultDisabled);
        const outlineDisabled = new BsButton("Disabled", undefined, {
            variant: "outline",
        });
        outlineDisabled.setEnabled(false);
        disabledContainer.add(outlineDisabled);
        const destructiveDisabled = new BsButton("Disabled", undefined, {
            variant: "destructive",
        });
        destructiveDisabled.setEnabled(false);
        disabledContainer.add(destructiveDisabled);
        card.setContent(disabledContainer);
        const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
        container.add(sectionTitle);
        container.add(card);
        return container;
    }
}
class CardPage extends BasePage {
    constructor() {
        super();
        this.setLayout(new qx.ui.layout.VBox(20));
        this.setPadding(20);
        this.add(this.createBasicCard());
        this.add(this.createCardWithList());
        this.add(this.createCardWithImage());
    }
    createBasicCard() {
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        const emailInput = new BsInput();
        emailInput.setPlaceholder("Email");
        const passwordInput = new BsPassword();
        passwordInput.setPlaceholder("Password");
        const formContent = new qx.ui.container.Composite(new qx.ui.layout.VBox(8));
        formContent.setPadding(0, 24, 16, 24);
        const emailLabel = new qx.ui.basic.Label("Email");
        emailLabel.setTextColor("var(--foreground)");
        formContent.add(emailLabel);
        formContent.add(emailInput);
        const passwordLabel = new qx.ui.basic.Label("Password");
        passwordLabel.setTextColor("var(--foreground)");
        formContent.add(passwordLabel);
        formContent.add(passwordInput);
        const submitButton = new BsButton("Submit");
        submitButton.setMarginTop(12);
        formContent.add(submitButton);
        submitButton.addListener("execute", () => {
            const email = emailInput.getValue();
            const password = passwordInput.getValue();
            if (email && password) {
                alert(`Email: ${email}\nPassword: ${password}`);
            }
        });
        card.setContent(formContent);
        return card;
    }
    createCardWithList() {
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        const contentSection = new qx.ui.container.Composite(new qx.ui.layout.VBox(8));
        contentSection.setPadding(24);
        const contentText = new qx.ui.basic.Label("Client requested dashboard redesign with focus on mobile responsiveness.");
        contentText.setTextColor("var(--foreground)");
        contentSection.add(contentText);
        const listItems = [
            "New analytics widgets for daily/weekly metrics",
            "Simplified navigation menu",
            "Dark mode support",
            "Timeline: 6 weeks",
            "Follow-up meeting scheduled for next Tuesday",
        ];
        const listContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox(4));
        listContainer.setPadding(16, 0, 0, 0);
        listItems.forEach((item) => {
            const label = new qx.ui.basic.Label(`• ${item}`);
            label.setTextColor("var(--foreground)");
            listContainer.add(label);
        });
        contentSection.add(listContainer);
        card.setContent(contentSection);
        return card;
    }
    createCardWithImage() {
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        const imageContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox(0));
        const image = new qx.ui.basic.Image("https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80&w=1080&q=75");
        image.setWidth(this.__isMobile() ? this.__responsiveWidth - 88 : 400);
        image.setMaxHeight(200);
        image.setScale(true);
        imageContainer.add(image);
        card.setContent(imageContainer);
        const actionContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox(8));
        actionContainer.setPadding(24, 24, 16, 24);
        const badge1 = new qx.ui.basic.Label("1");
        badge1.setBackgroundColor("var(--muted)");
        badge1.setTextColor("var(--muted-foreground)");
        badge1.setPadding(4, 8, 4, 8);
        const badge2 = new qx.ui.basic.Label("2");
        badge2.setBackgroundColor("var(--muted)");
        badge2.setTextColor("var(--muted-foreground)");
        badge2.setPadding(4, 8, 4, 8);
        const badge3 = new qx.ui.basic.Label("350m²");
        badge3.setBackgroundColor("var(--muted)");
        badge3.setTextColor("var(--muted-foreground)");
        badge3.setPadding(4, 8, 4, 8);
        const spacer = new qx.ui.core.Spacer();
        spacer.setAllowGrowX(true);
        const price = new qx.ui.basic.Label("$135,000");
        price.setTextColor("var(--foreground)");
        actionContainer.add(badge1);
        actionContainer.add(badge2);
        actionContainer.add(badge3);
        actionContainer.add(spacer);
        actionContainer.add(price);
        const contentWrapper = new qx.ui.container.Composite(new qx.ui.layout.VBox(0));
        contentWrapper.add(imageContainer);
        contentWrapper.add(actionContainer);
        card.setContent(contentWrapper);
        return card;
    }
}
class ComboboxPage extends BasePage {
    constructor() {
        super();
        this.setLayout(new qx.ui.layout.VBox(20));
        this.setPadding(20);
        this.add(this.createDefaultSection());
        this.add(this.createDisabledSection());
    }
    createDefaultSection() {
        const sectionTitle = new qx.ui.basic.Label("Default");
        sectionTitle.setFont(
        // @ts-ignore
        new qx.bom.Font(18).set({ bold: true }));
        sectionTitle.setTextColor("var(--foreground)");
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(12).set({ alignX: "center" }));
        const frameworks = [
            { value: "nextjs", label: "Next.js" },
            { value: "sveltekit", label: "SvelteKit" },
            { value: "nuxtjs", label: "Nuxt.js" },
            { value: "remix", label: "Remix" },
            { value: "astro", label: "Astro" },
        ];
        const combobox = new BsCombobox(frameworks, "Search framework...", undefined, "bottom").set({
            width: 250,
        });
        container.add(combobox);
        const valueLabel = new qx.ui.basic.Label("Value: ");
        valueLabel.setTextColor("var(--muted-foreground)");
        container.add(valueLabel);
        combobox.onChange((value) => {
            var _a, _b;
            const selected = (_b = (_a = frameworks.find((f) => f.value === value)) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : "None";
            valueLabel.setValue(`Value: ${selected} (${value})`);
        });
        card.setContent(container);
        const wrapper = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
        wrapper.add(sectionTitle);
        wrapper.add(card);
        return wrapper;
    }
    createDisabledSection() {
        const sectionTitle = new qx.ui.basic.Label("Disabled State");
        sectionTitle.setFont(
        // @ts-ignore
        new qx.bom.Font(18).set({ bold: true }));
        sectionTitle.setTextColor("var(--foreground)");
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(12).set({ alignX: "center" }));
        const enabledCombobox = new BsCombobox([
            { value: "a", label: "Option A" },
            { value: "b", label: "Option B" },
            { value: "c", label: "Option C" },
        ], "Search...").set({ width: 200 });
        container.add(enabledCombobox);
        const enabledLabel = new qx.ui.basic.Label("Enabled");
        enabledLabel.setTextColor("var(--muted-foreground)");
        container.add(enabledLabel);
        const separator = new qx.ui.core.Widget();
        separator.setHeight(20);
        container.add(separator);
        const disabledCombobox = new BsCombobox([
            { value: "a", label: "Option A" },
            { value: "b", label: "Option B" },
            { value: "c", label: "Option C" },
        ], "Search...").set({ width: 200, enabled: false });
        container.add(disabledCombobox);
        const disabledLabel = new qx.ui.basic.Label("Disabled");
        disabledLabel.setTextColor("var(--muted-foreground)");
        container.add(disabledLabel);
        card.setContent(container);
        const wrapper = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
        wrapper.add(sectionTitle);
        wrapper.add(card);
        return wrapper;
    }
}
class DateFieldPage extends BasePage {
    constructor() {
        super();
        this.setLayout(new qx.ui.layout.VBox(20));
        this.setPadding(20);
        this.add(this.createBasicSection());
        this.add(this.createWithValueSection());
        this.add(this.createDisabledSection());
        this.add(this.createEventsSection());
    }
    createBasicSection() {
        const sectionTitle = new qx.ui.basic.Label("Basic Date Field");
        sectionTitle.setFont(
        // @ts-ignore
        new qx.bom.Font(18).set({ bold: true }));
        sectionTitle.setTextColor("var(--foreground)");
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        const container = new qx.ui.container.Composite(new qx.ui.layout.HBox(16).set({ alignX: "left", alignY: "middle" }));
        container.setPadding(16);
        const dateField = new BsDateField();
        dateField.setWidth(280);
        container.add(dateField);
        card.setContent(container);
        const wrapper = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
        wrapper.add(sectionTitle);
        wrapper.add(card);
        return wrapper;
    }
    createWithValueSection() {
        const sectionTitle = new qx.ui.basic.Label("With Initial Value");
        sectionTitle.setFont(
        // @ts-ignore
        new qx.bom.Font(18).set({ bold: true }));
        sectionTitle.setTextColor("var(--foreground)");
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        const container = new qx.ui.container.Composite(new qx.ui.layout.HBox(16).set({ alignX: "left", alignY: "middle" }));
        container.setPadding(16);
        const dateField = new BsDateField();
        dateField.setWidth(280);
        dateField.setValue(new Date(2026, 6, 15));
        container.add(dateField);
        const valueLabel = new qx.ui.basic.Label("Jul 15, 2026");
        valueLabel.setTextColor("var(--muted-foreground)");
        container.add(valueLabel);
        card.setContent(container);
        const wrapper = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
        wrapper.add(sectionTitle);
        wrapper.add(card);
        return wrapper;
    }
    createDisabledSection() {
        const sectionTitle = new qx.ui.basic.Label("Disabled State");
        sectionTitle.setFont(
        // @ts-ignore
        new qx.bom.Font(18).set({ bold: true }));
        sectionTitle.setTextColor("var(--foreground)");
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        const container = new qx.ui.container.Composite(new qx.ui.layout.HBox(16).set({ alignX: "left", alignY: "middle" }));
        container.setPadding(16);
        const dateField = new BsDateField();
        dateField.setWidth(280);
        dateField.setEnabled(false);
        container.add(dateField);
        card.setContent(container);
        const wrapper = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
        wrapper.add(sectionTitle);
        wrapper.add(card);
        return wrapper;
    }
    createEventsSection() {
        const sectionTitle = new qx.ui.basic.Label("Event Handling");
        sectionTitle.setFont(
        // @ts-ignore
        new qx.bom.Font(18).set({ bold: true }));
        sectionTitle.setTextColor("var(--foreground)");
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(10).set({ alignX: "left" }));
        container.setPadding(16);
        const dateField = new BsDateField();
        dateField.setWidth(280);
        container.add(dateField);
        const logLabel = new qx.ui.basic.Label("Selected date: none");
        logLabel.setTextColor("var(--muted-foreground)");
        dateField.onChange((value) => {
            if (value) {
                logLabel.setValue(`Selected date: ${value.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`);
            }
            else {
                logLabel.setValue("Selected date: none");
            }
        });
        container.add(logLabel);
        card.setContent(container);
        const wrapper = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
        wrapper.add(sectionTitle);
        wrapper.add(card);
        return wrapper;
    }
}
class InputPage extends BasePage {
    constructor() {
        super();
        this.setLayout(new qx.ui.layout.VBox(20));
        this.setPadding(20);
        this.add(this.createBasicInput());
        this.add(this.createInputWithSearchIcon());
        this.add(this.createInputWithSearchButton());
        this.add(this.createInputWithLabel());
    }
    createBasicInput() {
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        const input = new BsInput();
        input.setPlaceholder("Enter your text...");
        input.setWidth(this.__isMobile() ? this.__responsiveWidth - 88 : 472);
        const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(8));
        container.setPadding(24);
        const label = new qx.ui.basic.Label("Basic Input");
        label.setTextColor("var(--foreground)");
        container.add(label);
        container.add(input);
        card.setContent(container);
        return card;
    }
    createInputWithSearchIcon() {
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        const input = new BsInput("", "Search...");
        input.setLeadingHtml('<img src="resource/app/icons/search.svg" alt="" width="16" height="16" style="display:block;opacity:0.7" />');
        input.setWidth(this.__isMobile() ? this.__responsiveWidth - 88 : 472);
        const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(8));
        container.setPadding(24);
        const label = new qx.ui.basic.Label("Input with Search Icon");
        label.setTextColor("var(--foreground)");
        container.add(label);
        container.add(input);
        card.setContent(container);
        return card;
    }
    createInputWithSearchButton() {
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        const inputContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox(0));
        inputContainer.setAllowGrowX(true);
        const input = new BsInput("", "Search pages...");
        input.setLeadingHtml('<img src="resource/app/icons/search.svg" alt="" width="16" height="16" style="display:block;opacity:0.7" />');
        input.setAllowGrowX(true);
        input.setWidth(300);
        const searchButton = new BsButton("Search");
        searchButton.setWidth(80);
        inputContainer.add(input);
        inputContainer.add(searchButton);
        const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(8));
        container.setPadding(24);
        const label = new qx.ui.basic.Label("Input with Search Button");
        label.setTextColor("var(--foreground)");
        container.add(label);
        container.add(inputContainer);
        card.setContent(container);
        return card;
    }
    createInputWithLabel() {
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(8));
        container.setPadding(24);
        const label = new qx.ui.basic.Label("Input with Label");
        label.setTextColor("var(--foreground)");
        const labelText = new qx.ui.basic.Label("Email address");
        labelText.setTextColor("var(--foreground)");
        const input = new BsInput("", "you@example.com");
        input.setWidth(this.__isMobile() ? this.__responsiveWidth - 88 : 472);
        const description = new qx.ui.basic.Label("We'll never share your email with anyone else.");
        description.setTextColor("var(--muted-foreground)");
        container.add(label);
        container.add(labelText);
        container.add(input);
        container.add(description);
        card.setContent(container);
        return card;
    }
}
class LabelPage extends BasePage {
    constructor() {
        super();
        this.setLayout(new qx.ui.layout.VBox(20));
        this.setPadding(20);
        this.add(this.createBasicSection());
        this.add(this.createWithInputSection());
        this.add(this.createDisabledSection());
    }
    createBasicSection() {
        const sectionTitle = new qx.ui.basic.Label("Basic Label");
        sectionTitle.setFont(
        // @ts-ignore
        new qx.bom.Font(18).set({ bold: true }));
        sectionTitle.setTextColor("var(--foreground)");
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        const contentContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox(16).set({ alignX: "center" }));
        const label = new BsLabel("Your email address");
        contentContainer.add(label, { alignY: "bottom" });
        card.setContent(contentContainer);
        const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
        container.add(sectionTitle);
        container.add(card);
        return container;
    }
    createWithInputSection() {
        const sectionTitle = new qx.ui.basic.Label("With Input");
        sectionTitle.setFont(
        // @ts-ignore
        new qx.bom.Font(18).set({ bold: true }));
        sectionTitle.setTextColor("var(--foreground)");
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        const contentContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox(0).set({ alignX: "center" }));
        const formGroup = new qx.ui.container.Composite(new qx.ui.layout.VBox(0));
        const emailLabel = new qx.ui.basic.Label("Email");
        formGroup.add(emailLabel, { alignY: "bottom" });
        const emailInput = new BsInput("", "you@example.com");
        formGroup.add(emailInput);
        contentContainer.add(formGroup);
        card.setContent(contentContainer);
        const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
        container.add(sectionTitle);
        container.add(card);
        return container;
    }
    createDisabledSection() {
        const sectionTitle = new qx.ui.basic.Label("Disabled State");
        sectionTitle.setFont(
        // @ts-ignore
        new qx.bom.Font(18).set({ bold: true }));
        sectionTitle.setTextColor("var(--foreground)");
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        const contentContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox(12).set({ alignX: "center" }));
        const formGroup = new qx.ui.container.Composite(new qx.ui.layout.VBox(8));
        const disabledLabel = new qx.ui.basic.Label("Email");
        formGroup.add(disabledLabel, { alignY: "bottom" });
        const disabledInput = new BsInput("", "you@example.com");
        // @ts-ignore
        disabledInput.setEnabled(false);
        formGroup.add(disabledInput);
        contentContainer.add(formGroup);
        card.setContent(contentContainer);
        const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
        container.add(sectionTitle);
        container.add(card);
        return container;
    }
}
class RadioGroupPage extends BasePage {
    constructor() {
        super();
        this.setLayout(new qx.ui.layout.VBox(20));
        this.setPadding(20);
        this.add(this.createDefaultSection());
        this.add(this.createFormSection());
        this.add(this.createDisabledSection());
    }
    createDefaultSection() {
        const sectionTitle = new qx.ui.basic.Label("Default");
        sectionTitle.setFont(
        // @ts-ignore
        new qx.bom.Font(18).set({ bold: true }));
        sectionTitle.setTextColor("var(--foreground)");
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        const radioContainer = new qx.ui.container.Composite(new qx.ui.layout.Grow());
        const radioGroup = new BsRadioGroup([
            { value: "default", label: "Default" },
            { value: "comfortable", label: "Comfortable", disabled: true },
            { value: "compact", label: "Compact" },
        ]);
        radioContainer.add(radioGroup);
        card.setContent(radioContainer);
        const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
        container.add(sectionTitle);
        container.add(card);
        return container;
    }
    createFormSection() {
        const sectionTitle = new qx.ui.basic.Label("With Form");
        sectionTitle.setFont(
        // @ts-ignore
        new qx.bom.Font(18).set({ bold: true }));
        sectionTitle.setTextColor("var(--foreground)");
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        const formContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox(16).set({ alignX: "center" }));
        const label = new qx.ui.basic.Label("Notify me about...");
        label.setTextColor("var(--foreground)");
        const radioGroup = new BsRadioGroup([
            { value: "1", label: "All new messages" },
            { value: "2", label: "Direct messages and mentions" },
            { value: "3", label: "Nothing" },
        ]);
        radioGroup.setValue("2");
        const submitBtn = new BsButton("Submit");
        formContainer.add(label);
        formContainer.add(radioGroup);
        formContainer.add(submitBtn);
        card.setContent(formContainer);
        const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
        container.add(sectionTitle);
        container.add(card);
        return container;
    }
    createDisabledSection() {
        const sectionTitle = new qx.ui.basic.Label("Disabled State");
        sectionTitle.setFont(
        // @ts-ignore
        new qx.bom.Font(18).set({ bold: true }));
        sectionTitle.setTextColor("var(--foreground)");
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        const disabledContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox(12).set({ alignX: "center", alignY: "middle" }));
        const radioGroup = new BsRadioGroup([
            { value: "1", label: "Option 1" },
            { value: "2", label: "Option 2" },
            { value: "3", label: "Option 3" },
        ]);
        radioGroup.setEnabled(false);
        disabledContainer.add(radioGroup);
        card.setContent(disabledContainer);
        const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
        container.add(sectionTitle);
        container.add(card);
        return container;
    }
}
class SelectPage extends BasePage {
    constructor() {
        super();
        this.setLayout(new qx.ui.layout.VBox(20));
        this.setPadding(20);
        this.add(this.createBasicSelect());
        this.add(this.createSelectWithLabel());
    }
    createBasicSelect() {
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        const select = new BsSelect([
            "Option 1",
            "Option 2",
            "Option 3",
            "Option 4",
        ]);
        select.setWidth(this.__isMobile() ? this.__responsiveWidth - 88 : 472);
        const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(8));
        container.setPadding(24);
        const label = new qx.ui.basic.Label("Basic Select");
        label.setTextColor("var(--foreground)");
        container.add(label);
        container.add(select);
        card.setContent(container);
        return card;
    }
    createSelectWithLabel() {
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(8));
        container.setPadding(24);
        const label = new qx.ui.basic.Label("Select with Label");
        label.setTextColor("var(--foreground)");
        const labelText = new qx.ui.basic.Label("Country");
        labelText.setTextColor("var(--foreground)");
        const select = new BsSelect([
            "United States",
            "Canada",
            "United Kingdom",
            "Germany",
            "France",
            "Japan",
            "Australia",
        ], "w-full");
        select.setWidth(this.__isMobile() ? this.__responsiveWidth - 88 : 472);
        const description = new qx.ui.basic.Label("Select your country from the list.");
        description.setTextColor("var(--muted-foreground)");
        container.add(label);
        container.add(labelText);
        container.add(select);
        container.add(description);
        card.setContent(container);
        return card;
    }
}
class SliderPage extends BasePage {
    constructor() {
        super();
        this.setLayout(new qx.ui.layout.VBox(20));
        this.setPadding(20);
        this.add(this.createDefaultSection());
        this.add(this.createMinMaxSection());
        this.add(this.createStepSection());
        this.add(this.createDisabledSection());
    }
    createDefaultSection() {
        const sectionTitle = new qx.ui.basic.Label("Default");
        sectionTitle.setFont(
        // @ts-ignore
        new qx.bom.Font(18).set({ bold: true }));
        sectionTitle.setTextColor("var(--foreground)");
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(12).set({ alignX: "center", alignY: "middle" }));
        const slider = new BsSlider(0, 100, 50).set({ width: 250 });
        container.add(slider, { paddingTop: 20 });
        const valueLabel = new qx.ui.basic.Label("Value: 50");
        valueLabel.setTextColor("var(--muted-foreground)");
        container.add(valueLabel);
        slider.onChangeValue((value) => {
            valueLabel.setValue(`Value: ${value}`);
        });
        card.setContent(container);
        const wrapper = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
        wrapper.add(sectionTitle);
        wrapper.add(card);
        return wrapper;
    }
    createMinMaxSection() {
        const sectionTitle = new qx.ui.basic.Label("Min and Max");
        sectionTitle.setFont(
        // @ts-ignore
        new qx.bom.Font(18).set({ bold: true }));
        sectionTitle.setTextColor("var(--foreground)");
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(16).set({ alignX: "center" }));
        const row1 = new qx.ui.container.Composite(new qx.ui.layout.VBox(8));
        const label1 = new qx.ui.basic.Label("0 to 100 (default)");
        label1.setTextColor("var(--muted-foreground)");
        row1.add(label1);
        const slider1 = new BsSlider(0, 100, 25).set({ width: 200 });
        row1.add(slider1);
        container.add(row1);
        const row2 = new qx.ui.container.Composite(new qx.ui.layout.VBox(8));
        const label2 = new qx.ui.basic.Label("-50 to 50");
        label2.setTextColor("var(--muted-foreground)");
        row2.add(label2);
        const slider2 = new BsSlider(-50, 50, 0).set({ width: 200 });
        row2.add(slider2);
        container.add(row2);
        const row3 = new qx.ui.container.Composite(new qx.ui.layout.VBox(8));
        const label3 = new qx.ui.basic.Label("0 to 1000");
        label3.setTextColor("var(--muted-foreground)");
        row3.add(label3);
        const slider3 = new BsSlider(0, 1000, 750).set({ width: 200 });
        row3.add(slider3);
        container.add(row3);
        card.setContent(container);
        const wrapper = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
        wrapper.add(sectionTitle);
        wrapper.add(card);
        return wrapper;
    }
    createStepSection() {
        const sectionTitle = new qx.ui.basic.Label("Step");
        sectionTitle.setFont(
        // @ts-ignore
        new qx.bom.Font(18).set({ bold: true }));
        sectionTitle.setTextColor("var(--foreground)");
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(16).set({ alignX: "center" }));
        const row1 = new qx.ui.container.Composite(new qx.ui.layout.VBox(8));
        const label1 = new qx.ui.basic.Label("Step 1 (default)");
        label1.setTextColor("var(--muted-foreground)");
        row1.add(label1);
        const slider1 = new BsSlider(0, 100, 10, 1).set({ width: 200 });
        row1.add(slider1);
        container.add(row1);
        const row2 = new qx.ui.container.Composite(new qx.ui.layout.VBox(8));
        const label2 = new qx.ui.basic.Label("Step 5");
        label2.setTextColor("var(--muted-foreground)");
        row2.add(label2);
        const slider2 = new BsSlider(0, 100, 20, 5).set({ width: 200 });
        row2.add(slider2);
        container.add(row2);
        const row3 = new qx.ui.container.Composite(new qx.ui.layout.VBox(8));
        const label3 = new qx.ui.basic.Label("Step 10");
        label3.setTextColor("var(--muted-foreground)");
        row3.add(label3);
        const slider3 = new BsSlider(0, 100, 30, 10).set({ width: 200 });
        row3.add(slider3);
        container.add(row3);
        const row4 = new qx.ui.container.Composite(new qx.ui.layout.VBox(8));
        const label4 = new qx.ui.basic.Label("Step 25");
        label4.setTextColor("var(--muted-foreground)");
        row4.add(label4);
        const slider4 = new BsSlider(0, 100, 50, 25).set({ width: 200 });
        row4.add(slider4);
        container.add(row4);
        card.setContent(container);
        const wrapper = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
        wrapper.add(sectionTitle);
        wrapper.add(card);
        return wrapper;
    }
    createDisabledSection() {
        const sectionTitle = new qx.ui.basic.Label("Disabled State");
        sectionTitle.setFont(
        // @ts-ignore
        new qx.bom.Font(18).set({ bold: true }));
        sectionTitle.setTextColor("var(--foreground)");
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(12).set({ alignX: "center" }));
        const enabledSlider = new BsSlider(0, 100, 50).set({ width: 200 });
        container.add(enabledSlider);
        const enabledLabel = new qx.ui.basic.Label("Enabled");
        enabledLabel.setTextColor("var(--muted-foreground)");
        container.add(enabledLabel);
        const separator = new qx.ui.core.Widget();
        separator.setHeight(20);
        container.add(separator);
        const disabledSlider = new BsSlider(0, 100, 50).set({ width: 200 });
        disabledSlider.setEnabled(false);
        container.add(disabledSlider);
        const disabledLabel = new qx.ui.basic.Label("Disabled");
        disabledLabel.setTextColor("var(--muted-foreground)");
        container.add(disabledLabel);
        card.setContent(container);
        const wrapper = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
        wrapper.add(sectionTitle);
        wrapper.add(card);
        return wrapper;
    }
}
class SwitchPage extends BasePage {
    constructor() {
        super();
        this.setLayout(new qx.ui.layout.VBox(20));
        this.setPadding(20);
        this.add(this.createBasicSwitch());
        this.add(this.createSwitchWithLabel());
        this.add(this.createSwitchWithDescription());
        this.add(this.createSwitchSizeVariants());
        this.add(this.createDisabledSwitch());
    }
    __maxWidth() {
        return this.__isMobile() ? this.__responsiveWidth - 40 : 520;
    }
    createBasicSwitch() {
        const card = new BsCard();
        card.setMaxWidth(this.__maxWidth());
        const sw = new BsSwitch();
        const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(8));
        container.setPadding(24);
        const label = new qx.ui.basic.Label("Basic Switch");
        label.setTextColor("var(--foreground)");
        container.add(label);
        container.add(sw);
        card.setContent(container);
        return card;
    }
    createSwitchWithLabel() {
        const card = new BsCard();
        card.setMaxWidth(this.__maxWidth());
        const sw = new BsSwitch(true);
        sw.onToggle((checked) => {
            BsToast.show({ title: `Switch toggled: ${checked ? "ON" : "OFF"}` });
        });
        const row = new qx.ui.container.Composite(new qx.ui.layout.HBox(12));
        row.setAlignY("middle");
        row.setAllowGrowX(true);
        const label = new qx.ui.basic.Label("Notifications");
        label.setTextColor("var(--foreground)");
        row.add(label, { flex: 1 });
        row.add(sw);
        const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(8));
        container.setPadding(24);
        const title = new qx.ui.basic.Label("Switch with Label");
        title.setTextColor("var(--foreground)");
        container.add(title);
        container.add(row);
        card.setContent(container);
        return card;
    }
    createSwitchWithDescription() {
        const card = new BsCard();
        card.setMaxWidth(this.__maxWidth());
        const sw = new BsSwitch();
        const row = new qx.ui.container.Composite(new qx.ui.layout.HBox(12));
        row.setAlignY("center");
        row.setAllowGrowX(true);
        const textColumn = new qx.ui.container.Composite(new qx.ui.layout.VBox(2));
        textColumn.setAllowGrowX(true);
        const label = new qx.ui.basic.Label("Share across devices");
        label.setTextColor("var(--foreground)");
        const desc = new qx.ui.basic.Label("Focus is shared across devices, and turns off when you leave the app.");
        desc.setTextColor("var(--muted-foreground)");
        textColumn.add(label);
        textColumn.add(desc);
        row.add(textColumn, { flex: 1 });
        row.add(sw);
        const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(8));
        container.setPadding(24);
        const title = new qx.ui.basic.Label("Switch with Description");
        title.setTextColor("var(--foreground)");
        container.add(title);
        container.add(row);
        card.setContent(container);
        return card;
    }
    createSwitchSizeVariants() {
        const card = new BsCard();
        card.setMaxWidth(this.__maxWidth());
        const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(8));
        container.setPadding(24);
        const title = new qx.ui.basic.Label("Switch Sizes");
        title.setTextColor("var(--foreground)");
        container.add(title);
        const smallRow = new qx.ui.container.Composite(new qx.ui.layout.HBox(12));
        smallRow.setAlignY("middle");
        const smallLabel = new qx.ui.basic.Label("Small");
        smallLabel.setTextColor("var(--foreground)");
        smallRow.add(smallLabel, { flex: 1 });
        smallRow.add(new BsSwitch(false, false, "sm"));
        container.add(smallRow);
        const defaultRow = new qx.ui.container.Composite(new qx.ui.layout.HBox(12));
        defaultRow.setAlignY("middle");
        const defaultLabel = new qx.ui.basic.Label("Default");
        defaultLabel.setTextColor("var(--foreground)");
        defaultRow.add(defaultLabel, { flex: 1 });
        defaultRow.add(new BsSwitch(true, false, "default"));
        container.add(defaultRow);
        card.setContent(container);
        return card;
    }
    createDisabledSwitch() {
        const card = new BsCard();
        card.setMaxWidth(this.__maxWidth());
        const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(8));
        container.setPadding(24);
        const title = new qx.ui.basic.Label("Disabled Switch");
        title.setTextColor("var(--foreground)");
        container.add(title);
        const uncheckedRow = new qx.ui.container.Composite(new qx.ui.layout.HBox(12));
        uncheckedRow.setAlignY("middle");
        const uncheckedLabel = new qx.ui.basic.Label("Disabled (unchecked)");
        uncheckedLabel.setTextColor("var(--foreground)");
        uncheckedRow.add(uncheckedLabel, { flex: 1 });
        uncheckedRow.add(new BsSwitch(false, true));
        container.add(uncheckedRow);
        const checkedRow = new qx.ui.container.Composite(new qx.ui.layout.HBox(12));
        checkedRow.setAlignY("middle");
        const checkedLabel = new qx.ui.basic.Label("Disabled (checked)");
        checkedLabel.setTextColor("var(--foreground)");
        checkedRow.add(checkedLabel, { flex: 1 });
        checkedRow.add(new BsSwitch(true, true));
        container.add(checkedRow);
        card.setContent(container);
        return card;
    }
}
class TextareaPage extends BasePage {
    constructor() {
        super();
        this.setLayout(new qx.ui.layout.VBox(20));
        this.setPadding(20);
        this.add(this.createBasicTextarea());
        this.add(this.createTextareaWithLabel());
    }
    createBasicTextarea() {
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        card.setAllowGrowY(true);
        const textarea = new BsTextarea("", "Enter your text here...");
        textarea.setWidth(this.__isMobile() ? this.__responsiveWidth - 88 : 472);
        const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(8));
        container.setPadding(24);
        const label = new qx.ui.basic.Label("Basic Textarea");
        label.setTextColor("var(--foreground)");
        container.add(label);
        container.add(textarea);
        card.setContent(container);
        return card;
    }
    createTextareaWithLabel() {
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(8));
        container.setPadding(24);
        const label = new qx.ui.basic.Label("Textarea with Label");
        label.setTextColor("var(--foreground)");
        const labelText = new qx.ui.basic.Label("Description");
        labelText.setTextColor("var(--foreground)");
        const textarea = new BsTextarea("", "Enter your description here...", "w-full", 4);
        textarea.setWidth(this.__isMobile() ? this.__responsiveWidth - 88 : 472);
        const description = new qx.ui.basic.Label("Provide a detailed description of your request.");
        description.setTextColor("var(--muted-foreground)");
        container.add(label);
        container.add(labelText);
        container.add(textarea);
        container.add(description);
        card.setContent(container);
        return card;
    }
}
class ToastPage extends BasePage {
    constructor() {
        super();
        this.setLayout(new qx.ui.layout.VBox(20));
        this.setPadding(20);
        this.add(this.createBasicSection());
        this.add(this.createCategoriesSection());
        this.add(this.createWithDescriptionSection());
        this.add(this.createWithActionSection());
        this.add(this.createWithCancelSection());
    }
    createBasicSection() {
        const sectionTitle = new qx.ui.basic.Label("Basic Toast");
        sectionTitle.setFont(
        // @ts-ignore
        new qx.bom.Font(18).set({ bold: true }));
        sectionTitle.setTextColor("var(--foreground)");
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        const contentContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox(12).set({ alignX: "center" }));
        const descriptionLabel = new qx.ui.basic.Label("A simple toast with title only.");
        contentContainer.add(descriptionLabel);
        const buttonRow = new qx.ui.container.Composite(new qx.ui.layout.HBox(12).set({ alignX: "center", alignY: "middle" }));
        const showToastBtn = new BsButton("Show Toast");
        showToastBtn.addListener("execute", () => {
            BsToast.show({
                title: "Toast Title",
            });
        });
        buttonRow.add(showToastBtn);
        contentContainer.add(buttonRow);
        card.setContent(contentContainer);
        const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
        container.add(sectionTitle);
        container.add(card);
        return container;
    }
    createCategoriesSection() {
        const sectionTitle = new qx.ui.basic.Label("Toast Categories");
        sectionTitle.setFont(
        // @ts-ignore
        new qx.bom.Font(18).set({ bold: true }));
        sectionTitle.setTextColor("var(--foreground)");
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        const contentContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox(16).set({ alignX: "center" }));
        const descLabel = new qx.ui.basic.Label("Different toast categories: success, info, warning, error.");
        contentContainer.add(descLabel);
        const buttonRow1 = new qx.ui.container.Composite(new qx.ui.layout.HBox(12).set({ alignX: "center", alignY: "middle" }));
        const successBtn = new BsButton("Success", undefined, {
            variant: "secondary",
        });
        successBtn.addListener("execute", () => {
            BsToast.success("Success!", "Your operation completed successfully.");
        });
        buttonRow1.add(successBtn);
        const infoBtn = new BsButton("Info", undefined, { variant: "secondary" });
        infoBtn.addListener("execute", () => {
            BsToast.info("Information", "Here is some useful information.");
        });
        buttonRow1.add(infoBtn);
        contentContainer.add(buttonRow1);
        const buttonRow2 = new qx.ui.container.Composite(new qx.ui.layout.HBox(12).set({ alignX: "center", alignY: "middle" }));
        const warningBtn = new BsButton("Warning", undefined, {
            variant: "secondary",
        });
        warningBtn.addListener("execute", () => {
            BsToast.warning("Warning", "Please review your input before proceeding.");
        });
        buttonRow2.add(warningBtn);
        const errorBtn = new BsButton("Error", undefined, {
            variant: "destructive",
        });
        errorBtn.addListener("execute", () => {
            BsToast.error("Error", "An error occurred while processing your request.");
        });
        buttonRow2.add(errorBtn);
        contentContainer.add(buttonRow2);
        card.setContent(contentContainer);
        const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
        container.add(sectionTitle);
        container.add(card);
        return container;
    }
    createWithDescriptionSection() {
        const sectionTitle = new qx.ui.basic.Label("With Description");
        sectionTitle.setFont(
        // @ts-ignore
        new qx.bom.Font(18).set({ bold: true }));
        sectionTitle.setTextColor("var(--foreground)");
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        const contentContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox(12).set({ alignX: "center" }));
        const descriptionLabel = new qx.ui.basic.Label("Toast with title and description text.");
        contentContainer.add(descriptionLabel);
        const buttonRow = new qx.ui.container.Composite(new qx.ui.layout.HBox(12).set({ alignX: "center", alignY: "middle" }));
        const withDescBtn = new BsButton("Show with Description");
        withDescBtn.setWidth(180);
        withDescBtn.addListener("execute", () => {
            BsToast.show({
                title: "Event Created",
                description: "Sunday, December 03, 2023 at 9:00 AM",
                category: "success",
            });
        });
        buttonRow.add(withDescBtn);
        contentContainer.add(buttonRow);
        card.setContent(contentContainer);
        const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
        container.add(sectionTitle);
        container.add(card);
        return container;
    }
    createWithActionSection() {
        const sectionTitle = new qx.ui.basic.Label("With Action Button");
        sectionTitle.setFont(
        // @ts-ignore
        new qx.bom.Font(18).set({ bold: true }));
        sectionTitle.setTextColor("var(--foreground)");
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        const contentContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox(12).set({ alignX: "center" }));
        const descriptionLabel = new qx.ui.basic.Label("Toast with an action button.");
        contentContainer.add(descriptionLabel);
        const buttonRow = new qx.ui.container.Composite(new qx.ui.layout.HBox(12).set({ alignX: "center", alignY: "middle" }));
        const actionBtn = new BsButton("With Action");
        actionBtn.addListener("execute", () => {
            BsToast.show({
                title: "File Saved",
                description: "Your changes have been saved successfully.",
                category: "success",
                action: {
                    label: "Undo",
                    onclick: (close) => {
                        console.log("Undo clicked");
                        close();
                    },
                },
            });
        });
        buttonRow.add(actionBtn);
        contentContainer.add(buttonRow);
        card.setContent(contentContainer);
        const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
        container.add(sectionTitle);
        container.add(card);
        return container;
    }
    createWithCancelSection() {
        const sectionTitle = new qx.ui.basic.Label("With Cancel Button");
        sectionTitle.setFont(
        // @ts-ignore
        new qx.bom.Font(18).set({ bold: true }));
        sectionTitle.setTextColor("var(--foreground)");
        const card = new BsCard();
        card.setMaxWidth(this.__isMobile() ? this.__responsiveWidth - 40 : 520);
        const contentContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox(12).set({ alignX: "center" }));
        const descriptionLabel = new qx.ui.basic.Label("Toast with a cancel/dismiss button.");
        contentContainer.add(descriptionLabel);
        const buttonRow = new qx.ui.container.Composite(new qx.ui.layout.HBox(12).set({ alignX: "center", alignY: "middle" }));
        const cancelBtn = new BsButton("With Cancel");
        cancelBtn.addListener("execute", () => {
            BsToast.show({
                title: "Item Deleted",
                description: "The item has been removed from your list.",
                category: "warning",
                cancel: {
                    label: "Undo",
                    onclick: () => {
                        console.log("Undo action triggered");
                    },
                },
            });
        });
        buttonRow.add(cancelBtn);
        contentContainer.add(buttonRow);
        card.setContent(contentContainer);
        const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
        container.add(sectionTitle);
        container.add(card);
        return container;
    }
}
const GRAPHQL_URL = "http://localhost:5071/graphql";
function graphqlRequest(query, variables) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(GRAPHQL_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query, variables }),
        });
        const json = yield response.json();
        if (json.errors) {
            throw new Error(json.errors[0].message);
        }
        return json.data;
    });
}
const ACCESS_LEVEL_FIELDS = "id code name createdAt updatedAt";
const COURSE_FIELDS = "id code name createdAt updatedAt";
const USER_FIELDS = "id code name email dateOfBirth createdAt updatedAt";
const PROFILE_FIELDS = "id code name firstName middleName lastName extentionName email phone sex dateOfBirth birthPlace municipality barangay street citizenship addressEmail addressPhone createdAt updatedAt";
const FAMILY_ENTRY_FIELDS = "lastName firstName middleName phone occupation anualIncome";
const FAMILY_BG_FIELDS = `id code name father { ${FAMILY_ENTRY_FIELDS} } mother { ${FAMILY_ENTRY_FIELDS} } guardian { ${FAMILY_ENTRY_FIELDS} } createdAt updatedAt`;
const ADMISSION_DATA_FIELDS = "id code name lrn level type yearLevel status score result createdAt updatedAt";
const APPLICATION_FIELDS = "id createdAt updatedAt";
const QUERIES = {
    accessLevels: `query { accessLevels { ${ACCESS_LEVEL_FIELDS} } }`,
    courses: `query { courses { ${COURSE_FIELDS} } }`,
    users: `query { users { ${USER_FIELDS} } }`,
    personalProfiles: `query { personalProfiles { ${PROFILE_FIELDS} } }`,
    familyBackgrounds: `query { familyBackgrounds { ${FAMILY_BG_FIELDS} } }`,
    admissionDataList: `query { admissionDataList { ${ADMISSION_DATA_FIELDS} } }`,
    admissionApplications: `query { admissionApplications { ${APPLICATION_FIELDS} } }`,
};
const MUTATIONS = {
    createAccessLevel: `mutation($input: CreateAccessLevelInput!) { createAccessLevel(input: $input) { ${ACCESS_LEVEL_FIELDS} } }`,
    createCourse: `mutation($input: CreateCourseInput!) { createCourse(input: $input) { ${COURSE_FIELDS} } }`,
    createUser: `mutation($input: CreateUserInput!) { createUser(input: $input) { ${USER_FIELDS} } }`,
    createPersonalProfile: `mutation($input: CreatePersonalProfileInput!) { createPersonalProfile(input: $input) { ${PROFILE_FIELDS} } }`,
    createFamilyBackground: `mutation($input: CreateFamilyBackgroundInput!) { createFamilyBackground(input: $input) { ${FAMILY_BG_FIELDS} } }`,
    createAdmissionData: `mutation($input: CreateAdmissionDataInput!) { createAdmissionData(input: $input) { ${ADMISSION_DATA_FIELDS} } }`,
    createAdmissionApplication: `mutation($input: CreateAdmissionApplicationInput!) { createAdmissionApplication(input: $input) { ${APPLICATION_FIELDS} } }`,
    attachPersonalProfile: `mutation($input: AttachToApplicationInput!) { attachPersonalProfile(input: $input) { ${APPLICATION_FIELDS} } }`,
    attachFamilyBackground: `mutation($input: AttachToApplicationInput!) { attachFamilyBackground(input: $input) { ${APPLICATION_FIELDS} } }`,
    attachAdmissionData: `mutation($input: AttachToApplicationInput!) { attachAdmissionData(input: $input) { ${APPLICATION_FIELDS} } }`,
    updateAdmissionStatus: `mutation($input: UpdateAdmissionStatusInput!) { updateAdmissionStatus(input: $input) { ${ADMISSION_DATA_FIELDS} } }`,
    updateAccessLevel: `mutation($input: UpdateAccessLevelInput!) { updateAccessLevel(input: $input) { ${ACCESS_LEVEL_FIELDS} } }`,
    updateCourse: `mutation($input: UpdateCourseInput!) { updateCourse(input: $input) { ${COURSE_FIELDS} } }`,
    updateUser: `mutation($input: UpdateUserInput!) { updateUser(input: $input) { ${USER_FIELDS} } }`,
    updatePersonalProfile: `mutation($input: UpdatePersonalProfileInput!) { updatePersonalProfile(input: $input) { ${PROFILE_FIELDS} } }`,
    updateFamilyBackground: `mutation($input: UpdateFamilyBackgroundInput!) { updateFamilyBackground(input: $input) { ${FAMILY_BG_FIELDS} } }`,
    updateAdmissionData: `mutation($input: UpdateAdmissionDataInput!) { updateAdmissionData(input: $input) { ${ADMISSION_DATA_FIELDS} } }`,
    updateAdmissionApplication: `mutation($input: UpdateAdmissionApplicationInput!) { updateAdmissionApplication(input: $input) { ${APPLICATION_FIELDS} } }`,
};
const LOGIN_QUERY = `query { users { id code name password email dateOfBirth createdAt updatedAt accessLevel { id code name } } }`;
function loginUser(code, password) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const data = yield graphqlRequest(LOGIN_QUERY);
        const users = data.users || [];
        const match = users.find((u) => u.code.toLowerCase() === code.toLowerCase() && u.password === password);
        if (!match)
            return null;
        return {
            name: match.name,
            role: (_b = (_a = match.accessLevel) === null || _a === void 0 ? void 0 : _a.code) !== null && _b !== void 0 ? _b : "",
            accessCode: (_d = (_c = match.accessLevel) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : "",
            raw: match,
        };
    });
}
function queryList(entityType) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const queryMap = {
            AccessLevel: "accessLevels",
            Course: "courses",
            User: "users",
            PersonalProfile: "personalProfiles",
            FamilyBackground: "familyBackgrounds",
            AdmissionData: "admissionDataList",
            AdmissionApplication: "admissionApplications",
        };
        const key = queryMap[entityType];
        if (!key)
            throw new Error(`Unknown entity: ${entityType}`);
        const data = yield graphqlRequest(QUERIES[key]);
        return (_a = data[key]) !== null && _a !== void 0 ? _a : [];
    });
}
function createEntity(entityType, input) {
    return __awaiter(this, void 0, void 0, function* () {
        const mutationMap = {
            AccessLevel: { key: "createAccessLevel", mutation: MUTATIONS.createAccessLevel },
            Course: { key: "createCourse", mutation: MUTATIONS.createCourse },
            User: { key: "createUser", mutation: MUTATIONS.createUser },
            PersonalProfile: { key: "createPersonalProfile", mutation: MUTATIONS.createPersonalProfile },
            FamilyBackground: { key: "createFamilyBackground", mutation: MUTATIONS.createFamilyBackground },
            AdmissionData: { key: "createAdmissionData", mutation: MUTATIONS.createAdmissionData },
            AdmissionApplication: { key: "createAdmissionApplication", mutation: MUTATIONS.createAdmissionApplication },
        };
        const entry = mutationMap[entityType];
        if (!entry)
            throw new Error(`Unknown entity: ${entityType}`);
        const data = yield graphqlRequest(entry.mutation, { input });
        return data[entry.key];
    });
}
function updateEntity(entityType, id, input) {
    return __awaiter(this, void 0, void 0, function* () {
        const mutationMap = {
            AccessLevel: { key: "updateAccessLevel", mutation: MUTATIONS.updateAccessLevel },
            Course: { key: "updateCourse", mutation: MUTATIONS.updateCourse },
            User: { key: "updateUser", mutation: MUTATIONS.updateUser },
            PersonalProfile: { key: "updatePersonalProfile", mutation: MUTATIONS.updatePersonalProfile },
            FamilyBackground: { key: "updateFamilyBackground", mutation: MUTATIONS.updateFamilyBackground },
            AdmissionData: { key: "updateAdmissionData", mutation: MUTATIONS.updateAdmissionData },
            AdmissionApplication: { key: "updateAdmissionApplication", mutation: MUTATIONS.updateAdmissionApplication },
        };
        const entry = mutationMap[entityType];
        if (!entry)
            throw new Error(`Unknown entity: ${entityType}`);
        const cleaned = {};
        for (const key in input) {
            const v = input[key];
            if (v !== "" && v !== null && v !== undefined) {
                cleaned[key] = v;
            }
        }
        const data = yield graphqlRequest(entry.mutation, { input: Object.assign(Object.assign({}, cleaned), { id }) });
        return data[entry.key];
    });
}
