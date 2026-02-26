import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';

export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname.substring(1);
  const displayPath = pageName ? `/${pageName}` : '/';

  const { data: authData, isFetched } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const user = await base44.auth.me();
        return { user, isAuthenticated: true };
      } catch (error) {
        return { user: null, isAuthenticated: false };
      }
    }
  });

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-16 bg-[#0a0a0f] text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#0f172a] to-[#0a0a0f]" />

      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(14, 165, 233, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(14, 165, 233, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-[110px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-[110px]" />

      <div className="relative z-10 w-full max-w-2xl">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/70 backdrop-blur-md p-8 md:p-10 text-center shadow-2xl shadow-blue-900/20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 mb-6">
            <ShieldAlert className="w-4 h-4 text-cyan-300" />
            <span className="text-sm text-blue-200">Error de navegación</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-3 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
            404
          </h1>

          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
            Página no encontrada
          </h2>

          <p className="text-slate-300 leading-relaxed max-w-xl mx-auto mb-8">
            La ruta <span className="font-semibold text-cyan-300">{displayPath}</span> no existe en esta aplicación.
            Verifica la URL o vuelve al inicio para continuar.
          </p>

          {isFetched && authData?.isAuthenticated && authData?.user?.role === 'admin' && (
            <div className="mb-8 text-left rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
              <p className="text-sm font-semibold text-amber-200 mb-1">Nota para admin</p>
              <p className="text-sm text-amber-100/90">
                Esta ruta puede no estar implementada todavía. Si corresponde, solicítala en el chat para agregarla.
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              onClick={() => (window.location.href = '/')}
              className="w-full sm:w-auto px-6 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-xl"
            >
              <Home className="w-4 h-4 mr-2" />
              Volver al inicio
            </Button>

            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="w-full sm:w-auto px-6 py-5 border-slate-700 bg-transparent hover:bg-slate-800 text-slate-100 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Regresar
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
