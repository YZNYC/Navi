export default function Sobre() {
    return (
        <section className="py-24 relative">
            <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
                <div className="w-full justify-start items-center gap-36 grid lg:grid-cols-2 grid-cols-1">
                    <div className="w-full flex-col justify-start lg:items-start items-center gap-10 inline-flex">
                        <div className="w-full flex-col justify-start lg:items-start items-center gap-4 flex">
                            <h2 className="text-gray-600 dark:text-yellow-400 text-4xl font-bold font-manrope leading-normal lg:text-start text-center">Estacione com Facilidade, Rapidez e Economia</h2>
                            <p className="text-white text-base font-normal leading-relaxed lg:text-start text-center">Com nosso aplicativo, você encontra vagas de estacionamento próximas em segundos, visualiza preços e distancia até o local, e reserva sua vaga antes de chegar. Tudo de forma prática, segura e totalmente digital. Pare de perder tempo procurando estacionamento e aproveite cada momento com tranquilidade.</p>
                        </div>
                        <button className="sm:w-fit w-full px-3.5 py-2 bg-white transition-transform duration-105 hover:scale-105 hover:bg-gray-200 rounded-lg shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] justify-center items-center flex cursor-pointer">
                            <span className="px-1.5 dark:text-yellow-500  text-sm font-medium leading-6">Get Started</span>
                        </button>
                    </div>
                    <img className="lg:mx-0 mx-auto h-full rounded-3xl object-cover" src="/sobre3.png" alt="about Us image" />
                </div>
            </div>
        </section>

    )
}
