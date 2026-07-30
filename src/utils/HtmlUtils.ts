/**
 * Shared HTML-escaping utilities. Previously duplicated (with tiny
 * inconsistencies) across ~15 components — BsInput, BsSelect, BsCombobox,
 * BsAvatar, BsSidebarAccount, BsLabel, BsSeparator, etc.
 */
class HtmlUtils {
  private static readonly ESCAPE_MAP: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  /** Escapes text for use inside HTML content or an attribute value. */
  static escape(value: string | null | undefined): string {
    return (value ?? "").replace(/[&<>"']/g, (ch) => HtmlUtils.ESCAPE_MAP[ch]);
  }

  /** Alias kept for call sites that previously used __escapeAttr specifically. */
  static escapeAttr(value: string | null | undefined): string {
    return HtmlUtils.escape(value);
  }
}