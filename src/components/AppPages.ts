type RouteDefinition = {
  label: string;
  iconName?: string;
  element?: () => qx.ui.core.Widget;
  action?: () => void;
  disabled?: boolean;
  hidden?: boolean;
  accessCode?: string;
  children?: RouteDefinition[];
};

class AppPages {
  static ROUTE_DEFINITIONS: RouteDefinition[] = [
    { label: "Access Levels", iconName: "shield", accessCode: "AL", element: () => new CrudPage("AccessLevel") },
    { label: "Courses", iconName: "book", accessCode: "C", element: () => new CrudPage("Course") },
    { label: "Users", iconName: "users", accessCode: "U", element: () => new CrudPage("User") },
    { label: "Personal Profiles", iconName: "id-card", accessCode: "PP", element: () => new CrudPage("PersonalProfile") },
    { label: "Family Backgrounds", iconName: "user-round", accessCode: "FB", element: () => new CrudPage("FamilyBackground") },
    { label: "Admission Applications", iconName: "clipboard-list", accessCode: "AA", element: () => new CrudPage("AdmissionApplication") }
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
        accessCode: definition.accessCode,
        children: definition.children
          ? createItems(definition.children)
          : undefined,
      }));
    };

    return createItems(definitions);
  }

  static filterByAccessCode(items: SidebarItem[], accessCodes: string): SidebarItem[] {
    const codes = accessCodes.split(",").map((c) => c.trim()).filter(Boolean);
    const isAdmin = codes.indexOf("AL") !== -1;
    return items.map((item) => ({
      ...item,
      disabled: item.accessCode
        ? (codes.indexOf(item.accessCode) === -1 && !isAdmin)
        : item.disabled,
      children: item.children
        ? AppPages.filterByAccessCode(item.children, accessCodes)
        : undefined,
    }));
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