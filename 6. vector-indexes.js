import path from "path"
import {config} from "dotenv"
import { OpenAI } from "langchain/llms/openai"
import {TextLoader} from "langchain/document_loaders/fs/text"
import {CharacterTextSplitter} from "langchain/text_splitter"
import {OpenAIEmbeddings} from "langchain/embeddings/openai"
import {FaissStore} from "langchain/vectorstores/faiss"
config()
const log=console.log
const llm = new OpenAI({ temperature: 1,openAIApiKey:process.env.OPENAI_API_KEY});

// 1. Create loader
const loader=new TextLoader(path.resolve("./restaurant.txt"))
// 2. Create spliter
const spliter=new CharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 50
})
// 3. loader docuemnt
const docs=await loader.load()
// 4. splict document
const documents=await spliter.splitDocuments(docs)
// 5. create embedding instance
const embeddings=new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY
})
// 6. Create Vector Store Faiss
const vectorStore=await FaissStore.fromDocuments(docs,embeddings)
// 7. Save Vector
await vectorStore.save(path.resolve())


