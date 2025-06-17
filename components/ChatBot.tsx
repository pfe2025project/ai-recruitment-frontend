/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { Job } from '@/types/Job';
import { fetchJobs } from '@/lib/api/job';
import { useEffect } from 'react';

type Message = {
  content: string;
  isBot: boolean;
  jobs?: Job[];
};

export default function ChatBot({ pageContext }: { pageContext?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedJobs, setFetchedJobs] = useState<Job[]>([]);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const jobsData = await fetchJobs(); // You might want to pass params here
        setFetchedJobs(jobsData);
      } catch (error) {
        console.error('Failed to fetch jobs for chatbot:', error);
        // Optionally, set some default/empty jobs or show an error
      }
    };
    loadJobs();
  }, []);

  const handleLocationFilter = (location: string) => {
    return fetchedJobs.filter(job =>
      job.location.toLowerCase().includes(location.toLowerCase())
    );
  };

  const processJobQuery = (query: string) => {
    const locationMatch = query.match(/\b(in|at|near)\s+([\w\s]+?)\b(?=\W|$)/i);
    const jobTypeMatch = query.match(/(frontend|backend|fullstack)/i);
    const skillMatch = query.match(/(react|node\.js|python)/i);

    let filtered = fetchedJobs;

    if (locationMatch) {
      filtered = handleLocationFilter(locationMatch[2]);
    }
    if (jobTypeMatch) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(jobTypeMatch[0].toLowerCase())
      );
    }
    if (skillMatch) {
      filtered = filtered.filter(job =>
        job.skills?.some(skill =>
          skill.toLowerCase().includes(skillMatch[0].toLowerCase())
        )
      );
    }

    return {
      message: `Found ${filtered.length} matching jobs:`,
      jobs: filtered.slice(0, 3)
    };
  };

  const isJobQuery = (query: string) => {
    return /(job|position|frontend|backend|fullstack|react|node|location)/i.test(query);
  };

  const fetchAIResponse = async (query: string) => {
    // Attach page context to the prompt for better AI awareness
    const contextPrompt = pageContext ? `You are currently on the page: ${pageContext}. ` : '';
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528:free",
        messages: [{ role: 'user', content: contextPrompt + query }],
      }),
    });

    const data = await res.json();
    return data?.choices?.[0]?.message?.content || "Sorry, I couldn't understand that.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage;
    setMessages(prev => [...prev, { content: userMessage, isBot: false }]);
    setInputMessage('');
    setIsLoading(true);

    try {
      if (isJobQuery(userMessage)) {
        const { message, jobs: filteredJobs } = processJobQuery(userMessage);
        setMessages(prev => [
          ...prev,
          { content: message, isBot: true, jobs: filteredJobs }
        ]);
      } else {
        const aiReply = await fetchAIResponse(userMessage);
        setMessages(prev => [...prev, { content: aiReply, isBot: true }]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { content: "There was an error processing your message.", isBot: true }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-500">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-200 mb-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
          stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
          />
        </svg>
      </button>

      {/* Chat Box */}
      {isOpen && (
        <div className="bg-white w-80 h-[500px] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          <div className="bg-blue-600 text-white p-4 font-semibold text-lg">Assistant</div>

          <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`rounded-lg p-2 whitespace-pre-wrap ${
                  msg.isBot ? 'bg-white text-gray-700' : 'bg-blue-100 text-blue-800 self-end'
                }`}
              >
                <div>{msg.content}</div>
                {msg.jobs?.map((job, i) => (
                  <div key={i} className="mt-2 p-2 bg-gray-100 border rounded-md text-sm">
                    <div className="font-medium">{job.title}</div>
                    <div>{job.company?.name} – {job.location}</div>
                  </div>
                ))}
              </div>
            ))}
            {isLoading && <div className="text-gray-400 text-sm">Typing...</div>}
          </div>

          <form onSubmit={handleSubmit} className="border-t p-2 bg-white">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything..."
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </form>
        </div>
      )}
    </div>
  );
}
