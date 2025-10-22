import React, { useState, useRef, useEffect, useCallback } from 'react';
import { runAdminCommand } from '../services/geminiService';
import ThreeScene from './ThreeScene';

interface Message {
  sender: 'user' | 'system' | 'error';
  text: string;
}

const SyntropicAdminConsole: React.FC = () => {
  const [isSyntropicMode, setIsSyntropicMode] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFakeError, setShowFakeError] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // FIX: Refactored useEffect to correctly handle setTimeout in a browser environment
  // and fix the "Cannot find namespace 'NodeJS'" error by letting TypeScript infer the type.
  useEffect(() => {
    if (isSyntropicMode) {
      return;
    }
    const errorTimer = setTimeout(() => setShowFakeError(true), 5000);
    return () => clearTimeout(errorTimer);
  }, [isSyntropicMode]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setUploadedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
    if(fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCommandSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const command = inputValue.trim();
    if (!command && !uploadedImage) return;

    if (command === 'TESLA-D9111') {
      setIsSyntropicMode(true);
      setMessages([{ sender: 'system', text: 'SYNTR-OP_ADMIN_CONSOLE::ACCESS_GRANTED. D9111 seed validated. Welcome, Administrator.' }]);
      setInputValue('');
      return;
    }

    if (!isSyntropicMode) {
      setShowFakeError(true);
      setTimeout(() => setShowFakeError(false), 3000);
      setInputValue('');
      return;
    }

    const fullCommand = uploadedImage ? `[Image Attached] ${command}` : command;
    setMessages(prev => [...prev, { sender: 'user', text: fullCommand }]);
    setInputValue('');
    setIsLoading(true);

    if (command.toLowerCase() === 'play heavenzfire') {
      if (!audioRef.current) {
        // Using a placeholder URL as backend/assets are not available.
        audioRef.current = new Audio('https://www.soundjay.com/buttons/sounds/button-3.mp3');
      }
      try {
        await audioRef.current.play();
        setMessages(prev => [...prev, { sender: 'system', text: 'HeavensFire audio cue initiated.' }]);
      } catch (error) {
        setMessages(prev => [...prev, { sender: 'error', text: 'Audio playback failed.' }]);
      }
      setIsLoading(false);
      clearImage();
      return;
    }

    const response = await runAdminCommand(command, uploadedImage || undefined);
    setMessages(prev => [...prev, { sender: response.isError ? 'error' : 'system', text: response.text }]);
    setIsLoading(false);
    clearImage();
  }, [inputValue, isSyntropicMode, uploadedImage]);


  if (!isSyntropicMode) {
    return (
      <div className="fixed bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 w-96 bg-gray-200 border-2 border-t-white border-l-white border-r-gray-500 border-b-gray-500 shadow-lg font-comic text-black">
        <div className="bg-blue-800 text-white p-1 flex justify-between items-center">
          <span>C:\\&gt; SEQA-DARK Console</span>
          <button onClick={() => setShowFakeError(true)} className="bg-gray-200 text-black font-bold w-5 h-5 border-2 border-t-white border-l-white border-r-gray-500 border-b-gray-500">X</button>
        </div>
        <div className="p-4">
          <p>Enter command:</p>
          <form onSubmit={handleCommandSubmit}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-white border border-gray-500 p-1 mt-2 focus:outline-none"
              autoFocus
            />
          </form>
          {showFakeError && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
              <div className="bg-gray-200 p-4 border-2 border-t-white border-l-white border-r-gray-500 border-b-gray-500 w-4/5 text-center">
                <p className="text-red-600 font-bold">General Protection Fault</p>
                <p className="text-xs mt-2">A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) + 00010E36.</p>
                <button onClick={() => setShowFakeError(false)} className="mt-4 px-4 py-1 bg-gray-300 border-2 border-t-white border-l-white border-r-gray-500 border-b-gray-500">Close</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <ThreeScene />
      <div className="fixed inset-0 flex flex-col bg-slate-900 bg-opacity-80 backdrop-blur-sm p-4 font-mono z-20">
        <div className="flex-grow overflow-y-auto pr-4">
          {messages.map((msg, index) => (
            <div key={index} className="mb-2">
              {msg.sender === 'user' && (
                <p><span className="text-green-400">root@syntropic-console:~$</span> {msg.text}</p>
              )}
              {msg.sender === 'system' && (
                <p className="text-cyan-300 whitespace-pre-wrap">{`> ${msg.text}`}</p>
              )}
              {msg.sender === 'error' && (
                <p className="text-red-500">{`> ERROR: ${msg.text}`}</p>
              )}
            </div>
          ))}
          {isLoading && <p className="text-yellow-400 animate-pulse">> Processing...</p>}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex-shrink-0 pt-4">
          {imagePreview && (
            <div className="relative w-24 h-24 mb-2">
              <img src={imagePreview} alt="upload preview" className="w-full h-full object-cover rounded" />
              <button onClick={clearImage} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">&times;</button>
            </div>
          )}
          <form onSubmit={handleCommandSubmit} className="flex items-center gap-4">
            <span className="text-green-400">root@syntropic-console:~$</span>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-grow bg-transparent border-b border-cyan-400 text-cyan-300 focus:outline-none focus:border-cyan-200"
              autoFocus
              disabled={isLoading}
            />
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1 bg-cyan-700 text-white rounded hover:bg-cyan-600 disabled:opacity-50"
              disabled={isLoading}
            >
              Attach Image
            </button>
            <button type="submit" className="px-3 py-1 bg-green-700 text-white rounded hover:bg-green-600 disabled:opacity-50" disabled={isLoading}>
              Execute
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SyntropicAdminConsole;
