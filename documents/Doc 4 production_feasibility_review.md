# Production Feasibility Review & V1 Scope

*This document analyzes the Cosmic Ocean GDD to prevent "Scope Creep," addressing the critical risk of building a 2-year indie game instead of a 2-month high-impact portfolio.*

## 1. Feature Classification & Risk Assessment

### 1.1 Core Regions
| Feature | Classification | Dev Difficulty | Modeling Difficulty | Performance Risk | Recruiter Impact |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hub Lagoon** | Must Have | Low | Low | Low | High (First impression) |
| **Tech Archipelago** | Must Have | Medium | Low | Low | High (Skills) |
| **Project Monoliths** | Must Have | Medium | Low | Low | Extreme (Case Studies) |
| **The Harbor (Contact)** | Must Have | Low | Low | Low | Extreme (Conversion) |
| **Prototype Reef** *(Replaces Creative Lab)* | Should Have | Low | Medium | Medium | High (Personality) |
| **Secret Observatory** | Should Have | Low | Medium | Low | High (Easter Egg) |
| **Open Source Atoll** | Nice To Have | Low | Low | Low | Medium |
| **Storm of Challenges** | Cut For V1 | High | Medium | High | High |

### 1.2 Systems & Mechanics
| Feature | Classification | Dev Difficulty | Modeling Difficulty | Performance Risk | Recruiter Impact |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Starlight Fragments (Collectibles)** | Must Have | Medium | Low | Low | High (Drives engagement) |
| **The Cosmic Whale (Simplified)** | Must Have | Medium | Medium | Medium | Extreme (WOW Moment) |
| **Volumetric Nebula Storms** | Should Have | Medium | Low | High | Medium |
| **Dynamic Skybox (Water ripples distorting stars)** | Cut For V1 | High | Low | High | Low |
| **Astral Currents (Auto-driving splines)** | Cut For V1 | High | Low | Low | Low |

---

## 2. Managerial Interventions (Course Corrections)

### 2.1 The "Too Much Content" Risk
**The Problem:** The Reddit critiques of Bruno Simon's portfolio highlighted that users spent too much time playing with physics and often completely missed his actual resume/projects. 9 regions + collectibles is a massive risk.
**The Solution:** We are cutting the *Storm of Challenges* and pushing the *Open Source Atoll* to V2. We are laser-focusing the map on the Monoliths (Projects), the Archipelago (Skills), and the Harbor (Contact). The progression must physically funnel them toward the resume data.

### 2.2 Fixing the Observatory Reward
**The Problem:** The "Crystal Boat" reward requires a new 3D model, new material shaders, new particle emissions, and extensive testing, yielding very little actual portfolio value.
**The Solution:** The Observatory will now unlock a **Hidden Developer Timeline / Secret Story**. Finding the telescope opens a beautiful HTML modal showing the developer's personal journey, an abandoned passion project, or a timeline of their career. It requires zero new 3D models and provides massive narrative/resume value.

### 2.3 Replacing the Creative Lab
**The Problem:** The "Physics Playground" is too similar to Bruno Simon's portfolio. It feels derivative.
**The Solution:** It has been completely replaced by the **Prototype Reef**. Instead of generic physics toys, this region houses the developer's *Failed Experiments, Abandoned Concepts, and Shader Playgrounds*. It is deeply personal, demonstrating a willingness to fail, learn, and iterate—traits highly valued by Senior Engineering Managers.

### 2.4 De-risking the Cosmic Whale
**The Problem:** Building a AAA cinematic sequence (camera interpolation, motion capture animations, complex boid AI) could easily delay the launch by 2 months.
**The Solution:** Keep the Whale as the "WOW Moment", but execute it cheaply. 
- **Simple Model:** A low-poly mesh with a basic glowing blue material.
- **Simple Animation:** A hardcoded `GSAP` spline jump. No complex skeletal rigs.
- **Simple Particles:** Basic `THREE.Points` splashing outward on impact. 
It will still look stunning because of the lighting and audio (the silence before the breach), but it will take 3 days to build instead of 60.

---

## 3. The Recommended V1 Scope

To ensure a realistic launch timeline while maximizing Recruiter Impact, the V1 build will strictly contain:

### V1 World Map (5 Regions)
1. **Hub Lagoon:** Drop-in zone.
2. **Tech Archipelago:** The skills showcase.
3. **Project Monoliths:** The core case studies.
4. **Prototype Reef:** The personal/failed experiments showcase.
5. **The Harbor:** The Contact form.
*(Hidden)* **Secret Observatory:** Unlocks the Developer Timeline.

### V1 Mechanics
- **Basic Boat Kinematics:** WASD thrust and drag. No Rapier.js rigid bodies.
- **Starlight Fragments:** Basic collection state (`zustand` or singleton) that triggers the Lighthouse at the end.
- **Proximity HTML UI:** Sleek, DOM-based modals that fade in when near an island.
- **The Whale Breach:** A scripted, low-poly GSAP animation triggered by crossing a specific Z-coordinate threshold in the deep water.
- **Static Skybox/Fog:** High-quality baked environment maps and standard `scene.fog` (cutting the dynamic real-time reflections and heavy volumetrics for V1).

### Conclusion
This V1 scope guarantees the portfolio remains "Game First" through the tactile boat mechanics and the Starlight Fragment quest, but brutally strips away any feature that distracts from the core goal: getting the recruiter to read the case studies and click "Contact Me."
