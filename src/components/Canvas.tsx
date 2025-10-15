"use client";
import { initDevtools } from "@pixi/devtools";
import { Application, extend, useApplication } from "@pixi/react";
import { Assets, Container, Sprite, Text, Texture, type Ticker } from "pixi.js";
import { useEffect, useRef, useState } from "react";

extend({ Container, Text, Sprite });

const generateGrid = (width: number, height: number) => {
  return Array.from({ length: width * height }, (_, i) => {
    const x = i % width;
    const y = Math.floor(i / 5);
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
      {generateGrid(5, 5).map(({ x, y, id }) => (
        <pixiSprite key={id} texture={texture} x={x * 40} y={y * 40} />
      ))}
    </pixiContainer>
  );
};

export const Canvas = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={canvasRef} className="w-9/10 h-9/10">
      <Application
        resizeTo={canvasRef}
        backgroundColor="#94a3b8"
        onInit={(app) => initDevtools(app)}
      >
        <BunnyGrid />
      </Application>
    </div>
  );
};
