import Image from "next/image";

export const Logo = () => {
    return ( 
        <>
        <Image
        height={50}
        width={50}
        alt="logo"
        src="/logo.svg"
        />
        <p className="text-xl font-semibold"> <span className="text-slate-700">Acade</span><span className="text-sky-700">mix</span> </p>
        </>
     );
}

