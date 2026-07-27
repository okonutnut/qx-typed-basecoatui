function __entityLabel(entityType: string): string {
  const map: Record<string, string> = {
    AccessLevel: "Access Levels",
    Course: "Courses",
    User: "Users",
    PersonalProfile: "Personal Profiles",
    FamilyBackground: "Family Backgrounds",
    AdmissionData: "Admission Data",
    AdmissionApplication: "Admission Applications",
  };
  return map[entityType] ?? entityType;
}

class CrudPage extends BasePage {
  private __entityType: string;
  private __entityLabel: string;
  private __formControl!: FormControl;
  private __tableHandle!: TableHandle;
  private __formView: qx.ui.container.Composite;
  private __tableView: qx.ui.container.Composite;
  private __showingForm = true;
  private __submitBtn!: BsButton;
  private __toggleFormBtn!: BsButton;
  private __toggleTableBtn!: BsButton;
  private __cancelEditBtn!: BsButton;
  private __errorLabel!: qx.ui.basic.Label;
  private __loading = false;
  private __selectedId: string | null = null;
  private __selectedRecord: any = null;

  constructor(entityType: string) {
    super();
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

  private __createHeader(): qx.ui.container.Composite {
    const bar = new qx.ui.container.Composite(new qx.ui.layout.HBox(10));
    bar.setPadding(12);
    bar.setDecorator(new qx.ui.decoration.Decorator().set({
      widthBottom: 1, styleBottom: "solid", colorBottom: AppColors.border(),
    }));

    const title = new qx.ui.basic.Label(this.__entityLabel);
    title.setFont(
      // @ts-ignore
      new qx.bom.Font(18).set({ bold: true }),
    );
    title.setTextColor(AppColors.foreground());

    const status = new qx.ui.basic.Label("Form View");
    status.setTextColor(AppColors.mutedForeground());
    status.setFont(
      // @ts-ignore
      new qx.bom.Font(12),
    );
    this.__errorLabel = status;

    bar.add(title);
    bar.add(new qx.ui.core.Spacer(), { flex: 1 });
    bar.add(status);
    return bar;
  }

  private __createFormView(): qx.ui.container.Composite {
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

  private __createTableView(): qx.ui.container.Composite {
    const wrapper = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
    wrapper.setPadding(12);

    this.__tableHandle = __buildTableForEntity(this.__entityType);
    wrapper.add(this.__tableHandle.table, { flex: 1 });

    this.__toggleTableBtn = new BsButton("Show Form", undefined, { variant: "outline" });
    this.__toggleTableBtn.setAllowGrowX(false);
    wrapper.add(this.__toggleTableBtn);

    this.__tableHandle.onRowSelect((rowData: any) => {
      this.__editRecord(rowData);
    });

    this.__toggleTableBtn.onClick(() => this.__toggleView());

    return wrapper;
  }

  private __toggleView(): void {
    this.__showingForm = !this.__showingForm;
    if (this.__showingForm) {
      this.__formView.show();
      this.__tableView.exclude();
    } else {
      this.__formView.exclude();
      this.__tableView.show();
      this.__loadTableData();
    }
  }

  private async __handleSubmit(): Promise<void> {
    if (this.__loading) return;
    this.__loading = true;
    this.__submitBtn.setEnabled(false);
    this.__errorLabel.setVisibility("excluded");

    try {
      const values = this.__formControl.getValues();
      if (this.__selectedId) {
        const result = await updateEntity(this.__entityType, this.__selectedId, values);
        BsToast.show({
          title: "Success",
          description: `${this.__entityLabel} updated successfully`,
          category: "success",
        });
        this.__cancelEdit();
      } else {
        const result = await createEntity(this.__entityType, values);
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
    } catch (err: any) {
      this.__errorLabel.setValue(err.message ?? "An error occurred");
      this.__errorLabel.setVisibility("visible");
      BsToast.show({
        title: "Error",
        description: err.message ?? `Failed to ${this.__selectedId ? "update" : "create"} record`,
        category: "error",
      });
    } finally {
      this.__loading = false;
      this.__submitBtn.setEnabled(true);
    }
  }

  private __editRecord(rowData: any): void {
    this.__selectedId = rowData.id;
    this.__selectedRecord = rowData;
    this.__formControl.setValues(rowData);
    this.__submitBtn.setText("Update");
    this.__cancelEditBtn.setVisibility("visible");
    if (!this.__showingForm) {
      this.__toggleView();
    }
  }

  private __cancelEdit(): void {
    this.__selectedId = null;
    this.__selectedRecord = null;
    this.__formControl.reset();
    this.__submitBtn.setText("Create");
    this.__cancelEditBtn.setVisibility("excluded");
  }

  private async __loadTableData(): Promise<void> {
    try {
      const data = await queryList(this.__entityType);
      this.__tableHandle.loadData(data);
    } catch (err: any) {
      BsToast.show({
        title: "Error Loading Data",
        description: err.message ?? "Failed to load table data",
        category: "error",
      });
    }
  }

  private async __loadReferenceData(): Promise<void> {
    try {
      if (this.__entityType === "User") {
        const levels = await queryList("AccessLevel");
        this.__formControl.setReferenceData("accessLevels",
          levels.map((l: any) => ({ value: l.id, label: `${l.code} - ${l.name}` })),
        );
      }
      if (this.__entityType === "AdmissionData") {
        const courses = await queryList("Course");
        this.__formControl.setReferenceData("courses",
          courses.map((c: any) => ({ value: c.id, label: `${c.code} - ${c.name}` })),
        );
      }
    } catch (err: any) {
      console.warn("Failed to load reference data:", err.message);
    }
  }
}
