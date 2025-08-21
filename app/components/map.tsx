import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useState, useEffect } from 'react';
import CreateNote, { Note } from './createnote';
import { LatLngExpression, LeafletMouseEvent } from 'leaflet';

// Fix default icon issues in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface LocationMarkerProps {
    setPosition: (position: LatLngExpression) => void;
}

// Component to handle map clicks for setting position (not currently used in main return)
const LocationMarker: React.FC<LocationMarkerProps> = ({ setPosition }) => {
    useMapEvents({
        click(e: LeafletMouseEvent) {
            const { lat, lng } = e.latlng;
            setPosition([lat, lng]);
        },
    });
    return null;
};

const Map: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [position, setPosition] = useState<LatLngExpression | null>(null);
    const [mapCenter, setMapCenter] = useState<LatLngExpression>([20, 0]);
    const [showCreateNote, setShowCreateNote] = useState<boolean>(false);
    const [newNotePosition, setNewNotePosition] = useState<LatLngExpression | null>(null);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await fetch('/api/notes');
                const data: Note[] = await response.json();
                setNotes(data);
            } catch (error) {
                console.error('Failed to fetch notes:', error);
            }
        };

        fetchNotes();

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setMapCenter([latitude, longitude]);
            },
            () => {
                console.log('Location access denied.');
            },
            { enableHighAccuracy: true }
        );
    }, []);

    const handleAddNote = (note: Note) => {
        setNotes([...notes, note]);
        setShowCreateNote(false);
        setNewNotePosition(null);
    };

    const handleMapClick = (e: LeafletMouseEvent) => {
        setNewNotePosition([e.latlng.lat, e.latlng.lng]);
        setShowCreateNote(true);
    };

    const MapEvents: React.FC = () => {
        useMapEvents({
            click: handleMapClick,
        });
        return null;
    };

    return (
        <div>
            <MapContainer
                center={mapCenter}
                zoom={3}
                scrollWheelZoom={true}
                style={{ height: '100vh', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                <MapEvents />
                {notes.map((note) => (
                    <Marker key={note.id} position={[note.lat, note.lng]}>
                        <Popup>
                            {note.text}
                            <br />
                            <small>
                                {note.timestamp
                                    ? new Date(note.timestamp).toLocaleString()
                                    : 'No timestamp'}
                            </small>
                        </Popup>
                    </Marker>
                ))}
                {newNotePosition && (
                    <Marker position={newNotePosition}>
                        <Popup>New note location</Popup>
                    </Marker>
                )}
            </MapContainer>

            {showCreateNote && newNotePosition && (
                <CreateNote
                    position={newNotePosition}
                    onAddNote={handleAddNote}
                    onClose={() => {
                        setShowCreateNote(false);
                        setNewNotePosition(null);
                    }}
                />
            )}

            <div
                style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    zIndex: 1000,
                    background: 'white',
                    padding: '10px',
                    borderRadius: '5px',
                }}
            >
                <p className='text-blue-400'>Right-click or long-press on the map to create a note.</p>
            </div>
        </div>
    );
};

export default Map;