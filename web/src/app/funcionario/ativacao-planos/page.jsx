'use client'
import React, { useState } from 'react';

const plansData = [
    {
        name: 'Diário (Day Pass)',
        description: 'Acesso por 24 horas. Ideal para visitas rápidas.',
        price: 15.00,
        unit: 'dia',
        features: [
            '1 Veículo Registrado',
            'Vaga Comum (sujeito à lotação)',
            'Pagamento na saída',
            'Ativação imediata',
        ],
        featured: false,
    },
    {
        name: 'Mensalista Padrão',
        description: 'Acesso ilimitado e recorrente. O mais popular.',
        price: 150.00,
        unit: 'mês',
        features: [
            '1 Veículo Registrado',
            'Vaga Preferencial',
            'Acesso 24 Horas',
            'Desconto em serviços',
        ],
        featured: true,
    },
    {
        name: 'Mensalista VIP',
        description: 'Benefícios premium para clientes de alto volume.',
        price: 280.00,
        unit: 'mês',
        features: [
            'Até 2 Veículos Registrados',
            'Vaga Exclusiva Coberta',
            'Serviço de Manobrista (Sob demanda)',
            'Lavagem simples mensal inclusa',
        ],
        featured: false,
    },
];

const FeatureItem = ({ children }) => (
    <li className="flex items-center space-x-3">
        <svg className="flex-shrink-0 w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
        </svg>
        <span className="text-gray-700 font-medium">{children}</span>
    </li>
);

const ConfirmationModal = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 transform scale-100 transition-transform duration-300 border-t-4 border-amber-500">
                <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-xl leading-6 font-semibold text-gray-900">Ativação Concluída!</h3>
                    <div className="mt-3">
                        <p className="text-sm text-gray-600 font-medium">{message}</p>
                    </div>
                </div>
                <div className="mt-5 sm:mt-6">
                    <button
                        type="button"
                        className="inline-flex justify-center w-full rounded-lg border border-transparent shadow-md px-4 py-2 bg-amber-500 text-base font-medium text-white hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition"
                        onClick={onClose}
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};

const PricingCard = ({ plan, onActivate, placa }) => {
    const isFeatured = plan.featured;

    const handleActivation = () => {
        if (!placa || placa.length < 7) {
            onActivate(null, null, "Erro de Validação: Por favor, insira a placa completa do veículo (7 caracteres alfanuméricos) no campo acima antes de ativar qualquer plano.");
            return;
        }
        onActivate(plan.name, placa);
    };

    return (
        <div className={`
            flex flex-col p-6 mx-auto max-w-lg text-center bg-white rounded-xl border shadow-lg transition-all duration-300 h-full
            ${isFeatured
                ? 'border-amber-500 ring-4 ring-amber-100 lg:transform lg:scale-115'
                : 'border-gray-200 hover:shadow-xl'
            }
        `}>
            <h3 className={`mb-4 text-2xl font-bold ${isFeatured ? 'text-amber-600' : 'text-gray-900'}`}>
                {plan.name}
            </h3>
            <p className="font-light text-gray-600 sm:text-lg min-h-[40px]">{plan.description}</p>

            <div className="flex justify-center items-baseline my-8">
                <span className="mr-2 text-5xl font-extrabold text-gray-900">
                    R$ {plan.price.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-gray-500">/{plan.unit}</span>
            </div>

            <ul role="list" className="space-y-4 text-left mb-8 px-2 flex-grow">
                {plan.features.map((feature, index) => (
                    <FeatureItem key={index}>{feature}</FeatureItem>
                ))}
            </ul>

            <button
                type="button"
                className={`
                    mt-auto py-3 px-5 text-center font-medium rounded-lg text-base transition-colors duration-200 shadow-md
                    ${isFeatured
                        ? 'text-white bg-amber-500 hover:bg-amber-600 disabled:bg-amber-400'
                        : 'text-amber-600 border border-amber-500 hover:bg-amber-50 disabled:border-gray-300 disabled:text-gray-400'
                    }
                    ${!placa || placa.length < 7 ? 'opacity-60 cursor-not-allowed' : ''}
                `}
                onClick={handleActivation}
                disabled={!placa || placa.length < 7}
            >
                Ativar Plano para Placa: <span className="font-mono text-lg">{placa || '...'}</span>
            </button>
        </div>
    );
};

export default function AtivarPlanos() {
    const [placa, setPlaca] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handlePlacaChange = (e) => {
        const formattedPlaca = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);
        setPlaca(formattedPlaca);
    };

    const handlePlanActivation = (planName, customerPlaca, errorMsg = null) => {
        if (errorMsg) {
            setErrorMessage(errorMsg);
            setShowErrorModal(true);
            return;
        }

        console.log(`Ativação: Plano ${planName} para Placa: ${customerPlaca}`);

        const successMessage = `O Plano "${planName}" foi ativado com sucesso para o veículo de placa ${customerPlaca}. Validade iniciada agora!`;
        setModalMessage(successMessage);

        setPlaca('');
    };

    return (
        <div className="pt-0 pb-8 lg:pb-12 mx-auto min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 border-b-2 border-amber-500 pb-2">
                Ativação de Planos de Estacionamento
            </h1>
            <p className="text-lg text-gray-600 mb-10">
                Selecione o plano do cliente, insira a placa para validação e finalize a ativação.
            </p>

            <div className="max-w-3xl mx-auto mb-20 bg-white p-6 rounded-xl shadow-xl border-2 border-amber-300">
                <label htmlFor="placa-veiculo" className="block text-sm font-bold text-gray-700 mb-2">
                    PLACA DO VEÍCULO (Mercosul - Ex: ABC1D23)
                </label>
                <input
                    type="text"
                    id="placa-veiculo"
                    value={placa}
                    onChange={handlePlacaChange}
                    maxLength="7"
                    placeholder="INSIRA A PLACA AQUI"
                    className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg text-3xl font-mono text-center tracking-widest uppercase focus:ring-amber-500 focus:border-amber-500 transition duration-150 shadow-inner"
                />
                <p className="mt-3 text-sm text-amber-600 font-bold text-center">
                    {placa.length < 7
                        ? `Faltam ${7 - placa.length} caracteres para a placa ser válida.`
                        : 'Placa pronta para ativação!'
                    }
                </p>
            </div>

            <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-8 lg:space-y-0 max-w-7xl mx-auto px-4">
                {plansData.map((plan) => (
                    <PricingCard
                        key={plan.name}
                        plan={plan}
                        placa={placa}
                        onActivate={handlePlanActivation}
                    />
                ))}
            </div>

            <ConfirmationModal
                message={modalMessage}
                onClose={() => setModalMessage('')}
            />

            {showErrorModal && (
                <ConfirmationModal
                    message={errorMessage}
                    onClose={() => setShowErrorModal(false)}
                />
            )}
        </div>
    );
}