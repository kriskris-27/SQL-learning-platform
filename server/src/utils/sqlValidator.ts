const FORBIDDEN_KEYWORDS = [
    'DROP',
    'DELETE',
    'TRUNCATE',
    'UPDATE',
    'INSERT',
    'ALTER',
    'GRANT',
    'REVOKE',
    'CREATE',
    'REPLACE'
];

export const validateSQL = (query: string): { isValid: boolean; error?: string } => {
    const upperQuery = query.toUpperCase();

    // Basic keyword check
    for (const keyword of FORBIDDEN_KEYWORDS) {
        // Match the keyword with boundary to avoid partial matches (e.g., "DROP" in "DROPOUT")
        const regex = new RegExp(`\\b${keyword}\\b`, 'i');
        if (regex.test(upperQuery)) {
            return {
                isValid: false,
                error: `Command '${keyword}' is not allowed in this sandbox.`
            };
        }
    }

    // Only allow SELECT queries (standard for learning platforms)
    if (!upperQuery.trim().startsWith('SELECT')) {
        return {
            isValid: false,
            error: 'Only SELECT queries are allowed.'
        };
    }

    return { isValid: true };
};
