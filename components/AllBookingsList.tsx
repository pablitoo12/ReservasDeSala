
import React from 'react';
import { Booking, Client } from '../types';

interface AllBookingsListProps {
    bookings: Booking[];
    clients: Client[];
    onCancelBooking: (bookingId: string) => void;
}

const AllBookingsList: React.FC<AllBookingsListProps> = ({ bookings, clients, onCancelBooking }) => {
    
    const getClientName = (clientId: string) => {
        return clients.find(c => c.id === clientId)?.name || 'Cliente Desconocido';
    };

    const groupedBookings = bookings.reduce((acc, booking) => {
        const date = booking.date;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(booking);
        return acc;
    }, {} as Record<string, Booking[]>);

    const sortedDates = Object.keys(groupedBookings).sort();

    return (
        <div>
            <h2 className="text-2xl font-bold text-indigo-400 mb-4">Todas las Próximas Reservas</h2>
            {bookings.length > 0 ? (
                <div className="space-y-6">
                    {sortedDates.map(date => {
                        const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        });
                        return (
                            <div key={date}>
                                <h3 className="text-lg font-semibold text-gray-300 border-b-2 border-gray-700 pb-2 mb-3 capitalize">
                                    {formattedDate}
                                </h3>
                                <ul className="space-y-3">
                                    {groupedBookings[date].map(booking => (
                                        <li key={booking.id} className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                            <div className="mb-3 sm:mb-0">
                                                <p className="font-bold text-white">{booking.timeSlot}</p>
                                                <p className="text-gray-400">{getClientName(booking.clientId)}</p>
                                            </div>
                                            <button
                                                onClick={() => onCancelBooking(booking.id)}
                                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-200 w-full sm:w-auto"
                                            >
                                                Cancelar Reserva
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="text-center py-16 bg-gray-800 rounded-lg">
                    <p className="text-gray-400 text-lg">Aún no se han realizado reservas.</p>
                    <p className="text-gray-500 mt-2">¡Ve a la pestaña 'Horarios' para empezar a reservar!</p>
                </div>
            )}
        </div>
    );
};

export default AllBookingsList;
