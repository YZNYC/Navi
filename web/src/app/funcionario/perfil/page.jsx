'use client';

import React, { useState } from 'react';

const initialEmployeeData = {
    firstName: 'Joana',
    lastName: 'Silveira Mendes',
    role: 'Analista de RH Sênior',
    hireDate: '15 de Março de 2023',
    status: 'Ativo',
    email: 'joana.silveira@empresa.com.br',
    phone: '(11) 98765-4321',
    bio: 'Analista de Recursos Humanos com 2 anos de experiência na área de Recrutamento e Seleção. Focada em otimizar processos de integração e treinamento de novos colaboradores, promovendo uma cultura de colaboração e inovação. Busco constantemente novas formas de aprimorar a experiência dos colaboradores e garantir um ambiente de trabalho positivo e produtivo.',
    country: 'Brasil',
    city: 'São Paulo',
    zip: '01310-100',
    street: 'Av. Paulista, 1000',
    profileImageUrl: 'https://placehold.co/112x112/14B8A6/FFFFFF/png?text=JS',
    social: {
        github: 'https://github.com/joana-silveira',
        linkedin: 'https://linkedin.com/in/joana-silveira',
        instagram: 'https://instagram.com/joana.silveira_rh',
    }
};

const renderIcon = (paths, classNames = "w-5 h-5 text-yellow-500 mr-3") => (
    <svg className={classNames} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {paths}
    </svg>
);

const IconPaths = {
    edit: <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>, 
    close: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    message: <path d="m21.4 15.6-5.8 5.8c-2.8 2.8-7.2 2.8-10 0L2.6 15.6c-2.8-2.8-2.8-7.2 0-10l5.8-5.8c2.8-2.8 7.2-2.8 10 0l5.8 5.8c2.8 2.8 2.8 7.2 0 10zM12 8l4 4-4 4"></path>,
    briefcase: <><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 2l-2 5h-4L8 2"></path></>,
    globe: <><circle cx="12" cy="12" r="10"></circle><path d="M12 2a10 10 0 0 0 0 20M2 12h20M12 2v20"></path></>,
    mail: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></>,
    phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-4.84-5.26 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>, 
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></>, 
    user: <><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></>,
};

const socialIconsMap = {
    github: <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.67c.8-.32 1.68-.3 2.5.38 2.76 2.08 3.55 3.5 3.55 5v1.27m-4.57 2.04l.03-.04m0 0h-.01a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1l.36 0m-.46-5.83l.03-.04a1 1 0 0 1 1-1l.24 0m0 0h-.01a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1l-.36 0M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.48.09.66-.21.66-.48v-1.9c-2.82.61-3.4-.6-3.4-.6-.46-1.18-1.14-1.5-1.14-1.5-.93-.63.07-.62 0-.62 1.03.07 1.57 1.05 1.57 1.05.91 1.56 2.4 1.11 2.98.85.09-.66.36-1.12.65-1.37-2.28-.26-4.67-1.14-4.67-5.05 0-1.12.4-2.03 1.03-2.73-.1-.23-.45-1.28.1-3.57 0 0 .84-.27 2.75 1.05.8-.22 1.65-.33 2.5-.33.86 0 1.7.11 2.5.33 1.91-1.32 2.75-1.05 2.75-1.05.55 2.29.2 3.34.1 3.57.63.7 1.03 1.6 1.03 2.73 0 3.92-2.39 4.79-4.66 5.05.35.31.67.92.67 1.85v2.75c0 .27.18.57.67.48C19.13 20.17 22 16.42 22 12c0-5.52-4.48-10-10-10z"/>,
    linkedin: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" fill="currentColor"/><rect x="2" y="9" width="4" height="12" fill="currentColor"/><circle cx="4" cy="4" r="2" fill="currentColor"/></>,
    instagram: <>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </>,
};

