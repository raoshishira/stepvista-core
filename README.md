# StepVista Core (`@stepvista/core`)
**Copyright (c) 2026 Shishira Rao H A**

> **High-performance interactive physics simulation engine for browser-based learning.**
>
> 🚀 **See it in action:** [lab.stepvista.com](https://lab.stepvista.com)

StepVista Core is a library of open-source components designed to transform static educational content into active, discovery-based experiences. It provides the fundamental building blocks for creating high-fidelity physics simulations that run smoothly in low-bandwidth environments.

## 🔬 Core Philosophy

This library is built on the principle of **Guided Discovery**:
- **Interactive First:** Students learn by manipulating variables rather than watching videos.
- **Conceptual Accuracy:** Math and visual logic are aligned with standard university-level physics principles.
- **Lightweight & Accessible:** SVG-based components optimized for mobile devices and classroom smart boards.

## 🏗️ Technical Stack

- **Framework:** [Svelte 5](https://svelte.dev/) (utilizing Runes for reactive state management).
- **Rendering:** Resolution-independent SVG.
- **Styling:** Tailwind CSS.
- **Math:** KaTeX for LaTeX rendering and a custom `physics-engine` with 3D support, high-precision snapping, and decimal formatting.

## 📦 Components

| Ingredient | Purpose |
| :--- | :--- |
| `SV-Grid` | A responsive Cartesian coordinate system with snappable grid lines. |
| `SV-Vector` | Draggable arrows with real-time magnitude and angular calculation. |
| `MathView` | A live LaTeX calculator that interpolates template strings with dynamic values. |
| `ZDirectionIndicator` | Renders textbook-standard symbols for Z-axis orientation (⊙ and ⊗). |
| `Physics-Engine` | High-precision utilities for 3D vector operations, cross products, and 2.5D projections. |

## 🚀 Installation

```bash
npm install @stepvista/core
```

## ⚖️ Licensing

Licensed under the **Creative Commons Attribution 4.0 International (CC BY 4.0)**.

Allows anyone to share, adapt, and use the engine commercially, provided that **appropriate credit (Attribution)** is given to **Shishira Rao H A** and a link to the original license is provided.

---

## 🛠️ Developer Guide

### 1. Initial Setup
```bash
npm install
```

### 2. Local Development
Preview components and test logic in the local workspace:
```bash
npm run dev
```

### 3. Linking to External Projects
To use this library locally in your platform repository:

**In `stepvista-core`:**
```bash
npm link
```

**In your platform repo:**
```bash
npm link @stepvista/core
```

### 4. Build Process
```bash
npm run build
```
*The build preserves internal attribution signatures while optimizing SVG performance.*

---

**Built by Shishira Rao H A.**

---