"use client";
import { useState } from "react";
import { Canvas } from "@/components/Canvas";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex bg-slate-200 border-2 border-slate-100 rounded-2xl shadow-md",
        className,
      )}
    >
      {children}
    </div>
  );
};

const tiles = ["🏡", "🏢", "⛲️", "🪨", "⛰️", "🌳"];

export default function Home() {
  const [doGenerate, setDoGenerate] = useState(false);

  return (
    <div className="font-sans grid grid-cols-[1fr_340px] items-center justify-center min-h-screen">
      <main className="h-full w-full flex justify-center items-center bg-slate-200">
        <Canvas doGenerate={doGenerate} setDoGenerate={setDoGenerate} />
      </main>
      <div className="h-full flex flex-col items-center gap-14 bg-slate-300 shadow-md border-l-2 border-slate-200">
        <Container className="w-9/10 px-2 py-3 mt-8 justify-center">
          <h1 className="font-semibold text-3xl text-center">
            Open City 🏡🏢🌳
          </h1>
        </Container>
        <Container className="flex-col w-9/10 p-2 gap-2">
          <div className="text-xl ml-2">
            <span className="font-semibold">User: </span>
            InterstellarMist
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="bg-slate-100 hover:bg-slate-300/50 cursor-pointer"
          >
            Log Out
          </Button>
        </Container>
        <div className="w-full flex flex-col items-center gap-2">
          <h2 className="text-xl font-semibold">Tiles</h2>
          <Container className="w-9/10 h-100 grid grid-cols-3 auto-rows-min gap-y-2 gap-x-4 p-4">
            {tiles.map((tile) => (
              <span
                key={tile}
                className="text-4xl text-center p-2 hover:bg-white/50 rounded-lg hover:cursor-grab active:cursor-grabbing"
              >
                {tile}
              </span>
            ))}
          </Container>
        </div>
        <Button
          className="w-9/10 text-xl h-14 rounded-2xl border-2 border-slate-600 cursor-pointer"
          size="lg"
          onClick={() => setDoGenerate(true)}
        >
          Generate
        </Button>
      </div>
    </div>
  );
}
