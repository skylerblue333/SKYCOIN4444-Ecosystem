import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import {
  ArrowLeft,
  Check,
  CheckCheck,
  Lock,
  MessageCircle,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  UserPlus,
} from "lucide-react";

function timeAgo(ts: string | Date) {
  const diff = (Date.now() - new Date(ts).getTime()) / 1000;
  if (diff < 60) return "now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return new Date(ts).toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

export default function Messages() {
  const { user, isAuthenticated } = useAuth();
  const [recipientDraft, setRecipientDraft] = useState("");
  const [activeRecipientId, setActiveRecipientId] = useState("");
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pendingReadIds = useRef<Set<string>>(new Set());
  const utils = trpc.useUtils();

  const currentUserId = user?.id ? String(user.id) : "";

  const conversation = trpc.message.list.useQuery(
    { userId: activeRecipientId },
    {
      enabled: isAuthenticated && activeRecipientId.length > 0,
      refetchInterval: 3000,
      refetchOnWindowFocus: true,
    }
  );

  const sendMutation = trpc.message.send.useMutation({
    onSuccess: async () => {
      setMessageText("");
      await utils.message.list.invalidate({ userId: activeRecipientId });
    },
    onError: error => toast.error(error.message),
  });

  const markReadMutation = trpc.message.markAsRead.useMutation();

  const messages = conversation.data ?? [];

  useEffect(() => {
    if (!currentUserId || !activeRecipientId) return;

    for (const message of messages) {
      if (
        message.id &&
        message.recipientId === currentUserId &&
        !message.read &&
        !pendingReadIds.current.has(message.id)
      ) {
        pendingReadIds.current.add(message.id);
        markReadMutation.mutate(
          { messageId: message.id },
          {
            onSettled: () => {
              pendingReadIds.current.delete(message.id);
              void utils.message.list.invalidate({ userId: activeRecipientId });
            },
          }
        );
      }
    }
  }, [
    activeRecipientId,
    currentUserId,
    markReadMutation,
    messages,
    utils.message.list,
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const filteredMessages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return messages;
    return messages.filter(message =>
      (message.content ?? "").toLowerCase().includes(query)
    );
  }, [messages, searchQuery]);

  const openConversation = useCallback(() => {
    const recipientId = recipientDraft.trim();
    if (!recipientId) {
      toast.error("Enter a user ID");
      return;
    }
    if (recipientId === currentUserId) {
      toast.error("Choose another user");
      return;
    }

    setActiveRecipientId(recipientId);
    setSearchQuery("");
  }, [currentUserId, recipientDraft]);

  const handleSend = useCallback(() => {
    const content = messageText.trim();
    if (!content || !activeRecipientId) return;

    sendMutation.mutate({
      recipientId: activeRecipientId,
      content,
    });
  }, [activeRecipientId, messageText, sendMutation]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white">Private Messages</h2>
          <p className="text-slate-400">
            Sign in to use the current one-to-one beta messaging flow.
          </p>
          <Button
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0"
            onClick={() => {
              window.location.href = getLoginUrl();
            }}
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#07040d] text-white"
      style={{ minHeight: "calc(100vh - 64px)" }}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 p-4 lg:flex-row lg:p-6">
        <aside
          className={`${
            activeRecipientId ? "hidden lg:flex" : "flex"
          } w-full flex-col rounded-2xl border border-white/10 bg-[#0d0817] p-4 lg:w-80`}
        >
          <div className="mb-5">
            <div className="mb-2 flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-purple-400" />
              <h1 className="text-xl font-black">Messages</h1>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              The verified beta API currently exposes direct history by user ID,
              sending, and recipient-scoped read state. Conversation discovery,
              calling, deletion, and end-to-end encryption are not claimed here.
            </p>
          </div>

          <div className="space-y-3 rounded-xl border border-white/5 bg-white/[0.03] p-3">
            <label
              htmlFor="recipient-id"
              className="text-xs font-semibold uppercase tracking-wide text-slate-400"
            >
              Open direct conversation
            </label>
            <Input
              id="recipient-id"
              value={recipientDraft}
              onChange={event => setRecipientDraft(event.target.value)}
              onKeyDown={event => {
                if (event.key === "Enter") openConversation();
              }}
              placeholder="Recipient user ID"
              className="border-white/10 bg-white/5 text-white placeholder:text-slate-600"
            />
            <Button
              className="w-full bg-purple-600 text-white hover:bg-purple-500"
              onClick={openConversation}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Open Conversation
            </Button>
          </div>

          <div className="mt-4 rounded-xl border border-purple-500/15 bg-purple-500/5 p-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-purple-200">
              <ShieldCheck className="h-4 w-4" />
              Beta contract
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">
              History is read from the canonical message store. Incoming
              messages are marked read only for the authenticated recipient.
            </p>
          </div>
        </aside>

        <main
          className={`${
            activeRecipientId ? "flex" : "hidden lg:flex"
          } min-h-[70vh] flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0d0817]`}
        >
          {!activeRecipientId ? (
            <div className="flex flex-1 items-center justify-center p-8 text-center">
              <div className="max-w-sm space-y-3">
                <MessageCircle className="mx-auto h-12 w-12 text-purple-400" />
                <h2 className="text-xl font-bold">Open a direct conversation</h2>
                <p className="text-sm text-slate-400">
                  Enter another user&apos;s ID to load the persisted one-to-one
                  history supported by the current beta backend.
                </p>
              </div>
            </div>
          ) : (
            <>
              <header className="border-b border-white/10 p-4">
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="lg:hidden text-slate-400 hover:text-white"
                    onClick={() => setActiveRecipientId("")}
                    aria-label="Back to recipient picker"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">
                      Direct message: {activeRecipientId}
                    </p>
                    <p className="text-xs text-slate-500">
                      Persisted beta history · refreshes every 3 seconds
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-slate-400 hover:text-purple-300"
                    onClick={() => void conversation.refetch()}
                    disabled={conversation.isFetching}
                    aria-label="Refresh conversation"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${
                        conversation.isFetching ? "animate-spin" : ""
                      }`}
                    />
                  </Button>
                </div>

                <div className="relative mt-3">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
                  <Input
                    value={searchQuery}
                    onChange={event => setSearchQuery(event.target.value)}
                    placeholder="Search loaded messages"
                    className="border-white/10 bg-white/5 pl-9 text-white placeholder:text-slate-600"
                  />
                </div>
              </header>

              <ScrollArea className="flex-1 p-4">
                {conversation.isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(item => (
                      <div
                        key={item}
                        className="h-16 animate-pulse rounded-xl bg-white/5"
                      />
                    ))}
                  </div>
                ) : conversation.error ? (
                  <div className="mx-auto max-w-md rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center">
                    <p className="font-semibold text-red-200">
                      Conversation could not be loaded
                    </p>
                    <p className="mt-1 text-sm text-red-200/70">
                      {conversation.error.message}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-3 border-red-400/20 bg-transparent text-red-100"
                      onClick={() => void conversation.refetch()}
                    >
                      Retry
                    </Button>
                  </div>
                ) : filteredMessages.length === 0 ? (
                  <div className="flex min-h-[45vh] items-center justify-center text-center">
                    <div className="max-w-sm space-y-2">
                      <MessageCircle className="mx-auto h-10 w-10 text-slate-700" />
                      <p className="font-semibold text-slate-300">
                        {searchQuery ? "No matching messages" : "No messages yet"}
                      </p>
                      <p className="text-sm text-slate-500">
                        {searchQuery
                          ? "Clear the search to see the full loaded history."
                          : "Send the first message in this direct conversation."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredMessages.map(message => {
                      const mine = message.senderId === currentUserId;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${mine ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[82%] rounded-2xl px-4 py-3 sm:max-w-[70%] ${
                              mine
                                ? "bg-purple-600 text-white"
                                : "border border-white/10 bg-white/5 text-slate-100"
                            }`}
                          >
                            <p className="whitespace-pre-wrap break-words text-sm">
                              {message.content || ""}
                            </p>
                            <div
                              className={`mt-1 flex items-center justify-end gap-1 text-[11px] ${
                                mine ? "text-purple-100/70" : "text-slate-500"
                              }`}
                            >
                              {message.createdAt && (
                                <span>{timeAgo(message.createdAt)}</span>
                              )}
                              {mine &&
                                (message.read ? (
                                  <CheckCheck className="h-3.5 w-3.5" />
                                ) : (
                                  <Check className="h-3.5 w-3.5" />
                                ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>

              <footer className="border-t border-white/10 p-4">
                <div className="flex gap-2">
                  <Input
                    value={messageText}
                    onChange={event => setMessageText(event.target.value)}
                    onKeyDown={event => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Write a message"
                    maxLength={255}
                    className="border-white/10 bg-white/5 text-white placeholder:text-slate-600"
                  />
                  <Button
                    type="button"
                    className="bg-purple-600 text-white hover:bg-purple-500"
                    disabled={!messageText.trim() || sendMutation.isPending}
                    onClick={handleSend}
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-2 text-xs text-slate-600">
                  Current beta limit: 255 characters per message. Delivery is
                  persisted through the server message API; real-time WebSocket
                  delivery is not claimed on this screen.
                </p>
              </footer>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
