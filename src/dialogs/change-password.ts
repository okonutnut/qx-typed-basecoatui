function showChangePasswordDialog(): void {
  const content = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
  content.setBackgroundColor(AppColors.background());

  const label = new qx.ui.basic.Label(
    "This is where you would change your password.",
  ).set({
    font: new qx.bom.Font("14", ["Inter", "sans-serif"]),
    textAlign: "center",
    padding: 20,
  });

  content.add(label);

  BsAlertDialog.show({
    title: "Change Password",
    children: content,
    cancelLabel: "Close",
    footerButtons: "cancel",
  });
}
