import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  Sparkles,
  ShoppingBag,
  Truck,
  RotateCcw,
  Tag,
  Database,
  ChevronDown
} from 'lucide-react';
import './AIChatbot.css';

const QUICK_PROMPTS = [
  { icon: Tag, text: 'Active discount coupons', query: 'What coupons can I use on PACIFIC?' },
  { icon: Truck, text: 'Track my package', query: 'How can I track my order delivery?' },
  { icon: RotateCcw, text: 'Return & Exchange policy', query: 'What is your return and exchange policy?' },
  { icon: Database, text: 'PostgreSQL vs MongoDB', query: 'How does dual-database switching work in PACIFIC?' }
];

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! I am PACIFIC AI Assistant. How can I assist your luxury shopping experience today?',
      time: 'Just now'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const generateAIResponse = (userQuery) => {
    const q = userQuery.toLowerCase();

    if (q.includes('coupon') || q.includes('discount') || q.includes('promo') || q.includes('code') || q.includes('offer')) {
      return `Here are the active PACIFIC promo coupons you can apply at checkout:\n\n• **PACIFIC20**: 20% OFF up to ₹1,000 on orders over ₹500\n• **GOLD500**: Flat ₹500 OFF on orders above ₹2,000\n• **FESTIVE10**: 10% OFF on all orders\n• **WELCOME100**: Flat ₹100 Welcome bonus for first-time shoppers!\n\nEnter any of these in your Shopping Cart summary!`;
    }

    if (q.includes('track') || q.includes('courier') || q.includes('awb') || q.includes('ship') || q.includes('delivery')) {
      return `You can track all your active shipments in real-time under **Orders** -> click the **3PL Track** button! Our automated 3PL logistics integrate with Delhivery, BlueDart, and Shiprocket with live GPS milestone checkpoints.`;
    }

    if (q.includes('return') || q.includes('exchange') || q.includes('replace') || q.includes('refund')) {
      return `PACIFIC offers a **7-Day Hassle-Free Replacement & Return Guarantee**! \n\n• **Exchange**: Pick a different size or color on the Orders page for free doorstep reverse pickup.\n• **Cancellation**: You can cancel any order prior to dispatch with instant refund directly to your payment source.`;
    }

    if (q.includes('database') || q.includes('postgres') || q.includes('mongo') || q.includes('dbms')) {
      return `PACIFIC is powered by an enterprise dual-database architecture! Use the top navigation pills to switch between **PostgreSQL (Relational)** and **MongoDB (Document-Store)** dynamically. When products are updated in PostgreSQL, changes are dual-written to keep MongoDB synchronized in real-time.`;
    }

    if (q.includes('pincode') || q.includes('speed') || q.includes('express') || q.includes('same-day')) {
      return `We provide tiered delivery speeds across Indian PIN codes:\n• **Same-Day VIP Delivery** (Bangalore, Delhi, Mumbai, Hyderabad)\n• **Next-Day Express**\n• **Standard Free Shipping** on orders above ₹499.\nCheck deliverability directly on any product page!`;
    }

    return `Thank you for your message! Our concierge support team is here to assist with catalog recommendations, order fulfillment, express delivery, or returns. Feel free to explore our product categories or check out with our active promo code **PACIFIC20**!`;
  };

  const handleSend = (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const responseText = generateAIResponse(query);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 550);
  };

  return (
    <div className="jmart-ai-chatbot-root">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          className="chatbot-floating-trigger"
          onClick={() => setIsOpen(true)}
          title="Open PACIFIC Concierge & AI Support"
          aria-label="Open AI Assistant"
        >
          <div className="trigger-icon-wrap">
            <Sparkles size={18} className="trigger-sparkle" />
            <Bot size={22} className="trigger-bot" />
          </div>
          <span className="trigger-label">PACIFIC AI</span>
        </button>
      )}

      {/* Chat Pane */}
      {isOpen && (
        <div className="chatbot-window-card animate-fade-in">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">
                <Bot size={18} />
              </div>
              <div>
                <div className="chatbot-title">PACIFIC Concierge AI</div>
                <div className="chatbot-status">
                  <span className="status-dot"></span> Online · Instant Support
                </div>
              </div>
            </div>
            <button
              type="button"
              className="chatbot-close-btn"
              onClick={() => setIsOpen(false)}
              title="Close Chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick FAQ Suggestion Chips */}
          <div className="chatbot-quick-chips">
            {QUICK_PROMPTS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  className="quick-chip-btn"
                  onClick={() => handleSend(item.query)}
                >
                  <Icon size={12} color="var(--color-primary)" />
                  <span>{item.text}</span>
                </button>
              );
            })}
          </div>

          {/* Messages Stream */}
          <div className="chatbot-messages-stream">
            {messages.map((m) => (
              <div key={m.id} className={`chat-message ${m.sender}`}>
                <div className="message-bubble">
                  {m.text.split('\n').map((line, i) => (
                    <p key={i} style={{ margin: line ? '0.2rem 0' : '0.4rem 0' }}>
                      {line}
                    </p>
                  ))}
                  <span className="message-time">{m.time}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-message bot">
                <div className="message-bubble typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form
            className="chatbot-input-row"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              placeholder="Ask about orders, returns, coupons..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="chatbot-input"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="chatbot-send-btn"
              title="Send Message"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
