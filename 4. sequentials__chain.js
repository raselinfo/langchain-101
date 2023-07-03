import {config} from "dotenv"
import { OpenAI } from "langchain/llms/openai"
import { PromptTemplate } from "langchain/prompts"
import { LLMChain,SequentialChain } from "langchain/chains"
config()
const log=console.log
const llm = new OpenAI({ temperature: 1,openAIApiKey:process.env.OPENAI_API_KEY });



//1 Create Review Chain
let promptTemplate=new PromptTemplate({
    template: "You ordered '''{dish_name}''' and your experience was '''{experience}'''. Write a review: ",
    inputVariables: ['dish_name','experience']
})

const reviewChain=new LLMChain({
    llm,
    prompt: promptTemplate,
    outputKey: 'review'
})
//2 Create Comment Chain
promptTemplate=new PromptTemplate({
    template:"Given the resturant review: '''{review}''', write the followw--up comment: ",
    inputVariables:['review']
})
const commentChain=new LLMChain({
    llm,
    prompt: promptTemplate,
    outputKey: 'comment'
})

//3 Create Summary Chain
promptTemplate=new PromptTemplate({
    template: "Summarise the review in on short sentence: \n\n review: '''{comment}'''",
    inputVariables: ['comment']
})
const summaryChain=new LLMChain({
    llm,
    prompt: promptTemplate,
    outputKey: 'summary'
})

//4 Create Translation Chain
promptTemplate=new PromptTemplate({
    template: "translate the summary to german: \n summary: '''{summary}'''",
    inputVariables: ['summary'],
})

const translationChain=new LLMChain({
    llm,
    prompt: promptTemplate,
    outputKey: 'german_translation'
})


const sequentialChain=new SequentialChain({
    chains:[reviewChain,commentChain,summaryChain,translationChain],
    inputVariables: ['dish_name','experience'],
    outputVariables:['review','comment','summary','german_translation'],
})


const result=await sequentialChain.call({
    dish_name: "Pizza",
    experience: "It was awful!"
})
log(result)



// ---------------
// const testChain=new LLMChain({
//     llm,
//     prompt: promptTemplate,
//     verbose:true
// })

// log(await testChain.call({
//     summary: 'My experience with the pizza from this restaurant was awful. The pizza had a strange and unpleasant taste, and the ingredients all tasted like they had been sitting out for way too long. The crust was too doughy and undercooked, and the cheese was not melted fully. I would not recommend ordering pizza from this restaurant.'
// }))