import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { IconSparkles, IconUser, IconEdit, IconSearch, IconFileText, IconList, IconShare, IconDotsVertical, IconChevronDown } from '../constants';

const AnavsanLogo: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="48" height="52" viewBox="0 0 48 52" fill="none">
        <path d="M26.0245 1.10411C26.5035 0.944589 27.0263 0.947640 27.4289 1.26015C27.8353 1.57579 27.9607 2.08272 27.9091 2.58175C27.8545 3.11164 27.7675 3.64069 27.6909 4.14221C27.6133 4.65109 27.5445 5.14003 27.5176 5.62516C27.3883 8.02999 27.2264 10.4046 27.2481 12.7777L27.2642 13.7268C27.3734 18.1509 27.9741 22.5304 28.8846 26.8812L29.0846 27.8133L29.1091 27.9046C29.117 27.9271 29.1239 27.9412 29.1284 27.9492C29.1329 27.9508 29.1399 27.952 29.1488 27.9545C29.1812 27.9632 29.2339 27.973 29.3187 27.9788C31.4692 28.126 33.6249 28.4423 35.6955 29.2251L35.8816 29.3026C36.0621 29.3849 36.2283 29.4799 36.3789 29.5712C36.5986 29.7041 36.752 29.8069 36.9415 29.9151L37.3619 30.155L37.0464 30.8939L36.8645 31.3163L36.4143 31.2091C34.2199 30.6888 31.9678 30.4478 29.7124 30.4872C29.9032 31.2229 30.0827 31.9235 30.2867 32.6262C31.4116 36.4888 32.6906 40.2413 34.7811 43.6545L35.1436 44.2309C36.0023 45.5552 36.9639 46.7297 38.2796 47.5599L38.5897 47.7445C40.1382 48.6137 41.6866 48.6982 43.2402 47.8018C44.9151 46.8355 45.6648 45.3592 45.5815 43.4241L45.5804 43.4135V43.4029C45.5802 43.3222 45.5841 43.2412 45.5921 43.1609L45.6371 42.7182L46.0831 42.6737L46.2745 42.6556L46.8392 42.5993L46.8756 43.1609C46.8944 43.4511 46.9331 43.7052 46.9665 44.042C46.9897 44.276 47.0079 44.5296 46.9965 44.7903L46.9741 45.0536C46.3837 49.7291 41.6611 52.2231 37.1523 50.4015C35.0198 49.5389 33.3957 48.0921 32.0633 46.3699L31.8002 46.0216C29.9253 43.4767 28.618 40.6676 27.5444 37.7853L27.0973 36.5454C26.7652 35.5902 26.4614 34.6274 26.169 33.6655L25.309 30.7877C25.2985 30.7525 25.2886 30.7234 25.2801 30.6985C21.2845 31.0504 17.4836 31.9481 13.9994 33.8247L13.3064 34.2133C10.7497 35.7051 8.95567 37.8478 7.83348 40.4943L7.6185 41.0303C7.09339 42.4103 6.60802 43.8048 6.13716 45.2075L4.74352 49.4345C4.5561 50.0028 4.25777 50.4981 3.76487 50.7741C3.32521 51.0202 2.82414 51.0403 2.30386 50.9185L2.08032 50.8581C1.74906 50.7565 1.35788 50.5985 1.14552 50.2424C0.921445 49.8662 0.994972 49.4467 1.10809 49.0969L2.15412 45.8465C2.50903 44.7593 2.87718 43.6729 3.27715 42.5993L4.01302 40.6493C7.48513 31.5656 11.5018 22.7148 16.4167 14.2723L17.4841 12.4689C19.3773 9.32226 21.5145 6.30633 23.5506 3.28343L23.7057 3.06475C24.0816 2.56193 24.538 2.12133 24.9497 1.73147L24.956 1.72722L25.0726 1.62426C25.3531 1.39264 25.6763 1.21696 26.0245 1.10411ZM23.0063 10.1675C18.5457 17.0145 14.8187 24.1166 11.563 31.4691C13.3624 30.4149 15.3197 29.6376 17.3675 29.1699L18.3344 28.9598C20.4134 28.5266 22.5251 28.2002 24.6202 27.8323C23.4817 22.1099 22.7559 16.2408 23.0063 10.1675Z" fill="url(#paint0_linear_splash)" stroke="url(#paint1_linear_splash)" strokeWidth="0.75"/>
        <defs>
            <linearGradient id="paint0_linear_splash" x1="23.9999" y1="1.54252" x2="23.9999" y2="50.4578" gradientUnits="userSpaceOnUse"><stop stopColor="#6932D5"/><stop offset="1" stopColor="#7163C6"/></linearGradient>
            <linearGradient id="paint1_linear_splash" x1="24" y1="1" x2="24" y2="51" gradientUnits="userSpaceOnUse"><stop stopColor="#6932D5"/><stop offset="1" stopColor="#7163C6"/></linearGradient>
        </defs>
    </svg>
);

