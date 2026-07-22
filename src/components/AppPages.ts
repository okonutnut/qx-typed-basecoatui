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
      children: [
        {
          label: "General",
          children: [
            { label: "Campuses", element: () => new PlaceholderPage("Campuses") },
            { label: "Departments", element: () => new PlaceholderPage("Departments") },
            { label: "Periods", element: () => new PlaceholderPage("Periods") },
            { label: "Gates (Entry Points)", element: () => new PlaceholderPage("Gates (Entry Points)") },
            { label: "Visitors", element: () => new PlaceholderPage("Visitors") },
            { label: "Document Types", element: () => new PlaceholderPage("Document Types") },
            { label: "Resources", element: () => new PlaceholderPage("Resources") },
            { label: "Clearance Items", element: () => new PlaceholderPage("Clearance Items") },
            { label: "Schools", element: () => new PlaceholderPage("Schools") },
            { label: "Test Centers", element: () => new PlaceholderPage("Test Centers") },
            { label: "Places & Culture", element: () => new PlaceholderPage("Places & Culture") },
            { label: "Calendar of Activities", element: () => new PlaceholderPage("Calendar of Activities") },
            { label: "Custom Reports", element: () => new PlaceholderPage("Custom Reports") },
            { label: "Translations", element: () => new PlaceholderPage("Translations") },
            { label: "DITO Config", element: () => new PlaceholderPage("DITO Config") },
          ],
        },
        {
          label: "Offerings",
          children: [
            { label: "Options", element: () => new PlaceholderPage("Options") },
            { label: "Rooms", element: () => new PlaceholderPage("Rooms") },
            { label: "Instructors", element: () => new PlaceholderPage("Instructors") },
            { label: "Ranks", element: () => new PlaceholderPage("Ranks") },
            { label: "Courses", element: () => new PlaceholderPage("Courses") },
            { label: "Strands", element: () => new PlaceholderPage("Strands") },
            { label: "Subjects", element: () => new PlaceholderPage("Subjects") },
            { label: "Subject Categories", element: () => new PlaceholderPage("Subject Categories") },
            { label: "Form 9 Catergories", element: () => new PlaceholderPage("Form 9 Catergories") },
            { label: "Curriculum", element: () => new PlaceholderPage("Curriculum") },
            { label: "Pre-requisites", element: () => new PlaceholderPage("Pre-requisites") },
            { label: "Equivalent", element: () => new PlaceholderPage("Equivalent") },
            { label: "Create Sections", element: () => new PlaceholderPage("Create Sections") },
            { label: "Subject Instructors", element: () => new PlaceholderPage("Subject Instructors") },
            { label: "Templates", element: () => new PlaceholderPage("Templates") },
          ],
        },
        {
          label: "Learning Management",
          children: [
            { label: "Options", element: () => new PlaceholderPage("Options") },
            { label: "Resources", element: () => new PlaceholderPage("Resources") },
            { label: "Subject Modules", element: () => new PlaceholderPage("Subject Modules") },
            { label: "Competencies", element: () => new PlaceholderPage("Competencies") },
            { label: "Mastery Levels", element: () => new PlaceholderPage("Mastery Levels") },
            { label: "Rubrics", element: () => new PlaceholderPage("Rubrics") },
            { label: "Test Bank", element: () => new PlaceholderPage("Test Bank") },
            { label: "Test", element: () => new PlaceholderPage("Test") },
            { label: "Copy Contents", element: () => new PlaceholderPage("Copy Contents") },
            {
              label: "Grading System",
              children: [
                { label: "Terms", element: () => new PlaceholderPage("Terms") },
                { label: "Components", element: () => new PlaceholderPage("Components") },
                { label: "Grade Transmutation", element: () => new PlaceholderPage("Grade Transmutation") },
                { label: "Grade Conversion", element: () => new PlaceholderPage("Grade Conversion") },
                { label: "Average to Percentile", element: () => new PlaceholderPage("Average to Percentile") },
                { label: "Grading System", element: () => new PlaceholderPage("Grading System") },
              ],
            },
          ],
        },
        {
          label: "Accounts",
          children: [
            { label: "Options", element: () => new PlaceholderPage("Options") },
            { label: "Charts of Accounts", element: () => new PlaceholderPage("Charts of Accounts") },
            { label: "Subsidiary Accounts", element: () => new PlaceholderPage("Subsidiary Accounts") },
            { label: "Fees", element: () => new PlaceholderPage("Fees") },
            { label: "Discounts / Scholarships", element: () => new PlaceholderPage("Discounts / Scholarships") },
            { label: "Assessment Setup", element: () => new PlaceholderPage("Assessment Setup") },
            { label: "Downpayment Options", element: () => new PlaceholderPage("Downpayment Options") },
            { label: "Subject Charges", element: () => new PlaceholderPage("Subject Charges") },
            { label: "Fee Year", element: () => new PlaceholderPage("Fee Year") },
            { label: "UNIFAST Classifications", element: () => new PlaceholderPage("UNIFAST Classifications") },
            { label: "UNIFAST Fees", element: () => new PlaceholderPage("UNIFAST Fees") },
            { label: "Funds", element: () => new PlaceholderPage("Funds") },
            { label: "Banks and Payments", element: () => new PlaceholderPage("Banks and Payments") },
            { label: "DragonPay Setup", element: () => new PlaceholderPage("DragonPay Setup") },
          ],
        },
        {
          label: "Import Data",
          children: [
            { label: "Import Students Info", element: () => new PlaceholderPage("Import Students Info") },
            { label: "Import Instructor Info", element: () => new PlaceholderPage("Import Instructor Info") },
            { label: "Import Subjects Data", element: () => new PlaceholderPage("Import Subjects Data") },
            { label: "Import Subjects Internal Codes", element: () => new PlaceholderPage("Import Subjects Internal Codes") },
            { label: "Import Curriculum", element: () => new PlaceholderPage("Import Curriculum") },
            { label: "Import Grades", element: () => new PlaceholderPage("Import Grades") },
            { label: "Import Balances", element: () => new PlaceholderPage("Import Balances") },
            { label: "Import Reciepts", element: () => new PlaceholderPage("Import Reciepts") },
            { label: "Import Chart of Accounts", element: () => new PlaceholderPage("Import Chart of Accounts") },
            { label: "Import Chart of Accounts (Name)", element: () => new PlaceholderPage("Import Chart of Accounts (Name)") },
          ],
        },
        { label: "Change Password", hidden: true, element: () => new PlaceholderPage("Change Password") },
        { label: "Multi-Factor Authentication", hidden: true, element: () => new PlaceholderPage("Multi-Factor Authentication") },
        { label: "Users", element: () => new PlaceholderPage("Users") },
      ],
    },
    {
      label: "Transactions",
      children: [
        {
          label: "Activate Account",
          children: [
            { label: "Student Access", element: () => new PlaceholderPage("Student Access") },
            { label: "Parent Access", element: () => new PlaceholderPage("Parent Access") },
            { label: "Enrolled Students", element: () => new PlaceholderPage("Enrolled Students") },
            { label: "Level / Department", element: () => new PlaceholderPage("Level / Department") },
            { label: "Instructors", element: () => new PlaceholderPage("Instructors") },
          ],
        },
        {
          label: "Admission",
          children: [
            { label: "Options", element: () => new PlaceholderPage("Options") },
            { label: "Admission Request", element: () => new PlaceholderPage("Admission Request") },
            { label: "Test Permit Reminders", element: () => new PlaceholderPage("Test Permit Reminders") },
            { label: "Admission Schedules", element: () => new PlaceholderPage("Admission Schedules") },
            { label: "Applications for Admission", element: () => new PlaceholderPage("Applications for Admission") },
            { label: "Admission Result", element: () => new PlaceholderPage("Admission Result") },
            { label: "Automatic ID No. Format", element: () => new PlaceholderPage("Automatic ID No. Format") },
            { label: "Create Student Account", element: () => new PlaceholderPage("Create Student Account") },
            { label: "Student Profile", element: () => new PlaceholderPage("Student Profile") },
            { label: "Classification / Disability", element: () => new PlaceholderPage("Classification / Disability") },
            { label: "Upload Document", element: () => new PlaceholderPage("Upload Document") },
            { label: "Upload Photo", element: () => new PlaceholderPage("Upload Photo") },
            { label: "Upload Photos (ZIP)", element: () => new PlaceholderPage("Upload Photos (ZIP)") },
            { label: "Disable ID Card", element: () => new PlaceholderPage("Disable ID Card") },
          ],
        },
        {
          label: "Class Schedule",
          children: [
            { label: "Create Classes", element: () => new PlaceholderPage("Create Classes") },
            { label: "Delete Classes", element: () => new PlaceholderPage("Delete Classes") },
            { label: "Add / Edit Classes", element: () => new PlaceholderPage("Add / Edit Classes") },
            { label: "Copy Class Schedule", element: () => new PlaceholderPage("Copy Class Schedule") },
            { label: "Change Class Data", element: () => new PlaceholderPage("Change Class Data") },
            { label: "Assign Rooms", element: () => new PlaceholderPage("Assign Rooms") },
            { label: "Scheduling Period", element: () => new PlaceholderPage("Scheduling Period") },
            { label: "Scheduling Wizard", element: () => new PlaceholderPage("Scheduling Wizard") },
            { label: "Merge Classes", element: () => new PlaceholderPage("Merge Classes") },
          ],
        },
        {
          label: "Pre-Enlistment",
          children: [
            { label: "Schedule", element: () => new PlaceholderPage("Schedule") },
            { label: "Automatic Promotion and Pre-enlistment", element: () => new PlaceholderPage("Automatic Promotion and Pre-enlistment") },
            { label: "Pre-enlist", element: () => new PlaceholderPage("Pre-enlist") },
            { label: "Pre-enlistment List", element: () => new PlaceholderPage("Pre-enlistment List") },
            { label: "Summary", element: () => new PlaceholderPage("Summary") },
          ],
        },
        {
          label: "Enrollment",
          children: [
            { label: "Enrollment Period", element: () => new PlaceholderPage("Enrollment Period") },
            { label: "Adding & Dropping Period", element: () => new PlaceholderPage("Adding & Dropping Period") },
            { label: "Enrollment", element: () => new PlaceholderPage("Enrollment") },
            { label: "Change Enrollment Data", element: () => new PlaceholderPage("Change Enrollment Data") },
            { label: "Approve Enrollment", element: () => new PlaceholderPage("Approve Enrollment") },
            { label: "Adding & Dropping Request", element: () => new PlaceholderPage("Adding & Dropping Request") },
            { label: "Transfer Section", element: () => new PlaceholderPage("Transfer Section") },
            { label: "Change Subject / Class", element: () => new PlaceholderPage("Change Subject / Class") },
            { label: "Validation", element: () => new PlaceholderPage("Validation") },
            { label: "Cancellation", element: () => new PlaceholderPage("Cancellation") },
            { label: "Cleanup", element: () => new PlaceholderPage("Cleanup") },
            { label: "Auto-Assign Section", element: () => new PlaceholderPage("Auto-Assign Section") },
            { label: "Initialize Curriculum", element: () => new PlaceholderPage("Initialize Curriculum") },
            { label: "Failed Subjects Payment", element: () => new PlaceholderPage("Failed Subjects Payment") },
            { label: "Set New/Old Student", element: () => new PlaceholderPage("Set New/Old Student") },
          ],
        },
        {
          label: "Grades",
          children: [
            { label: "Entry Schedule / Level", element: () => new PlaceholderPage("Entry Schedule / Level") },
            { label: "Entry Schedule / Instructor", element: () => new PlaceholderPage("Entry Schedule / Instructor") },
            { label: "Grading Sheet", element: () => new PlaceholderPage("Grading Sheet") },
            { label: "Input Grades", element: () => new PlaceholderPage("Input Grades") },
            { label: "Adviser Comments", element: () => new PlaceholderPage("Adviser Comments") },
            { label: "Modalities", element: () => new PlaceholderPage("Modalities") },
            { label: "Curriculum Evaluation", element: () => new PlaceholderPage("Curriculum Evaluation") },
            { label: "Credit Subjects", element: () => new PlaceholderPage("Credit Subjects") },
            {
              label: "Permanent Record",
              children: [
                { label: "Eligibility Record (ELEM)", element: () => new PlaceholderPage("Eligibility Record (ELEM)") },
                { label: "Eligibility Record (JHS)", element: () => new PlaceholderPage("Eligibility Record (JHS)") },
                { label: "Eligibility Record (SHS)", element: () => new PlaceholderPage("Eligibility Record (SHS)") },
                { label: "Scholastic Record", element: () => new PlaceholderPage("Scholastic Record") },
              ],
            },
            { label: "Authorize Input Grades", element: () => new PlaceholderPage("Authorize Input Grades") },
            { label: "Authorize Change Grade", element: () => new PlaceholderPage("Authorize Change Grade") },
            {
              label: "Attendance",
              children: [
                { label: "Class Attendance", element: () => new PlaceholderPage("Class Attendance") },
                { label: "Section Attedance", element: () => new PlaceholderPage("Section Attedance") },
                { label: "Override Totals", element: () => new PlaceholderPage("Override Totals") },
                { label: "Override Attendance", element: () => new PlaceholderPage("Override Attendance") },
              ],
            },
            {
              label: "Utilities",
              children: [
                { label: "Fix Missing Subjects", element: () => new PlaceholderPage("Fix Missing Subjects") },
                { label: "Post Enrolled Subjects", element: () => new PlaceholderPage("Post Enrolled Subjects") },
                { label: "Zero Final Grades", element: () => new PlaceholderPage("Zero Final Grades") },
                { label: "Remarks Term Grades", element: () => new PlaceholderPage("Remarks Term Grades") },
                { label: "Delete Unenrolled Grades", element: () => new PlaceholderPage("Delete Unenrolled Grades") },
                { label: "Insert / Recompute Parent Subject", element: () => new PlaceholderPage("Insert / Recompute Parent Subject") },
                { label: "Transmute Score", element: () => new PlaceholderPage("Transmute Score") },
              ],
            },
          ],
        },
        {
          label: "Learning Management",
          children: [
            { label: "Learning Period", element: () => new PlaceholderPage("Learning Period") },
            { label: "Schedule Online Tasks", element: () => new PlaceholderPage("Schedule Online Tasks") },
            { label: "My Online Tasks", element: () => new PlaceholderPage("My Online Tasks") },
          ],
        },
        {
          label: "Student Accounts",
          children: [
            { label: "Assessment Period", element: () => new PlaceholderPage("Assessment Period") },
            { label: "Cancellation Schedule", element: () => new PlaceholderPage("Cancellation Schedule") },
            { label: "Assessment", element: () => new PlaceholderPage("Assessment") },
            { label: "Assess Lock / Unlock", element: () => new PlaceholderPage("Assess Lock / Unlock") },
            { label: "Reprocess Assessments", element: () => new PlaceholderPage("Reprocess Assessments") },
            { label: "Student Ledger", element: () => new PlaceholderPage("Student Ledger") },
            { label: "Promisorry Notes", element: () => new PlaceholderPage("Promisorry Notes") },
            { label: "Individual Adjustment", element: () => new PlaceholderPage("Individual Adjustment") },
            { label: "Group Adjustment", element: () => new PlaceholderPage("Group Adjustment") },
            { label: "Recompute Duplicate Assess Nos", element: () => new PlaceholderPage("Recompute Duplicate Assess Nos") },
            { label: "Merge Duplicate Assess Nos", element: () => new PlaceholderPage("Merge Duplicate Assess Nos") },
            { label: "Fix Duplicate Adjust Nos", element: () => new PlaceholderPage("Fix Duplicate Adjust Nos") },
            { label: "Fix Adjust Nos Gap", element: () => new PlaceholderPage("Fix Adjust Nos Gap") },
            { label: "Remove Assess Adjustments", element: () => new PlaceholderPage("Remove Assess Adjustments") },
          ],
        },
        {
          label: "Payments",
          children: [
            { label: "Official Receipts", element: () => new PlaceholderPage("Official Receipts") },
            { label: "Acknowledgement Receipts", element: () => new PlaceholderPage("Acknowledgement Receipts") },
            { label: "Cashier", element: () => new PlaceholderPage("Cashier") },
            { label: "Credit Memo", element: () => new PlaceholderPage("Credit Memo") },
            { label: "Cancellation", element: () => new PlaceholderPage("Cancellation") },
            { label: "DragonPay Payments", element: () => new PlaceholderPage("DragonPay Payments") },
            { label: "Express Payments", element: () => new PlaceholderPage("Express Payments") },
            { label: "Deposits", element: () => new PlaceholderPage("Deposits") },
            { label: "Period Term Invoices", element: () => new PlaceholderPage("Period Term Invoices") },
            { label: "Repost Official Receipts", element: () => new PlaceholderPage("Repost Official Receipts") },
            { label: "Repost Acknowledgement Receipts", element: () => new PlaceholderPage("Repost Acknowledgement Receipts") },
          ],
        },
        {
          label: "Discounts / Scholarships",
          children: [
            { label: "Grantees", element: () => new PlaceholderPage("Grantees") },
            { label: "Exclusions", element: () => new PlaceholderPage("Exclusions") },
          ],
        },
        {
          label: "Disburstment",
          children: [
            { label: "Voucher Payable", element: () => new PlaceholderPage("Voucher Payable") },
            { label: "Cash Voucher", element: () => new PlaceholderPage("Cash Voucher") },
            { label: "Check Voucher", element: () => new PlaceholderPage("Check Voucher") },
            { label: "Cancel Check", element: () => new PlaceholderPage("Cancel Check") },
            { label: "Issue Check", element: () => new PlaceholderPage("Issue Check") },
            { label: "Encash Check", element: () => new PlaceholderPage("Encash Check") },
          ],
        },
        {
          label: "Accounting",
          children: [
            { label: "Journal Entry Voucher", element: () => new PlaceholderPage("Journal Entry Voucher") },
          ],
        },
        {
          label: "Teacher Evaluation",
          children: [
            { label: "Forms", element: () => new PlaceholderPage("Forms") },
            { label: "Questions", element: () => new PlaceholderPage("Questions") },
            { label: "Schedule", element: () => new PlaceholderPage("Schedule") },
          ],
        },
        {
          label: "Student Clearance",
          children: [
            { label: "Input", element: () => new PlaceholderPage("Input") },
            { label: "Print", element: () => new PlaceholderPage("Print") },
            { label: "Listing", element: () => new PlaceholderPage("Listing") },
          ],
        },
        {
          label: "Others",
          children: [
            { label: "Send Email", element: () => new PlaceholderPage("Send Email") },
            { label: "Text / Email Blast", element: () => new PlaceholderPage("Text / Email Blast") },
            { label: "Notify (Open Resource)", element: () => new PlaceholderPage("Notify (Open Resource)") },
            { label: "Notify (Show Amount Due)", element: () => new PlaceholderPage("Notify (Show Amount Due)") },
            { label: "Notify (Show Clearance Items)", element: () => new PlaceholderPage("Notify (Show Clearance Items)") },
            { label: "Notify (Show Teacher Evaluation)", element: () => new PlaceholderPage("Notify (Show Teacher Evaluation)") },
          ],
        },
      ],
    },
    {
      label: "Reports",
      children: [
        {
          label: "Registrar",
          children: [
            { label: "Enrollment List", element: () => new PlaceholderPage("Enrollment List") },
            { label: "Enrollment List (UNIFAST)", element: () => new PlaceholderPage("Enrollment List (UNIFAST)") },
            { label: "Enrollment List (CHED)", element: () => new PlaceholderPage("Enrollment List (CHED)") },
            { label: "Discontinued List", element: () => new PlaceholderPage("Discontinued List") },
            { label: "WebMail Accounts List", element: () => new PlaceholderPage("WebMail Accounts List") },
            { label: "Class Offerings", element: () => new PlaceholderPage("Class Offerings") },
            { label: "Weekly Schedules", element: () => new PlaceholderPage("Weekly Schedules") },
            { label: "Advice to Start Classes", element: () => new PlaceholderPage("Advice to Start Classes") },
            { label: "Instructor Load", element: () => new PlaceholderPage("Instructor Load") },
            { label: "Enrolled Subjects", element: () => new PlaceholderPage("Enrolled Subjects") },
            { label: "Unsubmitted Documents", element: () => new PlaceholderPage("Unsubmitted Documents") },
            {
              label: "Classes",
              children: [
                { label: "Class List / Instructor", element: () => new PlaceholderPage("Class List / Instructor") },
                { label: "Class List / Section", element: () => new PlaceholderPage("Class List / Section") },
                { label: "Class List / Subjects", element: () => new PlaceholderPage("Class List / Subjects") },
                { label: "Class List / Code", element: () => new PlaceholderPage("Class List / Code") },
                { label: "Class Attendance", element: () => new PlaceholderPage("Class Attendance") },
                { label: "Class Absences", element: () => new PlaceholderPage("Class Absences") },
              ],
            },
            {
              label: "Summary",
              children: [
                { label: "Enrollment Summary (Reserved / Confirmed)", element: () => new PlaceholderPage("Enrollment Summary (Reserved / Confirmed)") },
                { label: "Enrollment Summary (New / Old)", element: () => new PlaceholderPage("Enrollment Summary (New / Old)") },
                { label: "Enrollment Summary (Gender)", element: () => new PlaceholderPage("Enrollment Summary (Gender)") },
                { label: "Mobile Carrier Summary", element: () => new PlaceholderPage("Mobile Carrier Summary") },
              ],
            },
            {
              label: "Grades",
              children: [
                { label: "Term Grades (Match Curriculum)", element: () => new PlaceholderPage("Term Grades (Match Curriculum)") },
                { label: "Term Grades (Ignore Curriculum)", element: () => new PlaceholderPage("Term Grades (Ignore Curriculum)") },
                { label: "Final Grades (Match Curriculum)", element: () => new PlaceholderPage("Final Grades (Match Curriculum)") },
                { label: "Final Grades (Ignore Curriculum)", element: () => new PlaceholderPage("Final Grades (Ignore Curriculum)") },
                { label: "Periodic Average Grades (Match Curriculum)", element: () => new PlaceholderPage("Periodic Average Grades (Match Curriculum)") },
                { label: "Periodic Average Grades (Ignore Curriculum)", element: () => new PlaceholderPage("Periodic Average Grades (Ignore Curriculum)") },
                { label: "General Weighted Average (Match Curriculum)", element: () => new PlaceholderPage("General Weighted Average (Match Curriculum)") },
                { label: "General Weighted Average (Ignore Curriculum)", element: () => new PlaceholderPage("General Weighted Average (Ignore Curriculum)") },
                { label: "Individual Weighted Average (Match Curriculum)", element: () => new PlaceholderPage("Individual Weighted Average (Match Curriculum)") },
                { label: "Individual Weighted Average (Ignore Curriculum)", element: () => new PlaceholderPage("Individual Weighted Average (Ignore Curriculum)") },
                { label: "Grade Entry Monitor", element: () => new PlaceholderPage("Grade Entry Monitor") },
                { label: "Grade Entry Delays", element: () => new PlaceholderPage("Grade Entry Delays") },
                { label: "Periodic Grades Listing", element: () => new PlaceholderPage("Periodic Grades Listing") },
                { label: "Consolidated Grade Listing", element: () => new PlaceholderPage("Consolidated Grade Listing") },
                { label: "Consolidated Grade Listing (Instructor)", element: () => new PlaceholderPage("Consolidated Grade Listing (Instructor)") },
                { label: "Learners Proficieny Levels", element: () => new PlaceholderPage("Learners Proficieny Levels") },
                { label: "Test Items Analysis", element: () => new PlaceholderPage("Test Items Analysis") },
              ],
            },
            { label: "Report Card", element: () => new PlaceholderPage("Report Card") },
            { label: "Permanent Record", element: () => new PlaceholderPage("Permanent Record") },
          ],
        },
        {
          label: "Assessment",
          children: [
            { label: "Assessment Details", element: () => new PlaceholderPage("Assessment Details") },
            { label: "Assessment Summary", element: () => new PlaceholderPage("Assessment Summary") },
            { label: "Schedules of Fees", element: () => new PlaceholderPage("Schedules of Fees") },
          ],
        },
        {
          label: "Discount / Scholarship",
          children: [
            { label: "List of Grantees", element: () => new PlaceholderPage("List of Grantees") },
            { label: "List of Grantees (Personal)", element: () => new PlaceholderPage("List of Grantees (Personal)") },
            { label: "Enrollment List (UNIFAST)", element: () => new PlaceholderPage("Enrollment List (UNIFAST)") },
          ],
        },
        {
          label: "Student Ledger",
          children: [
            { label: "Statement of Accounts", element: () => new PlaceholderPage("Statement of Accounts") },
            { label: "Amount Dues / As Of", element: () => new PlaceholderPage("Amount Dues / As Of") },
            { label: "Amount Dues / Payment Sched", element: () => new PlaceholderPage("Amount Dues / Payment Sched") },
            { label: "Examination Permit", element: () => new PlaceholderPage("Examination Permit") },
            { label: "Summary of Accounts", element: () => new PlaceholderPage("Summary of Accounts") },
            { label: "Student Ledger Fees", element: () => new PlaceholderPage("Student Ledger Fees") },
            { label: "Account Receivables - Enrollment", element: () => new PlaceholderPage("Account Receivables - Enrollment") },
            { label: "Masterlist of Receivables", element: () => new PlaceholderPage("Masterlist of Receivables") },
            { label: "Aging of Receivables", element: () => new PlaceholderPage("Aging of Receivables") },
            { label: "Promisorry Notes", element: () => new PlaceholderPage("Promisorry Notes") },
            { label: "Individual Adjustments", element: () => new PlaceholderPage("Individual Adjustments") },
          ],
        },
        {
          label: "Collections",
          children: [
            { label: "Daily Collection Report", element: () => new PlaceholderPage("Daily Collection Report") },
            {
              label: "Collection Listing",
              children: [
                { label: "Official Receipts Listing", element: () => new PlaceholderPage("Official Receipts Listing") },
                { label: "Acknowledgement Receipts Listing", element: () => new PlaceholderPage("Acknowledgement Receipts Listing") },
                { label: "Service Invoices Listing", element: () => new PlaceholderPage("Service Invoices Listing") },
                { label: "Credit Memos Listing", element: () => new PlaceholderPage("Credit Memos Listing") },
              ],
            },
            {
              label: "Collection Details",
              children: [
                { label: "Official Receipts Details", element: () => new PlaceholderPage("Official Receipts Details") },
                { label: "Acknowledgement Receipts Details", element: () => new PlaceholderPage("Acknowledgement Receipts Details") },
                { label: "Service Invoices Details", element: () => new PlaceholderPage("Service Invoices Details") },
                { label: "Credit Memos Details", element: () => new PlaceholderPage("Credit Memos Details") },
              ],
            },
            {
              label: "Collection Summary",
              children: [
                { label: "Summary of Official Receipts", element: () => new PlaceholderPage("Summary of Official Receipts") },
                { label: "Summary of Acknowledgement Receipts", element: () => new PlaceholderPage("Summary of Acknowledgement Receipts") },
                { label: "Summary of Service Invoices", element: () => new PlaceholderPage("Summary of Service Invoices") },
                { label: "Summary of Credit Memos", element: () => new PlaceholderPage("Summary of Credit Memos") },
              ],
            },
            { label: "Cash Receipts Journal", element: () => new PlaceholderPage("Cash Receipts Journal") },
          ],
        },
        {
          label: "Disburstment",
          children: [
            { label: "Check Register", element: () => new PlaceholderPage("Check Register") },
            { label: "Check Disburstment Journal", element: () => new PlaceholderPage("Check Disburstment Journal") },
          ],
        },
        {
          label: "Accounting",
          children: [
            { label: "Journal Entries", element: () => new PlaceholderPage("Journal Entries") },
            { label: "General Ledger", element: () => new PlaceholderPage("General Ledger") },
            { label: "Consolidated General Ledger", element: () => new PlaceholderPage("Consolidated General Ledger") },
            { label: "Trial Balance", element: () => new PlaceholderPage("Trial Balance") },
            { label: "Income Statement", element: () => new PlaceholderPage("Income Statement") },
            { label: "Balance Sheet", element: () => new PlaceholderPage("Balance Sheet") },
            { label: "eWallet Transactions", element: () => new PlaceholderPage("eWallet Transactions") },
            { label: "Purchases Report", element: () => new PlaceholderPage("Purchases Report") },
          ],
        },
        {
          label: "Others",
          children: [
            { label: "Teacher Evaluation", element: () => new PlaceholderPage("Teacher Evaluation") },
            { label: "Teacher Evaluation Monitor", element: () => new PlaceholderPage("Teacher Evaluation Monitor") },
            { label: "Opened Resources", element: () => new PlaceholderPage("Opened Resources") },
            { label: "Accounts In/Out Report", element: () => new PlaceholderPage("Accounts In/Out Report") },
            { label: "Visitor In/Out Report", element: () => new PlaceholderPage("Visitor In/Out Report") },
          ],
        },
      ],
    },
    {
      label: "Tools",
      children: [
        {
          label: "Download Backup",
          children: [
            { label: "Primary", element: () => new PlaceholderPage("Primary") },
            { label: "Files", element: () => new PlaceholderPage("Files") },
          ],
        },
        {
          label: "Check and Repair",
          children: [
            { label: "Primary", element: () => new PlaceholderPage("Primary") },
            { label: "Files", element: () => new PlaceholderPage("Files") },
          ],
        },
        { label: "Rebuild LMS Cache", element: () => new PlaceholderPage("Rebuild LMS Cache") },
        { label: "Usage Summary", element: () => new PlaceholderPage("Usage Summary") },
        { label: "Activity Log", element: () => new PlaceholderPage("Activity Log") },
        { label: "Default Period", element: () => new PlaceholderPage("Default Period") },
        { label: "Options", element: () => new PlaceholderPage("Options") },
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