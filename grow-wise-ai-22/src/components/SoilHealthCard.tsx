import { motion } from "framer-motion";
import { Droplets, Leaf, FlaskConical } from "lucide-react";

const metrics = [
  { label: "pH အဆင့်", value: "၆.၅", status: "အကောင်းဆုံး", icon: FlaskConical, percent: 75, color: "bg-success" },
  { label: "စိုထိုင်းဆ", value: "၄၂%", status: "ကောင်းသည်", icon: Droplets, percent: 42, color: "bg-info" },
  { label: "နိုက်ထရိုဂျင်", value: "အလယ်အလတ်", status: "ယူရီးယား ထည့်ပါ", icon: Leaf, percent: 55, color: "bg-warning" },
];

const SoilHealthCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl bg-card p-6 shadow-card"
    >
      <h3 className="text-lg font-bold text-foreground mb-1">🌱 မြေဆီလွှာ ကျန်းမာရေး</h3>
      <p className="text-sm text-muted-foreground mb-4">နောက်ဆုံး စစ်ဆေးခဲ့သည်: ၂ ရက်အရင်</p>

      <div className="space-y-4">
        {metrics.map((m) => (
          <div key={m.label} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <m.icon className="w-5 h-5 text-accent-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-foreground">{m.label}</span>
                <span className="text-sm font-bold text-foreground">{m.value}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${m.percent}%` }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className={`h-full rounded-full ${m.color}`}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{m.status}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default SoilHealthCard;
