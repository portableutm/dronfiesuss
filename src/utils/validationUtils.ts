


/**
 * Return true if length is between 1 255
 * @param text text to validate
 */
export function genericTextLenghtValidation(text: String) {
    return notUndefined(text) && (text.length > 1) && (text.length<256)
}

/**
 * Return true if text not undefined or null
 */
export function notUndefined(text: String): boolean {
    return ((text !== undefined) && (text !== null));
}



