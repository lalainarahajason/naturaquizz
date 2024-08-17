import { NavBar } from "./settings/_components/navbar";

function ProtecedLayout({children}:{children: React.ReactNode}) {
  return (
    <div className='w-full h-full flex flex-col gap-y-10 items-center '>
        <NavBar />
        {children}
        
    </div>
  )
}

export default ProtecedLayout