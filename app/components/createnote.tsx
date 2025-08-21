import { useState, FormEvent } from 'react';
import { LatLngExpression } from 'leaflet';

export interface Note {
    id: string | number;
    lat: number;
    lng: number;
    text: string;
    timestamp?: string;
}

interface CreateNoteProps {
    position: LatLngExpression;
    onAddNote: (note: Note) => void;
    onClose: () => void;
}

const CreateNote: React.FC<CreateNoteProps> = ({ position, onAddNote, onClose }) => {
    const [text, setText] = useState<string>('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!text.trim()) return;

        const [lat, lng] = position as [number, number];

        const newNote = {
            lat,
            lng,
            text,
        };

        try {
            const response = await fetch('/api/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newNote),
            });

            if (response.ok) {
                const addedNote: Note = await response.json();
                onAddNote(addedNote);
                setText('');
            } else {
                console.error('Failed to add note');
            }
        } catch (error) {
            console.error('Error while posting note:', error);
        }
    };

    const [lat, lng] = position as [number, number];

    return (
        <div
            style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: '#f9f9f9',
                padding: '30px',
                borderRadius: '16px',
                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
                zIndex: 1001,
                width: '100%',
                maxWidth: '400px',
                fontFamily: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
                transition: 'all 0.3s ease',
            }}
        >
            <h2
                style={{
                    marginTop: 0,
                    marginBottom: '10px',
                    fontSize: '1.5rem',
                    color: '#333',
                    textAlign: 'center',
                }}
            >
                📝 New Note
            </h2>
            <p
                style={{
                    fontSize: '0.9rem',
                    color: '#666',
                    textAlign: 'center',
                    marginBottom: '20px',
                }}
            >
                Latitude: {lat.toFixed(4)} | Longitude: {lng.toFixed(4)}
            </p>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type something meaningful..."
                    maxLength={280}
                    required
                    style={{
                        width: '100%',
                        height: '120px',
                        padding: '12px',
                        fontSize: '1rem',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        resize: 'none',
                        marginBottom: '16px',
                        backgroundColor: '#fff',
                        color: '#333',
                        boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
                        outlineColor: '#3498db',
                        transition: 'box-shadow 0.2s ease-in-out',
                    }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                    <button
                        type="submit"
                        style={{
                            flex: 1,
                            padding: '12px',
                            border: 'none',
                            borderRadius: '8px',
                            backgroundColor: '#2ecc71',
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s ease',
                        }}
                        onMouseOver={(e) =>
                            ((e.target as HTMLButtonElement).style.backgroundColor = '#27ae60')
                        }
                        onMouseOut={(e) =>
                            ((e.target as HTMLButtonElement).style.backgroundColor = '#2ecc71')
                        }
                    >
                        Post ✅
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            flex: 1,
                            padding: '12px',
                            border: 'none',
                            borderRadius: '8px',
                            backgroundColor: '#e74c3c',
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s ease',
                        }}
                        onMouseOver={(e) =>
                            ((e.target as HTMLButtonElement).style.backgroundColor = '#c0392b')
                        }
                        onMouseOut={(e) =>
                            ((e.target as HTMLButtonElement).style.backgroundColor = '#e74c3c')
                        }
                    >
                        Cancel ❌
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateNote;