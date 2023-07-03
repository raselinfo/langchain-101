import {config} from "dotenv"
import { OpenAI } from "langchain/llms/openai"
import {ConversationChain} from "langchain/chains"
import {ChatPromptTemplate,SystemMessagePromptTemplate,MessagesPlaceholder,HumanMessagePromptTemplate} from "langchain/prompts"
import {BufferMemory} from "langchain/memory"
config()
const log=console.log
const key=process.env.OPENAI_API_KEY
const llm = new OpenAI({ temperature: 0,openAIApiKey:key});

//1. Create ChatPromptTemplate with SystemMessagePromptTemplate,message placeholder,human maessage prompt
const chatPrompt=ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate("The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know."),
    new MessagesPlaceholder("history"),
    HumanMessagePromptTemplate.fromTemplate("{input}")
])


//2. create conversation chain with llm, chat prompt and memory
const chain=new ConversationChain({
    llm,
    prompt:chatPrompt,
    memory:new BufferMemory({returnMessages:true,memoryKey:"history"})
})


//3. Call the chain
const res1=await chain.call({
    input: "what is the capital of bangladesh?"
})

const res2=await chain.call({
    input:"the is the great place to see there?"
})

log(res2)