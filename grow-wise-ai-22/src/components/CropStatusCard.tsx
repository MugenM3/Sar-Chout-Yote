import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

const crops = [
  { name: "စပါး", stage: "ပန်းပွင့်ချိန်", health: 92, status: "healthy", daysLeft: 35 },
  { name: "ခရမတီ", stage: "အသီးသီးချိန်", health: 78, status: "warning", daysLeft: 20 },
  { name: "ဂျုံ", stage: "အပင်ပေါက်ချိန်", health: 95, status: "healthy", daysLeft: 90 },
];

const CropStatusCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-2xl bg-card p-6 shadow-card"
    >
      <h3 className="text-lg font-bold text-foreground mb-1">🌾 သီးနှံ အခြေအနေ</h3>
      <p className="text-sm text-muted-foreground mb-4">သီးနှံ ၃ မျိုး စိုက်ပျိုးဆဲ</p>

      <div className="space-y-3">
        {crops.map((crop) => (
          <div key={crop.name} className="p-3 rounded-xl bg-muted/50 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              crop.status === "healthy" ? "bg-success/15" : "bg-warning/15"
            }`}>
              {crop.status === "healthy" 
                ? <CheckCircle className="w-5 h-5 text-success" />
                : <AlertTriangle className="w-5 h-5 text-warning" />
              }
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{crop.name}</p>
              <p className="text-xs text-muted-foreground">{crop.stage} • ရိတ်သိမ်းရန် {crop.daysLeft} ရက်</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-success" />
                <span className="text-sm font-bold text-foreground">{crop.health}%</span>
              </div>
              <span className="text-xs text-muted-foreground">ကျန်းမာရေး</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default CropStatusCard;
