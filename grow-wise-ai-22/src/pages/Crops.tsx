import { motion } from "framer-motion";
import { ArrowLeft, Plus, Sprout, TrendingUp, Droplets } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

const crops = [
  { name: "စပါး", stage: "ပွင့်ချိန်", health: 92, water: "ကောင်း", icon: "🌾", daysLeft: 45 },
  { name: "ပဲတီစိမ်း", stage: "အပင်ကြီးချိန်", health: 85, water: "အလယ်အလတ်", icon: "🌿", daysLeft: 60 },
  { name: "ချည်မျှင်", stage: "စိုက်ပျိုးစ", health: 78, water: "ကောင်း", icon: "🌱", daysLeft: 90 },
  { name: "နှမ်း", stage: "ရိတ်သိမ်းချိန်", health: 95, water: "နည်း", icon: "🌻", daysLeft: 10 },
];

const Crops = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="gradient-hero px-5 pt-12 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="text-primary-foreground">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-primary-foreground">သီးနှံ စီမံခန့်ခွဲမှု</h1>
          </div>
          <button className="w-9 h-9 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
            <Plus className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>
      </div>

      <div className="px-5 mt-5 space-y-4">
        {crops.map((crop, i) => (
          <motion.div
            key={crop.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-2xl p-4 shadow-card border border-border"
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl">{crop.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">{crop.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground">
                    {crop.stage}
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs text-muted-foreground">ကျန်းမာရေး</span>
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full gradient-hero"
                        style={{ width: `${crop.health}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-foreground">{crop.health}%</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Droplets className="w-3.5 h-3.5 text-info" />
                    <span className="text-xs text-muted-foreground">ရေ</span>
                    <span className="text-xs font-medium text-foreground ml-auto">{crop.water}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Sprout className="w-3.5 h-3.5 text-secondary" />
                    <span className="text-xs text-muted-foreground">ရိတ်သိမ်းရန်</span>
                    <span className="text-xs font-medium text-foreground ml-auto">{crop.daysLeft} ရက်</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default Crops;
