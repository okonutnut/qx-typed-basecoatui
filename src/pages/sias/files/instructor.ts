class InstructorPage extends BasePage {
    private __contentContainer: qx.ui.container.Composite;
    private __scrollContent: qx.ui.container.Scroll;
    private __scrollTable: qx.ui.container.Scroll;
    private __isFormMode = true;

    constructor() {
        super();
        this.setLayout(new qx.ui.layout.VBox(10));
        this.setPadding(0);
        this.add(this.createHeaderSection());
        this.__scrollContent = this.createContentSection();
        this.__scrollTable = this.createTableSection();
        this.__scrollTable.setVisibility("excluded");
        this.__contentContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox());
        this.__contentContainer.add(this.__scrollContent, { flex: 1 });
        this.__contentContainer.add(this.__scrollTable, { flex: 1 });
        this.add(this.__contentContainer, { flex: 1 });
        this.add(this.createFooterSection());
    }

    protected _onResize(): void {
        super._onResize();
        this.__applyContentWidths();
    }

    private __applyContentWidths(): void {
        const full = this.getResponsiveWidth();
        const fullH = this.getResponsiveHeight();
        this.__scrollContent.setWidth(full);
        this.__scrollContent.setHeight(fullH);
        this.__scrollTable.setWidth(full);
    }

    private __showForm(): void {
        if (this.__isFormMode) return;
        this.__isFormMode = true;
        this.__scrollContent.setVisibility("visible");
        this.__scrollTable.setVisibility("excluded");
    }

    private __showTable(): void {
        if (!this.__isFormMode) return;
        this.__isFormMode = false;
        this.__scrollContent.setVisibility("excluded");
        this.__scrollTable.setVisibility("visible");
    }

    private createHeaderSection(): qx.ui.container.Composite {
        const header = new qx.ui.container.Composite(new qx.ui.layout.HBox(5));

        // Entry Button
        const entryButton = new BsButton("Entry", undefined, {
            variant: "outline",
            size: "sm",
            className: "!w-22"
        });
        entryButton.addListener("execute", () => this.__showForm());
        header.add(entryButton);

        // List Button
        const listButton = new BsButton("List", undefined, {
            variant: "outline",
            size: "sm",
            className: "!w-22"
        });
        header.add(listButton);

        // Search Button
        const searchButton = new BsButton("Search", undefined, {
            variant: "outline",
            size: "sm",
            className: "!w-22"
        });
        header.add(searchButton);

        // Refresh Button
        const refreshButton = new BsButton("Refresh", undefined, {
            variant: "outline",
            size: "sm",
            className: "!w-22"
        });
        refreshButton.addListener("execute", () => this.__showTable());
        header.add(refreshButton);

        // XLS Button
        const xlsButton = new BsButton("XLS", undefined, {
            variant: "outline",
            size: "sm",
            className: "!w-22"
        });
        header.add(xlsButton);

        return header;
    }

    private createContentSection(): qx.ui.container.Scroll {
        const scroll = new qx.ui.container.Scroll();
        scroll.setWidth(this.getResponsiveWidth());
        scroll.setHeight(this.getResponsiveHeight());
        const content = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));

        const entries: Record<string, string>[] = [
            { name: "code", type: "text" },
            { name: "name", type: "text" },
            { name: "middleName", type: "text" },
            { name: "callName", type: "text" },
            { name: "address", type: "text" },
            { name: "CP Number", type: "number" },
            { name: "DITO Number", type: "number" },
            { name: "email", type: "email" },
        ]
        
        for (const entry of entries) {
            const LeftContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox(1));

            // Label
            const toTitle = (s: string) => {
                const spaced = s.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ');
                return spaced.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1));
            };
            const label = new BsLabel(toTitle(entry.name));
            LeftContainer.add(label);

            // Input
            const input = new BsInput("", `Enter ${toTitle(entry.name)}...`);
            input.setType(entry.type);
            LeftContainer.add(input);

            content.add(LeftContainer, { flex: 1 });
        }

        
        scroll.add(content);
        return scroll;
    }

    private createTableSection(): qx.ui.container.Scroll {
        const scroll = new qx.ui.container.Scroll();
        scroll.setWidth(this.getResponsiveWidth());

        const columnNames = [
            "Code", "Name", "Middle Name", "Call Name",
            "Address", "CP Number", "DITO Number", "Email"
        ];

        const sampleData = [
            ["INST-001", "Juan", "Santos", "Juan", "123 Rizal St.", "09171234567", "09181234567", "juan@email.com"],
            ["INST-002", "Maria", "Cruz", "Maria", "456 Mabini St.", "09172345678", "09192345678", "maria@email.com"],
            ["INST-003", "Pedro", "Reyes", "Ped", "789 Luna St.", "09173456789", "09193456789", "pedro@email.com"],
            ["INST-004", "Ana", "Garcia", "Annie", "321 Bonifacio St.", "09174567890", "09194567890", "ana@email.com"],
            ["INST-005", "Jose", "Mendoza", "Joe", "654 Katipunan St.", "09175678901", "09195678901", "jose@email.com"],
        ];

        const tableModel = (() => {
            const model = new qx.ui.table.model.Simple();
            model.setColumns(columnNames);
            model.setData(sampleData);
            return model;
        })();

        const custom = {};

        const table = new qx.ui.table.Table(tableModel, custom);
        table.setDecorator(null);
        table.setStatusBarVisible(false);
        table.setShowCellFocusIndicator(false);
        const tcm = table.getTableColumnModel();
        if (tcm) {
            for (let i = 0; i < columnNames.length; i++) {
                tcm.setColumnWidth(i, 120, false);
            }
        }

        const tableContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox());
        tableContainer.add(table, { flex: 1 });

        scroll.add(tableContainer);
        return scroll;
    }

    private createFooterSection(): qx.ui.container.Composite {
        const header = new qx.ui.container.Composite(new qx.ui.layout.HBox(5));

        // Add Button
        const addButton = new BsButton("Add", new InlineSvgIcon("plus", 16), {
            size: "sm",
            className: "!w-25"
        });
        header.add(addButton);

        // Edit Button
        const editButton = new BsButton("Edit", new InlineSvgIcon("edit", 16), {
            variant: "outline",
            size: "sm",
            className: "!w-25"
        });
        header.add(editButton);

        // Delete Button
        const deleteButton = new BsButton("Delete", new InlineSvgIcon("trash-2", 16), {
            variant: "destructive",
            size: "sm",
            className: "!w-25"
        });
        header.add(deleteButton);

        // Save Button
        const saveButton = new BsButton("Save", new InlineSvgIcon("save", 16), {
            size: "sm",
            className: "!w-25"
        });
        header.add(saveButton);

        // Cancel Button
        const cancelButton = new BsButton("Cancel", new InlineSvgIcon("x", 16), {
            variant: "outline",
            size: "sm",
            className: "!w-25"
        });
        header.add(cancelButton);

        return header;
    }
}