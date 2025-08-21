import { NextRequest, NextResponse } from 'next/server';

const demo_notes = [
    {
        "id": 1,
        "lat": 51.505,
        "lng": -0.09,
        "text": "Welcome to EchoMap! This is a sample note in London.",
        "timestamp": "2025-08-20T10:00:00Z"
    },
    {
        "id": 2,
        "lat": 48.8566,
        "lng": 2.3522,
        "text": "A note from Paris. Feel free to add your own!",
        "timestamp": "2025-08-19T15:30:00Z"
    }
];

export async function GET() {
    try {
        return NextResponse.json(demo_notes);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error reading notes' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const newNote = await request.json();

        newNote.id = Date.now();
        newNote.timestamp = new Date().toISOString();
        demo_notes.push(newNote);

        return NextResponse.json(newNote, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error creating note' }, { status: 500 });
    }
}