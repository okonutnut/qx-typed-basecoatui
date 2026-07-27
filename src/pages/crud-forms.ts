type FormControl = {
  getValues: () => Record<string, any>;
  setValues: (data: Record<string, any>) => void;
  reset: () => void;
  setReferenceData: (key: string, items: { value: string; label: string }[]) => void;
};

function __createFieldRow(container: qx.ui.container.Composite, label: string, input: qx.ui.core.Widget): void {
  const field = new qx.ui.container.Composite(new qx.ui.layout.VBox(4));
  field.setAllowGrowX(true);
  const lbl = new qx.ui.basic.Label(label);
  lbl.setTextColor("var(--foreground)");
  field.add(lbl);
  field.add(input);
  container.add(field);
}

function __buildEntrySubForm(prefix: string, container: qx.ui.container.Composite): { [key: string]: BsInputGroup } {
  const fields: { [key: string]: BsInputGroup } = {};
  const card = new BsCard();
  const inner = new qx.ui.container.Composite(new qx.ui.layout.VBox(8));
  inner.setPadding(8);

  const title = new qx.ui.basic.Label(prefix);
  title.setFont(
    // @ts-ignore
    new qx.bom.Font(14).set({ bold: true }),
  );
  title.setTextColor("var(--foreground)");
  inner.add(title);

  const names = ["lastName", "firstName", "middleName"];
  names.forEach((n) => {
    const f = new BsInputGroup(n.replace(/([A-Z])/g, " $1").trim(), `Enter ${n}`);
    fields[`${prefix}_${n}`] = f;
    inner.add(f);
  });

  const phone = new BsInputGroup("Phone", "Enter phone");
  fields[`${prefix}_phone`] = phone;
  inner.add(phone);

  const occupation = new BsInputGroup("Occupation", "Enter occupation");
  fields[`${prefix}_occupation`] = occupation;
  inner.add(occupation);

  const income = new BsInputGroup("Annual Income", "Enter annual income");
  fields[`${prefix}_anualIncome`] = income;
  inner.add(income);

  card.setContent(inner);
  container.add(card);
  return fields;
}

function buildAccessLevelForm(parent: qx.ui.container.Composite): FormControl {
  const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
  container.setPadding(8);
  container.setAllowGrowX(true);

  const codeField = new BsInputGroup("Code", "e.g. ADMIN");
  const codeInput = codeField.getInputWidget();
  codeInput.addListenerOnce("appear", () => {
    const rootEl = codeInput.getContentElement().getDomElement();
    if (!rootEl) return;
    const inputEl: HTMLInputElement | null = rootEl.querySelector("input");
    if (!inputEl) return;
    inputEl.addEventListener("blur", () => {
      const v = inputEl.value.toUpperCase();
      if (inputEl.value !== v) {
        inputEl.value = v;
        codeInput.setValue(v);
      }
    });
  });

  const codesLabel = new qx.ui.basic.Label("Access Codes");
  codesLabel.setTextColor("var(--foreground)");

  const codesText = new BsTextarea("", "Selected access codes", "", 3);
  codesText.addListenerOnce("appear", () => {
    qx.event.Timer.once(() => {
      const ta = (codesText as any).__textareaEl as HTMLTextAreaElement | null;
      if (ta) ta.readOnly = true;
    }, codesText, 50);
  });

  const codeLabels: Record<string, string> = {
    AL: "AL: Access Levels",
    C: "C: Courses",
    U: "U: Users",
    PP: "PP: Personal Profiles",
    FB: "FB: Family Backgrounds",
    AD: "AD: Admission Data",
    AA: "AA: Admission Applications",
  };
  const allCodes = Object.keys(codeLabels);
  const selectedCodes: string[] = [];

  const updateCombobox = () => {
    const available = allCodes.filter((c) => selectedCodes.indexOf(c) === -1);
    codesSelect.setOptions(available.map((c) => ({ value: c, label: codeLabels[c] })));
  };

  const codesSelect = new BsCombobox(
    allCodes.map((c) => ({ value: c, label: codeLabels[c] })),
    "Select page to add...",
  );
  codesSelect.onChange((value) => {
    if (!value) return;
    if (selectedCodes.indexOf(value) === -1) {
      selectedCodes.push(value);
      codesText.setValue(selectedCodes.join(", "));
      updateCombobox();
    }
  });

  container.add(codeField);
  container.add(codesLabel);
  container.add(codesText);
  container.add(codesSelect);

  parent.add(container, { flex: 1 });

  return {
    getValues: () => ({
      code: codeField.getValue(),
      name: selectedCodes.join(", "),
    }),
    setValues: (d) => {
      codeField.setValue(d.code ?? "");
      selectedCodes.length = 0;
      const codes = (d.name ?? "").split(",").map((c: string) => c.trim()).filter(Boolean);
      codes.forEach((c: string) => selectedCodes.push(c));
      codesText.setValue(selectedCodes.join(", "));
      updateCombobox();
    },
    reset: () => {
      codeField.setValue("");
      selectedCodes.length = 0;
      codesText.setValue("");
      updateCombobox();
    },
    setReferenceData: () => {},
  };
}

