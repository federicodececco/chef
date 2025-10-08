/* eslint-disable @typescript-eslint/no-unused-vars */

import axiosIstance from "@/lib/axios";
import axios from "axios";
import { useState } from "react";

interface FormDataInterface {
  firstName: string;
  lastName: string;
  phonePrefix: string;
  phoneNumber: string;
  email: string;
  confirmEmail: string;
  password: string;
  acceptTerms: boolean;
}

interface RegistrationPopUpInterface {
  handleToggle: () => void;
}
export default function RegistrationPopUp({
  handleToggle,
}: RegistrationPopUpInterface) {
  const [formData, setData] = useState<FormDataInterface>({
    firstName: "",
    lastName: "",
    phonePrefix: "+39",
    phoneNumber: "",
    email: "",
    confirmEmail: "",
    password: "",
    acceptTerms: false,
  });

  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "confirmEmail" || name === "email") {
      if (name === "confirmEmail" && value !== formData.email) {
        setEmailError("Le email non corrispondono");
      } else if (
        name === "email" &&
        value !== formData.confirmEmail &&
        formData.confirmEmail !== ""
      ) {
        setEmailError("Le email non corrispondono");
      } else {
        setEmailError("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.password
      ) {
        setError("Tutti i campi sono obbligatori");
        return;
      }

      if (formData.password.length < 8) {
        setError("La password deve contenere almeno 8 caratteri");
        return;
      }

      setIsLoading(true);
      setError(null);

      const res = await axiosIstance.post("/auth/register", {
        firstname: formData.firstName,
        lastname: formData.lastName,
        email: formData.email,
        password: formData.password,
        isChef: true,
      });

      const data = res.data;

      window.location.reload();

      console.log("Registrazione completata:", data.message);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.error) {
          setError(error.response.data.error);
        } else {
          setError("Errore durante la registrazione. Riprova più tardi.");
        }
      } else {
        setError("Errore durante la registrazione. Riprova più tardi.");
      }
      console.error("Errore registrazione:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleToggle();
    }
  };
  return (
    <div
      className="animate-fade-in fixed top-0 z-40 flex h-screen w-full items-center justify-center overflow-y-auto bg-[#0A0A0A]/70 duration-700"
      onClick={handleBackgroundClick}
    >
      <div className="animate-slide-down mx-4 my-8 w-full max-w-md rounded-lg bg-[#232323] px-8 py-10 shadow-xl duration-700">
        <h1 className="mb-2 text-center text-3xl font-bold text-white/70">
          Diventa uno chef
        </h1>
        <h2 className="text-white/70/90 mb-6 text-center text-xl">
          Unisciti a noi
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="firstName"
              className="mb-1 block text-sm text-white/70"
            >
              Nome
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="mb-1 block text-sm text-white/70"
            >
              Cognome
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="mb-1 block text-sm text-white/70"
            >
              Telefono
            </label>
            <div className="flex gap-2">
              <select
                name="phonePrefix"
                value={formData.phonePrefix}
                onChange={handleChange}
                className="rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="+39">+39</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+33">+33</option>
                <option value="+49">+49</option>
              </select>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="flex-1 rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm text-white/70">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="confirmEmail"
              className="mb-1 block text-sm text-white/70"
            >
              Conferma Email
            </label>
            <input
              type="email"
              id="confirmEmail"
              name="confirmEmail"
              value={formData.confirmEmail}
              onChange={handleChange}
              required
              className={`w-full rounded border px-3 py-2 focus:ring-2 focus:outline-none ${
                emailError
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-amber-500"
              }`}
            />
            {emailError && (
              <p className="mt-1 text-sm text-red-200">{emailError}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm text-white/70"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
            <p className="text-white/70/70 mt-1 text-xs">Minimo 8 caratteri</p>
          </div>

          <div className="flex items-start gap-2 pt-2">
            <input
              type="checkbox"
              id="acceptTerms"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              required
              className="mt-1 h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-2 focus:ring-amber-500"
            />
            <label htmlFor="acceptTerms" className="text-sm text-white/70">
              Accetto i{" "}
              <a
                href="/termini"
                className="underline hover:text-amber-200"
                target="_blank"
              >
                termini di servizio
              </a>{" "}
              e la{" "}
              <a
                href="/privacy"
                className="underline hover:text-amber-200"
                target="_blank"
              >
                privacy policy
              </a>
            </label>
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded bg-[#F4C858] py-3 font-semibold text-black transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!!emailError || !formData.acceptTerms}
          >
            Registrati
          </button>
        </form>
      </div>
    </div>
  );
}
