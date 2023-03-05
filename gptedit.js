
/****
 *    Credentials
 * 
 *   This script requires a GPT API key.
 *    You can get one for free at https://beta.openai.com/
 * 
 */
const credential = Credential.create('GPTKey', "Credentials for a GPT toy");
credential.addPasswordField('gptKey', "GPT API key");
credential.authorize();
const gptKey = credential.getValue('gptKey');

/****
 * 
 *  OpenAI API
 * 
 ****/

const gptURL = 'https://api.openai.com/v1/edits'
const http = HTTP.create(); // create HTTP object


/****
 * 
 *  POST https://api.openai.com/v1/edits
 * 
 ****/

const getEdits = (input) => {
    const response = http.request({
        "method": 'POST',
        "url": gptURL,
        "headers": {
            "Authorization": `Bearer ${gptKey}`
        },
        "data": {
            "model": "text-davinci-edit-001",
            "input": input,
            "instruction": "Fix spelling and typos\nonly one space at the end of sentences.",
            "temperature": 0.2,
            "top_p": 1
        }
    })
    console.log(`===> ${JSON.stringify(response.responseData, null, 2)}`)

    if (response.success) {
        return response.responseData.choices[0].text
    }
    else {
        return `###### ${response.statusCode} -- ${response.error}`
    }
}


/****
 * 
 * getInput()
 * 
 *  Get the input text from the draft or the selection
 *  Returns the input
 * 
 ****/

const getInput = () => {
    let p = editor.getSelectedText()

    if (!p)
        p = draft.content

    p = p.trim()
    return p
}


/****
 * 
 *   Main
 * 
 ****/

let p = getInput()
const response = getEdits(p)

//  add a separator between the prompt and
//  the response when echoing the prompt

draft.append(`\n---\n${response.trim()}`)
draft.addTag('gptedit')
draft.update()
