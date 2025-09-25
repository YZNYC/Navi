import { RippleEffect } from "../ripple-effect"

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
            <h1 className="text-white dark:text-white text-5xl font-bold">
              Encontre vagas e pague pelo <span className="text-yellow-500 dark:text-gray-500">app</span> 
            </h1>
            <h2 className="text-white text-2xl">
              Rápido, prático e seguro.
            </h2>
            <RippleEffect className="rounded-lg transform-transition duration-200 hover:scale-105">
            <button className="px-6 py-3 bg-yellow-500 dark:bg-gray-500 text-white rounded-lg cursor-pointer">
              Baixe no Android
            </button>
            </RippleEffect>
          </div>
        </div>
        <hr className="bg-yellow-500 h-5 dark:bg-gray-500"></hr>
      </>
    );
  }
  