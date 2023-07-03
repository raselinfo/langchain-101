import {config} from "dotenv"
import { OpenAI } from "langchain/llms/openai"
import { PromptTemplate } from "langchain/prompts"
import { LLMChain,SimpleSequentialChain } from "langchain/chains"
config()
const log=console.log
const llm = new OpenAI({ temperature: 1,openAIApiKey:process.env.OPENAI_API_KEY });



const responseTemplate1 = `
You are a helpful bot that creates a 'thank you' response text.
If customers are unsatisfied, offer them a real world assistant to talk to.
You will get a sentiment and subject as input and evaluate.

text: {input}
`;

const responseTemplate2 = `
You are an assistant bot. Your job is to make the customer feel heard and understood.
Reflect on the input you receive.

text: {input}
`;


const prompt1=new PromptTemplate({
    template:responseTemplate1,
    inputVariables:['input']
})

const prompt2=new PromptTemplate({
    template: responseTemplate2,
    inputVariables: ['input']
})

const chain1=new LLMChain({
    llm,
    prompt: prompt1
})

const chain2=new LLMChain({
    llm,
    prompt:prompt2
})

const simpleSequential=new SimpleSequentialChain({
    chains:[chain1,chain2],
    verbose: true, // it just simulate the chain and prompt call and show in the terminal console
})


// Differetn between run and call is : 
// call return an object 
// run simply return a text
const result=await simpleSequential.run({
    input: "I ordered Pizza Salami and it was awful!"
})

log(result)

// log(chain1)