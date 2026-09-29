class CampusPage extends BasePage {
  constructor() {
    super();
    this.setLayout(
      new qx.ui.layout.VBox().set({ alignX: "center", alignY: "middle" }),
    );
    const label = new qx.ui.basic.Label("CAMPUSESSSSS");
    label.setFont(
      // @ts-ignore
      new qx.bom.Font(24).set({ bold: true }),
    );
    label.setTextColor(AppColors.foreground());
    this.add(label);
  }
}
