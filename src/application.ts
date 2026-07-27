function qooxdooMain(app: qx.application.Standalone) {
  const root = <qx.ui.container.Composite>app.getRoot();

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
