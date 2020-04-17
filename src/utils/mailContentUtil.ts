

export function buildConfirmationLink(username, token, frontEndEndpoint){
    return `${frontEndEndpoint}verify/${username}/${token}`
    
}

export function buildConfirmationTextMail(username, link) {
    return `
    Hello ${username}, thanks for registering and trusting our UTM.
    To finish the user registration process, you need to follow the following link.
    
    ${link}
    
    In case this email arrived in error ...`
}

export function buildConfirmationHtmlMail(username, link)  {
    return `
    <p>Hello ${username}, thanks for registering and trusting our UTM.</p>
    <p>To finish the user registration process, you need to follow the following link.</p>
    <p><a href="">${link}</a></p>
    <p>In case this email arrived in error ...</p>`
}

