'use client'

import { useState } from "react";
import { ModeToggle } from "./shadcn/darkmode/darkMode";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (

    <>
      <div className="fixed top-5 right-5 z-50 flex items-center justify-center h-14 w-14">
        <ModeToggle />
      </div>


      <div className="bg-gray-500 dark:bg-yellow-500 rounded-full w-14 h-14 flex items-center justify-center cursor-pointer fixed top-5 left-5 z-50">
        <a href="/">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
          className="lucide lucide-house text-white transition-transform duration-300 hover:rotate-90">
            <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
            <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
        </a>
      </div>


      <section className="min-h-screen flex items-center justify-center">
        <div className="flex rounded-2xl shadow-lg max-w-3xl w-full p-5 bg-white/90 backdrop-blur-md">
          <div className="sm:w-1/2 px-10 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-yellow-500 text-center sm:text-left">Login</h2>
            <p className="text-sm mt-2 text-gray-700 text-center sm:text-left">Entre com seu Email e senha para continuar</p>

            <form className="flex flex-col gap-4 mt-6">
              <input
                type="text"
                name="email"
                placeholder="Email"
                className="p-3 rounded-xl border border-gray-300 bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-sm dark:placeholder:text-gray-500"
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Senha"
                  className="p-3 rounded-xl border w-full border-gray-300 bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-sm dark:placeholder:text-gray-500"
                />

                <div
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-yellow-500 transition-colors"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-closed-icon lucide-eye-closed"><path d="m15 18-.722-3.25" /><path d="M2 8a10.645 10.645 0 0 0 20 0" /><path d="m20 15-1.726-2.05" /><path d="m4 15 1.726-2.05" /><path d="m9 18 .722-3.25" /></svg>
                  )}
                </div>
              </div>


              <button className="bg-yellow-500 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-yellow-600 transition-transform duration-300 hover:scale-105 cursor-pointer">
                Entrar
              </button>
            </form>
          </div>

          <div className="w-1/2 sm:block hidden">
            <img
              src="/mulher.jpg"
              alt="mulher preto e branco"
              className="rounded-2xl object-cover h-full w-full"
            />
          </div>
        </div>
      </section>
    </>
  );
}
