<!-- Header Block -->
<div align="center">
  <br />
  <!-- Glowing Animated Banner (Pure Vector CSS SVG) -->
  <svg width="100%" height="160" viewBox="0 0 800 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>
      .text-title {
        font-family: 'Sora', 'Inter', system-ui, -apple-system, sans-serif;
        font-weight: 800;
        font-size: 46px;
        fill: url(#mintGradient);
        filter: drop-shadow(0px 15px 20px rgba(0, 110, 32, 0.25));
      }
      .text-subtitle {
        font-family: 'Inter', system-ui, sans-serif;
        font-weight: 500;
        font-size: 16px;
        fill: #3f4a3d;
        letter-spacing: 0.15em;
      }
      .glow-blob {
        animation: floatBlob 8s ease-in-out infinite alternate;
      }
      @keyframes floatBlob {
        0% { transform: translate(0px, 0px) scale(1); filter: blur(30px); opacity: 0.4; }
        100% { transform: translate(30px, -10px) scale(1.15); filter: blur(40px); opacity: 0.65; }
      }
    </style>
    <!-- Background Blur Decorative Blobs -->
    <circle class="glow-blob" cx="180" cy="80" r="70" fill="#98ff98" />
    <circle class="glow-blob" cx="620" cy="90" r="60" fill="#e8f3ea" style="animation-delay: -4s;" />
    
    <!-- Title Text -->
    <text x="50%" y="80" dominant-baseline="middle" text-anchor="middle" class="text-title">U P S C A L E F O R G E</text>
    <text x="50%" y="125" dominant-baseline="middle" text-anchor="middle" class="text-subtitle">AI-POWERED IMAGE & VIDEO SUPER-RESOLUTION</text>
    
    <defs>
      <linearGradient id="mintGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#006e20" />
        <stop offset="50%" stop-color="#16a34a" />
        <stop offset="100%" stop-color="#006e20" />
      </linearGradient>
    </defs>
  </svg>

  <p>
    <img src="https://img.shields.io/badge/React-18-006e20?style=for-the-badge&logo=react&logoColor=white" alt="React 18" />
    <img src="https://img.shields.io/badge/FastAPI-Python-006e20?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
    <img src="https://img.shields.io/badge/Tailwind--v4-Mint--M3-006e20?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind v4" />
    <img src="https://img.shields.io/badge/Hardware-Accelerated-006e20?style=for-the-badge&logo=nvidia&logoColor=white" alt="CUDA / MPS Ready" />
  </p>
  
  <p>
    A high-fidelity full-stack web application delivering state-of-the-art super-resolution and temporal frame interpolation for image and video formats. Completely local, sandboxed, and optimized for CUDA and Apple Silicon GPU cores.
  </p>
</div>

<hr style="border: 0; height: 1px; background-image: linear-gradient(to right, rgba(0, 110, 32, 0), rgba(0, 110, 32, 0.4), rgba(0, 110, 32, 0));" />

<!-- AI Pipeline Pulse Monitor (Glow CSS vector SVG) -->
<div align="center">
  <h3>⚡ Live AI Processing Pipeline Monitor</h3>
  <br />
  <svg width="640" height="150" viewBox="0 0 640 150" fill="none" xmlns="http://www.w3.org/2000/svg" style="background: #111411; border-radius: 20px; border: 1px solid rgba(0,110,32,0.25); box-shadow: 0 10px 30px rgba(0,110,32,0.15);">
    <style>
      .glow-node {
        animation: pulseNode 2s infinite ease-in-out alternate;
      }
      .line-flow {
        stroke-dasharray: 8 8;
        animation: marchFlow 3s infinite linear;
      }
      .core-pulse {
        animation: pulseCore 1.5s infinite alternate ease-in-out;
        transform-origin: 320px 75px;
      }
      .radar-sweep {
        animation: sweepRadar 4s infinite linear;
        transform-origin: 320px 75px;
      }
      @keyframes pulseNode {
        0% { r: 5; fill: #006e20; filter: drop-shadow(0 0 2px #006e20); }
        100% { r: 8; fill: #98ff98; filter: drop-shadow(0 0 8px #98ff98); }
      }
      @keyframes marchFlow {
        0% { stroke-dashoffset: 40; }
        100% { stroke-dashoffset: 0; }
      }
      @keyframes pulseCore {
        0% { transform: scale(0.92); opacity: 0.7; filter: drop-shadow(0 0 5px #006e20); }
        100% { transform: scale(1.08); opacity: 1; filter: drop-shadow(0 0 20px #98ff98); }
      }
      @keyframes sweepRadar {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .tag-text {
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        fill: #5e705c;
      }
    </style>

    <!-- Scanning Radar Grid -->
    <circle cx="320" cy="75" r="55" stroke="rgba(0,110,32,0.12)" stroke-width="1" />
    <circle cx="320" cy="75" r="35" stroke="rgba(0,110,32,0.08)" stroke-width="1" />
    <line x1="320" y1="20" x2="320" y2="130" stroke="rgba(0,110,32,0.08)" />
    <line x1="265" y1="75" x2="375" y2="75" stroke="rgba(0,110,32,0.08)" />
    
    <!-- Sweep Radar Line -->
    <line class="radar-sweep" x1="320" y1="75" x2="320" y2="20" stroke="rgba(152,255,152,0.3)" stroke-width="2" />

    <!-- Connected Data Flow Lines -->
    <path class="line-flow" d="M 80,75 L 265,75" stroke="#16a34a" stroke-width="2" />
    <path class="line-flow" d="M 375,75 L 560,75" stroke="#16a34a" stroke-width="2" style="animation-delay: -1.5s;" />
    
    <!-- Input Node -->
    <circle class="glow-node" cx="80" cy="75" r="6" />
    <text x="80" y="105" text-anchor="middle" class="tag-text">INPUT BUFFER</text>

    <!-- Active Processor Core (AI Kernel) -->
    <rect class="core-pulse" x="295" y="50" width="50" height="50" rx="10" fill="#006e20" stroke="#98ff98" stroke-width="2" />
    <text x="320" y="118" text-anchor="middle" class="tag-text" style="fill: #98ff98; font-weight: bold;">AI ENGINE</text>

    <!-- Output Node -->
    <circle class="glow-node" cx="560" cy="75" r="6" style="animation-delay: -1s;" />
    <text x="560" y="105" text-anchor="middle" class="tag-text">COMPILED OUT</text>
  </svg>
</div>

<br />

---

## 🌟 Key Features

<table width="100%">
  <tr>
    <td width="50%" valign="top">
      <h3>🖼️ AI Image Super-Resolution</h3>
      <ul>
        <li><b>Multi-Scale Selector</b>: 2×, 4×, 8× progressive, or Custom multiplier bounds from 1.5× to 16×.</li>
        <li><b>Next-Gen SOTA Models</b>: Real-ESRGAN, SwinIR Attention Transformer, and Generative SUPIR Diffusion.</li>
        <li><b>Interactive Split Canvas</b>: Real-time mouse-tracking comparator displaying raw source alongside actual compiled outputs.</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h3>🎬 Temporal Video Upscaler</h3>
      <ul>
        <li><b>Cinema Presets</b>: Upscale to 1080p Full HD, 4K Cinema, or 8K Super Hi-Vision.</li>
        <li><b>RIFE Interpolation</b>: Smart motion vector calculations to double or quadruple FPS (30 to 60/120 fps).</li>
        <li><b>Device-Tailored Estimation</b>: Live dynamic estimation mathematically calculating execution times.</li>
      </ul>
    </td>
  </tr>
</table>

---

## 🎨 Visual Design Token System

This project is built strictly around a customized **Material 3 Mint System** for premium glassmorphism:

<div align="center">
  <table style="border-collapse: collapse; border: none; background: transparent;">
    <tr style="background: transparent;">
      <td align="center" style="border: none;">
        <div style="width: 60px; height: 60px; background-color: #006e20; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,110,32,0.3); border: 2px solid white;"></div>
        <code style="font-size: 11px;">#006e20</code><br /><b>Primary Mint</b>
      </td>
      <td align="center" style="border: none; padding-left: 20px;">
        <div style="width: 60px; height: 60px; background-color: #98ff98; border-radius: 16px; box-shadow: 0 4px 12px rgba(152,255,152,0.3); border: 2px solid white;"></div>
        <code style="font-size: 11px;">#98ff98</code><br /><b>Container Highlight</b>
      </td>
      <td align="center" style="border: none; padding-left: 20px;">
        <div style="width: 60px; height: 60px; background-image: radial-gradient(circle at top left, #f9f9f9, #eff7f1, #e8f3ea); border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 2px solid #ccc;"></div>
        <code style="font-size: 11px;">Radial Gradient</code><br /><b>Background Depth</b>
      </td>
      <td align="center" style="border: none; padding-left: 20px;">
        <div style="width: 60px; height: 60px; background-color: rgba(255,255,255,0.45); backdrop-filter: blur(24px); border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid rgba(255,255,255,0.6);"></div>
        <code style="font-size: 11px;">Glassmorphic</code><br /><b>Sidebar Panels</b>
      </td>
    </tr>
  </table>
</div>

---

## ⚡ Technical Architecture

```mermaid
graph TD
  A[Browser Client<br/>React 18 + Vite] -->|Fetch POST Multipart| B[FastAPI Backend<br/>Uvicorn Server]
  A -->|WebSocket Stream| B
  B -->|Queue Task| C[Sequential Task Worker]
  C -->|Multi-Pass Engine| D{CUDA / MPS Available?}
  D -->|Yes| E[PyTorch Accelerated Pipeline<br/>Real-ESRGAN / BasicVSR++ / RIFE]
  D -->|No| F[High-Fidelity CPU Simulator<br/>Lanczos + Edge-Preserving Shaders]
  E -->|Job Progress Pushes| B
  F -->|Job Progress Pushes| B
  B -->|WebSocket Logs / Progress| A
```

---

## 🛠️ Interactive Details & Hardware Estimation

<details>
  <summary style="font-family: 'Sora', sans-serif; font-weight: 600; color: #006e20; cursor: pointer; padding: 8px 12px; background: rgba(0, 110, 32, 0.05); border-radius: 12px; outline: none; margin-bottom: 8px;">
    🧬 How the Device-Adaptive Time Estimator works (Click to Expand)
  </summary>
  <div style="padding: 12px; line-height: 1.6;">
    <p>UpscaleForge has an integrated performance profiling algorithm. When the workspace loads, the frontend queries the backend system resources to detect your GPU hardware tier:</p>
    <ul>
      <li><b>Accelerated Tier (NVIDIA CUDA / Apple Silicon MPS)</b>: Estimates use low base coefficients, enabling lightning-fast predictions (e.g., ~3s for standard 4x images).</li>
      <li><b>Fallback CPU Tier</b>: Automatically applies a 3.5× to 5.0× multiplier factor to match processing timelines on non-GPU instances.</li>
      <li><b>Dynamic Video Formula</b>:
        <pre>Total Frames = Video Duration × Selected Target FPS (30/60/120)<br />Total Time = Total Frames × Model Weight × Resolution Factor × Device Coefficient</pre>
      </li>
    </ul>
  </div>
</details>

<details>
  <summary style="font-family: 'Sora', sans-serif; font-weight: 600; color: #006e20; cursor: pointer; padding: 8px 12px; background: rgba(0, 110, 32, 0.05); border-radius: 12px; outline: none; margin-bottom: 8px;">
    🚀 Quick Setup & Run Instructions (Click to Expand)
  </summary>
  <div style="padding: 12px;">
    <h4>Prerequisites</h4>
    <ul>
      <li>Python 3.10+</li>
      <li>Node.js 18+</li>
      <li>FFmpeg installed and available on system PATH</li>
    </ul>
    
    <h4>Terminal 1 - Backend Server</h4>
    <pre>cd backend<br />pip install -r pyproject.toml # or use poetry/pipenv<br />python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload</pre>
    
    <h4>Terminal 2 - Frontend Web UI</h4>
    <pre>cd frontend<br />npm install<br />npm run dev</pre>
    <p>Open <b>http://localhost:5173/</b> in your browser and start upscaling!</p>
  </div>
</details>

<details>
  <summary style="font-family: 'Sora', sans-serif; font-weight: 600; color: #006e20; cursor: pointer; padding: 8px 12px; background: rgba(0, 110, 32, 0.05); border-radius: 12px; outline: none;">
    ⌨️ Power Keyboard Shortcuts (Click to Expand)
  </summary>
  <div style="padding: 12px;">
    <table width="100%">
      <thead>
        <tr style="background: rgba(0, 110, 32, 0.1);">
          <th>Shortcut</th>
          <th>Triggered Action</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>⌘O</code> / <code>Ctrl+O</code></td>
          <td>Launch native files upload prompt</td>
        </tr>
        <tr>
          <td><code>⌘1</code></td>
          <td>Switch to Image Workspace Mode</td>
        </tr>
        <tr>
          <td><code>⌘2</code></td>
          <td>Switch to Video Workspace Mode</td>
        </tr>
        <tr>
          <td><code>Space</code></td>
          <td>Play / Pause active video player timeline</td>
        </tr>
        <tr>
          <td><code>⌘Enter</code></td>
          <td>Submit job configuration and start Upscaling</td>
        </tr>
        <tr>
          <td><code>⌘D</code></td>
          <td>Download completed upscaled output stream</td>
        </tr>
        <tr>
          <td><code>Escape</code></td>
          <td>Instantly dismiss focus modals / overlays</td>
        </tr>
      </tbody>
    </table>
  </div>
</details>

---

<div align="center" style="background: radial-gradient(circle, rgba(152,255,152,0.1) 0%, transparent 80%); padding: 24px; border-radius: 16px;">
  <p style="font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; color: #006e20; margin: 0;">
    built by anuj with love and nicotine
  </p>
</div>
