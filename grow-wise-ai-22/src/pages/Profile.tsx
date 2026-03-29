import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, MapPin, Phone, Wheat, ArrowLeft, LogOut, Save } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

const Profile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    display_name: "",
    farm_location: "",
    farm_size: "",
    phone: "",
    primary_crops: [] as string[],
  });
  const [cropsInput, setCropsInput] = useState("");

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user!.id)
      .single();

    if (data && !error) {
      setProfile({
        display_name: data.display_name || "",
        farm_location: data.farm_location || "",
        farm_size: data.farm_size || "",
        phone: data.phone || "",
        primary_crops: data.primary_crops || [],
      });
      setCropsInput((data.primary_crops || []).join(", "));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: profile.display_name,
        farm_location: profile.farm_location,
        farm_size: profile.farm_size,
        phone: profile.phone,
        primary_crops: cropsInput.split(",").map((s) => s.trim()).filter(Boolean),
      })
      .eq("user_id", user!.id);

    if (error) {
      toast({ title: "အမှား", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "အောင်မြင်ပါသည်", description: "ပရိုဖိုင် သိမ်းဆည်းပြီးပါပြီ" });
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="gradient-hero px-5 pt-12 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate("/")} className="text-primary-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-primary-foreground">ပရိုဖိုင်</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <p className="text-primary-foreground font-semibold">{profile.display_name || "အသုံးပြုသူ"}</p>
            <p className="text-primary-foreground/70 text-sm">{user?.email}</p>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-5 mt-6 space-y-4"
      >
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">အမည်</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={profile.display_name}
              onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
              className="pl-10 bg-card"
              placeholder="သင့်အမည်"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">လယ်ကွင်း တည်နေရာ</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={profile.farm_location}
              onChange={(e) => setProfile({ ...profile, farm_location: e.target.value })}
              className="pl-10 bg-card"
              placeholder="ဥပမာ - မန္တလေး"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">လယ်ကွင်း အရွယ်အစား</label>
          <Input
            value={profile.farm_size}
            onChange={(e) => setProfile({ ...profile, farm_size: e.target.value })}
            className="bg-card"
            placeholder="ဥပမာ - ၅ ဧက"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">ဖုန်းနံပါတ်</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="pl-10 bg-card"
              placeholder="09xxxxxxxxx"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">အဓိက သီးနှံများ</label>
          <div className="relative">
            <Wheat className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={cropsInput}
              onChange={(e) => setCropsInput(e.target.value)}
              className="pl-10 bg-card"
              placeholder="စပါး, ပဲ, ချည်မျှင်"
            />
          </div>
        </div>

        <Button onClick={handleSave} className="w-full gradient-hero text-primary-foreground" disabled={loading}>
          <Save className="w-4 h-4 mr-1" />
          {loading ? "သိမ်းဆည်းနေသည်..." : "သိမ်းဆည်းရန်"}
        </Button>

        <Button onClick={handleLogout} variant="outline" className="w-full text-destructive border-destructive/30">
          <LogOut className="w-4 h-4 mr-1" />
          ထွက်ရန်
        </Button>
      </motion.div>

      <BottomNav />
    </div>
  );
};

export default Profile;
