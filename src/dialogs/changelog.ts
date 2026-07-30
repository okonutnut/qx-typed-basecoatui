function showChangelogDialog(): void {
  const content = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
  content.setBackgroundColor(AppColors.background());

  const label = new qx.ui.basic.Label(
    "This is where you would view the change log.",
  ).set({
    font: new qx.bom.Font("14", ["Inter", "sans-serif"]),
    textAlign: "center",
    wrap: true,
    padding: 20,
  });

  content.add(label);

  BsAlertDialog.show({
    title: "Change Log",
    children: content,
    cancelLabel: "Close",
    footerButtons: "cancel",
  });
}
