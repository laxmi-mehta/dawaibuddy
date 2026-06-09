import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/prescriptions", label: "Prescriptions" },
  { to: "/medicines", label: "Medicines" },
  { to: "/interactions", label: "Interactions" },
  { to: "/reminders", label: "Reminders" },
  { to: "/assistant", label: "AI Assistant" },
];

export default function Sidebar() {
  return (
    <aside className="flex w-64 flex-col border-r bg-card px-4 py-6">
      <div className="mb-8 px-2">
        <span className="text-xl font-bold text-primary">DawaiBuddy</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              ].join(" ")
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
