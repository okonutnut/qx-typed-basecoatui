function showLogoutDialog(onConfirmed: () => void): void {
  const content = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
  content.setBackgroundColor(AppColors.background());

  const label = new qx.ui.basic.Label(
    "Are you sure you want to log out?",
  ).set({
    font: new qx.bom.Font("14", ["Inter", "sans-serif"]),
    textAlign: "center",
    padding: 20,
  });

  content.add(label);

  BsAlertDialog.show({
    title: "Log Out",
    children: content,
    cancelLabel: "Cancel",
    continueLabel: "Log Out",
    footerButtons: "ok-cancel",
    onContinue: () => {
      onConfirmed();
    },
  });
}
