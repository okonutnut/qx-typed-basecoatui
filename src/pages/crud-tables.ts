type TableHandle = {
  table: qx.ui.table.Table;
  loadData: (data: any[]) => void;
  onRowSelect: (handler: (rowData: any) => void) => void;
};

function __buildTable(columns: string[], columnLabels: string[]): TableHandle {
  // @ts-ignore
  const model = new qx.ui.table.model.Simple();
  model.setColumns(columnLabels);

  const custom: any = {};
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

  const __pad = (n: number): string => n < 10 ? "0" + n : "" + n;

  const __fmtDate = (iso: string): string => {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return __pad(d.getMonth() + 1) + "/" + __pad(d.getDate()) + "/" + d.getFullYear() + " " + __pad(d.getHours()) + ":" + __pad(d.getMinutes());
  };

  let rawData: any[] = [];

  const loadData = (data: any[]) => {
    rawData = data;
    const rows = data.map((item) => columns.map((col) => {
      const val = item[col];
      if (val === null || val === undefined) return "";
      if (typeof val === "object" && val instanceof Date) return val.toLocaleDateString();
      if (typeof val === "object") return JSON.stringify(val);
      const s = String(val);
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(s)) return __fmtDate(s);
      return s;
    }));
    // @ts-ignore
    model.setData(rows);
  };

  const selectHandlers: ((rowData: any) => void)[] = [];

  const emitSelectedRow = () => {
    // @ts-ignore
    const ranges = table.getSelectionModel().getSelectedRanges();
    if (ranges.length > 0) {
      const rowIndex = (ranges[0] as any).minIndex ?? 0;
      if (rowIndex >= 0 && rowIndex < rawData.length) {
        const row = rawData[rowIndex];
        selectHandlers.forEach((h) => h(row));
      }
    }
  };

  // @ts-ignore
  table.addListener("tap", emitSelectedRow);

  const onRowSelect = (handler: (rowData: any) => void): void => {
    selectHandlers.push(handler);
  };

  return { table, loadData, onRowSelect };
}

function __buildTableForEntity(entityType: string): TableHandle {
  switch (entityType) {
    case "AccessLevel":
      return __buildTable(
        ["id", "code", "name", "createdAt", "updatedAt"],
        ["ID", "Code", "Access Codes", "Created At", "Updated At"],
      );
    case "Course":
      return __buildTable(
        ["id", "code", "name", "createdAt", "updatedAt"],
        ["ID", "Code", "Name", "Created At", "Updated At"],
      );
    case "User":
      return __buildTable(
        ["id", "code", "name", "email", "dateOfBirth", "createdAt", "updatedAt"],
        ["ID", "Code", "Name", "Email", "Date of Birth", "Created At", "Updated At"],
      );
    case "PersonalProfile":
      return __buildTable(
        ["id", "code", "name", "firstName", "lastName", "email", "phone", "sex", "createdAt"],
        ["ID", "Code", "Name", "First Name", "Last Name", "Email", "Phone", "Sex", "Created At"],
      );
    case "FamilyBackground":
      return __buildTable(
        ["id", "code", "name", "createdAt", "updatedAt"],
        ["ID", "Code", "Name", "Created At", "Updated At"],
      );
    case "AdmissionData":
      return __buildTable(
        ["code", "name", "lrn", "level", "type", "yearLevel", "status", "result", "createdAt"],
        ["Code", "Name", "LRN", "Level", "Type", "Year Level", "Status", "Result", "Created At"],
      );
    case "AdmissionApplication":
      return __buildTable(
        ["id", "createdAt", "updatedAt"],
        ["ID", "Created At", "Updated At"],
      );
    default:
      return __buildTable(["id"], ["ID"]);
  }
}
