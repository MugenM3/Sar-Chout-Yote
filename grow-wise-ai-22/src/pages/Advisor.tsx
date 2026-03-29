import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Bot, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import BottomNav from "@/components/BottomNav";

interface Message {
  role: "user" | "bot";
  text: string;
}

const suggestions = [
  "စပါး ရောဂါ ကာကွယ်နည်း",
  "မြေဆီလွှာ တိုးတက်အောင် ဘယ်လိုလုပ်ရမလဲ",
  "မိုးရာသီ သီးနှံ အကြံပြုပါ",
  "ဓာတ်မြေသြဇာ အသုံးပြုနည်း",
];

const Advisor = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "မင်္ဂလာပါ! ကျွန်ုပ်သည် သင့်၏ AI စိုက်ပျိုးရေး အကြံပေး ဖြစ်ပါသည်။ မည်သည့်အကူအညီ လိုပါသလဲ?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setInput("");

    // Simulated bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: `"${msg}" အကြောင်း ကောင်းသော မေးခွန်းပါ။ သင့်ဒေသ ရာသီဥတု အခြေအနေအရ အကြံပြုချက်များ ပေးပါမည်။ ထပ်မံ အသေးစိတ် မေးနိုင်ပါသည်။`,
        },
      ]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background pb-24 flex flex-col">
      <div className="gradient-hero px-5 pt-12 pb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="text-primary-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-primary-foreground">AI အကြံပေး</h1>
        </div>
      </div>

      <div className="flex-1 px-5 mt-4 space-y-3 overflow-y-auto">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "bot" && (
              <div className="w-7 h-7 rounded-full gradient-hero flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                msg.role === "user"
                  ? "gradient-hero text-primary-foreground rounded-br-md"
                  : "bg-card text-foreground border border-border rounded-bl-md"
              }`}
            >
              {msg.text}
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            )}
          </motion.div>
        ))}

        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="text-xs bg-accent text-accent-foreground px-3 py-1.5 rounded-full hover:bg-accent/80 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-5 pb-20 pt-3">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="မေးခွန်းမေးရန်..."
            className="bg-card"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={() => handleSend()}
            className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center flex-shrink-0"
          >
            <Send className="w-4 h-4 text-primary-foreground" />
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Advisor;
