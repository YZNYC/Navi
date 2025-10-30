export default function AdminDashboard() {

    return(
        <>
        {/* <Sidebar /> */}
        {/* <Navbar /> */}

        <main className="bg-[#E8E8E8] min-h-screen p-8">
        <div className="justify-items-center">
            <p className="text-[#021C49] font-bold text-lg">Quer uma análise mais profunda do seu negócio?</p>
        </div>

        
        <div className="pt-6">
        <input type="search" className="rounded-md h-10 w-full bg-[#F0F0F0] text-[#979DA5] font-semibold text-md pl-50" placeholder="Pergunte alguma coisa"/>
        </div>
        </main>
        </>
    );
}