const IconArrowUp: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" />
    </svg>
);


interface Message {
    role: 'user' | 'model';
    text: string;
}

interface ChatSession {
    id: string;
    title: string;
    messages: Message[];
    geminiChat: Chat;
}

const AIAgent: React.FC = () => {
    const [chats, setChats] = useState<Record<string, ChatSession>>({});
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    const initAI = () => {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            return ai;
        } catch (e) {
            console.error(e);
            setError('Failed to initialize AI Agent. Please check your API key configuration.');
            return null;
        }
    }

    const createNewChat = (ai: GoogleGenAI | null) => {
        if (!ai) return null;
        const newId = `chat_${Date.now()}`;
        const geminiChat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: 'You are Anavsan AI, a helpful assistant for cloud data warehouse optimization and insights. You help users monitor costs, storage, and performance, optimize queries, and detect anomalies.',
            }
        });
        const newChat: ChatSession = {
            id: newId,
            title: 'New Chat',
            messages: [{ role: 'model', text: 'Hello! I am Anavsan AI. How can I help you analyze your data cloud today?' }],
            geminiChat,
        };
        return newChat;
    }

    useEffect(() => {
        const ai = initAI();
        const newChat = createNewChat(ai);
        if (newChat) {
            setChats({ [newChat.id]: newChat });
            setActiveChatId(newChat.id);
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chats, activeChatId, isLoading]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [input]);

    const handleNewChat = () => {
        const ai = initAI();
        const newChat = createNewChat(ai);
        if (newChat) {
            setChats(prev => ({ ...prev, [newChat.id]: newChat }));
            setActiveChatId(newChat.id);
            setInput('');
        }
    }

    const handleSendMessage = async (e: FormEvent) => {
        e.preventDefault();
        const messageText = input.trim();
        if (!messageText || isLoading || !activeChatId || !chats[activeChatId]) return;

        const currentChat = chats[activeChatId];
        const updatedMessages: Message[] = [...currentChat.messages, { role: 'user', text: messageText }];
        
        // Update title for new chats
        const isNewChat = currentChat.title === 'New Chat' && currentChat.messages.length <= 1;
        const newTitle = isNewChat ? (messageText.length > 30 ? messageText.substring(0, 27) + '...' : messageText) : currentChat.title;

        setChats(prev => ({
            ...prev,
            [activeChatId]: { ...currentChat, messages: updatedMessages, title: newTitle }
        }));
        setInput('');
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await currentChat.geminiChat.sendMessage({ message: messageText });
            setChats(prev => ({
                ...prev,
                [activeChatId]: {
                    ...prev[activeChatId],
                    messages: [...updatedMessages, { role: 'model', text: response.text }],
                }
            }));
        } catch (e) {
            console.error(e);
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
            const errorText = `Sorry, I encountered an error: ${errorMessage}`;
            setChats(prev => ({
                ...prev,
                [activeChatId]: {
                    ...prev[activeChatId],
                    messages: [...updatedMessages, { role: 'model', text: errorText }],
                }
            }));
            setError('There was an issue communicating with the AI. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const suggestionPrompts = [
        'Summarize top 5 most expensive queries',
        'Why is my COMPUTE_WH cost so high?',
        'Suggest ways to reduce storage costs',
        'Find inefficient join patterns in recent queries'
    ];

    const activeChat = activeChatId ? chats[activeChatId] : null;

    return (
        <div className="flex h-full bg-background text-text-primary">
            {/* Sidebar */}
            <aside className="w-64 bg-sidebar-topbar text-white p-2 flex flex-col flex-shrink-0">
                <div className="flex-shrink-0 p-2">
                    <button onClick={handleNewChat} className="w-full flex items-center justify-between p-2 rounded-lg text-sm font-semibold border border-gray-500 hover:bg-surface-hover">
                        <span>New Chat</span>
                        <IconEdit className="w-4 h-4" />
                    </button>
                    <div className="relative mt-2">
                        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="search" placeholder="Search chats" className="w-full bg-gray-700 border-gray-600 rounded-lg pl-9 pr-3 py-1.5 text-sm focus:ring-primary focus:border-primary" />
                    </div>
                </div>
                <nav className="flex-grow overflow-y-auto mt-2 space-y-1 p-2">
                    {/* FIX: Explicitly typed 'chat' as 'ChatSession' to fix TypeScript inference issue. */}
                    {Object.values(chats).reverse().map((chat: ChatSession) => (
                        <button key={chat.id} onClick={() => setActiveChatId(chat.id)} className={`w-full text-left truncate text-sm p-2 rounded-lg ${activeChatId === chat.id ? 'bg-surface-hover' : 'hover:bg-surface-hover'}`}>
                            {chat.title}
                        </button>
                    ))}
                </nav>
                 <div className="flex-shrink-0 p-2 border-t border-gray-700">
                    <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-surface-hover">
                        <div className="w-7 h-7 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center flex-shrink-0">
                           SR
                        </div>
                        <span className="text-sm font-semibold">Sameer SR</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                <header className="flex-shrink-0 flex justify-between items-center p-4 border-b border-border-color">
                    <div className="flex items-center gap-2">
                         <h2 className="text-lg font-semibold">Anavsan AI</h2>
                        <IconChevronDown className="w-5 h-5 text-text-muted" />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg text-text-secondary hover:bg-surface-hover"><IconShare className="w-5 h-5"/></button>
                        <button className="p-2 rounded-lg text-text-secondary hover:bg-surface-hover"><IconDotsVertical className="w-5 h-5"/></button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    <div className="max-w-3xl mx-auto space-y-6">
                        {activeChat && activeChat.messages.length <= 1 && !isLoading && (
                            <div className="flex flex-col items-center justify-center text-center pt-16">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 border-8 border-background">
                                    <AnavsanLogo className="w-8 h-8"/>
                                </div>
                                <h2 className="text-2xl font-semibold text-text-strong">How can I help you today?</h2>
                            </div>
                        )}
                        {activeChat?.messages.map((msg, index) => (
                            <div key={index} className="flex items-start gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'model' ? 'bg-primary/10' : 'bg-surface-nested'}`}>
                                    {msg.role === 'model' ? <AnavsanLogo className="w-5 h-5" /> : <IconUser className="w-5 h-5 text-text-secondary" />}
                                </div>
                                <div className="pt-1.5 prose prose-sm max-w-none text-text-primary prose-p:my-0 prose-p:whitespace-pre-wrap">
                                    <p>{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <AnavsanLogo className="w-5 h-5" />
                                </div>
                                <div className="pt-1.5 flex items-center gap-1.5">
                                    <span className="h-2 w-2 bg-text-muted rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></span>
                                    <span className="h-2 w-2 bg-text-muted rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></span>
                                    <span className="h-2 w-2 bg-text-muted rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                <div className="p-4 flex-shrink-0">
                    <div className="max-w-3xl mx-auto">
                        {activeChat && activeChat.messages.length <= 1 && !isLoading && (
                            <div className="grid grid-cols-2 gap-2 mb-2">
                                {suggestionPrompts.map(prompt => (
                                     <button key={prompt} onClick={() => setInput(prompt)} className="p-2 bg-surface-hover rounded-lg text-left text-sm text-text-primary hover:bg-surface-nested transition-colors border border-border-light">
                                         {prompt}
                                     </button>
                                ))}
                            </div>
                        )}
                        <form onSubmit={handleSendMessage} className="relative">
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage(e);
                                    }
                                }}
                                placeholder="Ask anything..."
                                className="w-full bg-input-bg border border-border-color rounded-2xl py-3 pl-4 pr-14 text-sm focus:ring-2 focus:ring-primary focus:border-transparent resize-none max-h-48 overflow-y-auto"
                                disabled={isLoading || !activeChat}
                                rows={1}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading || !activeChat}
                                className="absolute bottom-2 right-2 flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-white disabled:bg-surface-hover disabled:text-text-muted disabled:cursor-not-allowed"
                                aria-label="Send message"
                            >
                                <IconArrowUp className="w-5 h-5" />
                            </button>
                        </form>
                         <p className="text-xs text-center text-text-muted mt-2">Anavsan AI can make mistakes. Consider checking important information.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AIAgent;
