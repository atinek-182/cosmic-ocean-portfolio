# Cosmic Ocean: Asset Production Checklist (V1)

*This document defines every visual, audio, and UI asset required before development begins. It establishes strict polygon and memory budgets to guarantee mobile performance.*

---

## 1. Asset Naming Conventions & Folder Structure
Assets must perfectly align with the `Technical Architecture Document` (TAD) repository structure and the `Project Data Schema` IDs.

*   **Models:** `/public/assets/models/[type]_[name].glb`
*   **Textures:** `/public/assets/textures/[type]_[name].webp`
*   **Audio:** `/public/assets/audio/[type]_[name].mp3`
*   **Icons:** `/public/assets/icons/[type]_[name].svg`

---

## 2. Global Memory & Performance Budgets
To maintain <16ms frame times and prevent WebGL crashes on Android/iOS devices, the entire scene must adhere to these absolute budgets:

*   **Total Polygon Budget:** `< 100,000 Triangles`
*   **Total Draw Calls:** `< 80 per frame`
*   **Total Texture Memory:** `< 20 MB`
*   **Total Audio Memory:** `< 5 MB`
*   **Total Application Size:** `< 15 MB (Gzipped)`

---

## 3. Strict 3D Polygon Budgets

| Asset Category | Max Triangle Limit | Reasoning |
| :--- | :--- | :--- |
| **Player Boat** | `2,000 tris` | High visibility, constantly moving. |
| **Cosmic Whale** | `4,000 tris` | Requires joint bending/animation. |
| **Islands (Each)**| `20,000 tris` | Hub, Archipelago, Harbor. The heaviest meshes. |
| **Monoliths** | `2,000 tris` | Sharp, simple geometric structures. |
| **Collectibles** | `200 tris` | Starlight fragments (high instance count). |

---

## 4. Texture & Material Budgets

*   **Maximum Resolution:** `1024x1024` for islands. `512x512` for boat/whale.
*   **Material Strategy:** We exclusively use `MeshMatcapMaterial` or `MeshBasicMaterial` with baked vertex colors. Standard PBR (Physically Based Rendering) is banned in V1 due to lighting calculation costs.
*   **Format Policy:** All flat textures must be `.webp` (lossy, 80% quality). If VRAM becomes an issue, transition to `KTX2` for hardware-level decompression.
*   **Atlasing:** All islands must share a single global color palette texture atlas (1 material = 1 draw call).

---

## 5. Production Workflow Pipeline

