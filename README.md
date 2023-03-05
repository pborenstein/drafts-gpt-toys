# GPT-3 / Drafts experiments

This repository contains my experiments 
writing [Drafts][] [actions][] to play with OpenAI's 
[ GPT-3 API ](https://platform.openai.com).


## Things that work

These are the things that work pretty well.


### gpttoy.js

This was my first attempt.
It takes the contents of the draft
and sends it to the [Completion endpoint](https://platform.openai.com/docs/api-reference/completions). The results are appended to the draft.
It does some other stuff with selected text,
but it's not one of my better ideas.


This is the action that's in the
[Drafts action directory](https://actions.getdrafts.com/a/2GW).


### gptchat.js

This one
uses the [Chat endpoint](https://platform.openai.com/docs/api-reference/chat),
which requires the prompt to be in a specific [chat format](https://platform.openai.com/docs/guides/chat/introduction). It looks like this:

```json
[
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Who won the world series in 2020?"},
    {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
    {"role": "user", "content": "Where was it played?"}
]
```

Writing this in JSON is a pain, so in 
in Drafts you could write it like this.

```text
S: You are a helpful assistant.
U: Who won the world series in 2020?
A: The Los Angeles Dodgers won the World Series in 2020.
U: Where was it played?
```

OpenAI provides [a little guidance](https://platform.openai.com/docs/guides/chat/instructing-chat-models) on what `role` values mean,
but they're not very helpful. So, if you leave the `role` off,
the script assumes `user`.

All of GPT-3.5's responses are appended to the draft
and prefixed with `A:`.


```text
S: You are a helpful assistant.
U: Who won the world series in 2020?
A: The Los Angeles Dodgers won the World Series in 2020.
U: Where was it played?

A: The 2020 World Series was played at Globe Life Field in Arlington, Texas.
```


## Things that need work

These are some things I played with.

### gptedit.js

I was trying understand what the 
[Edit endpoint](https://platform.openai.com/docs/api-reference/edits) does. 
But I either couldn't figure it out or I lost interest.

### gptsummy.js

This was an attempt to generate summaries for websites.
Because it doesn't actually visit the sites, it does
very well with famous URLs, but makes stuff up 
when it doesn't.


### gpttagger.js

This was an attempt at an auto-tagger, but then
two things happened. First, I had too many tags,
and second, it looked hopeless. 

[Drafts]: https://getdrafts.com
[actions]: https://docs.getdrafts.com/actions/
