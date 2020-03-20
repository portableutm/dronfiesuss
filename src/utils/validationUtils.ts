


/**
 * Return true if length is between 1 255
 * @param text text to validate
 */
export function genericTextLenghtValidation(text: String) {
    return notUndefined(text) && (text.length > 1) && (text.length < 256)
}

/**
 * Return true if text not undefined or null
 */
export function notUndefined(text: String): boolean {
    return ((text !== undefined) && (text !== null));
}


export function validateStringDateIso(strDateIso: string) {
    let isoDateRegex = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(\.\d+)?([+-][0-2]\d:[0-5]\d|Z)$/
    let strValid = isoDateRegex.test(strDateIso)
    return strValid
}

export const dateTimeStringFormat = "yyyy-mm-ddThh:mm:ss.mmmZ"



