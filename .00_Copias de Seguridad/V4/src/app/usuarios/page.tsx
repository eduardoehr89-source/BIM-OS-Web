import { UsuariosView } from "@/components/usuarios/UsuariosView";
import { requireMember } from "@/lib/comunicaciones-auth"; // Optional check, but we can just render the view. Wait, actually we can just render the component.

export const metadata = {
  title: "Gestión de Usuarios | BIM.OS",
};

export default function UsuariosPage() {
  return (
    <div className="mx-auto max-w-5xl py-6">
      <UsuariosView />
    </div>
  );
}
