"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, ChevronDown, ChevronUp } from "lucide-react";

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
  chef?: {
    id: string;
    user: {
      firstname: string;
      lastname: string;
      avatarUrl?: string;
    };
  };
  user?: {
    firstname: string;
    lastname: string;
  };
}

interface ChatComponentProps {
  currentUserId: string;
  isChef: boolean;
  chefId?: string;
  targetChefId?: string; // ID dello chef con cui chattare (per utenti)
  onClose?: () => void;
}

export default function ChatComponent({
  currentUserId,
  isChef,
  chefId,
  targetChefId,
  onClose,
}: ChatComponentProps) {
  const [isOpen, setIsOpen] = useState(!!targetChefId);
  const [chats, setChats] = useState<Chat[]>([]);
  const [expandedChatId, setExpandedChatId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (targetChefId) {
        // Modalità chat singola per utente
        initializeSingleChat();
      } else {
        // Modalità lista chat (per chef o utenti nella navbar)
        fetchChats();
      }
    }
  }, [isOpen, targetChefId]);

  useEffect(() => {
    if (expandedChatId) {
      scrollToBottom();
    }
  }, [expandedChatId, chats]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const initializeSingleChat = async () => {
    if (!targetChefId || !currentUserId) return;

    setIsLoading(true);
    try {
      /* da implementare */
      const checkResponse = await fetch(
        `/api/chats/by-users?chefId=${targetChefId}&userId=${currentUserId}`,
      );

      let chat;
      if (checkResponse.ok) {
        chat = await checkResponse.json();
      } else {
        // Se non esiste, creala
        const createResponse = await fetch("/api/chats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chefId: targetChefId,
            userId: currentUserId,
          }),
        });
        chat = await createResponse.json();
      }

      setChats([chat]);
      setExpandedChatId(chat.id);
    } catch (error) {
      console.error("Errore nell'inizializzazione della chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChats = async () => {
    setIsLoading(true);
    try {
      const endpoint = isChef
        ? `/api/chefs/${chefId}/chats`
        : `/api/users/${currentUserId}/chats`;

      const response = await fetch(endpoint);
      const data = await response.json();
      setChats(data);
    } catch (error) {
      console.error("Errore nel caricamento delle chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (chatId: string) => {
    if (!messageInput.trim()) return;

    const newMessage = {
      chatId,
      isChef,
      text: messageInput,
      isRed: false,
    };

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });

      const createdMessage = await response.json();

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === chatId
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

  const toggleChat = (chatId: string) => {
    setExpandedChatId(expandedChatId === chatId ? null : chatId);
  };

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const getOtherPersonName = (chat: Chat) => {
    if (isChef) {
      return `${chat.user?.firstname} ${chat.user?.lastname}`;
    }
    return `Chef ${chat.chef?.user.firstname} ${chat.chef?.user.lastname}`;
  };

  const getLastMessage = (chat: Chat) => {
    if (chat.Messages.length === 0) return "Nessun messaggio";
    const lastMsg = chat.Messages[chat.Messages.length - 1];
    return lastMsg.text.length > 50
      ? lastMsg.text.substring(0, 50) + "..."
      : lastMsg.text;
  };

  // Se è una chat singola (targetChefId definito), non mostrare il pulsante toggle
  if (targetChefId) {
    return (
      <>
        {isOpen && (
          <div className="fixed right-6 bottom-6 z-50 flex h-[600px] w-96 flex-col rounded-lg bg-[#232323] shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <h3 className="text-lg font-bold text-[#c8a36a]">
                {chats[0] && getOtherPersonName(chats[0])}
              </h3>
              <button
                onClick={handleClose}
                className="text-white/70 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messaggi */}
            <div className="flex-1 overflow-y-auto p-4">
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-white/50">Caricamento...</p>
                </div>
              ) : chats[0] ? (
                <div className="space-y-2">
                  {chats[0].Messages.length === 0 ? (
                    <p className="text-center text-sm text-white/50">
                      Inizia la conversazione
                    </p>
                  ) : (
                    chats[0].Messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.isChef === isChef
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            message.isChef === isChef
                              ? "bg-[#c8a36a] text-[#0a0a0a]"
                              : "bg-[#0a0a0a] text-white"
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p
                            className={`mt-1 text-xs ${
                              message.isChef === isChef
                                ? "text-[#0a0a0a]/70"
                                : "text-white/50"
                            }`}
                          >
                            {new Date(message.createdAt).toLocaleTimeString(
                              "it-IT",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              ) : null}
            </div>

            {/* Input messaggio */}
            {chats[0] && (
              <div className="border-t border-white/10 p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage(chats[0].id);
                      }
                    }}
                    placeholder="Scrivi un messaggio..."
                    className="flex-1 rounded border border-[#c8a36a]/30 bg-[#0a0a0a] px-3 py-2 text-sm text-white outline-none focus:border-[#c8a36a]"
                  />
                  <button
                    onClick={() => handleSendMessage(chats[0].id)}
                    className="rounded bg-[#c8a36a] p-2 text-[#0a0a0a] transition hover:bg-[#d4b480]"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </>
    );
  }

  // Modalità lista chat (codice originale)
  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#c8a36a] text-[#0a0a0a] shadow-lg transition hover:bg-[#d4b480] hover:shadow-xl"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {isOpen && (
        <div className="fixed right-6 bottom-24 z-40 flex h-[600px] w-96 flex-col rounded-lg bg-[#232323] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 p-4">
            <h3 className="text-lg font-bold text-[#c8a36a]">Messaggi</h3>
            <span className="rounded-full bg-[#c8a36a] px-2 py-1 text-xs font-semibold text-[#0a0a0a]">
              {chats.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-white/50">Caricamento...</p>
              </div>
            ) : chats.length === 0 ? (
              <div className="flex h-full items-center justify-center p-8 text-center">
                <div>
                  <MessageSquare
                    size={48}
                    className="mx-auto mb-4 text-white/30"
                  />
                  <p className="text-white/70">Nessuna chat disponibile</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2 p-3">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className="overflow-hidden rounded-lg bg-[#2a2a2a] transition hover:bg-[#333333]"
                  >
                    <button
                      onClick={() => toggleChat(chat.id)}
                      className="flex w-full items-center justify-between p-4"
                    >
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-white">
                          {getOtherPersonName(chat)}
                        </p>
                        <p className="text-sm text-white/50">
                          {getLastMessage(chat)}
                        </p>
                      </div>
                      {expandedChatId === chat.id ? (
                        <ChevronUp size={20} className="text-[#c8a36a]" />
                      ) : (
                        <ChevronDown size={20} className="text-white/50" />
                      )}
                    </button>

                    {expandedChatId === chat.id && (
                      <div className="border-t border-white/10">
                        <div className="max-h-80 space-y-2 overflow-y-auto p-4">
                          {chat.Messages.length === 0 ? (
                            <p className="text-center text-sm text-white/50">
                              Inizia la conversazione
                            </p>
                          ) : (
                            chat.Messages.map((message) => (
                              <div
                                key={message.id}
                                className={`flex ${
                                  message.isChef === isChef
                                    ? "justify-end"
                                    : "justify-start"
                                }`}
                              >
                                <div
                                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                    message.isChef === isChef
                                      ? "bg-[#c8a36a] text-[#0a0a0a]"
                                      : "bg-[#0a0a0a] text-white"
                                  }`}
                                >
                                  <p className="text-sm">{message.text}</p>
                                  <p
                                    className={`mt-1 text-xs ${
                                      message.isChef === isChef
                                        ? "text-[#0a0a0a]/70"
                                        : "text-white/50"
                                    }`}
                                  >
                                    {new Date(
                                      message.createdAt,
                                    ).toLocaleTimeString("it-IT", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                </div>
                              </div>
                            ))
                          )}
                          <div ref={messagesEndRef} />
                        </div>

                        <div className="border-t border-white/10 p-3">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={messageInput}
                              onChange={(e) => setMessageInput(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  handleSendMessage(chat.id);
                                }
                              }}
                              placeholder="Scrivi un messaggio..."
                              className="flex-1 rounded border border-[#c8a36a]/30 bg-[#0a0a0a] px-3 py-2 text-sm text-white outline-none focus:border-[#c8a36a]"
                            />
                            <button
                              onClick={() => handleSendMessage(chat.id)}
                              className="rounded bg-[#c8a36a] p-2 text-[#0a0a0a] transition hover:bg-[#d4b480]"
                            >
                              <Send size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
