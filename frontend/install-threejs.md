# Three.js Installation Guide

To use the advanced 3D spinning world component, you need to install Three.js:

```bash
cd frontend
npm install three @types/three
```

After installation, you can use either:

1. **SpinningWorld3D** - CSS-based animation (no dependencies)
2. **SpinningWorld3DAdvanced** - Three.js-based realistic 3D (requires Three.js)

## Usage Examples:

### Basic CSS Version:
```tsx
import SpinningWorld3D from './components/SpinningWorld3D';

<SpinningWorld3D size={200} className="my-world" />
```

### Advanced Three.js Version:
```tsx
import SpinningWorld3DAdvanced from './components/SpinningWorld3DAdvanced';

<SpinningWorld3DAdvanced width={400} height={400} className="my-3d-world" />
```

## Features:

### SpinningWorld3D (CSS):
- ✅ Pure CSS animations
- ✅ Lightweight
- ✅ Responsive
- ✅ 3 airplanes orbiting
- ✅ Spinning globe with continents
- ✅ Atmosphere glow effect
- ✅ Flight path trails

### SpinningWorld3DAdvanced (Three.js):
- ✅ Real 3D rendering
- ✅ Realistic lighting
- ✅ Smooth animations
- ✅ Better performance for complex scenes
- ✅ More customizable
- ✅ WebGL acceleration