function buildCourseForm(parent: qx.ui.container.Composite): FormControl {
  const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
  container.setPadding(8);
  container.setAllowGrowX(true);

  const codeField = new BsInputGroup("Code", "e.g. BSCS");
  const nameField = new BsInputGroup("Name", "e.g. Bachelor of Science in Computer Science");

  container.add(codeField);
  container.add(nameField);

  parent.add(container, { flex: 1 });

  return {
    getValues: () => ({ code: codeField.getValue(), name: nameField.getValue() }),
    setValues: (d) => { codeField.setValue(d.code ?? ""); nameField.setValue(d.name ?? ""); },
    reset: () => { codeField.setValue(""); nameField.setValue(""); },
    setReferenceData: () => {},
  };
}

function buildUserForm(parent: qx.ui.container.Composite): FormControl {
  const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
  container.setPadding(8);
  container.setAllowGrowX(true);

  const codeField = new BsInputGroup("Code", "e.g. USR001");
  const nameField = new BsInputGroup("Name", "Full name");
  const passwordField = new BsInputGroup("Password", "Enter password", "", "input");
  passwordField.getInputWidget().setType("password");
  const emailField = new BsInputGroup("Email", "email@example.com");
  const dobField = new BsDateField();

  const accessLevelSelect = new BsCombobox([], "Select access level");

  container.add(codeField);
  container.add(nameField);
  container.add(passwordField);
  container.add(emailField);

  __createFieldRow(container, "Date of Birth", dobField);
  __createFieldRow(container, "Access Level", accessLevelSelect);

  parent.add(container, { flex: 1 });

  return {
    getValues: () => ({
      code: codeField.getValue(),
      name: nameField.getValue(),
      password: passwordField.getValue(),
      email: emailField.getValue(),
      dateOfBirth: dobField.getValue() ? (dobField.getValue() as Date).toISOString() : null,
      accessLevelId: accessLevelSelect.getValue(),
    }),
    setValues: (d) => {
      codeField.setValue(d.code ?? "");
      nameField.setValue(d.name ?? "");
      passwordField.setValue(d.password ?? "");
      emailField.setValue(d.email ?? "");
      if (d.dateOfBirth) dobField.setValue(new Date(d.dateOfBirth));
      const levelId = d.accessLevelId ?? d.accessLevel?.id;
      if (levelId) accessLevelSelect.setValue(levelId);
    },
    reset: () => {
      codeField.setValue(""); nameField.setValue(""); passwordField.setValue("");
      emailField.setValue(""); dobField.setValue(null); accessLevelSelect.setValue("");
    },
    setReferenceData: (key, items) => {
      if (key === "accessLevels") accessLevelSelect.setOptions(items);
    },
  };
}

