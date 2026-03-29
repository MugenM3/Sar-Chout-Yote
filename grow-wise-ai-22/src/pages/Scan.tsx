import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Camera, Upload, History, AlertTriangle, CheckCircle, Loader2, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";
import { useToast } from "@/hooks/use-toast";

interface PredictionResult {
  disease: string;
  affected_crop: string;
  confidence: number;
  status: string;
  symptoms: string;
  solution: string;
  prevention: string;
  severity: string;
}

const scanHistory = [
  { date: "၂၀၂၆ မတ် ၂၅", crop: "စပါး", result: "ရွက်ညှိုး ရောဂါ", severity: "high", confidence: 94 },
  { date: "၂၀၂၆ မတ် ၂၀", crop: "ပဲတီစိမ်း", result: "ကျန်းမာသည်", severity: "low", confidence: 98 },
  { date: "၂၀၂၆ မတ် ၁၅", crop: "ချည်မျှင်", result: "ပိုးမွှား တွေ့ရှိ", severity: "medium", confidence: 87 },
];

const Scan = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState<"scan" | "history">("scan");
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = async (file: File) => {
    // Show preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setResult(null);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://192.168.1.23:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Prediction failed");
      }

      const data = await response.json();
      setResult(data);
      toast({
        title: "စစ်ဆေးမှု ပြီးဆုံးပါပြီ",
        description: `${data.disease} ဖြစ်နိုင်ခြေရှိပါသည်။`,
      });
    } catch (error) {
      console.error("Error predicting:", error);
      toast({
        variant: "destructive",
        title: "အမှားအယွင်း",
        description: "AI စာဗာနှင့် ချိတ်ဆက်၍မရပါ။ backend အဖွင့်အပိတ် ပြန်စစ်ပါ။",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="gradient-hero px-5 pt-12 pb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="text-primary-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-primary-foreground">သီးနှံ စကင်ဖတ်ရန်</h1>
        </div>
      </div>

      <div className="px-5 mt-5">
        {/* Tabs */}
        <div className="flex bg-muted rounded-xl p-1 mb-5">
          <button
            onClick={() => setActiveTab("scan")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "scan" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            စကင်ဖတ်ရန်
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "history" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            မှတ်တမ်း
          </button>
        </div>

        {activeTab === "scan" ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
            
            <div className="bg-card rounded-2xl border-2 border-dashed border-border p-6 flex flex-col items-center text-center">
              {previewUrl ? (
                <div className="relative w-full aspect-square max-w-[200px] mb-4 rounded-xl overflow-hidden border border-border">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center mb-4">
                  <Camera className="w-10 h-10 text-primary" />
                </div>
              )}
              
              <h3 className="font-semibold text-foreground mb-1">
                {previewUrl ? "ဓာတ်ပုံ ရွေးချယ်ပြီးပါပြီ" : "သီးနှံ ဓာတ်ပုံ ရိုက်ပါ"}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                AI က ရောဂါနှင့် ပိုးမွှားများကို စစ်ဆေးပေးပါမည်
              </p>
              
              <div className="flex gap-3 w-full">
                <Button 
                  onClick={triggerUpload} 
                  disabled={isUploading}
                  className="flex-1 gradient-hero text-primary-foreground"
                >
                  <Camera className="w-4 h-4 mr-1" /> ဓာတ်ပုံရိုက်
                </Button>
                <Button 
                  variant="outline" 
                  onClick={triggerUpload}
                  disabled={isUploading}
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-1" /> ရွေးချယ်
                </Button>
              </div>
            </div>

            <AnimatePresence>
              {result && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-card rounded-2xl p-5 shadow-card border border-border">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${result.status.includes('Healthy') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {result.status.includes('Healthy') ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">ရလဒ်</p>
                          <h4 className="font-bold text-foreground">{result.disease}</h4>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">ယုံကြည်မှု</p>
                        <p className="font-bold text-primary">{Math.round(result.confidence)}%</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-accent/30 p-3 rounded-xl">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">သီးနှံ</p>
                        <p className="text-sm font-semibold">{result.affected_crop}</p>
                      </div>
                      <div className="bg-accent/30 p-3 rounded-xl">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">အခြေအနေ</p>
                        <p className={`text-sm font-semibold ${result.severity === 'High' ? 'text-destructive' : 'text-primary'}`}>{result.severity}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <Info className="w-4 h-4 text-primary" />
                          <h5 className="text-sm font-bold">ရောဂါ လက္ခဏာများ</h5>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed bg-muted/50 p-3 rounded-lg">
                          {result.symptoms}
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <h5 className="text-sm font-bold">ဖြေရှင်းရန် နည်းလမ်း</h5>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed bg-green-50/50 p-3 rounded-lg border border-green-100">
                          {result.solution}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!result && (
              <div className="bg-accent/50 rounded-xl p-4">
                <h4 className="text-sm font-medium text-accent-foreground mb-2">💡 အကြံပြုချက်</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• ရွက်ကို နီးနီးကပ်ကပ် ရိုက်ပါ</li>
                  <li>• အလင်းရောင် ကောင်းသောနေရာတွင် ရိုက်ပါ</li>
                  <li>• ရောဂါ လက္ခဏာ ရှိသော နေရာကို ဦးစားပေး ရိုက်ပါ</li>
                </ul>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {scanHistory.map((item, i) => (
              <div key={i} className="bg-card rounded-xl p-4 shadow-card border border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground">{item.crop}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.date}</p>
                  </div>
                  {item.severity === "low" ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertTriangle className={`w-5 h-5 ${item.severity === "high" ? "text-destructive" : "text-secondary"}`} />
                  )}
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className={`text-sm font-medium ${
                    item.severity === "low" ? "text-green-600" : item.severity === "high" ? "text-destructive" : "text-secondary"
                  }`}>
                    {item.result}
                  </span>
                  <span className="text-xs text-muted-foreground">ယုံကြည်မှု {item.confidence}%</span>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Scan;
