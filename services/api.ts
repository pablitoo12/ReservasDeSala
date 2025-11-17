import { Client, Booking } from '../types';

// --- SIMULACIÓN DE BASE DE DATOS USANDO LOCALSTORAGE ---
// En una aplicación real, estas funciones no existirían.
// Todas las operaciones se harían en el backend con la base de datos MySQL.

const getClientsFromStorage = (): Client[] => {
    try {
        const stored = localStorage.getItem('clients');
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
};

const getBookingsFromStorage = (): Booking[] => {
     try {
        const stored = localStorage.getItem('bookings');
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
};

const saveClientsToStorage = (clients: Client[]) => {
    localStorage.setItem('clients', JSON.stringify(clients));
};

const saveBookingsToStorage = (bookings: Booking[]) => {
    localStorage.setItem('bookings', JSON.stringify(bookings));
};


// --- SERVICIO DE API ---
// Estas son las funciones que tu aplicación llamará.
// Simulan la asincronía de una petición de red con un 'delay'.

const API_DELAY = 300; // ms
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 * Obtiene todos los clientes.
 */
export const getClients = async (): Promise<Client[]> => {
    await delay(API_DELAY);
    
    // CÓDIGO REAL CON BACKEND:
    // try {
    //     const response = await fetch('/api/clients');
    //     if (!response.ok) throw new Error('Network response was not ok');
    //     return await response.json();
    // } catch (error) {
    //     console.error("Error fetching clients:", error);
    //     return [];
    // }

    console.log("API_MOCK: Obteniendo clientes de localStorage");
    return getClientsFromStorage();
};

/**
 * Obtiene todas las reservas.
 */
export const getBookings = async (): Promise<Booking[]> => {
    await delay(API_DELAY);

    // CÓDIGO REAL CON BACKEND:
    // const response = await fetch('/api/bookings');
    // return await response.json();

    console.log("API_MOCK: Obteniendo reservas de localStorage");
    return getBookingsFromStorage();
};

/**
 * Añade un nuevo cliente.
 */
export const addClient = async (name: string, contact: string): Promise<Client> => {
    await delay(API_DELAY);
    const newClient: Client = { id: crypto.randomUUID(), name, contact };

    // CÓDIGO REAL CON BACKEND:
    // const response = await fetch('/api/clients', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ name, contact })
    // });
    // return await response.json(); // El backend devolvería el cliente creado con su ID de la DB

    console.log("API_MOCK: Añadiendo cliente a localStorage");
    const clients = getClientsFromStorage();
    saveClientsToStorage([...clients, newClient]);
    return newClient;
};

/**
 * Elimina un cliente y sus reservas asociadas.
 */
export const deleteClient = async (clientId: string): Promise<void> => {
    await delay(API_DELAY);
    
    // CÓDIGO REAL CON BACKEND:
    // await fetch(`/api/clients/${clientId}`, { method: 'DELETE' });
    // El backend se encargaría de borrar el cliente Y SUS RESERVAS en una transacción.
    
    console.log("API_MOCK: Eliminando cliente de localStorage");
    const clients = getClientsFromStorage();
    saveClientsToStorage(clients.filter(c => c.id !== clientId));
    
    const bookings = getBookingsFromStorage();
    saveBookingsToStorage(bookings.filter(b => b.clientId !== clientId));
};

/**
 * Crea una nueva reserva.
 */
export const addBooking = async (clientId: string, date: string, timeSlot: string): Promise<Booking> => {
    await delay(API_DELAY);
    const newBooking: Booking = { id: crypto.randomUUID(), clientId, date, timeSlot };

    // CÓDIGO REAL CON BACKEND:
    // const response = await fetch('/api/bookings', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ clientId, date, timeSlot })
    // });
    // return await response.json();

    console.log("API_MOCK: Añadiendo reserva a localStorage");
    const bookings = getBookingsFromStorage();
    saveBookingsToStorage([...bookings, newBooking]);
    return newBooking;
};

/**
 * Elimina una reserva.
 */
export const deleteBooking = async (bookingId: string): Promise<void> => {
    await delay(API_DELAY);
    
    // CÓDIGO REAL CON BACKEND:
    // await fetch(`/api/bookings/${bookingId}`, { method: 'DELETE' });

    console.log("API_MOCK: Eliminando reserva de localStorage");
    const bookings = getBookingsFromStorage();
    saveBookingsToStorage(bookings.filter(b => b.id !== bookingId));
};
