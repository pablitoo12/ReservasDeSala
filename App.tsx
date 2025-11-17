import React, { useState, useEffect, useCallback } from 'react';
import { Client, Booking } from './types';
import ScheduleView from './components/ScheduleView';
import BookingModal from './components/BookingModal';
import ClientManager from './components/ClientManager';
import AllBookingsList from './components/AllBookingsList';
import * as api from './services/api';

type View = 'schedule' | 'bookings' | 'clients';

const GuitarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zm12-3c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zM9 6l12-3" />
    </svg>
);


const App: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [activeView, setActiveView] = useState<View>('schedule');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlotInfo, setSelectedSlotInfo] = useState<{ date: string; timeSlot: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [clientsData, bookingsData] = await Promise.all([
                    api.getClients(),
                    api.getBookings()
                ]);
                setClients(clientsData);
                setBookings(bookingsData);
            } catch (error) {
                console.error("Failed to load data from API", error);
                // Aquí podrías mostrar un mensaje de error al usuario
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const handleAddClient = async (name: string, contact: string) => {
        const newClient = await api.addClient(name, contact);
        setClients(prevClients => [...prevClients, newClient]);
    };
    
    const handleDeleteClient = async (clientId: string) => {
        if(window.confirm("¿Estás seguro de que quieres eliminar este cliente? Esto también cancelará todas sus reservas.")) {
            await api.deleteClient(clientId);
            setClients(clients.filter(c => c.id !== clientId));
            setBookings(bookings.filter(b => b.clientId !== clientId));
        }
    };

    const handleOpenBookingModal = (date: string, timeSlot: string) => {
        setSelectedSlotInfo({ date, timeSlot });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSlotInfo(null);
    };

    const handleConfirmBooking = async (clientId: string) => {
        if (selectedSlotInfo) {
            const newBooking = await api.addBooking(clientId, selectedSlotInfo.date, selectedSlotInfo.timeSlot);
            setBookings(prevBookings => [...prevBookings, newBooking].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
            handleCloseModal();
        }
    };

    const handleCancelBooking = async (bookingId: string) => {
        if (window.confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
            await api.deleteBooking(bookingId);
            setBookings(prevBookings => prevBookings.filter(b => b.id !== bookingId));
        }
    };

    const NavButton = ({ view, label }: { view: View; label: string }) => (
        <button
            onClick={() => setActiveView(view)}
            className={`px-3 py-2 text-sm md:px-4 md:py-2 md:text-base font-medium rounded-md transition-colors duration-200 ${
                activeView === view
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
        >
            {label}
        </button>
    );

    const renderContent = () => {
        if (isLoading) {
            return <div className="text-center py-16">Cargando datos...</div>;
        }
        
        switch(activeView) {
            case 'schedule':
                return <ScheduleView
                    bookings={bookings}
                    clients={clients}
                    onBookSlot={handleOpenBookingModal}
                    onCancelBooking={handleCancelBooking}
                />;
            case 'bookings':
                return <AllBookingsList
                    bookings={bookings}
                    clients={clients}
                    onCancelBooking={handleCancelBooking}
                />;
            case 'clients':
                return <ClientManager clients={clients} onAddClient={handleAddClient} onDeleteClient={handleDeleteClient} />;
            default:
                return null;
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
            <header className="bg-gray-800/50 backdrop-blur-sm shadow-lg sticky top-0 z-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-3">
                            <GuitarIcon />
                            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Reservas Sala de Ensayo</h1>
                        </div>
                        <nav className="flex space-x-2 md:space-x-4">
                            <NavButton view="schedule" label="Horarios" />
                            <NavButton view="bookings" label="Todas las Reservas" />
                            <NavButton view="clients" label="Clientes" />
                        </nav>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {renderContent()}
            </main>

            {isModalOpen && selectedSlotInfo && (
                <BookingModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    clients={clients}
                    onConfirmBooking={handleConfirmBooking}
                    timeSlot={selectedSlotInfo.timeSlot}
                    date={selectedSlotInfo.date}
                />
            )}
        </div>
    );
};

export default App;