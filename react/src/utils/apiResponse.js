export const getResponseData = (response, fallback = null) => {
    if (!response) return fallback;

    if (response.data?.data !== undefined) {
        return response.data.data;
    }

    if (response.data !== undefined) {
        return response.data;
    }

    return fallback;
};

export const getResponseCollection = (response) => {
    const payload = response?.data ?? response;

    const candidates = [
        payload?.data?.data,
        payload?.data,
        payload?.items,
        payload?.records,
        payload?.results,
        payload
    ];

    const collection = candidates.find(Array.isArray);
    return collection || [];
};

export const getApiErrorMessage = (error, fallback = 'حدث خطأ غير متوقع. حاول مرة أخرى.') => {
    const validationErrors = error?.response?.data?.errors;

    if (validationErrors && typeof validationErrors === 'object') {
        const firstErrorGroup = Object.values(validationErrors).find(Boolean);

        if (Array.isArray(firstErrorGroup) && firstErrorGroup.length > 0) {
            return firstErrorGroup[0];
        }

        if (typeof firstErrorGroup === 'string') {
            return firstErrorGroup;
        }
    }

    return (
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        fallback
    );
};
