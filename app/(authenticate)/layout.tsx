// app/(authenticate)/layout.tsx
import { ReactNode } from "react";
import "./css/style.css";

export const metadata = {
  title: "Authentication",
  description: "Login and Register pages",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white shadow-md">
      {children}
    </div>
  );
}
