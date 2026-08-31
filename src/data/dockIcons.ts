export interface DockIconData {
  id: string;
  label: string;
  href: string;
  icon: string;
}

// Note: "About" links to #hero, not #about — an existing quirk of the
// original site's nav, preserved as-is (not silently "fixed").
export const dockIcons: DockIconData[] = [
  { id: "about", label: "About", href: "#hero", icon: "/assets/img/ui/dock-notes.png" },
  { id: "projects", label: "Projects", href: "#work", icon: "/assets/img/ui/dock-photos.png" },
  { id: "services", label: "Services", href: "#services", icon: "/assets/img/ui/dock-finder.png" },
  { id: "contact", label: "Contact", href: "#contact", icon: "/assets/img/ui/dock-mail.png" }
];
