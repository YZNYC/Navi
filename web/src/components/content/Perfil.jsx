import React, { useState } from 'react';
import {
    User, Briefcase, Calendar, Mail, Phone, Edit, X, Save, Github, Facebook, Instagram, Home, Globe
} from 'lucide-react';

const initialEmployeeData = {
    firstName: 'Joana',
    lastName: 'Silveira Mendes',
    role: 'Analista de RH Sênior',
    hireDate: '15/03/2023',
    status: 'Ativo',
    email: 'joana.silveira@empresa.com.br',
    phone: '(11) 98765-4321',
    bio: 'Analista de Recursos Humanos com 2 anos de experiência na área de Recrutamento e Seleção. Focada em otimizar processos de integração e treinamento de novos colaboradores.',
    country: 'Brasil',
    city: 'São Paulo',
    zip: '01310-100',
    street: 'Av. Paulista, 1000',
    social: {
        github: 'https://github.com/joana-silveira',
        facebook: 'https://facebook.com/joana.silveira',
        instagram: 'https://instagram.com/joana.silveira_rh',
    }
};

const ProfileCard = ({ title, value, icon, accentColor = 'text-gray-600', isLink = false }) => (
    <div className="flex items-center p-3 sm:p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-yellow-400 transition duration-150">
        <div className={`p-2 sm:p-3 mr-3 sm:mr-4 bg-gray-100 rounded-full ${accentColor}`}>
            {React.cloneElement(icon, { size: 18 })}
        </div>
        <div className="min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">{title}</p>
            {isLink && value ? (
                <a
                    href={value.startsWith('http') ? value : `https://${value}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-md sm:text-lg font-semibold text-blue-600 hover:text-blue-700 underline truncate block"
                >
                    {new URL(value.startsWith('http') ? value : `https://${value}`).hostname}
                </a>
            ) : (
                <p className="text-md sm:text-lg font-semibold text-gray-800 break-words">{value || 'Não informado'}</p>
            )}
        </div>
    </div>
);

const EditModal = ({ isOpen, onClose, employee, onSave }) => {
    const [formData, setFormData] = useState({
        ...employee,
        social: { ...employee.social }
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('social.')) {
            const socialKey = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                social: {
                    ...prev.social,
                    [socialKey]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = () => {
        onSave(formData);
        onClose();
    };

    const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 text-sm sm:text-base";
    const labelClass = "text-sm font-medium text-gray-700";

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 sm:p-8 z-50 transition-opacity">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">

                <div className="sticky top-0 bg-white p-4 sm:p-5 border-b border-gray-200 flex justify-between items-center z-10">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center">
                        <Edit size={20} className="mr-2 sm:mr-3 text-yellow-600" /> Editar Perfil
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-red-600 transition p-1"
                        aria-label="Fechar Modal"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-4 sm:p-6 space-y-6">

                    <div className="space-y-4">
                        <h4 className="text-md font-semibold text-gray-800 border-b pb-1">Informação Pessoal</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <label className="block">
                                <span className={labelClass}>Primeiro Nome</span>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </label>
                            <label className="block">
                                <span className={labelClass}>Sobrenome</span>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </label>
                        </div>
                        <label className="block">
                            <span className={labelClass}>Email Corporativo</span>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </label>
                        <label className="block">
                            <span className={labelClass}>Telefone</span>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </label>
                        <label className="block">
                            <span className={labelClass}>Biografia / Sobre</span>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                className={`${inputClass} h-24 resize-none`}
                            />
                        </label>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-md font-semibold text-gray-800 border-b pb-1">Endereço</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <label className="block">
                                <span className={labelClass}>País</span>
                                <input type="text" name="country" value={formData.country} onChange={handleChange} className={inputClass} />
                            </label>
                            <label className="block">
                                <span className={labelClass}>Cidade</span>
                                <input type="text" name="city" value={formData.city} onChange={handleChange} className={inputClass} />
                            </label>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <label className="block">
                                <span className={labelClass}>CEP</span>
                                <input type="text" name="zip" value={formData.zip} onChange={handleChange} className={inputClass} />
                            </label>
                            <label className="block">
                                <span className={labelClass}>Rua/Avenida</span>
                                <input type="text" name="street" value={formData.street} onChange={handleChange} className={inputClass} />
                            </label>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-md font-semibold text-gray-800 border-b pb-1">Redes Sociais (URL Completa)</h4>
                        <label className="block">
                            <span className={labelClass}>GitHub</span>
                            <input
                                type="url"
                                name="social.github"
                                value={formData.social.github}
                                onChange={handleChange}
                                placeholder="https://github.com/..."
                                className={inputClass}
                            />
                        </label>
                        <label className="block">
                            <span className={labelClass}>Facebook</span>
                            <input
                                type="url"
                                name="social.facebook"
                                value={formData.social.facebook}
                                onChange={handleChange}
                                placeholder="https://facebook.com/..."
                                className={inputClass}
                            />
                        </label>
                        <label className="block">
                            <span className={labelClass}>Instagram</span>
                            <input
                                type="url"
                                name="social.instagram"
                                value={formData.social.instagram}
                                onChange={handleChange}
                                placeholder="https://instagram.com/..."
                                className={inputClass}
                            />
                        </label>
                    </div>

                </div>

                <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row-reverse justify-start sm:justify-between space-y-2 sm:space-y-0 sm:space-x-3">
                    <button
                        onClick={handleSave}
                        className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition shadow-md flex items-center justify-center sm:justify-start space-x-2"
                    >
                        <Save size={18} /> <span>Salvar Alterações</span>
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition shadow-sm flex items-center justify-center sm:justify-start space-x-2"
                    >
                        <X size={18} /> <span>Cancelar</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

const PerfilFuncionario = () => {
    const [employee, setEmployee] = useState(initialEmployeeData);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSaveEmployee = (updatedData) => {
        setEmployee(updatedData);
    };

    const renderSocialIcons = () => {
        const icons = {
            github: { Icon: Github, color: 'bg-gray-700 hover:bg-gray-800' },
            facebook: { Icon: Facebook, color: 'bg-gray-700 hover:bg-gray-800' },
            instagram: { Icon: Instagram, color: 'bg-gray-700 hover:bg-gray-800' }
        };

        return Object.keys(employee.social).map((key) => {
            const url = employee.social[key];
            const { Icon, color } = icons[key];
            if (url) {
                return (
                    <a
                        key={key}
                        href={url.startsWith('http') ? url : `https://${url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-2 rounded-full text-white transition duration-150 ${color} shadow-md`}
                        aria-label={`Link para ${key}`}
                    >
                        <Icon size={16} />
                    </a>
                );
            }
            return null;
        }).filter(Boolean);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 flex justify-center items-start">
            <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl sm:rounded-2xl border border-gray-300 overflow-hidden">

                <header className="p-4 sm:p-8 bg-gray-100 border-b border-gray-300">
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">

                        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto">
                            <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-yellow-500 flex items-center justify-center bg-white shadow-inner flex-shrink-0">
                                <User size={40} className="text-gray-600 sm:text-60" />
                            </div>
                            <div className="text-center sm:text-left">
                                <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-0 sm:mb-1">
                                    {employee.firstName} <span className="font-light">{employee.lastName}</span>
                                </h1>
                                <p className="text-md sm:text-xl text-gray-600 font-semibold">{employee.role}</p>
                                <span className={`inline-flex items-center px-3 py-1 mt-2 rounded-full text-xs font-semibold tracking-wide uppercase 
                                    ${employee.status === 'Ativo'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-300 text-gray-700'}`}
                                >
                                    {employee.status}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                            <div className="flex space-x-2">
                                {renderSocialIcons()}
                            </div>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg shadow-md transition duration-200 flex items-center space-x-2 w-full sm:w-auto justify-center"
                            >
                                <Edit size={20} />
                                <span>Editar Perfil</span>
                            </button>
                        </div>
                    </div>
                </header>

                <main className="p-4 sm:p-8">

                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 border-b-2 border-gray-200 pb-2">Detalhes do Funcionário</h2>

                    <div className="mb-8 space-y-6">
                        <h3 className="text-lg font-bold text-gray-700 flex items-center"><User size={20} className="mr-2 text-gray-600" /> Informação Pessoal</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ProfileCard title="Primeiro Nome" value={employee.firstName} icon={<User />} />
                            <ProfileCard title="Sobrenome" value={employee.lastName} icon={<User />} />
                            <ProfileCard title="Email" value={employee.email} icon={<Mail />} />
                            <ProfileCard title="Telefone" value={employee.phone} icon={<Phone />} />
                        </div>

                        <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-xl shadow-md col-span-full">
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Biografia</h4>
                            <p className="text-md sm:text-lg font-semibold text-gray-800 whitespace-pre-wrap">{employee.bio || 'Nenhuma biografia informada.'}</p>
                        </div>
                    </div>

                    <div className="mb-8 space-y-6">
                        <h3 className="text-lg font-bold text-gray-700 flex items-center"><Home size={20} className="mr-2 text-gray-600" /> Endereço</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ProfileCard title="País" value={employee.country} icon={<Globe />} />
                            <ProfileCard title="Cidade" value={employee.city} icon={<Home />} />
                            <ProfileCard title="Rua/Avenida" value={employee.street} icon={<Home />} />
                            <ProfileCard title="CEP" value={employee.zip} icon={<Home />} />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-700 flex items-center"><Briefcase size={20} className="mr-2 text-gray-600" /> Informação de Contrato</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ProfileCard
                                title="Cargo / Função"
                                value={employee.role}
                                icon={<Briefcase />}
                            />
                            <ProfileCard
                                title="Data de Contratação"
                                value={employee.hireDate}
                                icon={<Calendar />}
                            />
                        </div>
                    </div>

                </main>

                <footer className="p-4 bg-gray-100 border-t border-gray-300 text-center text-xs sm:text-sm text-gray-500">
                    Última atualização: {new Date().toLocaleDateString('pt-BR')}
                </footer>

            </div>

            <EditModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                employee={employee}
                onSave={handleSaveEmployee}
            />
        </div>
    );
}

export default PerfilFuncionario;