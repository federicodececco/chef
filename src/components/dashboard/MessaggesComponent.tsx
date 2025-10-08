"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, User, Clock } from "lucide-react";

interface Message {
  id: string;
  chatId: string;
  isChef: boolean;
  text: string;
  isRed: boolean;
  createdAt: string;
}

interface Chat {
  id: string;
  chefId: string;
  userId: string;
  createdAt: string;
  Messages: Message[];
  user: {
    firstname: string;
    lastname: string;
  };
}

interface MessagesComponentProps {
  chefId: string;
}

export default function MessagesComponent({ chefId }: MessagesComponentProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchChats = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/chefs/${chefId}/chats`);
        if (!response.ok) throw new Error("Errore nel caricamento delle chat");
        const data = await response.json();
        setChats(data);

        if (data.length > 0 && !selectedChatId) {
          setSelectedChatId(data[0].id);
        }
      } catch (error) {
        console.error("Errore nel caricamento delle chat:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, [chefId]);

  useEffect(() => {
    if (selectedChatId) {
      scrollToBottom();
    }
  }, [selectedChatId, chats]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedChatId) return;

    const newMessage = {
      chatId: selectedChatId,
      isChef: true,
      text: messageInput,
      isRed: false,
    };

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });

      if (!response.ok) throw new Error("Errore nell'invio del messaggio");

      const createdMessage = await response.json();

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === selectedChatId
            ? {
                ...chat,
                Messages: [...chat.Messages, createdMessage],
              }
            : chat,
        ),
      );

      setMessageInput("");
    } catch (error) {
      console.error("Errore nell'invio del messaggio:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const getLastMessage = (chat: Chat) => {
    if (chat.Messages.length === 0) return "Nessun messaggio";
    const lastMsg = chat.Messages[chat.Messages.length - 1];
    const prefix = lastMsg.isChef ? "Tu: " : "";
    return (
      prefix +
      (lastMsg.text.length > 40
        ? lastMsg.text.substring(0, 40) + "..."
        : lastMsg.text)
    );
  };

  const getLastMessageTime = (chat: Chat) => {
    if (chat.Messages.length === 0) return "";
    const lastMsg = chat.Messages[chat.Messages.length - 1];
    const date = new Date(lastMsg.createdAt);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("it-IT", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString("it-IT", {
        day: "numeric",
        month: "short",
      });
    }
  };

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-[#c8a36a]">Messaggi</h2>
        <div className="rounded-lg bg-[#232323] p-12 text-center">
          <p className="text-white/70">Caricamento messaggi...</p>
        </div>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-[#c8a36a]">Messaggi</h2>
        <div className="rounded-lg bg-[#232323] p-12 text-center">
          <MessageSquare size={48} className="mx-auto mb-4 text-white/30" />
          <p className="text-white/70">Nessun messaggio ricevuto</p>
          <p className="mt-2 text-sm text-white/50">
            Quando gli utenti ti contatteranno, vedrai i loro messaggi qui
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#c8a36a]">Messaggi</h2>
        <div className="flex items-center gap-2 rounded-full bg-[#c8a36a] px-3 py-1">
          <MessageSquare size={16} className="text-[#0a0a0a]" />
          <span className="text-sm font-semibold text-[#0a0a0a]">
            {chats.length} {chats.length === 1 ? "Chat" : "Chat"}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Lista Chat */}
        <div className="lg:col-span-1">
          <div className="rounded-lg bg-[#232323] p-4">
            <h3 className="mb-4 text-sm font-semibold text-white/70">
              CONVERSAZIONI
            </h3>
            <div className="space-y-2">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChatId(chat.id)}
                  className={`w-full rounded-lg p-4 text-left transition ${
                    selectedChatId === chat.id
                      ? "bg-[#c8a36a]/10 ring-2 ring-[#c8a36a]"
                      : "bg-[#2a2a2a] hover:bg-[#333333]"
                  }`}
                >
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c8a36a]/20">
                      <User size={20} className="text-[#c8a36a]" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate font-semibold text-white">
                        {chat.user.firstname} {chat.user.lastname}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-white/50">
                        <Clock size={12} />
                        {getLastMessageTime(chat)}
                      </div>
                    </div>
                  </div>
                  <p className="truncate text-sm text-white/60">
                    {getLastMessage(chat)}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Area Messaggi */}
        <div className="lg:col-span-2">
          {selectedChat ? (
            <div className="flex h-[600px] flex-col rounded-lg bg-[#232323]">
              {/* Header Chat */}
              <div className="flex items-center gap-3 border-b border-white/10 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c8a36a]/20">
                  <User size={24} className="text-[#c8a36a]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {selectedChat.user.firstname} {selectedChat.user.lastname}
                  </h3>
                  <p className="text-sm text-white/50">
                    {selectedChat.Messages.length}{" "}
                    {selectedChat.Messages.length === 1
                      ? "messaggio"
                      : "messaggi"}
                  </p>
                </div>
              </div>

              {/* Messaggi */}
              <div className="flex-1 space-y-4 overflow-y-auto p-6">
                {selectedChat.Messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-white/50">Nessun messaggio ancora</p>
                  </div>
                ) : (
                  selectedChat.Messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.isChef ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[75%] rounded-lg px-4 py-3 ${
                          message.isChef
                            ? "bg-[#c8a36a] text-[#0a0a0a]"
                            : "bg-[#0a0a0a] text-white"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">
                          {message.text}
                        </p>
                        <p
                          className={`mt-1 text-xs ${
                            message.isChef
                              ? "text-[#0a0a0a]/60"
                              : "text-white/50"
                          }`}
                        >
                          {new Date(message.createdAt).toLocaleString("it-IT", {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Messaggio */}
              <div className="border-t border-white/10 p-6">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Scrivi un messaggio..."
                    className="flex-1 rounded-lg border border-[#c8a36a]/30 bg-[#0a0a0a] px-4 py-3 text-white transition outline-none focus:border-[#c8a36a]"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="flex items-center gap-2 rounded-lg bg-[#c8a36a] px-6 py-3 font-semibold text-[#0a0a0a] transition hover:bg-[#d4b480] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send size={18} />
                    Invia
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-[600px] items-center justify-center rounded-lg bg-[#232323]">
              <div className="text-center">
                <MessageSquare
                  size={48}
                  className="mx-auto mb-4 text-white/30"
                />
                <p className="text-white/50">
                  Seleziona una conversazione per visualizzare i messaggi
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
