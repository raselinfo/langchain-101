import {config} from "dotenv"
import {Configuration,OpenAIApi} from "openai"
const log=console.log
config()

const conf=new Configuration({apiKey:process.env.OPENAI_API_KEY,organization:process.env.OPENAI_ORG_ID})

const ai=new OpenAIApi(conf)


const chat=async(input)=>{
    try{
        const messages=[
            {
                role:"user",
                content:input
            }
        ]
        const response=await ai.createChatCompletion({
            model:"gpt-3.5-turbo",
            messages,
            temperature:0,
            stream:true
        },{
            responseType:"stream"
        })
        let main_message=""
        let stop_resone=""
        response.data.on("data",(data)=>{
            const lines=data?.toString()?.split("\n")?.filter(line=>line.trim() !=="")
           for(const line of lines){
            const message=line.replace(/^data: /,"")
            if(message==="[DONE]"){
             return
            }
            try{
             const parsed=JSON.parse(message)
             const res=parsed?.choices[0]?.delta?.content
             const stop=parsed?.choices[0]?.delta?.finish_reason
             if(stop){
                    stop_resone=stop
             }
             if(res.split('\n')[0]!=='undefined'){
                    main_message+=res
             }
           
            }catch(err){
             log("💖",err.message,message)
            }
           }
        })
        response.data.on("close",()=>{

            log("✅",main_message)
            log("🚀",stop_resone)
        })

        // return response.data.choices[0].message.content
    }catch(err){
        throw new Error(err.message)
    }
}
const question="write me a nobel"

const promptTemplate=`
Be very funny when answering the following question:
Question: {question}
`

const prompt=promptTemplate.replace("{question}",question)
log(prompt)

chat(prompt).then(res=>{
    // log(res)
}).catch(err=>{
    console.log("last",err.message)
})