function buildPersonalProfileForm(parent: qx.ui.container.Composite): FormControl {
  const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
  container.setPadding(8);
  container.setAllowGrowX(true);

  const codeField = new BsInputGroup("Code", "e.g. PROF001");
  const nameField = new BsInputGroup("Name", "Full name (pre-computed)");
  const firstName = new BsInputGroup("First Name", "First name");
  const middleName = new BsInputGroup("Middle Name", "Middle name");
  const lastName = new BsInputGroup("Last Name", "Last name");
  const extName = new BsInputGroup("Extension Name", "e.g. Jr., III");
  const emailField = new BsInputGroup("Email", "email@example.com");
  const phoneField = new BsInputGroup("Phone", "Contact number");
  const sexSelect = new BsSelect(["Male", "Female"], "select");

  const dobField = new BsDateField();
  const birthPlace = new BsInputGroup("Birth Place", "Place of birth");
  const municipality = new BsInputGroup("Municipality", "Municipality/City");
  const barangay = new BsInputGroup("Barangay", "Barangay");
  const street = new BsInputGroup("Street", "Street address");
  const citizenship = new BsInputGroup("Citizenship", "e.g. Filipino");
  const addrEmail = new BsInputGroup("Address Email", "Alternate email");
  const addrPhone = new BsInputGroup("Address Phone", "Alternate phone");

  container.add(codeField);
  container.add(nameField);
  container.add(firstName);
  container.add(middleName);
  container.add(lastName);
  container.add(extName);
  container.add(emailField);
  container.add(phoneField);

  __createFieldRow(container, "Sex", sexSelect);
  __createFieldRow(container, "Date of Birth", dobField);

  container.add(birthPlace);
  container.add(municipality);
  container.add(barangay);
  container.add(street);
  container.add(citizenship);
  container.add(addrEmail);
  container.add(addrPhone);

  parent.add(container, { flex: 1 });

  return {
    getValues: () => ({
      code: codeField.getValue(),
      name: nameField.getValue(),
      firstName: firstName.getValue(),
      middleName: middleName.getValue(),
      lastName: lastName.getValue(),
      extentionName: extName.getValue(),
      email: emailField.getValue(),
      phone: phoneField.getValue(),
      sex: sexSelect.getSelectedValue(),
      dateOfBirth: dobField.getValue() ? (dobField.getValue() as Date).toISOString() : null,
      birthPlace: birthPlace.getValue(),
      municipality: municipality.getValue(),
      barangay: barangay.getValue(),
      street: street.getValue(),
      citizenship: citizenship.getValue(),
      addressEmail: addrEmail.getValue(),
      addressPhone: addrPhone.getValue(),
    }),
    setValues: (d) => {
      const set = (f: BsInputGroup, v: string) => f.setValue(v ?? "");
      set(codeField, d.code); set(nameField, d.name); set(firstName, d.firstName);
      set(middleName, d.middleName); set(lastName, d.lastName); set(extName, d.extentionName);
      set(emailField, d.email); set(phoneField, d.phone);
      if (d.sex) sexSelect.setSelectedByLabel(d.sex);
      if (d.dateOfBirth) dobField.setValue(new Date(d.dateOfBirth));
      set(birthPlace, d.birthPlace); set(municipality, d.municipality);
      set(barangay, d.barangay); set(street, d.street);
      set(citizenship, d.citizenship); set(addrEmail, d.addressEmail);
      set(addrPhone, d.addressPhone);
    },
    reset: () => {
      const fields = [codeField, nameField, firstName, middleName, lastName, extName,
        emailField, phoneField, birthPlace, municipality, barangay, street,
        citizenship, addrEmail, addrPhone];
      fields.forEach((f) => f.setValue(""));
      sexSelect.resetSelection();
      dobField.setValue(null);
    },
    setReferenceData: () => {},
  };
}

function buildFamilyBackgroundForm(parent: qx.ui.container.Composite): FormControl {
  const scroll = new qx.ui.container.Scroll();
  scroll.setAllowGrowY(true);

  const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
  container.setPadding(8);
  container.setAllowGrowX(true);

  const codeField = new BsInputGroup("Code", "e.g. FAM001");
  const nameField = new BsInputGroup("Name", "Family name identifier");

  container.add(codeField);
  container.add(nameField);

  const fatherFields = __buildEntrySubForm("Father", container);
  const motherFields = __buildEntrySubForm("Mother", container);
  const guardianFields = __buildEntrySubForm("Guardian", container);

  scroll.add(container);
  parent.add(scroll, { flex: 1 });

  const collectEntry = (fields: { [key: string]: BsInputGroup }, prefix: string) => ({
    lastName: fields[`${prefix}_lastName`].getValue(),
    firstName: fields[`${prefix}_firstName`].getValue(),
    middleName: fields[`${prefix}_middleName`].getValue(),
    phone: fields[`${prefix}_phone`].getValue(),
    occupation: fields[`${prefix}_occupation`].getValue(),
    anualIncome: fields[`${prefix}_anualIncome`].getValue(),
  });

  const setEntry = (fields: { [key: string]: BsInputGroup }, prefix: string, data: any) => {
    if (!data) return;
    fields[`${prefix}_lastName`].setValue(data.lastName ?? "");
    fields[`${prefix}_firstName`].setValue(data.firstName ?? "");
    fields[`${prefix}_middleName`].setValue(data.middleName ?? "");
    fields[`${prefix}_phone`].setValue(data.phone ?? "");
    fields[`${prefix}_occupation`].setValue(data.occupation ?? "");
    fields[`${prefix}_anualIncome`].setValue(data.anualIncome ?? "");
  };

  const resetEntry = (fields: { [key: string]: BsInputGroup }, prefix: string) => {
    const keys = ["lastName", "firstName", "middleName", "phone", "occupation", "anualIncome"];
    keys.forEach((k) => fields[`${prefix}_${k}`].setValue(""));
  };

  return {
    getValues: () => ({
      code: codeField.getValue(),
      name: nameField.getValue(),
      father: collectEntry(fatherFields, "Father"),
      mother: collectEntry(motherFields, "Mother"),
      guardian: collectEntry(guardianFields, "Guardian"),
    }),
    setValues: (d) => {
      codeField.setValue(d.code ?? "");
      nameField.setValue(d.name ?? "");
      setEntry(fatherFields, "Father", d.father);
      setEntry(motherFields, "Mother", d.mother);
      setEntry(guardianFields, "Guardian", d.guardian);
    },
    reset: () => {
      codeField.setValue("");
      nameField.setValue("");
      resetEntry(fatherFields, "Father");
      resetEntry(motherFields, "Mother");
      resetEntry(guardianFields, "Guardian");
    },
    setReferenceData: () => {},
  };
}

