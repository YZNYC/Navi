'use client'

import { useState } from "react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="bg-white flex rounded-2xl shadow-lg max-w-3xl p-5">

        <div className="sm:w-1/2 px-16 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-yellow-400 text-center">Login</h2>
          <p className="text-sm mt-4">Entre com seu Email e senha para continuar</p>

          <form className="flex flex-col gap-4 mt-8">
            <input
              className="p-2 rounded-xl border border-gray-300 bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              type="text"
              name="email"
              placeholder="Email"
            />

            <div className="relative">
              <input
                className="p-2 rounded-xl border w-full bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
              />
              <svg
                onClick={() => setShowPassword(!showPassword)}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500"
              >
                <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>

            <button className="bg-white rounded-xl text-black py-2 hover:bg-gray-200 transition-transform duration-300 hover:scale-105 cursor-pointer">
              Entrar
            </button>
          </form>
        </div>


        <div className="w-1/2 sm:block hidden">
          <img
            src="/mulher.jpg"
            alt="mulher preto e branco"
            className="rounded-2xl object-cover h-full"
          />
        </div>
      </div>
    </section>
  );
}
