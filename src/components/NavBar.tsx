/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { ChefHat, DoorOpen, House, LogIn, NotebookText } from "lucide-react";
import { useEffect, useState } from "react";

export default function NavBar() {
  const { user, isAuthenticated, isChef, chefSlug, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNavigation = (value: string) => {
    if ((value = "dashboard")) {
      router.push(`/chef/dashboard/${user?.id}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Errore durante il logout:", error);
    }
  };

  const handleLogin = () => {
    router.push("/login");
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <div className="navbar bg-first-theme absolute -top-18 z-14 hidden h-18 shadow-sm md:flex">
        <div className="flex-9">
          <div
            className="btn bg-first-theme btn-ghost relative min-h-[70px] w-1/4 border-none lg:mx-0"
            onClick={() => {
              router.push(`/`);
            }}
          >
            <Image
              fill
              className="object-contain"
              src="/registration/logo-oro-COD.png"
              alt="Logo"
            />
          </div>
        </div>
        <div className="flex-2">
          <ul className="menu menu-horizontal px-2">
            <li>
              {!isAuthenticated && (
                <button
                  onClick={() => {
                    handleLogin();
                  }}
                  className="outline-gold bg-gold hover:text-gold rounded-xl px-2 duration-200 hover:cursor-pointer hover:bg-transparent hover:outline"
                >
                  Login
                </button>
              )}
              {isAuthenticated && (
                <button
                  className="outline-gold bg-gold hover:text-gold rounded-xl px-2 duration-200 hover:cursor-pointer hover:bg-transparent hover:outline"
                  onClick={() => {
                    handleLogout();
                  }}
                >
                  Logout
                </button>
              )}
            </li>
            {isChef && (
              <li className="">
                <details>
                  <summary className="text-gold">Pagine</summary>
                  <ul className="bg-first-theme rounded-t-none">
                    <li className="text-white/70">
                      <span
                        onClick={() => {
                          router.push(`/chef/${chefSlug}`);
                        }}
                      >
                        Pagina personale
                      </span>
                    </li>
                    <li className="text-white/70">
                      <span
                        onClick={() => {
                          handleNavigation("dashboard");
                        }}
                      >
                        Area Riservata
                      </span>
                    </li>
                  </ul>
                </details>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="dock text-gold bg-first-theme border-gold z-21 border-t-1 md:hidden">
        <button
          onClick={() => {
            router.push(`/`);
          }}
        >
          <House />
          <span className="dock-label">Home</span>
        </button>
        {!isAuthenticated && (
          <button
            className="dock-label"
            onClick={() => {
              handleLogin();
            }}
          >
            <LogIn />
            <span>Login</span>
          </button>
        )}

        {isChef && (
          <button
            onClick={() => {
              router.push(`/chef/${chefSlug}`);
            }}
          >
            <NotebookText />
            <span className="dock-label">Pagina personale</span>
          </button>
        )}
        {isChef && (
          <button
            onClick={() => {
              handleNavigation("dashboard");
            }}
          >
            <ChefHat />
            <span className="dock-label">Area Riservata</span>
          </button>
        )}
        {isAuthenticated && (
          <button
            className=""
            onClick={() => {
              handleLogout();
            }}
          >
            <DoorOpen />
            <span className="dock-label">Logout</span>
          </button>
        )}
      </div>
    </>

    /*  <nav className="bg-first-theme absolute -top-18 z-12 grid h-18 w-full grid-cols-12 text-center text-white">
      Sono una navbar
      <div className="col-start-10 flex items-center justify-center">
        {!isAuthenticated && (
          <button
            onClick={() => {
              handleLogin();
            }}
            className="outline-gold bg-gold hover:text-gold rounded-xl px-6 py-3 duration-200 hover:cursor-pointer hover:bg-transparent hover:outline"
          >
            Login
          </button>
        )}
        {isAuthenticated && (
          <button
            className="outline-gold bg-gold hover:text-gold rounded-xl px-6 py-3 duration-200 hover:cursor-pointer hover:bg-transparent hover:outline"
            onClick={() => {
              handleLogout();
            }}
          >
            Logout
          </button>
        )}
      </div>
      <div className="flex items-center justify-center">
        {isChef && (
          <button
            className="outline-gold bg-gold hover:text-gold rounded-xl px-6 py-3 duration-200 hover:cursor-pointer hover:bg-transparent hover:outline"
            onClick={() => {
              handleNavigation("dashboard");
            }}
          >
            Area personale
          </button>
        )}
      </div>
      <div className="flex items-center justify-center">
        {isChef && (
          <button
            className="outline-gold bg-gold hover:text-gold rounded-xl px-6 py-3 duration-200 hover:cursor-pointer hover:bg-transparent hover:outline"
            onClick={() => {
              router.push(`/chef/${chefSlug}`);
            }}
          >
            La mia pagina
          </button>
        )}
      </div>
    </nav> */
  );
}
