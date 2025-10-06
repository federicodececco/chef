"use client";

import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useRef, useState } from "react";

export default function NavBar() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const modalRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <nav className="bg-first-theme absolute -top-18 z-12 grid h-18 w-full grid-cols-12 text-center text-white">
      Sono una navbar
      <div className="col-start-11 flex items-center justify-center">
        <button
          onClick={() => modalRef.current?.showModal()}
          className="outline-gold bg-gold hover:text-gold rounded-xl px-6 py-3 duration-200 hover:cursor-pointer hover:bg-transparent hover:outline"
        >
          Login
        </button>

        {/* form */}
        <dialog
          ref={modalRef}
          className="bg-first-theme mx-auto my-auto w-full max-w-md rounded-2xl p-0 shadow-2xl backdrop:bg-black/50"
        >
          <div className="rounded-2xl p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-gold text-2xl font-bold">Accedi</h2>
              <button
                onClick={() => modalRef.current?.close()}
                className="text-2xl font-light text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-5">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="text-gold mb-2 block text-sm font-medium"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-gold focus:ring-gold w-full rounded-lg border py-3 pr-4 pl-10 transition outline-none focus:border-transparent focus:ring-2"
                    placeholder="nome@esempio.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="text-gold mb-2 block text-sm font-medium"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-gold focus:ring-gold w-full rounded-lg border py-3 pr-12 pl-10 transition outline-none focus:border-transparent focus:ring-2"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="bg-gold/70 hover:bg-gold w-full rounded-lg py-3 font-semibold text-black shadow-lg transition duration-200 hover:cursor-pointer"
              >
                Accedi
              </button>
            </div>
          </div>
        </dialog>
      </div>
    </nav>
  );
}
