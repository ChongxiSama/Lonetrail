---
title: "The Art of Code"
published: 2026-02-10
description: "Showcasing Lonetrail's syntax highlighting across JavaScript, Python, Rust, Go, and more."
tags: ["Code", "Programming", "Syntax Highlighting"]
category: "Tech"
image: ""
---

## Elegant Code

Good code reads like good writing — clear, concise, and purposeful. Below is a demonstration of Lonetrail's syntax highlighting across multiple programming languages.

### TypeScript

```typescript
interface Star {
  name: string;
  distance: number; // light years
  spectralType: string;
}

async function findNearestStars(
  maxDistance: number
): Promise<Star[]> {
  const response = await fetch(
    "https://api.stellar-db.example/stars"
  );
  const allStars: Star[] = await response.json();
  return allStars.filter(
    (star) => star.distance <= maxDistance
  );
}
```

### Python

```python
from dataclasses import dataclass
from typing import List
import asyncio


@dataclass
class Voyager:
    name: str
    launch_year: int
    speed: float  # km/s
    destination: str

    async def transmit(self, message: str) -> bool:
        """Transmit signal back to Earth"""
        delay = len(message) * 0.1  # simulate transmission delay
        await asyncio.sleep(delay)
        print(f"[{self.name}] Signal sent: {message}")
        return True


async def exploration_mission():
    voyager = Voyager(
        name="Lonetrail-1",
        launch_year=2147,
        speed=42.0,
        destination="Proxima Centauri b"
    )
    await voyager.transmit("Arrived at target sector, beginning observation")
```

### Rust

```rust
use std::collections::HashMap;

#[derive(Debug)]
struct NavigationSystem {
    waypoints: HashMap<String, (f64, f64, f64)>,
    current_position: (f64, f64, f64),
}

impl NavigationSystem {
    fn new() -> Self {
        NavigationSystem {
            waypoints: HashMap::new(),
            current_position: (0.0, 0.0, 0.0),
        }
    }

    fn add_waypoint(&mut self, name: &str, coords: (f64, f64, f64)) {
        self.waypoints.insert(name.to_string(), coords);
    }

    fn distance_to(&self, target: &str) -> Option<f64> {
        self.waypoints.get(target).map(|&(x, y, z)| {
            let dx = x - self.current_position.0;
            let dy = y - self.current_position.1;
            let dz = z - self.current_position.2;
            (dx * dx + dy * dy + dz * dz).sqrt()
        })
    }
}
```

### Go

```go
package stellar

import (
	"context"
	"fmt"
	"time"
)

type Probe struct {
	ID        string
	Launched  time.Time
	Status    string
	Telemetry chan Signal
}

type Signal struct {
	Timestamp time.Time
	Data      map[string]float64
	Strength  float64
}

func (p *Probe) StartMission(ctx context.Context) error {
	p.Status = "en_route"
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			p.Status = "offline"
			return ctx.Err()
		case <-ticker.C:
			signal := p.collectData()
			p.Telemetry <- signal
		}
	}
}

func (p *Probe) collectData() Signal {
	return Signal{
		Timestamp: time.Now(),
		Data: map[string]float64{
			"temperature": -270.4,
			"radiation":   0.87,
			"velocity":    42.0,
		},
		Strength: 0.92,
	}
}
```

### Inline Code

Call `calculateTrajectory(origin, destination, fuel)` which returns a `Trajectory` object. Use `pnpm dev` to start the development server.

### Terminal Commands

```bash
# Clone the theme
git clone https://github.com/ChongxiSama/Lonetrail.git
cd Lonetrail

# Install and run
pnpm install
pnpm dev

# Build
pnpm build
```

### Math Formulas

$$
E = mc^2
$$

$$
v = \sqrt{\frac{2GM}{r}}
$$

Lonetrail supports LaTeX math rendering via KaTeX, making it ideal for technical and scientific blogging.
