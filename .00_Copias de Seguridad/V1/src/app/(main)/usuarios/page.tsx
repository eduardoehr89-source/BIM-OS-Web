import { UsuariosView } from "@/components/usuarios/UsuariosView";

export const dynamic = "force-dynamic";

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
