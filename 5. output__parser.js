import {config} from "dotenv"
import { OpenAI } from "langchain/llms/openai"
import { PromptTemplate } from "langchain/prompts"
import { LLMChain,SequentialChain } from "langchain/chains"
import {StructuredOutputParser} from "langchain/output_parsers"
config()
const log=console.log
const llm = new OpenAI({ temperature: 1,openAIApiKey:process.env.OPENAI_API_KEY});


const parser=StructuredOutputParser.fromNamesAndDescriptions({
    answer: "Answer the user question"
})


const prompt=new PromptTemplate({
    template: "Be very fynny when answering the question.\nyou should follow the format instruction to answer the question.\nformat: '''{format_instruction}'''\nQuestion: '''{question}'''",
    inputVariables: ['question'],
    partialVariables:{format_instruction: parser.getFormatInstructions()}
})

const input=await prompt.format({
    question: "what is the capital of Bangladesh?"
})

const res=await llm.call(input)
const json_output=await parser.parse(res)
log(json_output)