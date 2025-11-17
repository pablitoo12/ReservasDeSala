
import React, { useState } from 'react';
import { Booking, Client } from '../types';
import { TIME_SLOTS } from '../constants';

interface ScheduleViewProps {
    bookings: Booking[];
    clients: Client[];
    onBookSlot: (date: string, timeSlot: string) => void;
    onCancelBooking: (bookingId: string) => void;
}

const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const ScheduleView: React.FC<ScheduleViewProps> = ({ bookings, clients, onBookSlot, onCancelBooking }) => {
    const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());

    const getClientName = (clientId: string) => {
        return clients.find(c => c.id === clientId)?.name || 'Cliente Desconocido';
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-indigo-400 mb-4">Horario del Día</h2>
                <div className="max-w-xs">
                    <label htmlFor="schedule-date" className="block text-sm font-medium text-gray-400 mb-1">Seleccionar Fecha</label>
                    <input
                        id="schedule-date"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full bg-gray-800 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white p-2"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {TIME_SLOTS.map(slot => {
                    const booking = bookings.find(b => b.date === selectedDate && b.timeSlot === slot);
                    const isBooked = !!booking;

                    return (
                        <div key={slot} className={`p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 ${isBooked ? 'bg-gray-800' : 'bg-gray-700/50'}`}>
                            <h3 className="font-bold text-lg text-white">{slot}</h3>
                            <div className="mt-4">
                                {isBooked && booking ? (
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm text-red-400 font-semibold">RESERVADO</p>
                                            <p className="text-lg font-medium text-gray-200">{getClientName(booking.clientId)}</p>
                                        </div>
                                        <button 
                                            onClick={() => onCancelBooking(booking.id)}
                                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
                                        >
                                            Cancelar Reserva
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                         <div>
                                            <p className="text-sm text-green-400 font-semibold">DISPONIBLE</p>
                                            <p className="text-lg font-medium text-gray-400">Listo para rockear</p>
                                        </div>
                                        <button 
                                            onClick={() => onBookSlot(selectedDate, slot)}
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
                                        >
                                            Reservar Ahora
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ScheduleView;
