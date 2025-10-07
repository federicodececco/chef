"use client";

import axiosIstance from "@/lib/axios";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const [isAuth, setIsAuth] = useState(false);
  const [isChef, setIsChef] = useState(false);
  const [chefSlug, setChefSlug] = useState("");
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const res = await axiosIstance.get("/auth/user");
      if (!res) {
        return;
      }
      if (res.data.user.chef) {
        setIsChef(true);
        setChefSlug(`${res.data.user.chef.id}-${res.data.user.chef.slug}`);
      }
      console.log(res);
      setIsAuth(true);
    } catch (error) {
      console.error(error);
    }
  };
  const handleLogout = async () => {
    try {
      await axiosIstance.post("/auth/logout");
      window.location.replace(`/chef/chef-registration`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = () => {
    try {
      router.push(`/login`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <nav className="bg-first-theme absolute -top-18 z-12 grid h-18 w-full grid-cols-12 text-center text-white">
      Sono una navbar
      <div className="col-start-10 flex items-center justify-center">
        {!isAuth && (
          <button
            onClick={() => {
              handleLogin();
            }}
            className="outline-gold bg-gold hover:text-gold rounded-xl px-6 py-3 duration-200 hover:cursor-pointer hover:bg-transparent hover:outline"
          >
            Login
          </button>
        )}
        {isAuth && (
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
              router.push(`/chef/dashboard`);
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
