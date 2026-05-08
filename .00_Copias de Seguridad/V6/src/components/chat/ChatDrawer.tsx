"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Paperclip, Mic, Square, Search, User as UserIcon, Link2 } from "lucide-react";
import { notifyDataRefresh, subscribeDataRefresh } from "@/lib/data-sync";

type ChatMessage = {
  id: string;
  contenido: string;
  senderId: string;
  timestamp: string;
  voiceUrl: string | null;
  sender: {
    id: string;
    nombre: string;
    tipo: string;
    rol: string;
    client: { nombre: string } | null;
  };
  mentions: { id: string; nombre: string }[];
  attachedFile: { id: string; originalName: string; projectId: string } | null;
  attachedTask: { id: string; nombre: string; projectId: string } | null;
};

type MentionUser = {
  id: string;
  nombre: string;
  client?: { nombre: string } | null;
};

export function ChatDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  
  // Voice recording
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [recordedVoice, setRecordedVoice] = useState<Blob | null>(null);

  // Mentions
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionUsers, setMentionUsers] = useState<MentionUser[]>([]);
  const [selectedMentions, setSelectedMentions] = useState<MentionUser[]>([]);

  // Attachments
  const [showResourceModal, setShowResourceModal] = useState<"file" | "task" | null>(null);
  const [resourceItems, setResourceItems] = useState<any[]>([]);
  const [attachedFile, setAttachedFile] = useState<{ id: string; name: string } | null>(null);
  const [attachedTask, setAttachedTask] = useState<{ id: string; name: string } | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const currentUserId = "mocked-for-now"; // En producción real obtendrías esto del auth state o cookie.

  async function loadMessages() {
    try {
      const res = await fetch("/api/chat");
      if (res.ok) {
        setMessages(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function loadMentions() {
    try {
      // Re-using users list for simplicity (we'd need a specific endpoint to only fetch "allowed" users)
      const res = await fetch("/api/users/list");
      if (res.ok) {
        setMentionUsers(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadMessages();
      loadMentions();
      const unsub = subscribeDataRefresh(({ reason }) => {
        if (reason === "chat") loadMessages();
      });
      return () => unsub();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isRecording && recordingTime >= 120) {
      stopRecording();
    }
  }, [recordingTime, isRecording]);

  // Voice logic
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorder.current = recorder;
      audioChunks.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        setRecordedVoice(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000);
    } catch (err) {
      alert("Error al acceder al micrófono.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const cancelRecording = () => {
    stopRecording();
    setRecordedVoice(null);
  };

  const handleSend = async () => {
    if ((!input.trim() && !recordedVoice) || sending) return;
    setSending(true);

    const fd = new FormData();
    fd.append("contenido", input);
    if (selectedMentions.length > 0) {
      fd.append("mentions", JSON.stringify(selectedMentions.map(m => m.id)));
    }
    if (recordedVoice) {
      fd.append("voiceFile", recordedVoice, "voice.webm");
    }
    if (attachedFile) fd.append("attachedFileId", attachedFile.id);
    if (attachedTask) fd.append("attachedTaskId", attachedTask.id);

    try {
      const res = await fetch("/api/chat", { method: "POST", body: fd });
      if (res.ok) {
        setInput("");
        setRecordedVoice(null);
        setSelectedMentions([]);
        setAttachedFile(null);
        setAttachedTask(null);
        loadMessages();
        notifyDataRefresh({ reason: "chat" });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Botón flotante */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg hover:opacity-90 transition-opacity"
      >
        <MessageSquare className="h-6 w-6" strokeWidth={1.5} />
      </button>

      {/* Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative flex w-full max-w-md flex-col bg-background shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-muted/40 px-6">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Chat Interno</h2>
                <p className="text-xs text-muted-foreground">Colaboración multi-organización</p>
              </div>
              <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className="flex flex-col gap-1">
                  <div className="flex items-end gap-2">
                    <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-sm max-w-[85%]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-foreground">{msg.sender.nombre}</span>
                        {msg.sender.client && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-background text-muted-foreground border border-border/40">
                            Cliente: {msg.sender.client.nombre}
                          </span>
                        )}
                      </div>
                      
                      {msg.contenido && <p className="text-sm text-foreground whitespace-pre-wrap">{msg.contenido}</p>}
                      
                      {msg.voiceUrl && (
                        <audio controls src={msg.voiceUrl} className="mt-2 h-8 w-full max-w-[200px]" />
                      )}

                      {/* Attachments */}
                      {(msg.attachedFile || msg.attachedTask) && (
                        <div className="mt-3 space-y-2">
                          {msg.attachedFile && (
                            <a href={`/api/files/${msg.attachedFile.id}/download`} className="flex items-center gap-2 rounded bg-background/50 p-2 border border-border/40 text-xs hover:bg-background/80 transition-colors">
                              <Paperclip className="h-3 w-3 text-accent" />
                              <span className="truncate text-foreground font-medium">{msg.attachedFile.originalName}</span>
                            </a>
                          )}
                          {msg.attachedTask && (
                            <div className="flex items-center gap-2 rounded bg-background/50 p-2 border border-border/40 text-xs">
                              <Link2 className="h-3 w-3 text-accent" />
                              <span className="truncate text-foreground font-medium">{msg.attachedTask.nombre}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground ml-2">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-border/60 bg-muted/20 p-4">
              {recordedVoice ? (
                <div className="flex items-center justify-between bg-muted rounded-xl p-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                    <span className="text-xs font-medium text-foreground">Audio grabado ({recordingTime}s)</span>
                  </div>
                  <button onClick={cancelRecording} className="text-destructive hover:underline text-xs">Descartar</button>
                </div>
              ) : isRecording ? (
                <div className="flex items-center justify-between bg-destructive/10 rounded-xl p-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                    <span className="text-xs font-medium text-destructive">Grabando... {recordingTime}s</span>
                  </div>
                  <button onClick={stopRecording} className="text-destructive font-medium text-xs flex items-center gap-1">
                    <Square className="h-3 w-3" /> Detener
                  </button>
                </div>
              ) : null}

              {/* Selected Mentions & Resources */}
              {(selectedMentions.length > 0 || attachedFile || attachedTask) && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedMentions.map(m => (
                    <span key={m.id} className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-medium text-accent">
                      @{m.nombre}
                      <button onClick={() => setSelectedMentions(selectedMentions.filter(x => x.id !== m.id))} className="hover:text-accent-foreground"><X className="h-3 w-3" /></button>
                    </span>
                  ))}
                  {attachedFile && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground">
                      <Paperclip className="h-3 w-3" /> {attachedFile.name}
                      <button onClick={() => setAttachedFile(null)} className="hover:text-muted-foreground"><X className="h-3 w-3" /></button>
                    </span>
                  )}
                  {attachedTask && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground">
                      <Link2 className="h-3 w-3" /> {attachedTask.name}
                      <button onClick={() => setAttachedTask(null)} className="hover:text-muted-foreground"><X className="h-3 w-3" /></button>
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-end gap-2">
                <button 
                  type="button"
                  onClick={async () => {
                    const res = await fetch("/api/chat/resources?type=file");
                    if (res.ok) setResourceItems(await res.json());
                    setShowResourceModal("file");
                  }}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
                  title="Vincular Documento"
                >
                  <Paperclip className="h-5 w-5" strokeWidth={1.75} />
                </button>
                <button 
                  type="button"
                  onClick={async () => {
                    const res = await fetch("/api/chat/resources?type=task");
                    if (res.ok) setResourceItems(await res.json());
                    setShowResourceModal("task");
                  }}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
                  title="Vincular Tarea"
                >
                  <Link2 className="h-5 w-5" strokeWidth={1.75} />
                </button>
                <div className="flex-1 rounded-xl border border-border/60 bg-background focus-within:border-accent focus-within:ring-1 focus-within:ring-accent overflow-hidden relative">
                  <textarea
                    rows={1}
                    placeholder="Escribe un mensaje..."
                    className="w-full resize-none bg-transparent p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none max-h-32"
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      const lastWord = e.target.value.split(/\s+/).pop();
                      if (lastWord?.startsWith('@')) {
                        setMentionQuery(lastWord.slice(1).toLowerCase());
                        setShowMentions(true);
                      } else {
                        setShowMentions(false);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                  />
                  
                  {/* Mentions Popover */}
                  {showMentions && (
                    <div className="absolute bottom-full left-0 mb-1 w-full max-h-40 overflow-y-auto rounded-lg border border-border/60 bg-background shadow-lg">
                      {mentionUsers.filter(u => u.nombre.toLowerCase().includes(mentionQuery)).map(u => (
                        <button
                          key={u.id}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted text-left"
                          onClick={() => {
                            setSelectedMentions([...selectedMentions, u]);
                            const words = input.split(/\s+/);
                            words.pop();
                            setInput(words.join(" ") + ` @${u.nombre} `);
                            setShowMentions(false);
                          }}
                        >
                          <UserIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-foreground">{u.nombre}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {!input.trim() && !recordedVoice ? (
                  <button 
                    onClick={startRecording}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
                  >
                    <Mic className="h-5 w-5" />
                  </button>
                ) : (
                  <button 
                    onClick={handleSend}
                    disabled={sending}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resource Selection Modal */}
      {showResourceModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-background p-6 shadow-2xl border border-border/60">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Vincular {showResourceModal === "file" ? "Documento" : "Tarea"}
            </h3>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {resourceItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay elementos recientes.</p>
              ) : (
                resourceItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (showResourceModal === "file") setAttachedFile({ id: item.id, name: item.originalName });
                      else setAttachedTask({ id: item.id, name: item.nombre });
                      setShowResourceModal(null);
                    }}
                    className="w-full text-left p-3 rounded-xl border border-border/60 hover:border-accent hover:bg-accent/5 transition-colors"
                  >
                    <p className="text-sm font-medium text-foreground truncate">{showResourceModal === "file" ? item.originalName : item.nombre}</p>
                    {item.project && <p className="text-xs text-muted-foreground truncate">{item.project.nombre}</p>}
                  </button>
                ))
              )}
            </div>
            <button 
              onClick={() => setShowResourceModal(null)}
              className="mt-4 w-full rounded-xl bg-muted py-2.5 text-sm font-medium text-foreground hover:bg-muted/80"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
