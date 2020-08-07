

export function buildConfirmationLink(username, token, frontEndEndpoint){
    return `${frontEndEndpoint}/verify/${username}?token=${token}`
    
}

export function buildConfirmationTextMail(username, link) {
    return `
    Hello ${username}, 
    Thank you for registering in PortableUTM!
    To finish the user registration process, please click in the following link.
    
    ${link}
    `
}

export function buildConfirmationHtmlMail(username, link)  {
    return `
    <p>Hello ${username},</p>
    <p>Thank you for registering in PortableUTM!</p>
    <p>To finish the user registration process, please click in the following link.</p>
    <p><a href="">${link}</a></p>
    `
}

