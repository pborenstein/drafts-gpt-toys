//  GPT Toy -- a toy for the OpenAI GPT-3 API
//  If no selection, the toy uses the entire draft.
//  If there is a selection, the toy uses the selection.

//  Credentials
//    This script requires a GPT API key.
//    You can get one at https://beta.openai.com/

const credential = Credential.create('GPTKey', "Credentials for a GPT toy");
credential.addPasswordField('gptKey', "GPT API key");
credential.authorize();
const gptKey = credential.getValue('gptKey');

/****
 *          OpenAI API
 ****/

const gptURL = 'https://api.openai.com/v1/completions'
const http = HTTP.create(); // create HTTP object

//     POST https://api.openai.com/v1/completions

const getCompletion = (prompt, echo) => {
    const response = http.request({
        "method": 'POST',
        "url": gptURL,
        "headers": {
            "Authorization": `Bearer ${gptKey}`
        },
        "data": {
            "model": "text-davinci-003",
            "prompt": prompt,
            "max_tokens": 2048,
            "temperature": 0.6,
            "top_p": 1,
            "n": 1,
            "stream": false,
            "logprobs": null,
            "echo": echo
        }
    })
    console.log(`===> ${JSON.stringify(response.responseData, null, 2)}`)

    if (response.success)
        return response.responseData.choices[0].text
    else
        return `error ${response.statusCode} -- ${JSON.stringify(response.responseData, null, 2)}`
}


/****
 * getPrompt()
 * 
 *    Get the prompt from the draft or the selection
 *    If there is a selection, then echo the prompt
 *    Returns an array with the prompt and whether to echo it
 ****/

const getPrompt = () => {
    let echoPrompt = false
    let p = editor.getSelectedText()

    if (p)
        echoPrompt = true
    else
        p = draft.content

    p = p.trim()
    return [p, echoPrompt]
}


/****
 *   Main
 ****/

let [p, echo] = getPrompt()
const response = getCompletion(`${p}`, echo)

draft.saveVersion() // save the draft, just in case

//  add a separator between the prompt and
//  the response when echoing the prompt

if (echo) {
    draft.append(`\n---`)
}

draft.append(response.trim())
draft.addTag('gpt-toy')
draft.update()
