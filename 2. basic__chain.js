import {config} from "dotenv"
import {OpenAI} from "langchain/llms/openai"
import {LLMChain} from "langchain/chains"
import {PromptTemplate} from "langchain/prompts"
const log=console.log
config()


const model=new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,    
})
const prompt=new PromptTemplate({
    template:"Be funny when answering the question.\n Question: {question}",
    inputVariables:['question']
})

const chain=new LLMChain({
    prompt,
    llm:model
})

const res=await chain.call({
    question: "What the capital of Bangladesh?"
})


log(res)


// in the sort
// const res= await new LLMChain({
//     llm: new OpenAI({
//         openAIApiKey:process.env.OPENAI_API_KEY
//     }),
//     prompt: new PromptTemplate({template: "Be funny when answering the question.\n Question: {question}",inputVariables:['question']})
// }).call({
//     question: "My name is Rasel."
// })


// log(res)