"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    window.location.replace(`/chef/chef-registration`);
  }, []);
  return <div></div>;
}
