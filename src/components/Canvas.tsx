"use client";
import { initDevtools } from "@pixi/devtools";
import { Application, extend } from "@pixi/react";
import { Assets, Container, Sprite, Text, Texture } from "pixi.js";
import { useEffect, useRef, useState } from "react";

extend({ Container, Text, Sprite });

export const Canvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [texture, setTexture] = useState(Texture.EMPTY);

  useEffect(() => {
    if (texture === Texture.EMPTY) {
      // Assets.load("https://pixijs.com/assets/bunny.png").then(
      Assets.load("/circuit/10.png").then((texture: Texture) =>
        setTexture(texture),
      );
    }
  }, [texture]);

  return (
    <div ref={containerRef} className="w-9/10 h-9/10">
      <Application
        resizeTo={containerRef}
        backgroundColor="#94a3b8"
        onInit={(app) => initDevtools(app)}
      >
        <pixiContainer>
          <pixiText text="test" />
          <pixiSprite texture={texture} x={100} y={100} />
        </pixiContainer>
      </Application>
    </div>
  );
};
