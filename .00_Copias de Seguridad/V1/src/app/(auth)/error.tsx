"use client";

import { useEffect } from "react";
import { WelcomeLogin } from "@/components/auth/WelcomeLogin";

/** Si el segmento (auth) falla al renderizar, el acceso sigue disponible con el formulario. */
export default function AuthError({ error, reset: _reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[auth/error]", error);
  }, [error]);

  return <WelcomeLogin />;
}
