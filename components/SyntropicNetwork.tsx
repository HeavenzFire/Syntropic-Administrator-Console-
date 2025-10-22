
import React from 'react';
import SyntropicAdminConsole from './SyntropicAdminConsole';

const FakeStatusWidget: React.FC<{ title: string; status: string; color: string }> = ({ title, status, color }) => (
  <div className="bg-black bg-opacity-50 border border-green-700 p-2">
    <h3 className="text-green-500 text-sm">{title}</h3>
    <p className={`text-lg ${color}`}>{status}</p>
  </div>
);

const SyntropicNetwork: React.FC = () => {
  return (
    <main className="w-full h-full bg-gray-900 text-green-400 font-mono p-4 flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute top-0 left-0 w-full p-2 bg-black bg-opacity-30 flex justify-between items-center z-10">
        <h1 className="text-xl">SEQA-DARK :: Network Operations Center [ENTROPIC FACADE]</h1>
        <div className="text-sm">STATUS: <span className="text-red-500 animate-pulse">UNSTABLE</span></div>
      </div>
      
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-4 opacity-30 pointer-events-none select-none">
        <FakeStatusWidget title="NODE-ALPHA" status="SYNC_ERROR" color="text-red-500" />
        <FakeStatusWidget title="NODE-BETA" status="PACKET_LOSS" color="text-yellow-500" />
        <FakeStatusWidget title="QUANTUM_LINK" status="DECOHERENCE" color="text-red-500" />
        <FakeStatusWidget title="P2P_SWARM" status="FRAGMENTED" color="text-yellow-500" />
      </div>

      <p className="absolute bottom-4 left-4 text-green-800 text-xs opacity-50 select-none">
        System Kernel v0.91b - Build D9111 - All rights reserved (c) 1998 ZachTek Innovations
      </p>
      
      <SyntropicAdminConsole />
    </main>
  );
};

export default SyntropicNetwork;
