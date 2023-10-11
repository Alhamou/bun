import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";

const app = express()
const port = Bun.env.PORT || 4000;

let privateKey = await Bun.file("./jwtRS256.key").text()
let publicKey = await Bun.file("./jwtRS256.key.pub").text()

// create application/json parser
// var jsonParser = bodyParser.json()
app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: false }))

app.post('/sing', async (req: Request, res: Response) => {
    const token = jwt.sign({...req.body}, privateKey, {algorithm: "RS256"})
    res.json({token: token})
})

app.post('/verify', async (req: Request, res: Response) => {
    try{
        const token = String(req.headers.authorization?.split(" ")[1])
        const result = jwt.verify(token, publicKey)
        res.json({result})
    } catch{
        res.json({error: "token is required!"})
    }
})

app.get('/', async (req: Request, res: Response) => {
    const file = Bun.file("index.html")
    res.send(await file.text())
})

app.listen(port, function(){
    console.log(`app is running localhost:${port}`)
})
