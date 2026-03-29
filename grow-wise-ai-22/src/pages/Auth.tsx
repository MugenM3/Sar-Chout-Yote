import { useState } from "react";
import { motion } from "framer-motion";
import { Leaf, Mail, Lock, User, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email, password, displayName);
      if (error) {
        toast({ title: "အမှား", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "အောင်မြင်ပါသည်", description: "အကောင့်ဖွင့်ပြီးပါပြီ။ ဝင်ရောက်ပါ။" });
        setIsSignUp(false);
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: "အမှား", description: error.message, variant: "destructive" });
      } else {
        navigate("/");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center shadow-elevated mb-4">
            <Leaf className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">စိုက်ပျိုးရေး လမ်းညွှန်</h1>
          <p className="text-muted-foreground text-sm mt-1">AI စိုက်ပျိုးရေး အကူအညီ</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="အမည်"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="pl-10 bg-card border-border"
                  required
                />
              </div>
            </motion.div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="အီးမေးလ်"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 bg-card border-border"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="password"
              placeholder="စကားဝှက်"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 bg-card border-border"
              required
              minLength={6}
            />
          </div>

          <Button type="submit" className="w-full gradient-hero text-primary-foreground" disabled={loading}>
            {loading ? "ခဏစောင့်ပါ..." : isSignUp ? "အကောင့်ဖွင့်ရန်" : "ဝင်ရောက်ရန်"}
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-primary hover:underline"
          >
            {isSignUp ? "အကောင့်ရှိပြီးသားလား? ဝင်ရောက်ရန်" : "အကောင့်မရှိသေးဘူးလား? အကောင့်ဖွင့်ရန်"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
