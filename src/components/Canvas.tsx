"use client";
import { initDevtools } from "@pixi/devtools";
import { Application, extend, useApplication } from "@pixi/react";
import {
  Assets,
  Container,
  Graphics,
  Sprite,
  Text,
  Texture,
  type Ticker,
} from "pixi.js";
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { type Cell, newGrid, WFC } from "@/lib/WFC";
import "@/lib/generateStates";
import { stateNames } from "@/lib/generateStates";

extend({ Container, Text, Sprite, Graphics });

export interface DoGenerateState {
  doGenerate: boolean;
  setDoGenerate: Dispatch<SetStateAction<boolean>>;
}

export type Textures = Record<string, Texture>;

const generateStateTextures = () => {
  const textures = {} as Record<string, Texture>;
  stateNames.forEach((state) => {
    const [name, rotation] = state.split("_");
    const texture: Texture = Assets.get(name);
    const newTexture = new Texture({
      source: texture.source,
      rotate: (8 - Number(rotation) * 2) % 8, // flip rotation
    });
    textures[state] = newTexture;
  });
  return textures;
};

const generateGridIndex = (width: number, height: number) => {
  return Array.from({ length: width * height }, (_, i) => {
    const x = i % width;
    const y = Math.floor(i / height);
    return { x, y, id: `${x}-${y}` };
  });
};

const BunnyGrid = () => {
  const { app } = useApplication();
  const containerRef = useRef<Container>(null);
  const [texture, setTexture] = useState(Texture.EMPTY);

  useEffect(() => {
    if (texture !== Texture.EMPTY) return;
    Assets.load("https://pixijs.com/assets/bunny.png").then(
      // Assets.load("/circuit/10.png").then(
      (texture: Texture) => setTexture(texture),
    );
  }, [texture]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.pivot.x = container.width / 2;
    container.pivot.y = container.height / 2;

    const rotate = (ticker: Ticker) => {
      if (!containerRef.current) return;
      containerRef.current.rotation -= 0.01 * ticker.deltaTime;
    };

    app.ticker.add(rotate);

    return () => {
      app.ticker.remove(rotate);
    };
  }, [app]);

  return (
    <pixiContainer
      ref={containerRef}
      x={app.screen.width / 2}
      y={app.screen.height / 2}
    >
      {generateGridIndex(5, 5).map(({ x, y, id }) => (
        <pixiSprite key={id} texture={texture} x={x * 40} y={y * 40} />
      ))}
    </pixiContainer>
  );
};

const ImageGrid = ({ doGenerate, setDoGenerate }: DoGenerateState) => {
  const dim = 30;
  const [loaded, setLoaded] = useState(false);
  const [textures, setTextures] = useState<Record<string, Texture>>({});
  const [grid, setGrid] = useState<Cell[]>(newGrid(dim));
  const cellRefs = useRef<(Sprite | null)[]>([]);
  const { app } = useApplication();

  const size = app.screen.width / dim;
  const numStates = 5;
  const gridIndex = generateGridIndex(dim, dim);

  useEffect(() => {
    // Load images
    (async () => {
      for (let i = 0; i < numStates; i++) {
        await Assets.load({ alias: i.toString(), src: `knots/${i}.png` });
      }
      setLoaded(true);
      setTextures(generateStateTextures());
    })();
  }, []);

  useEffect(() => {
    if (!doGenerate) return;
    setGrid(WFC(grid, textures));
    setDoGenerate(false);
  }, [doGenerate, setDoGenerate, grid, textures]);

  const drawGrid = (graphics: Graphics) => {
    graphics.clear();
    gridIndex.forEach(({ x, y }) => {
      graphics.rect(x * size, y * size, size, size).stroke({ color: 0 });
    });
  };

  return (
    <>
      {!doGenerate && <pixiGraphics draw={drawGrid} />}
      {loaded &&
        gridIndex.map(({ x, y, id }, i) => {
          grid[i].pos = i;
          grid[i].x = x;
          grid[i].y = y;
          return (
            <pixiSprite
              ref={(sprite) => {
                if (sprite) {
                  cellRefs.current[i] = sprite;
                  grid[i].sprite = sprite;
                }
              }}
              texture={Texture.EMPTY}
              key={id}
              x={x * size}
              y={y * size}
              height={size}
              width={size}
            />
          );
        })}
    </>
  );
};

export const Canvas = (props: DoGenerateState) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={canvasRef} className="w-9/10 h-9/10">
      <Application
        resizeTo={canvasRef}
        backgroundColor="#94a3b8"
        onInit={(app) => initDevtools(app)}
      >
        {/* <BunnyGrid /> */}
        <ImageGrid {...props} />
      </Application>
    </div>
  );
};
