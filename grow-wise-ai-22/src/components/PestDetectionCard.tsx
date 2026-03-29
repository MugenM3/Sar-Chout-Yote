import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Upload, Search, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

const recentScans = [
  { crop: "ခရမတီ အရွက်", issue: "အစောပိုင်း ရောဂါ", confidence: 94, severity: "Medium" },
  { crop: "စပါးပင်", issue: "ပြဿနာ မတွေ့ပါ", confidence: 98, severity: "None" },
];

const PestDetectionCard = () => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-2xl bg-card p-6 shadow-card"
    >
      <h3 className="text-lg font-bold text-foreground mb-1">📷 ပိုးမွှား နှင့် ရောဂါ ရှာဖွေခြင်း</h3>
      <p className="text-sm text-muted-foreground mb-4">AI ဖြင့် သီးနှံ ကျန်းမာရေး စစ်ဆေးခြင်း</p>

      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          isDragging ? "border-primary bg-accent" : "border-border"
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={() => setIsDragging(false)}
      >
        <div className="w-14 h-14 rounded-2xl gradient-hero mx-auto mb-3 flex items-center justify-center">
          <Camera className="w-7 h-7 text-primary-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground mb-1">သီးနှံ ဓာတ်ပုံ တင်ပါ</p>
        <p className="text-xs text-muted-foreground mb-3">ဆွဲချပါ သို့မဟုတ် ရွေးချယ်ပါ</p>
        <div className="flex gap-2 justify-center">
          <Button size="sm" className="gradient-hero text-primary-foreground border-0">
            <Upload className="w-4 h-4 mr-1" /> တင်ပါ
          </Button>
          <Button size="sm" variant="outline">
            <Camera className="w-4 h-4 mr-1" /> ကင်မရာ
          </Button>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">မကြာမီက စစ်ဆေးမှုများ</p>
        {recentScans.map((scan, i) => (
          <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              scan.severity === "None" ? "bg-success/15" : "bg-warning/15"
            }`}>
              {scan.severity === "None"
                ? <Search className="w-4 h-4 text-success" />
                : <ShieldAlert className="w-4 h-4 text-warning" />
              }
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{scan.issue}</p>
              <p className="text-xs text-muted-foreground">{scan.crop} • {scan.confidence}% ယုံကြည်မှု</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default PestDetectionCard;
