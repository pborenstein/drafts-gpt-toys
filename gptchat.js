//  GPT Chat Toy -- a toy for the OpenAI GPT-3.5 API

//  Credentials
//    This script requires a GPT API key.
//    You can get one at https://beta.openai.com/

//  For doc see: https://platform.openai.com/docs/api-reference/chat

const credential = Credential.create('GPTKey', "Credentials for a GPT Chat toy")
      credential.addPasswordField('gptKey', "GPT API key")
      credential.authorize()
const gptKey = credential.getValue('gptKey')


const getChatCompletion = (messages) => {
    const gptURL = 'https://api.openai.com/v1/chat/completions'
    const gptParams = {
        "model":        "gpt-3.5-turbo",
        "messages":     messages,
        "temperature":  1.0, // more focused 0.0 - 2.0 more random
        "top_p":        1.0, // 0 - 1.0 ( 0.1 means only the tokens comprising the top 10% probability mass are considered)
        "n":              1,
        "max_tokens":  1536
    }
    const response = HTTP.create().request({
        "headers":  { "Authorization": `Bearer ${gptKey}` },
        "method":   'POST',
        "url":      gptURL,
        "data":     gptParams
    })
    console.log(`=response==> ${JSON.stringify(response.responseData, null, 2)}`)

    if (response.success)
        return response.responseData.choices[0].message
    else {
        context.fail(`error ${response.statusCode}`)
        return `error ${response.statusCode} -- ${JSON.stringify(response.responseData, null, 2)}`
    }
}


const parseRole = (line) => {
    let roleRegex = /^[SUA]:/i
    let role = null

    if (roleRegex.test(line)) {
        switch (line[0]) {
            case 'S': role = 'system'; break;
            case 'U': role = 'user'; break;
            case 'A': role = 'assistant'; break;
        }
    }
    console.log(`=line==> ${line}`)

    return role
}


const parseContent = (d) => {
    let messages = []
    let currentMessage = null

    for (let line of d.lines) {
        let role = parseRole(line)
        if (role) {
            if (currentMessage)
                messages.push(currentMessage)
            
            currentMessage = { role, content: line.slice(2).trim() }
        } else {
            if (currentMessage) {
                currentMessage.content += `\n${line}`
            } else {
                currentMessage = { role: 'user', content: line }
            }
        }
        console.log(`=currentMessage==> ${JSON.stringify(currentMessage, null, 2)}`)
    }

    if (currentMessage)
        messages.push(currentMessage)

    console.log(`=messages==> ${JSON.stringify(messages, null, 2)}`)
    return messages
}


const printMessages = (messages) => {
    let role
    let content = messages.content.trim()

    switch (messages.role) {
        case 'assistant': role = 'A'; break;
        case 'system': role = 'S'; break;
        case 'user': role = 'U'; break;
        default: role = 'X'; break;
    }

    return `${role}: ${content}`
}

/****
 *   Main
 ****/

const messages = getChatCompletion(parseContent(draft))
const response = printMessages(messages)

draft.saveVersion() 
draft.append(response)
draft.addTag('gpt-chat')
draft.update()


