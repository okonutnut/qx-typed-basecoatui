type RouteDefinition = {
  label: string;
  iconName?: string;
  element?: () => qx.ui.core.Widget;
  action?: () => void;
  disabled?: boolean;
  hidden?: boolean;
  children?: RouteDefinition[];
};

class AppPages {
  static ROUTE_DEFINITIONS: RouteDefinition[] = [
    {
      label: "Files",
      iconName: "folder",
      children: [
        {
          label: "General",
          iconName: "list",
          children: [
            { label: "Campuses", iconName: "building", element: () => new PlaceholderPage("Campuses") },
            { label: "Departments", iconName: "building-2", element: () => new PlaceholderPage("Departments") },
            { label: "Periods", iconName: "calendar", element: () => new PlaceholderPage("Periods") },
            { label: "Gates (Entry Points)", iconName: "door-open", element: () => new PlaceholderPage("Gates (Entry Points)") },
            { label: "Visitors", iconName: "users", element: () => new PlaceholderPage("Visitors") },
            { label: "Document Types", iconName: "file-text", element: () => new PlaceholderPage("Document Types") },
            { label: "Resources", iconName: "archive", element: () => new PlaceholderPage("Resources") },
            { label: "Clearance Items", iconName: "clipboard-check", element: () => new PlaceholderPage("Clearance Items") },
            { label: "Schools", iconName: "school", element: () => new PlaceholderPage("Schools") },
            { label: "Test Centers", iconName: "landmark", element: () => new PlaceholderPage("Test Centers") },
            { label: "Places & Culture", iconName: "map-pin", element: () => new PlaceholderPage("Places & Culture") },
            { label: "Calendar of Activities", iconName: "calendar-check", element: () => new PlaceholderPage("Calendar of Activities") },
            { label: "Custom Reports", iconName: "file-bar-chart", element: () => new PlaceholderPage("Custom Reports") },
            { label: "Translations", iconName: "languages", element: () => new PlaceholderPage("Translations") },
            { label: "DITO Config", iconName: "settings", element: () => new PlaceholderPage("DITO Config") },
          ],
        },
        {
          label: "Offerings",
          iconName: "package",
          children: [
            { label: "Options", iconName: "sliders-horizontal", element: () => new PlaceholderPage("Options") },
            { label: "Rooms", iconName: "door-open", element: () => new PlaceholderPage("Rooms") },
            { label: "Instructors", iconName: "user-round", element: () => new PlaceholderPage("Instructors") },
            { label: "Ranks", iconName: "award", element: () => new PlaceholderPage("Ranks") },
            { label: "Courses", iconName: "book", element: () => new PlaceholderPage("Courses") },
            { label: "Strands", iconName: "layers", element: () => new PlaceholderPage("Strands") },
            { label: "Subjects", iconName: "book-open", element: () => new PlaceholderPage("Subjects") },
            { label: "Subject Categories", iconName: "folder-tree", element: () => new PlaceholderPage("Subject Categories") },
            { label: "Form 9 Catergories", iconName: "form-input", element: () => new PlaceholderPage("Form 9 Catergories") },
            { label: "Curriculum", iconName: "file-text", element: () => new PlaceholderPage("Curriculum") },
            { label: "Pre-requisites", iconName: "file-check", element: () => new PlaceholderPage("Pre-requisites") },
            { label: "Equivalent", iconName: "shuffle", element: () => new PlaceholderPage("Equivalent") },
            { label: "Create Sections", iconName: "grid", element: () => new PlaceholderPage("Create Sections") },
            { label: "Subject Instructors", iconName: "user-check", element: () => new PlaceholderPage("Subject Instructors") },
            { label: "Templates", iconName: "copy", element: () => new PlaceholderPage("Templates") },
          ],
        },
        {
          label: "Learning Management",
          iconName: "graduation-cap",
          children: [
            { label: "Options", iconName: "sliders-horizontal", element: () => new PlaceholderPage("Options") },
            { label: "Resources", iconName: "archive", element: () => new PlaceholderPage("Resources") },
            { label: "Subject Modules", iconName: "bookmark", element: () => new PlaceholderPage("Subject Modules") },
            { label: "Competencies", iconName: "target", element: () => new PlaceholderPage("Competencies") },
            { label: "Mastery Levels", iconName: "bar-chart", element: () => new PlaceholderPage("Mastery Levels") },
            { label: "Rubrics", iconName: "clipboard-list", element: () => new PlaceholderPage("Rubrics") },
            { label: "Test Bank", iconName: "database", element: () => new PlaceholderPage("Test Bank") },
            { label: "Test", iconName: "file-question", element: () => new PlaceholderPage("Test") },
            { label: "Copy Contents", iconName: "copy", element: () => new PlaceholderPage("Copy Contents") },
            {
              label: "Grading System",
              iconName: "clipboard",
              children: [
                { label: "Terms", iconName: "calendar", element: () => new PlaceholderPage("Terms") },
                { label: "Components", iconName: "puzzle", element: () => new PlaceholderPage("Components") },
                { label: "Grade Transmutation", iconName: "calculator", element: () => new PlaceholderPage("Grade Transmutation") },
                { label: "Grade Conversion", iconName: "refresh-cw", element: () => new PlaceholderPage("Grade Conversion") },
                { label: "Average to Percentile", iconName: "percent", element: () => new PlaceholderPage("Average to Percentile") },
                { label: "Grading System", iconName: "clipboard-check", element: () => new PlaceholderPage("Grading System") },
              ],
            },
          ],
        },
        {
          label: "Accounts",
          iconName: "wallet",
          children: [
            { label: "Options", iconName: "sliders-horizontal", element: () => new PlaceholderPage("Options") },
            { label: "Charts of Accounts", iconName: "file-text", element: () => new PlaceholderPage("Charts of Accounts") },
            { label: "Subsidiary Accounts", iconName: "folder-open", element: () => new PlaceholderPage("Subsidiary Accounts") },
            { label: "Fees", iconName: "dollar-sign", element: () => new PlaceholderPage("Fees") },
            { label: "Discounts / Scholarships", iconName: "gift", element: () => new PlaceholderPage("Discounts / Scholarships") },
            { label: "Assessment Setup", iconName: "settings", element: () => new PlaceholderPage("Assessment Setup") },
            { label: "Downpayment Options", iconName: "wallet", element: () => new PlaceholderPage("Downpayment Options") },
            { label: "Subject Charges", iconName: "credit-card", element: () => new PlaceholderPage("Subject Charges") },
            { label: "Fee Year", iconName: "calendar", element: () => new PlaceholderPage("Fee Year") },
            { label: "UNIFAST Classifications", iconName: "list", element: () => new PlaceholderPage("UNIFAST Classifications") },
            { label: "UNIFAST Fees", iconName: "coins", element: () => new PlaceholderPage("UNIFAST Fees") },
            { label: "Funds", iconName: "banknote", element: () => new PlaceholderPage("Funds") },
            { label: "Banks and Payments", iconName: "building", element: () => new PlaceholderPage("Banks and Payments") },
            { label: "DragonPay Setup", iconName: "cog", element: () => new PlaceholderPage("DragonPay Setup") },
          ],
        },
        {
          label: "Import Data",
          iconName: "upload",
          children: [
            { label: "Import Students Info", iconName: "upload", element: () => new PlaceholderPage("Import Students Info") },
            { label: "Import Instructor Info", iconName: "user-plus", element: () => new PlaceholderPage("Import Instructor Info") },
            { label: "Import Subjects Data", iconName: "file-plus", element: () => new PlaceholderPage("Import Subjects Data") },
            { label: "Import Subjects Internal Codes", iconName: "code", element: () => new PlaceholderPage("Import Subjects Internal Codes") },
            { label: "Import Curriculum", iconName: "file-text", element: () => new PlaceholderPage("Import Curriculum") },
            { label: "Import Grades", iconName: "file-bar-chart", element: () => new PlaceholderPage("Import Grades") },
            { label: "Import Balances", iconName: "dollar-sign", element: () => new PlaceholderPage("Import Balances") },
            { label: "Import Reciepts", iconName: "receipt", element: () => new PlaceholderPage("Import Reciepts") },
            { label: "Import Chart of Accounts", iconName: "file-spreadsheet", element: () => new PlaceholderPage("Import Chart of Accounts") },
            { label: "Import Chart of Accounts (Name)", iconName: "file-edit", element: () => new PlaceholderPage("Import Chart of Accounts (Name)") },
          ],
        },
        { label: "Change Password", hidden: true, iconName: "lock", element: () => new PlaceholderPage("Change Password") },
        { label: "Multi-Factor Authentication", hidden: true, iconName: "shield", element: () => new PlaceholderPage("Multi-Factor Authentication") },
        { label: "Users", iconName: "users", element: () => new PlaceholderPage("Users") },
      ],
    },
    {
      label: "Transactions",
      iconName: "activity",
      children: [
        {
          label: "Activate Account",
          iconName: "unlock",
          children: [
            { label: "Student Access", iconName: "user-check", element: () => new PlaceholderPage("Student Access") },
            { label: "Parent Access", iconName: "users", element: () => new PlaceholderPage("Parent Access") },
            { label: "Enrolled Students", iconName: "user-round", element: () => new PlaceholderPage("Enrolled Students") },
            { label: "Level / Department", iconName: "building", element: () => new PlaceholderPage("Level / Department") },
            { label: "Instructors", iconName: "user-cog", element: () => new PlaceholderPage("Instructors") },
          ],
        },
        {
          label: "Admission",
          iconName: "clipboard-list",
          children: [
            { label: "Options", iconName: "sliders-horizontal", element: () => new PlaceholderPage("Options") },
            { label: "Admission Request", iconName: "file-plus", element: () => new PlaceholderPage("Admission Request") },
            { label: "Test Permit Reminders", iconName: "bell", element: () => new PlaceholderPage("Test Permit Reminders") },
            { label: "Admission Schedules", iconName: "calendar", element: () => new PlaceholderPage("Admission Schedules") },
            { label: "Applications for Admission", iconName: "file-text", element: () => new PlaceholderPage("Applications for Admission") },
            { label: "Admission Result", iconName: "check", element: () => new PlaceholderPage("Admission Result") },
            { label: "Automatic ID No. Format", iconName: "hash", element: () => new PlaceholderPage("Automatic ID No. Format") },
            { label: "Create Student Account", iconName: "user-plus", element: () => new PlaceholderPage("Create Student Account") },
            { label: "Student Profile", iconName: "id-card", element: () => new PlaceholderPage("Student Profile") },
            { label: "Classification / Disability", iconName: "list", element: () => new PlaceholderPage("Classification / Disability") },
            { label: "Upload Document", iconName: "upload", element: () => new PlaceholderPage("Upload Document") },
            { label: "Upload Photo", iconName: "image", element: () => new PlaceholderPage("Upload Photo") },
            { label: "Upload Photos (ZIP)", iconName: "image-plus", element: () => new PlaceholderPage("Upload Photos (ZIP)") },
            { label: "Disable ID Card", iconName: "x-circle", element: () => new PlaceholderPage("Disable ID Card") },
          ],
        },
        {
          label: "Class Schedule",
          iconName: "clock",
          children: [
            { label: "Create Classes", iconName: "plus-circle", element: () => new PlaceholderPage("Create Classes") },
            { label: "Delete Classes", iconName: "minus-circle", element: () => new PlaceholderPage("Delete Classes") },
            { label: "Add / Edit Classes", iconName: "edit", element: () => new PlaceholderPage("Add / Edit Classes") },
            { label: "Copy Class Schedule", iconName: "copy", element: () => new PlaceholderPage("Copy Class Schedule") },
            { label: "Change Class Data", iconName: "refresh-cw", element: () => new PlaceholderPage("Change Class Data") },
            { label: "Assign Rooms", iconName: "door-open", element: () => new PlaceholderPage("Assign Rooms") },
            { label: "Scheduling Period", iconName: "calendar", element: () => new PlaceholderPage("Scheduling Period") },
            { label: "Scheduling Wizard", iconName: "wand", element: () => new PlaceholderPage("Scheduling Wizard") },
            { label: "Merge Classes", iconName: "combine", element: () => new PlaceholderPage("Merge Classes") },
          ],
        },
        {
          label: "Pre-Enlistment",
          iconName: "list-check",
          children: [
            { label: "Schedule", iconName: "calendar", element: () => new PlaceholderPage("Schedule") },
            { label: "Automatic Promotion and Pre-enlistment", iconName: "arrow-up", element: () => new PlaceholderPage("Automatic Promotion and Pre-enlistment") },
            { label: "Pre-enlist", iconName: "user-plus", element: () => new PlaceholderPage("Pre-enlist") },
            { label: "Pre-enlistment List", iconName: "list", element: () => new PlaceholderPage("Pre-enlistment List") },
            { label: "Summary", iconName: "file-text", element: () => new PlaceholderPage("Summary") },
          ],
        },
        {
          label: "Enrollment",
          iconName: "user-round-plus",
          children: [
            { label: "Enrollment Period", iconName: "calendar", element: () => new PlaceholderPage("Enrollment Period") },
            { label: "Adding & Dropping Period", iconName: "calendar-check", element: () => new PlaceholderPage("Adding & Dropping Period") },
            { label: "Enrollment", iconName: "user-check", element: () => new PlaceholderPage("Enrollment") },
            { label: "Change Enrollment Data", iconName: "edit", element: () => new PlaceholderPage("Change Enrollment Data") },
            { label: "Approve Enrollment", iconName: "check-circle", element: () => new PlaceholderPage("Approve Enrollment") },
            { label: "Adding & Dropping Request", iconName: "file-plus", element: () => new PlaceholderPage("Adding & Dropping Request") },
            { label: "Transfer Section", iconName: "arrow-right", element: () => new PlaceholderPage("Transfer Section") },
            { label: "Change Subject / Class", iconName: "refresh-cw", element: () => new PlaceholderPage("Change Subject / Class") },
            { label: "Validation", iconName: "check", element: () => new PlaceholderPage("Validation") },
            { label: "Cancellation", iconName: "x-square", element: () => new PlaceholderPage("Cancellation") },
            { label: "Cleanup", iconName: "trash", element: () => new PlaceholderPage("Cleanup") },
            { label: "Auto-Assign Section", iconName: "wand", element: () => new PlaceholderPage("Auto-Assign Section") },
            { label: "Initialize Curriculum", iconName: "file-text", element: () => new PlaceholderPage("Initialize Curriculum") },
            { label: "Failed Subjects Payment", iconName: "dollar-sign", element: () => new PlaceholderPage("Failed Subjects Payment") },
            { label: "Set New/Old Student", iconName: "user-round", element: () => new PlaceholderPage("Set New/Old Student") },
          ],
        },
        {
          label: "Grades",
          iconName: "clipboard-pen",
          children: [
            { label: "Entry Schedule / Level", iconName: "calendar", element: () => new PlaceholderPage("Entry Schedule / Level") },
            { label: "Entry Schedule / Instructor", iconName: "calendar-check", element: () => new PlaceholderPage("Entry Schedule / Instructor") },
            { label: "Grading Sheet", iconName: "file-text", element: () => new PlaceholderPage("Grading Sheet") },
            { label: "Input Grades", iconName: "edit", element: () => new PlaceholderPage("Input Grades") },
            { label: "Adviser Comments", iconName: "message-square", element: () => new PlaceholderPage("Adviser Comments") },
            { label: "Modalities", iconName: "layers", element: () => new PlaceholderPage("Modalities") },
            { label: "Curriculum Evaluation", iconName: "file-search", element: () => new PlaceholderPage("Curriculum Evaluation") },
            { label: "Credit Subjects", iconName: "check", element: () => new PlaceholderPage("Credit Subjects") },
            {
              label: "Permanent Record",
              iconName: "file-archive",
              children: [
                { label: "Eligibility Record (ELEM)", iconName: "file-text", element: () => new PlaceholderPage("Eligibility Record (ELEM)") },
                { label: "Eligibility Record (JHS)", iconName: "file-check", element: () => new PlaceholderPage("Eligibility Record (JHS)") },
                { label: "Eligibility Record (SHS)", iconName: "file-plus", element: () => new PlaceholderPage("Eligibility Record (SHS)") },
                { label: "Scholastic Record", iconName: "award", element: () => new PlaceholderPage("Scholastic Record") },
              ],
            },
            { label: "Authorize Input Grades", iconName: "user-check", element: () => new PlaceholderPage("Authorize Input Grades") },
            { label: "Authorize Change Grade", iconName: "user-cog", element: () => new PlaceholderPage("Authorize Change Grade") },
            {
              label: "Attendance",
              iconName: "table",
              children: [
                { label: "Class Attendance", iconName: "calendar-check", element: () => new PlaceholderPage("Class Attendance") },
                { label: "Section Attedance", iconName: "users", element: () => new PlaceholderPage("Section Attedance") },
                { label: "Override Totals", iconName: "calculator", element: () => new PlaceholderPage("Override Totals") },
                { label: "Override Attendance", iconName: "edit", element: () => new PlaceholderPage("Override Attendance") },
              ],
            },
            {
              label: "Utilities",
              iconName: "tool",
              children: [
                { label: "Fix Missing Subjects", iconName: "wrench", element: () => new PlaceholderPage("Fix Missing Subjects") },
                { label: "Post Enrolled Subjects", iconName: "upload", element: () => new PlaceholderPage("Post Enrolled Subjects") },
                { label: "Zero Final Grades", iconName: "x-circle", element: () => new PlaceholderPage("Zero Final Grades") },
                { label: "Remarks Term Grades", iconName: "message-square", element: () => new PlaceholderPage("Remarks Term Grades") },
                { label: "Delete Unenrolled Grades", iconName: "trash", element: () => new PlaceholderPage("Delete Unenrolled Grades") },
                { label: "Insert / Recompute Parent Subject", iconName: "refresh-cw", element: () => new PlaceholderPage("Insert / Recompute Parent Subject") },
                { label: "Transmute Score", iconName: "calculator", element: () => new PlaceholderPage("Transmute Score") },
              ],
            },
          ],
        },
        {
          label: "Learning Management",
          iconName: "laptop",
          children: [
            { label: "Learning Period", iconName: "calendar", element: () => new PlaceholderPage("Learning Period") },
            { label: "Schedule Online Tasks", iconName: "calendar-check", element: () => new PlaceholderPage("Schedule Online Tasks") },
            { label: "My Online Tasks", iconName: "clipboard-list", element: () => new PlaceholderPage("My Online Tasks") },
          ],
        },
        {
          label: "Student Accounts",
          iconName: "wallet-cards",
          children: [
            { label: "Assessment Period", iconName: "calendar", element: () => new PlaceholderPage("Assessment Period") },
            { label: "Cancellation Schedule", iconName: "calendar-check", element: () => new PlaceholderPage("Cancellation Schedule") },
            { label: "Assessment", iconName: "dollar-sign", element: () => new PlaceholderPage("Assessment") },
            { label: "Assess Lock / Unlock", iconName: "lock", element: () => new PlaceholderPage("Assess Lock / Unlock") },
            { label: "Reprocess Assessments", iconName: "refresh-cw", element: () => new PlaceholderPage("Reprocess Assessments") },
            { label: "Student Ledger", iconName: "file-text", element: () => new PlaceholderPage("Student Ledger") },
            { label: "Promisorry Notes", iconName: "file-pen", element: () => new PlaceholderPage("Promisorry Notes") },
            { label: "Individual Adjustment", iconName: "edit", element: () => new PlaceholderPage("Individual Adjustment") },
            { label: "Group Adjustment", iconName: "users", element: () => new PlaceholderPage("Group Adjustment") },
            { label: "Recompute Duplicate Assess Nos", iconName: "calculator", element: () => new PlaceholderPage("Recompute Duplicate Assess Nos") },
            { label: "Merge Duplicate Assess Nos", iconName: "combine", element: () => new PlaceholderPage("Merge Duplicate Assess Nos") },
            { label: "Fix Duplicate Adjust Nos", iconName: "wrench", element: () => new PlaceholderPage("Fix Duplicate Adjust Nos") },
            { label: "Fix Adjust Nos Gap", iconName: "tool", element: () => new PlaceholderPage("Fix Adjust Nos Gap") },
            { label: "Remove Assess Adjustments", iconName: "trash", element: () => new PlaceholderPage("Remove Assess Adjustments") },
          ],
        },
        {
          label: "Payments",
          iconName: "landmark",
          children: [
            { label: "Official Receipts", iconName: "receipt", element: () => new PlaceholderPage("Official Receipts") },
            { label: "Acknowledgement Receipts", iconName: "file-text", element: () => new PlaceholderPage("Acknowledgement Receipts") },
            { label: "Cashier", iconName: "banknote", element: () => new PlaceholderPage("Cashier") },
            { label: "Credit Memo", iconName: "credit-card", element: () => new PlaceholderPage("Credit Memo") },
            { label: "Cancellation", iconName: "x-circle", element: () => new PlaceholderPage("Cancellation") },
            { label: "DragonPay Payments", iconName: "globe", element: () => new PlaceholderPage("DragonPay Payments") },
            { label: "Express Payments", iconName: "zap", element: () => new PlaceholderPage("Express Payments") },
            { label: "Deposits", iconName: "landmark", element: () => new PlaceholderPage("Deposits") },
            { label: "Period Term Invoices", iconName: "file-bar-chart", element: () => new PlaceholderPage("Period Term Invoices") },
            { label: "Repost Official Receipts", iconName: "refresh-cw", element: () => new PlaceholderPage("Repost Official Receipts") },
            { label: "Repost Acknowledgement Receipts", iconName: "repeat", element: () => new PlaceholderPage("Repost Acknowledgement Receipts") },
          ],
        },
        {
          label: "Discounts / Scholarships",
          iconName: "gift",
          children: [
            { label: "Grantees", iconName: "users", element: () => new PlaceholderPage("Grantees") },
            { label: "Exclusions", iconName: "x-circle", element: () => new PlaceholderPage("Exclusions") },
          ],
        },
        {
          label: "Disburstment",
          iconName: "arrow-up-down",
          children: [
            { label: "Voucher Payable", iconName: "file-text", element: () => new PlaceholderPage("Voucher Payable") },
            { label: "Cash Voucher", iconName: "banknote", element: () => new PlaceholderPage("Cash Voucher") },
            { label: "Check Voucher", iconName: "file-check", element: () => new PlaceholderPage("Check Voucher") },
            { label: "Cancel Check", iconName: "x-circle", element: () => new PlaceholderPage("Cancel Check") },
            { label: "Issue Check", iconName: "plus-circle", element: () => new PlaceholderPage("Issue Check") },
            { label: "Encash Check", iconName: "dollar-sign", element: () => new PlaceholderPage("Encash Check") },
          ],
        },
        {
          label: "Accounting",
          iconName: "book-open-check",
          children: [
            { label: "Journal Entry Voucher", iconName: "file-text", element: () => new PlaceholderPage("Journal Entry Voucher") },
          ],
        },
        {
          label: "Teacher Evaluation",
          iconName: "star",
          children: [
            { label: "Forms", iconName: "file-text", element: () => new PlaceholderPage("Forms") },
            { label: "Questions", iconName: "help-circle", element: () => new PlaceholderPage("Questions") },
            { label: "Schedule", iconName: "calendar", element: () => new PlaceholderPage("Schedule") },
          ],
        },
        {
          label: "Student Clearance",
          iconName: "clipboard-check",
          children: [
            { label: "Input", iconName: "edit", element: () => new PlaceholderPage("Input") },
            { label: "Print", iconName: "printer", element: () => new PlaceholderPage("Print") },
            { label: "Listing", iconName: "list", element: () => new PlaceholderPage("Listing") },
          ],
        },
        {
          label: "Others",
          iconName: "more-horizontal",
          children: [
            { label: "Send Email", iconName: "mail", element: () => new PlaceholderPage("Send Email") },
            { label: "Text / Email Blast", iconName: "message-circle", element: () => new PlaceholderPage("Text / Email Blast") },
            { label: "Notify (Open Resource)", iconName: "bell", element: () => new PlaceholderPage("Notify (Open Resource)") },
            { label: "Notify (Show Amount Due)", iconName: "dollar-sign", element: () => new PlaceholderPage("Notify (Show Amount Due)") },
            { label: "Notify (Show Clearance Items)", iconName: "clipboard-list", element: () => new PlaceholderPage("Notify (Show Clearance Items)") },
            { label: "Notify (Show Teacher Evaluation)", iconName: "star", element: () => new PlaceholderPage("Notify (Show Teacher Evaluation)") },
          ],
        },
      ],
    },
    {
      label: "Reports",
      iconName: "file-text",
      children: [
        {
          label: "Registrar",
          iconName: "library",
          children: [
            { label: "Enrollment List", iconName: "list", element: () => new PlaceholderPage("Enrollment List") },
            { label: "Enrollment List (UNIFAST)", iconName: "file-text", element: () => new PlaceholderPage("Enrollment List (UNIFAST)") },
            { label: "Enrollment List (CHED)", iconName: "file-check", element: () => new PlaceholderPage("Enrollment List (CHED)") },
            { label: "Discontinued List", iconName: "x-circle", element: () => new PlaceholderPage("Discontinued List") },
            { label: "WebMail Accounts List", iconName: "mail", element: () => new PlaceholderPage("WebMail Accounts List") },
            { label: "Class Offerings", iconName: "book", element: () => new PlaceholderPage("Class Offerings") },
            { label: "Weekly Schedules", iconName: "calendar", element: () => new PlaceholderPage("Weekly Schedules") },
            { label: "Advice to Start Classes", iconName: "bell", element: () => new PlaceholderPage("Advice to Start Classes") },
            { label: "Instructor Load", iconName: "user-round", element: () => new PlaceholderPage("Instructor Load") },
            { label: "Enrolled Subjects", iconName: "book-open", element: () => new PlaceholderPage("Enrolled Subjects") },
            { label: "Unsubmitted Documents", iconName: "file-plus", element: () => new PlaceholderPage("Unsubmitted Documents") },
            {
              label: "Classes",
              iconName: "grid",
              children: [
                { label: "Class List / Instructor", iconName: "file-text", element: () => new PlaceholderPage("Class List / Instructor") },
                { label: "Class List / Section", iconName: "list", element: () => new PlaceholderPage("Class List / Section") },
                { label: "Class List / Subjects", iconName: "book-open", element: () => new PlaceholderPage("Class List / Subjects") },
                { label: "Class List / Code", iconName: "hash", element: () => new PlaceholderPage("Class List / Code") },
                { label: "Class Attendance", iconName: "calendar-check", element: () => new PlaceholderPage("Class Attendance") },
                { label: "Class Absences", iconName: "x-circle", element: () => new PlaceholderPage("Class Absences") },
              ],
            },
            {
              label: "Summary",
              iconName: "file-up",
              children: [
                { label: "Enrollment Summary (Reserved / Confirmed)", iconName: "file-text", element: () => new PlaceholderPage("Enrollment Summary (Reserved / Confirmed)") },
                { label: "Enrollment Summary (New / Old)", iconName: "users", element: () => new PlaceholderPage("Enrollment Summary (New / Old)") },
                { label: "Enrollment Summary (Gender)", iconName: "chart-pie", element: () => new PlaceholderPage("Enrollment Summary (Gender)") },
                { label: "Mobile Carrier Summary", iconName: "smartphone", element: () => new PlaceholderPage("Mobile Carrier Summary") },
              ],
            },
            {
              label: "Grades",
              iconName: "bar-chart",
              children: [
                { label: "Term Grades (Match Curriculum)", iconName: "file-text", element: () => new PlaceholderPage("Term Grades (Match Curriculum)") },
                { label: "Term Grades (Ignore Curriculum)", iconName: "file-check", element: () => new PlaceholderPage("Term Grades (Ignore Curriculum)") },
                { label: "Final Grades (Match Curriculum)", iconName: "file-bar-chart", element: () => new PlaceholderPage("Final Grades (Match Curriculum)") },
                { label: "Final Grades (Ignore Curriculum)", iconName: "file-minus", element: () => new PlaceholderPage("Final Grades (Ignore Curriculum)") },
                { label: "Periodic Average Grades (Match Curriculum)", iconName: "calculator", element: () => new PlaceholderPage("Periodic Average Grades (Match Curriculum)") },
                { label: "Periodic Average Grades (Ignore Curriculum)", iconName: "bar-chart", element: () => new PlaceholderPage("Periodic Average Grades (Ignore Curriculum)") },
                { label: "General Weighted Average (Match Curriculum)", iconName: "award", element: () => new PlaceholderPage("General Weighted Average (Match Curriculum)") },
                { label: "General Weighted Average (Ignore Curriculum)", iconName: "star", element: () => new PlaceholderPage("General Weighted Average (Ignore Curriculum)") },
                { label: "Individual Weighted Average (Match Curriculum)", iconName: "user-round", element: () => new PlaceholderPage("Individual Weighted Average (Match Curriculum)") },
                { label: "Individual Weighted Average (Ignore Curriculum)", iconName: "user-check", element: () => new PlaceholderPage("Individual Weighted Average (Ignore Curriculum)") },
                { label: "Grade Entry Monitor", iconName: "eye", element: () => new PlaceholderPage("Grade Entry Monitor") },
                { label: "Grade Entry Delays", iconName: "clock", element: () => new PlaceholderPage("Grade Entry Delays") },
                { label: "Periodic Grades Listing", iconName: "list", element: () => new PlaceholderPage("Periodic Grades Listing") },
                { label: "Consolidated Grade Listing", iconName: "files", element: () => new PlaceholderPage("Consolidated Grade Listing") },
                { label: "Consolidated Grade Listing (Instructor)", iconName: "user-cog", element: () => new PlaceholderPage("Consolidated Grade Listing (Instructor)") },
                { label: "Learners Proficieny Levels", iconName: "layers", element: () => new PlaceholderPage("Learners Proficieny Levels") },
                { label: "Test Items Analysis", iconName: "file-question", element: () => new PlaceholderPage("Test Items Analysis") },
              ],
            },
            { label: "Report Card", iconName: "award", element: () => new PlaceholderPage("Report Card") },
            { label: "Permanent Record", iconName: "file-archive", element: () => new PlaceholderPage("Permanent Record") },
          ],
        },
        {
          label: "Assessment",
          iconName: "calculator",
          children: [
            { label: "Assessment Details", iconName: "file-text", element: () => new PlaceholderPage("Assessment Details") },
            { label: "Assessment Summary", iconName: "file-bar-chart", element: () => new PlaceholderPage("Assessment Summary") },
            { label: "Schedules of Fees", iconName: "calendar", element: () => new PlaceholderPage("Schedules of Fees") },
          ],
        },
        {
          label: "Discount / Scholarship",
          iconName: "badge-percent",
          children: [
            { label: "List of Grantees", iconName: "users", element: () => new PlaceholderPage("List of Grantees") },
            { label: "List of Grantees (Personal)", iconName: "user-round", element: () => new PlaceholderPage("List of Grantees (Personal)") },
            { label: "Enrollment List (UNIFAST)", iconName: "file-text", element: () => new PlaceholderPage("Enrollment List (UNIFAST)") },
          ],
        },
        {
          label: "Student Ledger",
          iconName: "book-open",
          children: [
            { label: "Statement of Accounts", iconName: "file-text", element: () => new PlaceholderPage("Statement of Accounts") },
            { label: "Amount Dues / As Of", iconName: "dollar-sign", element: () => new PlaceholderPage("Amount Dues / As Of") },
            { label: "Amount Dues / Payment Sched", iconName: "calendar", element: () => new PlaceholderPage("Amount Dues / Payment Sched") },
            { label: "Examination Permit", iconName: "file-check", element: () => new PlaceholderPage("Examination Permit") },
            { label: "Summary of Accounts", iconName: "file-bar-chart", element: () => new PlaceholderPage("Summary of Accounts") },
            { label: "Student Ledger Fees", iconName: "credit-card", element: () => new PlaceholderPage("Student Ledger Fees") },
            { label: "Account Receivables - Enrollment", iconName: "file-plus", element: () => new PlaceholderPage("Account Receivables - Enrollment") },
            { label: "Masterlist of Receivables", iconName: "list", element: () => new PlaceholderPage("Masterlist of Receivables") },
            { label: "Aging of Receivables", iconName: "clock", element: () => new PlaceholderPage("Aging of Receivables") },
            { label: "Promisorry Notes", iconName: "file-pen", element: () => new PlaceholderPage("Promisorry Notes") },
            { label: "Individual Adjustments", iconName: "edit", element: () => new PlaceholderPage("Individual Adjustments") },
          ],
        },
        {
          label: "Collections",
          iconName: "folder-open",
          children: [
            { label: "Daily Collection Report", iconName: "file-text", element: () => new PlaceholderPage("Daily Collection Report") },
            {
              label: "Collection Listing",
              iconName: "list",
              children: [
                { label: "Official Receipts Listing", iconName: "receipt", element: () => new PlaceholderPage("Official Receipts Listing") },
                { label: "Acknowledgement Receipts Listing", iconName: "file-text", element: () => new PlaceholderPage("Acknowledgement Receipts Listing") },
                { label: "Service Invoices Listing", iconName: "file-bar-chart", element: () => new PlaceholderPage("Service Invoices Listing") },
                { label: "Credit Memos Listing", iconName: "credit-card", element: () => new PlaceholderPage("Credit Memos Listing") },
              ],
            },
            {
              label: "Collection Details",
              iconName: "file-search",
              children: [
                { label: "Official Receipts Details", iconName: "receipt", element: () => new PlaceholderPage("Official Receipts Details") },
                { label: "Acknowledgement Receipts Details", iconName: "file-text", element: () => new PlaceholderPage("Acknowledgement Receipts Details") },
                { label: "Service Invoices Details", iconName: "file-bar-chart", element: () => new PlaceholderPage("Service Invoices Details") },
                { label: "Credit Memos Details", iconName: "credit-card", element: () => new PlaceholderPage("Credit Memos Details") },
              ],
            },
            {
              label: "Collection Summary",
              iconName: "file-bar-chart",
              children: [
                { label: "Summary of Official Receipts", iconName: "receipt", element: () => new PlaceholderPage("Summary of Official Receipts") },
                { label: "Summary of Acknowledgement Receipts", iconName: "file-text", element: () => new PlaceholderPage("Summary of Acknowledgement Receipts") },
                { label: "Summary of Service Invoices", iconName: "file-bar-chart", element: () => new PlaceholderPage("Summary of Service Invoices") },
                { label: "Summary of Credit Memos", iconName: "credit-card", element: () => new PlaceholderPage("Summary of Credit Memos") },
              ],
            },
            { label: "Cash Receipts Journal", iconName: "receipt", element: () => new PlaceholderPage("Cash Receipts Journal") },
          ],
        },
        {
          label: "Disburstment",
          iconName: "receipt",
          children: [
            { label: "Check Register", iconName: "file-text", element: () => new PlaceholderPage("Check Register") },
            { label: "Check Disburstment Journal", iconName: "receipt", element: () => new PlaceholderPage("Check Disburstment Journal") },
          ],
        },
        {
          label: "Accounting",
          iconName: "scale",
          children: [
            { label: "Journal Entries", iconName: "file-text", element: () => new PlaceholderPage("Journal Entries") },
            { label: "General Ledger", iconName: "book-open", element: () => new PlaceholderPage("General Ledger") },
            { label: "Consolidated General Ledger", iconName: "book", element: () => new PlaceholderPage("Consolidated General Ledger") },
            { label: "Trial Balance", iconName: "scale", element: () => new PlaceholderPage("Trial Balance") },
            { label: "Income Statement", iconName: "file-bar-chart", element: () => new PlaceholderPage("Income Statement") },
            { label: "Balance Sheet", iconName: "file-spreadsheet", element: () => new PlaceholderPage("Balance Sheet") },
            { label: "eWallet Transactions", iconName: "wallet", element: () => new PlaceholderPage("eWallet Transactions") },
            { label: "Purchases Report", iconName: "shopping-cart", element: () => new PlaceholderPage("Purchases Report") },
          ],
        },
        {
          label: "Others",
          iconName: "ellipsis",
          children: [
            { label: "Teacher Evaluation", iconName: "star", element: () => new PlaceholderPage("Teacher Evaluation") },
            { label: "Teacher Evaluation Monitor", iconName: "eye", element: () => new PlaceholderPage("Teacher Evaluation Monitor") },
            { label: "Opened Resources", iconName: "file-text", element: () => new PlaceholderPage("Opened Resources") },
            { label: "Accounts In/Out Report", iconName: "users", element: () => new PlaceholderPage("Accounts In/Out Report") },
            { label: "Visitor In/Out Report", iconName: "user-round", element: () => new PlaceholderPage("Visitor In/Out Report") },
          ],
        },
      ],
    },
    {
      label: "Tools",
      iconName: "wrench",
      children: [
        {
          label: "Download Backup",
          iconName: "download",
          children: [
            { label: "Primary", iconName: "database", element: () => new PlaceholderPage("Primary") },
            { label: "Files", iconName: "file-text", element: () => new PlaceholderPage("Files") },
          ],
        },
        {
          label: "Check and Repair",
          iconName: "shield-check",
          children: [
            { label: "Primary", iconName: "database", element: () => new PlaceholderPage("Primary") },
            { label: "Files", iconName: "file-text", element: () => new PlaceholderPage("Files") },
          ],
        },
        { label: "Rebuild LMS Cache", iconName: "refresh-cw", element: () => new PlaceholderPage("Rebuild LMS Cache") },
        { label: "Usage Summary", iconName: "file-bar-chart", element: () => new PlaceholderPage("Usage Summary") },
        { label: "Activity Log", iconName: "list", element: () => new PlaceholderPage("Activity Log") },
        { label: "Default Period", iconName: "calendar", element: () => new PlaceholderPage("Default Period") },
        { label: "Options", iconName: "sliders-horizontal", element: () => new PlaceholderPage("Options") },
      ],
    },
  ];

