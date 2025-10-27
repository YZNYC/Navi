import React from 'react';
import { Bell, User, Settings, LogOut, User as UserIcon } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu" 


export default function Header({ pageTitle = 'Dashboard' }) {
    return (
        <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-10">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    <div className="flex items-center">
                        <h1 className="text-xl font-bold text-gray-900">
                            {pageTitle}
                        </h1>
                    </div>

                    <div className="flex items-center space-x-4">

                        <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition duration-150">
                            <Bell className="w-6 h-6" aria-label="Notificações" />
                            <span className="absolute top-2 right-16 block h-2 w-2 rounded-full ring-2 ring-white bg-red-400"></span>
                        </button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150">
                                    <span className="sr-only">Abrir menu do usuário</span>
                                    <User className="h-8 w-8 rounded-full bg-yellow-400 text-white p-1 cursor-pointer" />
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                
                                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        <UserIcon className="mr-2 h-4 w-4" />
                                        <span>Perfil</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Configurações</span>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            
                                <DropdownMenuSeparator />
                                
                                <DropdownMenuItem>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Sair</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    </div>

                </div>
            </div>
        </header>
    );
}