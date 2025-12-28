// export async function saveDesign(schema: unknown) {
//     const token = localStorage.getItem('token');

//     const response = await fetch('http://localhost:8000/api/designs', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//             title: 'Generated Page',
//             schema,
//         }),
//     });

//     if (!response.ok) {
//         const text = await response.text();
//         throw new Error(text || 'Failed to save design');
//     }

//     return response.json();
// }
type SaveDesignPayload = {
    schema: unknown;
    categoryId?: string;
    subcategoryId?: string;
};

export async function saveDesign({
    schema,
    categoryId,
    subcategoryId,
}: SaveDesignPayload) {
    const token = localStorage.getItem('access_token');

    if (!token) {
        throw new Error('User not authenticated');
    }

    const response = await fetch('http://localhost:8000/api/designs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            title: 'Generated Page',
            schema,
            category_id: categoryId ?? null,
            subcategory_id: subcategoryId ?? null,
        }),
    });
    const text = await response.text();
    if (!response.ok) {
        
        throw new Error(text || 'Failed to save design');
    }

    return text ? JSON.parse(text) : null;

}

