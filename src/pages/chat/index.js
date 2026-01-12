import React, { use, useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { AvatarImage, Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Send, Search, MessageCircle, Loader2 } from 'lucide-react';
import useFirebase from '../../hook/firebase';
import InfiniteScroll from 'react-infinite-scroll-component';
import { api } from '../../lib/api';

const buildChannel = (userID1, userID2) => {
    if (userID1 < userID2) {
        return `dm_${userID1}_${userID2}`;
    }
    return `dm_${userID2}_${userID1}`;
}

export default function ChatPage() {
    const socketRef = useRef(null);
    const [input, setInput] = useState("");
    const { auth } = useFirebase();
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const messagesRef = useRef();
    const [contactUser, setContactUser] = useState();
    const workerRef = useRef();

    const currentUser = users?.find(u => u.email === auth?.currentUser?.email);

    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }, []);

    useEffect(() => {
        const worker = new Worker('/message.js');
        workerRef.current = worker;
        worker.onmessage = (event) => {
            const { type, data, error } = event.data;
            if (type === 'merged-messages') {
                setMessages(data);
            } else if (type === 'merged-messages-failed') {
                console.error('Failed to merge messages:', error);
            }
        }
    }, [])



    const getAllUser = async () => {
        try {
            const res = await api.fetch("/user");
            const json = await res.json();
            if (json.data) {
                setUsers(json.data);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const connectSocket = async () => {
        try {
            //replace https and http from host
            const host = process.env.REACT_APP_API_URL
                .replace(/^https?:\/\//, '')
                .replace(/\/$/, '');
            const socket = new WebSocket(`ws://${host}/message/ws`);
            socketRef.current = socket;

            socket.onopen = () => {
                console.log('✅ Connected to WebSocket server');
            };

            socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    if (data.type === 'message') {
                        const now = new Date();
                        setMessages((m) => [{ ...data, created_at: now.toISOString(), id: now.getTime() }, ...m]);
                    }
                } catch (e) {
                    console.log('⚠️ Parse error:', event.data);
                }
            };

            socket.onclose = (event) => {
                console.log('❌ Disconnected:', event.reason);
            };

            socket.onerror = (error) => {
                console.error('⚠️ WebSocket error:', error);
            };
        } catch (e) {
            console.log("error: ", e);
        }
    };

    const handleContactUser = (user) => {
        setContactUser(user);
        setMessages([]);

        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                type: "join",
                target_id: user.id
            }));
        }
        workerRef.current.postMessage({ type: 'merge-message', data: { channelID: buildChannel(user.id, currentUser.id), limit: 20, offset: 0 }, currentData: [] });
    };

    const sendMessage = () => {
        if (!input || !contactUser) return;

        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        const msg = {
            id: Date.now(),
            target_id: contactUser.id,
            content: input,
            time: timeString,
            type: "message"
        };

        setInput("");

        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            try {
                socketRef.current.send(JSON.stringify(msg));
            } catch (e) {
                console.log('⚠️ Send error:', e);
            }
        }
    };

    useEffect(() => {
        getAllUser();
        connectSocket();

        return () => {
            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                socketRef.current.close();
            }
        };
    }, []);

    return (
        <div className="h-[100%] w-full  p-4 md:p-6">
            <div className="mx-auto flex flex-col md:flex-row h-full max-w-7xl gap-6">
                <aside className="w-full md:w-80 flex-shrink-0 h-full md:h-auto">
                    <Card className="h-[calc(100vh-2rem)] md:h-full flex flex-col border-slate-200 dark:border-slate-700 shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800 border-b border-slate-200 dark:border-slate-700 flex-shrink-0 rounded-sm">
                            <div className="flex items-center justify-between p-2">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-md">
                                        <MessageCircle className="h-4 w-4 text-white" />
                                    </div>
                                    <CardTitle className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Contacts</CardTitle>
                                </div>
                                <div className="text-sm px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full font-semibold">{users.length}</div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-hidden pt-4 flex flex-col">
                            <div className="mb-4 relative flex-shrink-0">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input placeholder="Search contacts" className="pl-10 border-slate-300 dark:border-slate-600" />
                            </div>
                            <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
                                {users.map((user) => (
                                    <div
                                        key={user.id}
                                        className={`flex items-center gap-3 rounded-lg p-3 cursor-pointer transition-all duration-200 ${contactUser?.id === user.id
                                            ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-800 shadow-sm"
                                            : "hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent"
                                            }`}
                                        onClick={() => handleContactUser(user)}
                                    >
                                        <Avatar className='h-10 w-10 ring-2 ring-slate-200 dark:ring-slate-700'>
                                            <AvatarImage src={user.photoUrl} />
                                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                                                {user.username?.[0]?.toUpperCase() || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">{user.username}</div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                                        </div>
                                        {contactUser?.id === user.id && (
                                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </aside>

                {contactUser ? (
                    <section className="flex-1 flex flex-col min-h-0">
                        <Card className="h-[calc(100vh-2rem)] md:h-full flex flex-col shadow-xl border-slate-200 dark:border-slate-700">
                            <header className="flex items-center justify-between gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 rounded-t-lg flex-shrink-0">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12 ring-2 ring-blue-200 dark:ring-blue-800">
                                        <AvatarImage src={contactUser.photoUrl} />
                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold text-lg">
                                            {contactUser.username?.[0]?.toUpperCase() || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-bold text-slate-900 dark:text-slate-100">{contactUser.username}</div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Online</div>
                                        </div>
                                    </div>
                                </div>
                            </header>

                            <CardContent className="pl-2 p-1 h-full bg-slate-50 dark:bg-slate-900/50">
                                <div
                                    id="scrollableDiv"
                                    ref={messagesRef}
                                    className="overflow-auto"
                                    style={{
                                        height: '100%',
                                        maxHeight: 'calc(100vh - 350px)',
                                        display: 'flex',
                                        flexDirection: 'column-reverse',
                                    }}
                                >
                                    <InfiniteScroll
                                        dataLength={messages.length}
                                        next={() => { workerRef.current.postMessage({ type: 'merge-message', data: { channelID: buildChannel(contactUser.id, currentUser.id), limit: 20, offset: messages.length }, currentData: messages }); }}
                                        style={{ display: 'flex', width: '100%', flexDirection: 'column-reverse' }}
                                        inverse={true}
                                        hasMore={true}
                                        loader={<div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin text-blue-600" /></div>}
                                        scrollableTarget="scrollableDiv"
                                    >
                                        {messages.map((m, index) => {
                                            const created_at = new Date(m.created_at).toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true
                                            });
                                            return (
                                                <div key={index} className={`flex mb-3 ${m.target_id === contactUser.id ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-[70%] p-3 rounded-xl shadow-md transition-all hover:shadow-lg ${m.target_id === contactUser.id
                                                        ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white'
                                                        : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700'
                                                        }`}>
                                                        <div className="text-sm whitespace-pre-wrap leading-relaxed">{m.content}</div>
                                                        <div className={`text-xs mt-1.5 ${m.target_id === contactUser.id
                                                            ? 'text-blue-100'
                                                            : 'text-slate-500 dark:text-slate-400'
                                                            }`}>
                                                            {created_at}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </InfiniteScroll>
                                </div>
                            </CardContent>

                            <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-slate-900 rounded-b-lg flex-shrink-0">
                                <div className="flex items-center gap-3">
                                    <Input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Write a message..."
                                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                        className="flex-1 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
                                    />
                                    <Button
                                        onClick={sendMessage}
                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all"
                                    >
                                        <Send className="h-4 w-4 mr-2" />
                                        Send
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </section>
                ) : (
                    <section className="w-full flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 mb-4">
                                <MessageCircle className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                            </div>
                            <p className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Select a conversation</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Choose a contact from the list to start messaging</p>
                        </div>
                    </section>
                )}
            </div>

            <style jsx>{`
                .scrollbar-thin {
                    scrollbar-width: thin;
                }
                .scrollbar-thumb-slate-300::-webkit-scrollbar-thumb {
                    background-color: #cbd5e1;
                    border-radius: 4px;
                }
                .scrollbar-track-transparent::-webkit-scrollbar-track {
                    background-color: transparent;
                }
                .dark .scrollbar-thumb-slate-600::-webkit-scrollbar-thumb {
                    background-color: #475569;
                }
                ::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
            `}</style>
        </div>
    );
}
