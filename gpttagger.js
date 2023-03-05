//  GPT Tagger -- toward an auto-tagger
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
            "max_tokens": 16,
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
 *    Create the GPT prompt to ask for tags
 *    'the following tags are known: <tag list>
 *     return 3 tags for the following text'
 * 
 ****/

const getPrompt = (n) => {
    n = n || 3

    let prompt = `
extract ${n} keywords from the following text
as a comma-separated list of single words:

${draft.content}


`

    return prompt
}

function selectTags(ss) {
    if (!ss)
        return null

    let p = Prompt.create()
    p.title = "GTP-3 tagger"
    p.message = "Suggested tags for this draft"
    let m = "select the tags to add to this draft"
    let s = ss.toLowerCase()
        .split(',')
        .map((x) => x.trim())
        .filter((x) => x !== "")

    if (s.length === 0)
        m = "GPT didn't suggest any tags for this draft."

    p.addSelect("tags", m, s, s, true)
    p.addButton("OK", "OK")

    if (p.show() && p.buttonPressed == "OK")
        return p.fieldValues.tags
    else
        return null
}

/****
 *   Main
 ****/

draft.saveVersion() // save the draft, just in case

let response = getCompletion(getPrompt(5), false)
let selectedTags = selectTags(response)

console.log(`---`)
console.log(JSON.stringify(selectedTags, null, 2))

if (selectedTags)
    selectedTags.forEach(tag => draft.addTag(tag))

draft.update()
