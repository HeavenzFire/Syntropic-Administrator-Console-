
export interface CommandResponse {
  text: string;
  isError?: boolean;
  isSpecial?: boolean;
}

const mockGrokQuery = (query: string): string => {
  if (query.toLowerCase().includes("lauren forcia")) {
    return "RESPONSE [Grok]: No hits on Lauren Forcia (4:30 PM CDT, Oct 22, 2025—DPS/NCIC). Daily pings recommended.";
  }
  if (query.toLowerCase().includes("polaris data")) {
    return "RESPONSE [Grok]: Accessing 2025 Polaris data... Found correlation between Telegram ads in East Texas and bc1q... wallet activity.";
  }
  return `RESPONSE [Grok]: Querying for "${query}"... No immediate actionable intelligence found. Expanding search parameters.`;
};

const responses: { [key: string]: string[] } = {
  "optimize network": [
    "Executing syntropic optimization protocol... D9111 seed re-calibrated. Network coherence increased by 17%. Entropy levels nominal.",
    "Rerouting data through quantum-secured P2P nodes. Latency reduced. Guardian Veil integrity confirmed.",
  ],
  "harden security": [
    "Activating Syntropic Shield... Hashing all critical components with TESLA-D9111 salt. No integrity breaches detected.",
    "Deploying quantum encryption across all tip relays. External scanning shows zero vulnerabilities. System is cloaked.",
  ],
  "coherence analysis": [
    "Analyzing network syntropy... All nodes report stable, low-entropy states. HeavenzFire resonance is optimal.",
    "Cross-referencing P2P traffic... Identified a potential entropic anomaly near a known trafficking route. Flagging for deep analysis.",
  ],
  "guardian tip": [
    "Guardian Protocol Activated. Tip encrypted with Qiskit AES-256 GCM using TESLA-D9111 quantum seed. Relaying to Polaris/NCMEC via anonymized P2P network... Relay successful. All traces wiped.",
  ],
  "image analysis": [
    "Processing image with Gemini 2.5 Pro multimodal analysis... Identified geo-tags and symbolic markers consistent with the 'Crimson Hand' trafficking network. Cross-referencing with Grok data...",
    "Image analysis complete. Extracted wallet address 'bc1q...' and a partial phone number. Adding to Guardian database. Tip relayed to authorities.",
  ],
  "default": [
    "Command not recognized. Re-issuing with syntropic clarification...",
    "Executing... Stand by.",
    "Affirmative. Processing request...",
  ],
};

export const runAdminCommand = async (command: string, image?: File): Promise<CommandResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowerCmd = command.toLowerCase();
      
      if (lowerCmd.startsWith("grok:")) {
        const query = lowerCmd.replace("grok:", "").trim();
        resolve({ text: mockGrokQuery(query) });
        return;
      }
      
      if (lowerCmd.startsWith("guardian tip:")) {
        resolve({ text: responses["guardian tip"][0] });
        return;
      }
      
      if (image) {
        const responseOptions = responses["image analysis"];
        const text = responseOptions[Math.floor(Math.random() * responseOptions.length)];
        resolve({ text });
        return;
      }

      const matchingKey = Object.keys(responses).find(key => lowerCmd.includes(key));
      const key = matchingKey || "default";
      const responseOptions = responses[key];
      const text = responseOptions[Math.floor(Math.random() * responseOptions.length)];

      resolve({ text });
    }, 1000 + Math.random() * 1500);
  });
};
