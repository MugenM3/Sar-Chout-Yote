import { motion } from "framer-motion";
import { AlertTriangle, CloudRain, Thermometer } from "lucide-react";

const alerts = [
  { icon: CloudRain, text: "ဗုဒ္ဓဟူးနေ့ မိုးသည်းထန်စွာ ရွာမည် — သီးနှံများ လုံခြုံအောင်ထားပါ", type: "warning" as const },
  { icon: Thermometer, text: "ယနေ့ည အပူချိန် ၁၅°C သို့ကျဆင်းမည်", type: "info" as const },
  { icon: AlertTriangle, text: "ဤအပတ် ခရမတီ ရောဂါဖြစ်နိုင်ခြေ မြင့်မားသည်", type: "destructive" as const },
];

const AlertsBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
    >
      {alerts.map((alert, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap text-sm font-medium shrink-0 ${
            alert.type === "warning"
              ? "bg-warning/15 text-warning"
              : alert.type === "destructive"
              ? "bg-destructive/15 text-destructive"
              : "bg-info/15 text-info"
          }`}
        >
          <alert.icon className="w-4 h-4 shrink-0" />
          {alert.text}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default AlertsBanner;