Every asset must clear these stages before entering the `public/` directory:
1.  **Concept:** Block-out in Blender.
2.  **Production:** Final modeling and vertex painting.
3.  **Optimization:** Merge all vertices by distance. Delete non-visible internal geometry.
4.  **Compression:** Export via `glTF-Transform` using Draco compression (`-d`).
5.  **QA Validation:** Load into [glTF Viewer](https://gltf-viewer.donmccurdy.com/) to verify triangle count and material slots.
6.  **Final Import:** Place in `public/assets/models/` and add to the `AssetManifest`.

---

## 6. Complete Asset Inventory

### 6.1 3D Models
| Asset Name | File Name | Format | Compression | Target Tris | Status | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Player Boat | `boat_player.glb` | GLB | Draco | < 2k | Pending | P0 |
| Hub Lagoon | `island_hub.glb` | GLB | Draco | < 20k | Pending | P0 |
| Archipelago | `island_archipelago.glb` | GLB | Draco | < 20k | Pending | P0 |
| Monoliths | `island_monoliths.glb` | GLB | Draco | < 15k | Pending | P0 |
| The Harbor | `island_harbor.glb` | GLB | Draco | < 20k | Pending | P0 |
| Prototype Reef | `island_reef.glb` | GLB | Draco | < 10k | Pending | P1 |
| Observatory | `island_observatory.glb` | GLB | Draco | < 10k | Pending | P1 |
| Cosmic Whale | `whale_cosmic.glb` | GLB | Draco | < 4k | Pending | P2 |
| Starlight Frag | `fragment_starlight.glb` | GLB | Draco | < 200 | Pending | P0 |

### 6.2 Audio Asset Checklist
| Audio Event | File Name | Format | Target Duration | Looping? | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Ocean Ambience | `amb_ocean.mp3` | MP3 | 45s | Yes | P1 |
| Boat Wake Loop | `sfx_boat_move.mp3` | MP3 | 10s | Yes | P1 |
| Whale Breach | `sfx_whale_breach.mp3` | MP3 | 8s | No | P2 |
| Fragment Pickup | `sfx_pickup.mp3` | MP3 | 1s | No | P0 |
| Modal Open | `ui_modal_open.mp3` | MP3 | 0.5s | No | P0 |
| Lighthouse Ignite | `sfx_lighthouse.mp3` | MP3 | 5s | No | P1 |

### 6.3 UI & Content Assets
*   **Project Thumbnails:** `thumb_[projectId].webp` (Ratio: 16:9, Max Size: 50kb).
*   **Icons (SVG):** `icon_github.svg`, `icon_demo.svg`, `icon_close.svg`, `icon_resume.svg`.
*   **Fonts:** `Outfit.woff2`, `Inter.woff2` (Preloaded in `<head>`).

---

## 7. Asset Manifest & Loading Strategy

All assets are centrally registered in the `AssetManifest` to guarantee deterministic loading. Critical assets are preloaded, while secondary assets (Whale, Observatory) can be lazy-loaded if needed.

```typescript
interface AssetManifestNode {
    id: string; // Used by caching system
    type: "model" | "texture" | "audio" | "image";
    url: string;
    preloadPriority: 0 | 1 | 2; // 0 = Blocker (Hub/Boat), 1 = Standard (Projects), 2 = Deferred (Whale)
    fallbackUrl?: string; // Critical QA Rule: If main fails, load this.
}

const GlobalAssetManifest: AssetManifestNode[] = [
    { id: "boat", type: "model", url: "/assets/models/boat_player.glb", preloadPriority: 0, fallbackUrl: "/assets/models/fallback_box.glb" },
    { id: "island_hub", type: "model", url: "/assets/models/island_hub.glb", preloadPriority: 0 }
    // ...
];
```

---

## 8. Asset Dependency Graph
*Which systems break if an asset is missing?*

*   **BoatController** -> `boat_player.glb` (Critical. Fallback: Render primitive BoxGeometry).
*   **OceanShader** -> `tex_water_normals.webp` (Critical. Fallback: Generate procedural noise).
*   **WhaleSystem** -> `whale_cosmic.glb` (Non-Critical. Fallback: Silent failure, disable event).
*   **ResumeMode** -> `thumb_[projectId].webp` (Critical. Fallback: Render gray placeholder div).

---

## 9. Risk Analysis & QA Validation Rules

| Risk | Mitigation / QA Validation Rule |
| :--- | :--- |
| **Oversized GLBs** | CI/CD pipeline runs a script failing the build if any `.glb` > 3MB. |
| **Memory Explosion** | Disallow `.png` entirely for 3D textures. Only `.webp` or `.ktx2` allowed. |
| **Missing Fallbacks**| Schema validation checks `AssetManifest`. If priority `0` lacks a `fallbackUrl`, throw build error. |
| **Inconsistent Art** | All islands must share the exact same Matcap and Color Palette texture. |

---

## 10. Future Scalability Rules
If new projects are added in 2027:
1.  Add new `thumb_[projectId].webp` to `/public/assets/images/`.
2.  Update `data.json` to include the new project data and coordinate trigger.
3.  *The 3D pipeline requires zero changes.* The `InteractionSystem` will automatically read the JSON, spawn a generic monolith at the new coordinate, and map the UI thumbnail.
