
import React, { useState } from 'react';
import { Client } from '../types';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    clients: Client[];
    onConfirmBooking: (clientId: string) => void;
    timeSlot: string;
    date: string;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, clients, onConfirmBooking, timeSlot, date }) => {
    const [selectedClientId, setSelectedClientId] = useState<string>('');

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (selectedClientId) {
            onConfirmBooking(selectedClientId);
        }
    };
    
    const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });


    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 border border-gray-700">
                <h2 className="text-2xl font-bold mb-2 text-indigo-400">Reservar Horario</h2>
                <p className="text-gray-300 mb-1">Hora: <span className="font-semibold">{timeSlot}</span></p>
                <p className="text-gray-300 mb-4 capitalize">Fecha: <span className="font-semibold">{formattedDate}</span></p>

                {clients.length > 0 ? (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="client-select" className="block text-sm font-medium text-gray-400">Seleccionar Cliente</label>
                            <select
                                id="client-select"
                                value={selectedClientId}
                                onChange={(e) => setSelectedClientId(e.target.value)}
                                className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white p-2"
                            >
                                <option value="" disabled>-- Elige un cliente --</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>{client.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={onClose}
                                className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition duration-200"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={!selectedClientId}
                                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition duration-200"
                            >
                                Confirmar Reserva
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                         <p className="text-center text-yellow-400 bg-yellow-900/50 p-4 rounded-md">
                            No se encontraron clientes. Por favor, añade un cliente primero desde la pestaña 'Clientes'.
                        </p>
                        <div className="flex justify-end mt-4">
                             <button
                                onClick={onClose}
                                className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition duration-200"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingModal;
