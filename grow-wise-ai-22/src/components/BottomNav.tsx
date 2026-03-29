import { Home, Leaf, Camera, Bot, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const tabs = [
  { icon: Home, label: "ပင်မ", path: "/" },
  { icon: Leaf, label: "သီးနှံ", path: "/crops" },
  { icon: Camera, label: "စကင်", path: "/scan" },
  { icon: Bot, label: "အကြံပေး", path: "/advisor" },
  { icon: User, label: "ပရိုဖိုင်", path: "/profile" },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border px-2 pb-safe z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map((tab, i) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.label}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {i === 2 ? (
                <div className="w-12 h-12 -mt-6 rounded-2xl gradient-hero flex items-center justify-center shadow-elevated">
                  <tab.icon className="w-6 h-6 text-primary-foreground" />
                </div>
              ) : (
                <tab.icon className="w-5 h-5" />
              )}
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
