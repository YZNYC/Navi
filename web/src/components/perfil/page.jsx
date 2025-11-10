"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Edit3,
    Plus,
    X,
    Save,
    Loader2,
    Briefcase,
    User,
    Phone,
    Mail,
    MapPin,
    Linkedin,
    Github
} from "lucide-react";

export default function EmployeeProfile() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        first_name: "Joana",
        last_name: "Silveira",
        position: "Analista de Sistemas",
        department: "Desenvolvimento",
        photo_url: "",
        bio: "consequences, or one who avoids a pain that produces no resultant pleasure?",
        phone: "(11) 99999-9999",
        email: "joana.silveira@email.com",
        address: "Rua Exemplo, 123 - São Paulo, SP",
        linkedin: "https://linkedin.com/in/joana",
        github: "https://github.com/joana",
    });


    const [isSaving, setIsSaving] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 1000);
        setIsModalOpen(false);
    };

    const contactItems = [
        { icon: Phone, label: "Telefone", value: formData.phone, href: `tel:${formData.phone}` },
        { icon: Mail, label: "E-mail", value: formData.email, href: `mailto:${formData.email}` },
        { icon: MapPin, label: "Endereço", value: formData.address, href: null },
    ];

    const socialLinks = [
        { icon: Linkedin, label: "LinkedIn", url: formData.linkedin, color: "hover:border-none hover:bg-gray-100" },
        { icon: Github, label: "GitHub", url: formData.github, color: "hover:border-none hover:bg-gray-100" },
    ];

    return (
        <div className="overflow-visible">
            <div className="relative z-10">
                <div className="max-w-5xl mx-auto">
                    {/* Botão Editar */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex justify-end mb-6"
                    >
                        <Button
                            onClick={openModal}
                            className="bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-full shadow-lg cursor-pointer dark:bg-yellow-500"
                        >
                            <Edit3 className="w-4 h-4 mr-2" />
                            Editar Perfil
                        </Button>
                    </motion.div>

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="text-center mb-8"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-yellow-500 mb-3">
                            {formData.first_name} <span className="text-yellow-500 dark:text-gray-400">{formData.last_name}</span>
                        </h1>
                        <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
                            <Briefcase className="w-5 h-5 text-yellow-500" />
                            <p className="text-xl md:text-2xl font-medium">{formData.position}</p>
                        </div>
                    </motion.div>

                    {/* Card Principal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative overflow-hidden rounded-3xl p-8 backdrop-blur-lg bg-white/70 dark:bg-slate-800 border-b-4 border-amber-500 mb-8"
                    >
                        <div className="flex flex-col items-center">
                            {/* Foto de perfil */}
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
                                className="relative mb-6"
                            >
                                {formData.photo_url ? (
                                    <img
                                        src={formData.photo_url}
                                        alt="Profile"
                                        className="relative w-40 h-40 rounded-full object-cover border-4 border-white shadow-2xl"
                                    />
                                ) : (
                                    <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center border-4 border-white shadow-2xl">
                                        <User className="w-20 h-20 text-white" />
                                    </div>
                                )}
                            </motion.div>

                            {/* Departamento */}
                            {formData.department && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className="mb-4"
                                >
                                    <span className="px-4 py-2 bg-yellow-400 text-gray-900 dark:text-gray-100 font-semibold rounded-full text-sm">
                                        {formData.department}
                                    </span>
                                </motion.div>
                            )}

                            {/* Biografia */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                                className="text-center max-w-2xl"
                            >
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-300 mb-3">Sobre</h3>
                                <p className="text-gray-600 dark:text-gray-300 tracking-wide">
                                    {formData.bio || "Nenhuma biografia adicionada ainda."}
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                    {/* Seção de Contato */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Contato */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                            className="rounded-3xl p-6 backdrop-blur-lg bg-white/70 dark:bg-slate-800 border border-white/40 dark:border-slate-800/40 shadow-xl"
                        >
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                                    <Phone className="w-4 h-4 text-gray-900" />
                                </div>
                                Contato
                            </h3>
                            <div className="space-y-4">
                                {contactItems.map((item, index) => {
                                    if (!item.value) return null;
                                    const Icon = item.icon;
                                    const content = (
                                        <motion.div
                                            key={index}
                                            whileHover={{ x: 5 }}
                                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors cursor-pointer group"
                                        >
                                            <div className="w-10 h-10 bg-gray-100  rounded-lg flex items-center justify-center group-hover:bg-yellow-400  transition-colors">
                                                <Icon className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">{item.label}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 font-semibold">{item.value}</p>
                                            </div>
                                        </motion.div>
                                    );

                                    return item.href ? <a key={index} href={item.href}>{content}</a> : content;
                                })}
                            </div>
                        </motion.div>

                        {/* Redes Sociais */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.9 }}
                            className="rounded-3xl p-6 backdrop-blur-lg bg-white/70 dark:bg-slate-800 border border-white/40 dark:border-slate-800/40 shadow-xl"
                        >
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                                    <Linkedin className="w-4 h-4 text-gray-900" />
                                </div>
                                Redes Profissionais
                            </h3>
                            <div className="space-y-3">
                                {socialLinks.map((social, index) => {
                                    if (!social.url) return null;
                                    const Icon = social.icon;
                                    return (
                                        <motion.a
                                            key={index}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`flex items-center gap-3 p-4 rounded-xl bg-gray-100 text-slate-800 dark:bg-gray-900 dark:text-white transition-all ${social.color} group`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span className="font-semibold">{social.label}</span>
                                            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">→</div>
                                        </motion.a>
                                    );
                                })}
                                {!formData.linkedin && !formData.github && (
                                    <p className="text-gray-500 text-sm text-center py-4">
                                        Nenhuma rede social adicionada
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Modal de Edição */}
            {/* Modal de Edição */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Fundo escurecido com blur */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-lg"
                        />

                        {/* Conteúdo do modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="relative w-full max-w-3xl rounded-3xl overflow-hidden bg-white dark:bg-slate-800 shadow-2xl border border-gray-200 dark:border-none"
                        >
                            {/* Cabeçalho */}
                            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-6 flex items-center justify-between shadow-md">
                                <h2 className="text-2xl font-bold dark:text-gray-900 text-white drop-shadow-md">Editar Perfil</h2>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded-full hover:bg-yellow-300/40 transition-transform hover:scale-110 cursor-pointer"
                                >
                                    <X className="w-5 h-5 text-gray-900" />
                                </Button>
                            </div>

                            {/* Formulário */}
                            <form
                                onSubmit={handleSubmit}
                                className="p-8 grid md:grid-cols-2 gap-6 overflow-y-auto max-h-[75vh] scrollbar-thin scrollbar-thumb-yellow-300 scrollbar-track-gray-100"
                            >
                                {/* Upload de Foto */}
                                <div className="md:col-span-2 flex flex-col items-center space-y-4">
                                    <Label className="dark:text-white font-medium">Foto de Perfil</Label>
                                    <div className="relative w-32 h-32">
                                        {formData.photo_url ? (
                                            <img
                                                src={formData.photo_url}
                                                alt="Profile"
                                                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                                            />
                                        ) : (
                                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center border-4 border-white shadow-lg">
                                                <User className="w-16 h-16 text-white" />
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onload = (ev) => handleChange("photo_url", ev.target.result);
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
                                        />
                                        <div className="absolute bottom-0 right-0 bg-yellow-400 p-2 rounded-full shadow-md hover:bg-yellow-500 transition-colors cursor-pointer">
                                            <Plus className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                </div>

                                {[
                                    ["first_name", "Nome *"],
                                    ["last_name", "Sobrenome *"],
                                    ["position", "Cargo *"],
                                    ["department", "Departamento"],
                                    ["bio", "Biografia", true],
                                    ["phone", "Telefone"],
                                    ["email", "E-mail *"],
                                    ["address", "Endereço"],
                                    ["linkedin", "LinkedIn"],
                                    ["github", "GitHub"],
                                ].map(([field, label, isTextArea]) => (
                                    <div
                                        key={field}
                                        className={`space-y-2 ${["bio", "address"].includes(field) ? "md:col-span-2" : ""}`}
                                    >
                                        <Label htmlFor={field} className="font-medium text-gray-700 dark:text-white">{label}</Label>
                                        {isTextArea ? (
                                            <Textarea
                                                id={field}
                                                rows={4}
                                                className="focus:ring-4 focus:ring-yellow-400 dark:border-none border-gray-300 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                                                value={formData[field]}
                                                onChange={(e) => handleChange(field, e.target.value)}
                                            />
                                        ) : (
                                            <Input
                                                id={field}
                                                className="focus:ring-4 focus:ring-yellow-400 dark:border-none border-gray-300 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                                                value={formData[field]}
                                                onChange={(e) => handleChange(field, e.target.value)}
                                                required={label.includes("*")}
                                            />
                                        )}
                                    </div>
                                ))}

                                {/* Botões */}
                                <div className="md:col-span-2 flex justify-end gap-4 mt-6 border-t pt-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsModalOpen(false)}
                                        disabled={isSaving}
                                        className="rounded-full border-gray-300 hover:bg-gray-100 hover:scale-105 transition-transform shadow-sm cursor-pointer"
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 dark:text-white font-semibold rounded-full shadow-lg flex items-center justify-center gap-2 px-6 py-2 transition-transform hover:scale-105 hover:shadow-xl cursor-pointer"
                                        disabled={isSaving}
                                    >
                                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        Salvar
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>


        </div>
    );
}
