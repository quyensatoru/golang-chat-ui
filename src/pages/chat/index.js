import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { AvatarImage, Avatar, AvatarFallback } from '../../components/ui/avatar';
import useFirebase from '../../hook/firebase';

export default function ChatPage() {
    const socketRef = useRef(null);
    const [input, setInput] = useState("");
    const { auth } = useFirebase();
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const messagesRef = useRef();
    const [contactUser, setContactUser] = useState();

    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }, [messages]);

    const getAllUser = async () => {
        try {
            const res = await fetch("http://localhost:3000/user", {
                method: "GET",
                credentials: "include",
            });
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
            const socket = new WebSocket('ws://localhost:3000/message/ws');
            socketRef.current = socket;

            socket.onopen = () => {
                console.log('✅ Connected to WebSocket server');
            };

            socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log("📩 Received:", data);

                    if (data.type === 'message') {
                        const now = new Date();
                        const time = now.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        });
                        setMessages((m) => [...m, { ...data, time, id: now.getTime() }]);
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
            console.log(`🚀 Joined channel with ${user.email}`);
        }
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
            data: input,
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
        <div className="h-[100%] w-full bg-background overflow-hidden">
            <div className="mx-auto flex flex-col md:flex-row h-full max-w-7xl gap-6 p-4 md:p-6 overflow-hidden">
                <aside className="w-full md:w-80">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Contacts</CardTitle>
                                <div className="text-sm text-muted-foreground">{users.length}</div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4">
                                <Input placeholder="Search contacts" />
                            </div>
                            <div className="space-y-2 max-h-[60vh] overflow-auto pr-2">
                                {users.map((user) => (
                                    <div
                                        key={user.id}
                                        className={`flex items-center gap-3 rounded-lg p-3 cursor-pointer hover:bg-accent hover:shadow-sm transition ${contactUser?.id === user.id ? "bg-accent" : ""}`}
                                        onClick={() => handleContactUser(user)}
                                    >
                                        <Avatar className='h-8 w-8'>
                                            <AvatarImage src={user.photoUrl} />
                                            <AvatarFallback>{user.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="font-medium">{user.username}</div>
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </aside>

                {contactUser && (
                    <section className="w-full flex-1 flex flex-col min-h-0">
                        <Card className="w-full flex-1 flex flex-col shadow-lg min-h-0">
                            <header className="flex items-center justify-between gap-4 border-b p-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={contactUser.photoUrl} />
                                        <AvatarFallback>{contactUser.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-semibold">{contactUser.username}</div>
                                        <div className="text-xs text-muted-foreground">Online</div>
                                    </div>
                                </div>
                            </header>

                            <CardContent className="flex-1 overflow-auto p-4 md:p-6" ref={messagesRef}>
                                <div className="space-y-4">
                                    {messages.map((m) => (
                                        <div key={m.id} className={`flex ${m.target_id === contactUser.id ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] p-3 rounded-lg shadow-sm ${m.target_id === contactUser.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                                <div className="text-sm whitespace-pre-wrap">{m.data}</div>
                                                <div className={`text-xs mt-1 ${m.target_id === contactUser.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{m.time}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>

                            <div className="border-t p-4">
                                <div className="flex items-center gap-2">
                                    <Input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Write a message..."
                                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                    />
                                    <Button onClick={sendMessage}>Send</Button>
                                </div>
                            </div>
                        </Card>
                    </section>
                )}
            </div>
        </div>
    );
}
