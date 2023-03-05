//  GPT Summarizer -- summarize the content of a website
//  for Drafts


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
            "temperature": 0.5,
            "top_p": 1,
            "n": 1,
            "stream": false,
            "logprobs": null,
            "echo": echo
        }
    })
    console.log(`===> ${JSON.stringify(response.responseData, null, 2)}`)

    if (response.success)
        return response.responseData.choices[0].text.trim()
    else
        return `###### ${response.statusCode} -- ${response.error}`
}


/****
 * getPrompt(n)
 * 
 * 
 ****/

const getPrompt = (n) => {
    n = n || 3

    let prompt = `
Go to each of the URLs below and summarize them
${draft.content}

`

    return prompt
}


/****
 *   Main
 ****/

draft.saveVersion() // save the draft, just in case

let response = getCompletion(getPrompt(5), false)

console.log(`---`)
console.log(JSON.stringify(response, null, 2))

draft.append(response)
draft.update()
