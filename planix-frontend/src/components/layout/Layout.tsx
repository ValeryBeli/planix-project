import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />

      <div className="app">
        <Sidebar />

        <main className="main">
          {children}
        </main>
      </div>
    </>
  );
}