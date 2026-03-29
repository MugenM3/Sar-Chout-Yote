import { motion } from "framer-motion";
import { MapPin, Bell } from "lucide-react";
import WeatherCard from "@/components/WeatherCard";
import SoilHealthCard from "@/components/SoilHealthCard";
import CropStatusCard from "@/components/CropStatusCard";
import PestDetectionCard from "@/components/PestDetectionCard";
import AIAdvisoryCard from "@/components/AIAdvisoryCard";
import AlertsBanner from "@/components/AlertsBanner";
import BottomNav from "@/components/BottomNav";
import heroFarm from "@/assets/hero-farm.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroFarm} alt="Farmland" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-background" />
        </div>
        <div className="relative px-5 pt-12 pb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <div>
              <h1 className="text-2xl font-bold text-primary-foreground">မင်္ဂလာပါ 🌾</h1>
              <div className="flex items-center gap-1 text-primary-foreground/80 text-sm mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>မန္တလေး, မြန်မာ</span>
              </div>
            </div>
            <button className="w-10 h-10 rounded-xl bg-primary-foreground/20 backdrop-blur flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary-foreground" />
            </button>
          </motion.div>
        </div>
      </div>

      <div className="px-5 -mt-2 space-y-5">
        {/* Alerts */}
        <AlertsBanner />

        {/* Weather */}
        <WeatherCard />

        {/* Grid for Soil & Crops */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SoilHealthCard />
          <CropStatusCard />
        </div>

        {/* Pest Detection */}
        <PestDetectionCard />

        {/* AI Advisory */}
        <AIAdvisoryCard />
      </div>

      <BottomNav />
    </div>
  );
};

export default Index;
