import { MessageSquare } from "lucide-react";

export default function MessagesComponent() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#c8a36a]">Messaggi</h2>
      <div className="rounded-lg bg-[#232323] p-12 text-center">
        <MessageSquare size={48} className="mx-auto mb-4 text-white/30" />
        <p className="text-white/70"></p>
      </div>
    </div>
  );
}