const EditModal = ({ isOpen, closeModal, editFormData, handleFormChange, handleSave }) => {
    if (!isOpen) return null;

    const renderInputField = (id, label, type, value, placeholder) => (
        <div className="flex flex-col">
            <label htmlFor={id} className="font-semibold text-sm text-slate-700 mb-1">{label}</label>
            {type === 'textarea' ? (
                <textarea
                    id={id}
                    name={id}
                    rows="4"
                    value={value}
                    onChange={handleFormChange}
                    className="p-3 border border-gray-300 rounded-xl focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 resize-none shadow-sm outline-none"
                    placeholder={placeholder}
                />
            ) : (
                <input
                    id={id}
                    name={id}
                    type={type}
                    value={value}
                    onChange={handleFormChange}
                    className="p-3 border border-gray-300 rounded-xl focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 shadow-sm outline-none"
                    placeholder={placeholder}
                />
            )}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-gray-900/90 flex items-center justify-center p-4 z-50 transition-opacity duration-300 backdrop-blur-sm animate-fade-in">
            <style jsx="true">{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes zoom-in {
                    from { transform: scale(0.9); }
                    to { transform: scale(1); }
                }
                .animate-fade-in { animation: fade-in 0.3s ease-out; }
                .animate-zoom-in { animation: zoom-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
            `}</style>
            <div className="bg-white rounded-3xl shadow-4xl w-full max-w-lg max-h-[90vh] flex flex-col animate-zoom-in">
                
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                        {renderIcon(IconPaths.edit, "w-6 h-6 mr-3 text-yellow-600")}
                        Editar Perfil
                    </h2>
                    <button 
                        onClick={closeModal} 
                        className="text-gray-400 hover:text-gray-700 transition p-2 rounded-full hover:bg-gray-100 active:bg-gray-200"
                        aria-label="Fechar"
                    >
                        {renderIcon(IconPaths.close, "w-6 h-6 text-gray-500")}
                    </button>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto flex-grow">

                    {renderInputField('profileImageUrl', 'URL da Foto de Perfil', 'url', editFormData.profileImageUrl || '', 'Ex: https://example.com/minhafoto.jpg')}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {renderInputField('firstName', 'Primeiro Nome', 'text', editFormData.firstName || '', 'Joana')}
                        {renderInputField('lastName', 'Sobrenome', 'text', editFormData.lastName || '', 'Silveira Mendes')}
                    </div>

                    {renderInputField('role', 'Cargo', 'text', editFormData.role || '', 'Analista de RH Sênior')}
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {renderInputField('email', 'Email', 'email', editFormData.email || '', 'joana.silveira@empresa.com.br')}
                        {renderInputField('phone', 'Telefone', 'tel', editFormData.phone || '', '(11) 98765-4321')}
                    </div>

                    {renderInputField('bio', 'Biografia', 'textarea', editFormData.bio || '', 'Descreva sua experiência e foco profissional...')}
                </div>

                <div className="p-6 border-t border-gray-100 flex justify-end space-x-3 bg-white rounded-b-3xl">
                    <button 
                        onClick={closeModal}
                        className="px-6 py-3 border border-gray-300 rounded-xl text-slate-700 font-medium hover:bg-gray-50 transition duration-150 active:scale-98"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleSave}
                        className="px-6 py-3 bg-yellow-500 text-white font-semibold rounded-xl shadow-lg shadow-yellow-500/50 hover:bg-yellow-600 transition duration-300 transform active:scale-98"
                    >
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
    );
};


const App = () => {
    const [employeeData, setEmployeeData] = useState(initialEmployeeData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({});

    const renderSocialLinks = () => {
        return Object.keys(employeeData.social).map((key) => {
            const url = employeeData.social[key];
            const svgPath = socialIconsMap[key];
            
            const keyDisplay = key.charAt(0).toUpperCase() + key.slice(1);
            let hoverColorClass = '';

            switch (key) {
                case 'github':
                    hoverColorClass = 'hover:text-gray-800';
                    break;
                case 'linkedin':
                    hoverColorClass = 'hover:text-blue-700';
                    break;
                case 'instagram':
                    hoverColorClass = 'hover:text-pink-600';
                    break;
                default:
                    hoverColorClass = 'hover:text-yellow-500';
            }

            if (url && svgPath) {
                return (
                    <a 
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Perfil ${keyDisplay}`}
                        className={`text-slate-500 ${hoverColorClass} transition duration-300 hover:scale-110 flex items-center justify-center bg-gray-50 p-3 rounded-full`}
                    >
                        {renderIcon(svgPath, "w-6 h-6")}
                    </a>
                );
            }
            return null;
        });
    };

    const openModal = () => {
        setEditFormData({ 
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            role: employeeData.role,
            email: employeeData.email,
            phone: employeeData.phone,
            bio: employeeData.bio,
            profileImageUrl: employeeData.profileImageUrl,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleFormChange = (e) => {
        setEditFormData({
            ...editFormData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = () => {
        setEmployeeData(prevData => ({
            ...prevData,
            ...editFormData,
        }));
        closeModal();
    };
    
    const DetailItem = ({ icon, title, value }) => (
        <div className="flex items-start p-3 bg-gray-50 rounded-xl shadow-inner">
            {renderIcon(icon, "w-5 h-5 text-yellow-500 mr-3 flex-shrink-0 mt-0.5")}
            <div>
                <span className="font-medium text-slate-700 block text-sm">{title}</span>
                <span className="text-slate-900 font-semibold block text-base leading-snug">{value}</span>
            </div>
        </div>
    );
    
    const AddressItem = ({ title, value }) => (
        <div className="flex flex-col p-3 bg-gray-50 rounded-xl shadow-inner">
            <span className="font-medium text-slate-700 text-sm">{title}</span>
            <span className="text-slate-900 font-semibold text-base">{value}</span>
        </div>
    );


    return (
        <div className="w-full font-sans overflow-hidden">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
                body {
                    font-family: 'Inter', sans-serif;
                    overflow: hidden;
                    height: 100vh;
                }
            `}</style>
            
            <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 h-full flex flex-col">
                
                <header className="py-6 flex flex-col sm:flex-row justify-between items-center border-b border-gray-200 flex-shrink-0">
                    <div className="text-left w-full sm:w-auto mb-4 sm:mb-0">
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                            <span className="text-yellow-600">Detalhes</span> do Colaborador
                        </h1>
                        <p className="text-slate-500 mt-2 text-lg">Perfil completo de {employeeData.firstName} {employeeData.lastName}</p>
                    </div>
                    
                    <button 
                        onClick={openModal}
                        className="w-full sm:w-auto px-8 py-3 bg-yellow-500 text-white font-semibold rounded-xl shadow-lg shadow-yellow-500/50 hover:bg-yellow-600 transition duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center flex-shrink-0"
                    >
                        {renderIcon(IconPaths.edit, "w-5 h-5 mr-2 text-white")}
                        Editar Perfil
                    </button>
                </header>

                <div id="profile-container" className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8 overflow-y-auto flex-grow pb-10">
                    
                    <div className="lg:col-span-1 space-y-8">
                        
                        <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 text-center z-10"> 
                            <div className="w-28 h-28 mx-auto bg-gray-200 rounded-full border-4 border-yellow-500/50 flex items-center justify-center overflow-hidden mb-5 shadow-inner">
                                {employeeData.profileImageUrl ? (
                                    <img 
                                        src={employeeData.profileImageUrl} 
                                        alt={`Foto de perfil de ${employeeData.firstName}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null; 
                                            e.target.src = 'https://placehold.co/112x112/EF4444/FFFFFF/png?text=ERRO'; 
                                        }}
                                    />
                                ) : (
                                    renderIcon(IconPaths.user, "w-16 h-16 text-yellow-500")
                                )}
                            </div>

                            <h2 className="text-3xl font-extrabold text-slate-900">{employeeData.firstName} {employeeData.lastName}</h2>
                            <p className="text-xl text-yellow-600 font-semibold mt-1">{employeeData.role}</p>
                            
                            <div className={`mt-4 inline-block px-4 py-1.5 rounded-full text-sm font-bold tracking-wider ${employeeData.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {employeeData.status}
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-100 space-y-3">
                                <a href={`mailto:${employeeData.email}`} className="flex items-center justify-center text-slate-700 hover:text-yellow-600 transition duration-200">
                                    {renderIcon(IconPaths.mail, "w-5 h-5 mr-2")}
                                    <span className="truncate">{employeeData.email}</span>
                                </a>
                                <div className="flex items-center justify-center text-slate-700">
                                    {renderIcon(IconPaths.phone, "w-5 h-5 mr-2")}
                                    <span>{employeeData.phone}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
                            <h3 className="text-xl font-bold text-slate-900 border-b border-gray-100 pb-3 mb-4 flex items-center">
                                {renderIcon(IconPaths.globe, "w-5 h-5 text-yellow-500 mr-2")}
                                Redes Profissionais
                            </h3>
                            <div className="flex justify-start space-x-4">
                                {renderSocialLinks()}
                            </div>
                        </div>

                    </div>

                    <div className="lg:col-span-2 space-y-8">

                        <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
                            <h3 className="text-2xl font-bold text-slate-900 border-b border-yellow-500/30 pb-3 mb-5 flex items-center">
                                {renderIcon(IconPaths.message, "w-6 h-6 text-yellow-600 mr-3")}
                                Biografia
                            </h3>
                            <p className="text-slate-700 leading-relaxed text-lg whitespace-pre-line">{employeeData.bio}</p>
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                            <h3 className="text-2xl font-bold text-slate-900 border-b border-yellow-500/30 pb-3 mb-6 flex items-center">
                                {renderIcon(IconPaths.briefcase, "w-6 h-6 text-yellow-600 mr-3")}
                                Informações Profissionais
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DetailItem 
                                    icon={IconPaths.briefcase} 
                                    title="Cargo Principal" 
                                    value={employeeData.role} 
                                />
                                <DetailItem 
                                    icon={IconPaths.calendar} 
                                    title="Data de Contratação" 
                                    value={employeeData.hireDate} 
                                />
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                            <h3 className="text-2xl font-bold text-slate-900 border-b border-yellow-500/30 pb-3 mb-6 flex items-center">
                                {renderIcon(IconPaths.globe, "w-6 h-6 text-yellow-600 mr-3")}
                                Endereço de Contato
                            </h3>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <AddressItem title="País" value={employeeData.country} />
                                <AddressItem title="Cidade" value={employeeData.city} />
                                <AddressItem title="CEP" value={employeeData.zip} />
                                <AddressItem title="Rua/Av" value={employeeData.street} />
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <EditModal 
                isOpen={isModalOpen}
                closeModal={closeModal}
                editFormData={editFormData}
                handleFormChange={handleFormChange}
                handleSave={handleSave}
            />
        </div>
    );
};

export default App;