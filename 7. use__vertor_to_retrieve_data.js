import path from "path"
import {config} from "dotenv"
import { OpenAI } from "langchain/llms/openai"
import {FaissStore} from "langchain/vectorstores/faiss"
import {OpenAIEmbeddings} from "langchain/embeddings/openai"
import {RetrievalQAChain,loadQAStuffChain,loadQAChain} from "langchain/chains"
config()
const log=console.log
const key=process.env.OPENAI_API_KEY
const llm = new OpenAI({ temperature: 0,openAIApiKey:key});


const embeddings=new OpenAIEmbeddings({
    openAIApiKey:key
})
//1. load vecotr
const vectorStore=await FaissStore.load("./",embeddings)

// 2. Create Retrieval chain for search into vector store and use open_ai as an model
const chain=new RetrievalQAChain({
    // combineDocumentsChain: loadQAChain(),// it is useful for the general perpose. 
    combineDocumentsChain: loadQAStuffChain(llm), // it is very usefull wwhen you wnat to retrieve data from your document
    retriever: vectorStore.asRetriever(),
    // returnSourceDocuments:true,// return the whole docuemnts
    
})

//5. call the chain and get answer
const res=await chain.call({
    query:"what is your service?"
})

log(res)