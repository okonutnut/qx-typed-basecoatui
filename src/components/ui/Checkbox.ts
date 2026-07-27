class BsCheckbox extends qx.ui.basic.Atom {
  static events = {
    changeValue: "qx.event.type.Data",
  };

  private __htmlEmbed: qx.ui.embed.Html;
  private __checked: boolean;
  private __disabled: boolean;
  private __inputEl: HTMLInputElement | null = null;

  constructor(checked = false, disabled = false) {
    super();

    this._setLayout(new qx.ui.layout.Grow());
    this.setAllowGrowX(true);
    this.setFocusable(true);

    this.__checked = checked;
    this.__disabled = disabled;

    this.__htmlEmbed = new qx.ui.embed.Html("");
    this.__htmlEmbed.setAllowGrowX(true);
    this.__render();
    this._add(this.__htmlEmbed);

    this.__htmlEmbed.addListenerOnce("appear", () => {
      const root = this.__htmlEmbed.getContentElement().getDomElement();
      this.__inputEl = root?.querySelector("input") ?? null;
      if (!this.__inputEl) return;

      this.__inputEl.addEventListener("change", () => {
        const next = this.__inputEl?.checked ?? false;
        this.__checked = next;
        this.fireDataEvent("changeValue", next);
      });
    });

    this.addListener("focusin", () => {
      this.__inputEl?.focus();
    });
  }

  // @ts-ignore
  _getContentHint(): qx.ui.layout.SizeHint {
    return { width: 24, height: 24 };
  }

  public isChecked(): boolean {
    return this.__inputEl?.checked ?? this.__checked;
  }

  public setChecked(value: boolean): this {
    this.__checked = value;
    if (this.__inputEl) this.__inputEl.checked = value;
    else this.__render();
    return this;
  }

  public setDisabled(value: boolean): this {
    this.__disabled = value;
    if (this.__inputEl) this.__inputEl.disabled = value;
    else this.__render();
    return this;
  }

  public onToggle(handler: (checked: boolean) => void): this {
    this.addListener("changeValue", (ev: qx.event.type.Data) => {
      handler((ev.getData() as boolean) ?? false);
    });
    return this;
  }

  private __render(): void {
    const checkedAttr = this.__checked ? "checked" : "";
    const disabledAttr = this.__disabled ? "disabled" : "";

    this.__htmlEmbed.setHtml(`
      <div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;">
        <input
          type="checkbox"
          class="input"
          ${checkedAttr}
          ${disabledAttr}
        />
      </div>
    `);
  }
}