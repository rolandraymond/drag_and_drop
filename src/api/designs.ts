export async function saveDesignSchema(schema: unknown) {
    const response = await fetch('http://localhost:8000/api/designs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: 'Generated Page',
            schema,
        }),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Failed to save design');
    }

    return response.json();
}
