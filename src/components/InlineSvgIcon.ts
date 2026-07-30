class InlineSvgIcon extends qx.ui.embed.Html {
  static iconsBaseUrl = "resource/app/icons/";

  // Shared across every instance — one fetch per icon name, ever.
  private static __cache = new Map<string, Promise<string>>();

  private __name: string;
  private __size: number;

  constructor(name: string, size = 20) {
    super("");
    this.__name = name;
    this.__size = size;

    this.set({
      width: size,
      height: size,
      minWidth: size,
      minHeight: size,
      selectable: false,
    });

    this.__loadAndRender();
  }

  setIcon(name: string) {
    this.__name = name;
    this.__loadAndRender();
  }

  setSize(size: number) {
    this.__size = size;
    this.setWidth(size);
    this.setHeight(size);
    this.setMinWidth(size);
    this.setMinHeight(size);
    // no re-fetch needed — just re-render with cached svg
    this.__renderFromCache();
  }

  private __fetchRaw(name: string): Promise<string> {
    let pending = InlineSvgIcon.__cache.get(name);
    if (!pending) {
      const url = InlineSvgIcon.iconsBaseUrl + name + ".svg";
      pending = fetch(url)
        .then((r) => r.text())
        .catch(() => "");
      InlineSvgIcon.__cache.set(name, pending);
    }
    return pending;
  }

  private __renderFromCache(): void {
    // re-derive from the (already resolved) cached promise without a new request
    InlineSvgIcon.__cache.get(this.__name)?.then((svg) => this.__applySvg(svg));
  }

  private __applySvg(svg: string): void {
    let out = svg;
    out = out.replace(/stroke="[^"]*"/g, `stroke="currentColor"`);
    out = out.replace(/<svg\b[^>]*>/, (tag) => {
      const cleanedTag = tag
        .replace(/\swidth="[^"]*"/g, "")
        .replace(/\sheight="[^"]*"/g, "")
        .replace(/\sstyle="[^"]*"/g, "");
      return cleanedTag.replace(
        "<svg",
        `<svg width="${this.__size}" height="${this.__size}" style="display:block;"`,
      );
    });
    this.setHtml(out);
    this.invalidateLayoutCache();
  }

  private __loadAndRender(): void {
    this.__fetchRaw(this.__name).then((svg) => this.__applySvg(svg));
  }
}