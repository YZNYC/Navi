import { RippleEffect } from "../ripple-effect"
import { TextGenerateEffect } from "../ui/text-generate-effect";

const words = ` Encontre vagas e pague pelo app`;

export default function Banner() {
  return (
    <>
      <div className="w-full h-screen overflow-hidden relative">
        <video
          src="/carro3.mp4"
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center gap-4 z-10">
          <TextGenerateEffect words={words} />
          <h2 className="text-white text-[20px] md:text-2xl">
            Rápido, prático e seguro.
          </h2>
          <RippleEffect className="rounded-lg transform-transition duration-200 hover:scale-105">
            <button className="px-6 py-3 bg-yellow-500 dark:bg-gray-500 text-white rounded-lg cursor-pointer">
              Baixe no Android
            </button>
          </RippleEffect>
        </div>
      </div>
    </>
  );
}
