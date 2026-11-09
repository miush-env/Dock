import { Button } from "@components/ui/button";

function Login() {
  return (
    <main className="h-screen flex flex-col items-center justify-around bg-slate-100">
      <section className="flex items-center justify-center w-full">
        <img src="/petAppSVG.svg" alt="pet app logo" width={90} />
        <h2 className="uppercase font-poppins font-bold text-3xl">Dock</h2>
      </section>
      <section className="flex items-center justify-center w-full px-4">
        <h1 className="font-catamaran font-extrabold text-4xl text-center text-balence">
          Todo <span className="text-decoration underline underline-offset-[6px] decoration-[#f5462c]">Conectado</span>, estés donde estés.
        </h1>
      </section>
      <section className="flex flex-col items-center justify-center w-full px-4 gap-5">
        <p className="font-roboto font-normal text-center text-balance mb-5 text-slate-600 text-sm">
          Mové tus archivos entre dispositivos y concentrate en lo que importa
        </p>
        <Button className="w-full bg-[#2b78f5] py-6 flex items-center gap-5">
          <img src="/google.png" alt="Google" width={25} />
          <span className="text-white">Entrar con Google</span>
        </Button> 
        <Button className="w-full bg-[#2b78f5] py-6 flex items-center gap-5">
          <img src="/apple_dark.svg" alt="Apple" width={25} />
          <span className="text-white">Entrar con Apple</span>
        </Button>
      </section>
    </main>
  );
}

export default Login;