  static createSidebarItems(
    definitions: RouteDefinition[] = AppPages.ROUTE_DEFINITIONS,
  ) {
    const createItems = (items: RouteDefinition[]): SidebarItem[] => {
      return items.map((definition) => ({
        label: definition.label,
        icon: definition.iconName
          ? new InlineSvgIcon(definition.iconName, 16)
          : undefined,
        action: definition.action,
        disabled: definition.disabled,
        hidden: definition.hidden,
        children: definition.children
          ? createItems(definition.children)
          : undefined,
      }));
    };

    return createItems(definitions);
  }

  static manipulateSidebarItems(
    items: SidebarItem[],
    pageMap: Map<string, () => qx.ui.core.Widget>,
  ): SidebarItem[] {
    const normalizeItems = (source: SidebarItem[]): SidebarItem[] => {
      const normalizedItems: SidebarItem[] = [];

      source.forEach((item) => {
        if (item.hidden) return;

        const normalizedLabel = item.label.trim();
        const normalizedChildren = item.children
          ? normalizeItems(item.children)
          : undefined;

        const isLeaf = !normalizedChildren || normalizedChildren.length === 0;
        if (isLeaf && !pageMap.has(normalizedLabel)) return;

        normalizedItems.push({
          ...item,
          label: normalizedLabel,
          children:
            normalizedChildren && normalizedChildren.length > 0
              ? normalizedChildren
              : undefined,
        });
      });

      return normalizedItems;
    };

    return normalizeItems(items);
  }
}