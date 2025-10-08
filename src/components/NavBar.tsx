/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function NavBar() {
  const { user, isAuthenticated, isChef, chefSlug, logout } = useAuth();

  const router = useRouter();

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

  return (
    <nav className="bg-first-theme absolute -top-18 z-12 grid h-18 w-full grid-cols-12 text-center text-white">
      {/*  {currentUser && (
        <ChatComponent
          currentUserId={currentUser}
          isChef={isChef}
        ></ChatComponent>
      )} */}
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
    </nav>
  );
}
