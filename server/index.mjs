import express, { json } from 'express';
import fs from 'fs';
const file = fs;
const app = express();
const PORT = 9999;

app.use(json());
app.get('/api/randomcolor', (req, res) => {
    let colors = ['red', 'green', 'yellow', 'blue'];
    return res.status(200).send( colors[Math.floor(Math.random() * 4)]);
});
app.put('/api/setscore',(req, res)=>{
    let highestscore = req.body.score;
    console.log(req.body);
    file.writeFileSync(`../database/score.json`, JSON.stringify({ "score": highestscore }) )
    res.send("ok");
})
app.get('/api/score', (req, res) => {
    const score = file.readFileSync(`../database/score.json`);
    res.send(score);
})







app.listen(PORT, () => console.log(`server is runing on port:${PORT}`));