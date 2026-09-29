function qooxdooMain(app: qx.application.Standalone) {
  const root = <qx.ui.container.Composite>app.getRoot();

  // http req
  const appManager = new AppManager(root, {
    appName: "SIAS Online",
    appVersion: "3.8.0",  
    user: { name: "John Doe", role: "TECHSUP" },
    login: {
      title: "Aldersgate College Inc.",
      subtitle: "Solano, Nueva Vizcaya",
    },
    callbacks: {
      onLogout: () => showLogoutDialog(() => {
        // TODO: perform actual logout (clear session, revoke tokens, etc.)
        appManager.setLayout("fullscreen");
      }),
      onAbout: () => showAboutDialog(),
      onChangeLog: () => showChangelogDialog(),
      onSupport: () => showSupportDialog(),
    },
  }, AppPages.ROUTE_DEFINITIONS);

  appManager.start();
}

qx.registry.registerMainMethod(qooxdooMain);
