import { Cloud, Droplets, Sun, Wind, Thermometer } from "lucide-react";
import { motion } from "framer-motion";

const forecast = [
  { day: "တနင်္လာ", icon: Sun, temp: 32, condition: "နေပူ" },
  { day: "အင်္ဂါ", icon: Cloud, temp: 28, condition: "တိမ်ထူ" },
  { day: "ဗုဒ္ဓဟူး", icon: Droplets, temp: 25, condition: "မိုးရွာ" },
  { day: "ကြာသပတေး", icon: Sun, temp: 30, condition: "နေပူ" },
  { day: "သောကြာ", icon: Cloud, temp: 27, condition: "တိမ်အနည်းငယ်" },
];

const WeatherCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl gradient-sky p-6 text-info-foreground shadow-elevated"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm opacity-80">လက်ရှိ ရာသီဥတု</p>
          <h3 className="text-3xl font-bold">၂၈°C</h3>
          <p className="text-sm opacity-80">တိမ်အနည်းငယ် • စိုထိုင်းဆ ၆၅%</p>
        </div>
        <Sun className="w-16 h-16 opacity-90" />
      </div>

      <div className="flex items-center gap-4 mb-4 text-sm opacity-80">
        <span className="flex items-center gap-1"><Wind className="w-4 h-4" /> ၁၂ ကီလို/နာရီ</span>
        <span className="flex items-center gap-1"><Droplets className="w-4 h-4" /> ၆၅%</span>
        <span className="flex items-center gap-1"><Thermometer className="w-4 h-4" /> ခံစားရ ၃၀°C</span>
      </div>

      <div className="grid grid-cols-5 gap-2 pt-4 border-t border-info-foreground/20">
        {forecast.map((f) => (
          <div key={f.day} className="text-center">
            <p className="text-xs opacity-70">{f.day}</p>
            <f.icon className="w-5 h-5 mx-auto my-1" />
            <p className="text-sm font-semibold">{f.temp}°</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default WeatherCard;
