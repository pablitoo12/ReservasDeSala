
import React, { useState } from 'react';
import { Client } from '../types';

interface ClientManagerProps {
    clients: Client[];
    onAddClient: (name: string, contact: string) => void;
    onDeleteClient: (clientId: string) => void;
}

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
);


const ClientManager: React.FC<ClientManagerProps> = ({ clients, onAddClient, onDeleteClient }) => {
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && contact.trim()) {
            onAddClient(name.trim(), contact.trim());
            setName('');
            setContact('');
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <h2 className="text-2xl font-bold text-indigo-400 mb-4">Añadir Nuevo Cliente</h2>
                <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
                    <div>
                        <label htmlFor="client-name" className="block text-sm font-medium text-gray-300">Nombre</label>
                        <input
                            id="client-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ej: Los Rockeros"
                            className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white p-2"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="client-contact" className="block text-sm font-medium text-gray-300">Contacto (Teléfono/Email)</label>
                        <input
                            id="client-contact"
                            type="text"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            placeholder="Ej: banda@email.com"
                            className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white p-2"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
                    >
                        Añadir Cliente
                    </button>
                </form>
            </div>
            <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-indigo-400 mb-4">Clientes Registrados</h2>
                <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                    {clients.length > 0 ? (
                        <ul className="divide-y divide-gray-700">
                            {clients.map(client => (
                                <li key={client.id} className="flex items-center justify-between p-3">
                                    <div>
                                        <p className="font-semibold text-white">{client.name}</p>
                                        <p className="text-sm text-gray-400">{client.contact}</p>
                                    </div>
                                    <button 
                                        onClick={() => onDeleteClient(client.id)}
                                        className="text-gray-400 hover:text-red-500 p-2 rounded-full transition-colors duration-200"
                                        aria-label={`Eliminar ${client.name}`}
                                    >
                                        <TrashIcon />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400 text-center py-8">Aún no hay clientes registrados.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientManager;