function generateGuid(): string {
  const hex = (): string => ((Math.random() * 16) | 0).toString(16);
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function buildAdmissionDataForm(parent: qx.ui.container.Composite): FormControl {
  const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
  container.setPaddingBottom(8);
  container.setAllowGrowX(true);

  const codeField = new BsInputGroup("Control Number");
  const nameField = new BsInputGroup("Name");
  const lrnField = new BsInputGroup("LRN");
  const levelSelect = new BsSelect(["College", "Senior High", "Junior High"], "select");
  const typeSelect = new BsSelect(["New", "Transferee", "Returning"], "select");
  const yearLevelField = new BsInputGroup("Year Level");
  yearLevelField.getInputWidget().setType("number");
  const courseSelect = new BsCombobox([], "Select course");

  const newApplicationRow = new qx.ui.container.Composite(new qx.ui.layout.HBox(12).set({ alignY: "middle" }));
  newApplicationRow.setAllowGrowX(true);

  const newApplicationLabel = new qx.ui.basic.Label("New Application");
  newApplicationLabel.setTextColor("var(--foreground)");
  const newApplicationCheckbox = new BsCheckbox();

  newApplicationRow.add(newApplicationCheckbox);
  newApplicationRow.add(newApplicationLabel, { flex: 1 });
  container.add(newApplicationRow);

  newApplicationCheckbox.onToggle(function (checked: boolean) {
    if (checked) {
      const guid = generateGuid();
      codeField.setValue(guid);
    }
  });

  container.add(codeField);
  container.add(nameField);
  container.add(lrnField);

  __createFieldRow(container, "Level", levelSelect);
  __createFieldRow(container, "Type", typeSelect);
  container.add(yearLevelField);
  __createFieldRow(container, "Course", courseSelect);

  parent.add(container, { flex: 1 });

  return {
    getValues: () => ({
      code: codeField.getValue(),
      name: nameField.getValue(),
      lrn: lrnField.getValue(),
      level: levelSelect.getSelectedValue(),
      type: typeSelect.getSelectedValue(),
      yearLevel: parseInt(yearLevelField.getValue(), 10) || 0,
      courseId: courseSelect.getValue(),
    }),
    setValues: (d) => {
      codeField.setValue(d.code ?? "");
      nameField.setValue(d.name ?? "");
      lrnField.setValue(d.lrn ?? "");
      if (d.level) levelSelect.setSelectedByLabel(d.level);
      if (d.type) typeSelect.setSelectedByLabel(d.type);
      yearLevelField.setValue(d.yearLevel?.toString() ?? "");
      const cId = d.courseId ?? d.course?.id;
      if (cId) courseSelect.setValue(cId);
    },
    reset: () => {
      codeField.setValue(""); nameField.setValue(""); lrnField.setValue("");
      levelSelect.resetSelection(); typeSelect.resetSelection();
      yearLevelField.setValue(""); courseSelect.setValue("");
    },
    setReferenceData: (key, items) => {
      if (key === "courses") courseSelect.setOptions(items);
    },
  };
}

function buildAdmissionApplicationForm(parent: qx.ui.container.Composite): FormControl {
  const container = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
  container.setPadding(8);
  container.setAllowGrowX(true);

  const codeField = new BsInputGroup("Code");
  const nameField = new BsInputGroup("Name");

  container.add(codeField);
  container.add(nameField);

  parent.add(container, { flex: 1 });

  return {
    getValues: () => ({ code: codeField.getValue(), name: nameField.getValue() }),
    setValues: (d) => { codeField.setValue(d.code ?? ""); nameField.setValue(d.name ?? ""); },
    reset: () => { codeField.setValue(""); nameField.setValue(""); },
    setReferenceData: () => {},
  };
}

function buildFormByEntity(entityType: string, parent: qx.ui.container.Composite): FormControl {
  switch (entityType) {
    case "AccessLevel": return buildAccessLevelForm(parent);
    case "Course": return buildCourseForm(parent);
    case "User": return buildUserForm(parent);
    case "PersonalProfile": return buildPersonalProfileForm(parent);
    case "FamilyBackground": return buildFamilyBackgroundForm(parent);
    case "AdmissionData": return buildAdmissionDataForm(parent);
    case "AdmissionApplication": return buildAdmissionApplicationForm(parent);
    default: throw new Error(`Unknown entity: ${entityType}`);
  }
}
