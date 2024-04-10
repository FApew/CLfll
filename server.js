import express from "express"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.get("/src/main.js", (req, res) => {
    res.type("application/javascript")
    res.sendFile(__dirname + "/src/main.js")
})

app.get("/src/script.js", (req, res) => {
    res.sendFile(__dirname + "/src/script.js")
})

app.get("/src/assets/style.css", (req, res) => {
    res.sendFile(__dirname + "/src/assets/style.css")
})

app.get("/src/assets/js/data.js", (req, res) => {
    res.sendFile(__dirname + "/src/assets/js/data.js")
})

app.get("/src/assets/js/lights.js", (req, res) => {
    res.sendFile(__dirname + "/src/assets/js/lights.js")
})

app.get("/src/assets/js/robot.js", (req, res) => {
    res.sendFile(__dirname + "/src/assets/js/robot.js")
})

app.get("/src/assets/js/plane.js", (req, res) => {
    res.sendFile(__dirname + "/src/assets/js/plane.js")
})

app.get("/src/assets/js/tiles.js", (req, res) => {
    res.sendFile(__dirname + "/src/assets/js/tiles.js")
})

app.get("/src/assets/model/robot.glb", (req, res) => {
    res.sendFile(__dirname + "/src/assets/model/robot.glb")
})

app.get("/src/assets/model/key.glb", (req, res) => {
    res.sendFile(__dirname + "/src/assets/model/key.glb")
})

app.get("/src/assets/model/brick.glb", (req, res) => {
    res.sendFile(__dirname + "/src/assets/model/brick.glb")
})

app.get("/src/assets/model/base.glb", (req, res) => {
    res.sendFile(__dirname + "/src/assets/model/base.glb")
})


app.get("/src/assets/model/statue1.glb", (req, res) => {
    res.sendFile(__dirname + "/src/assets/model/statue1.glb")
})

app.get("/src/assets/model/table.glb", (req, res) => {
    res.sendFile(__dirname + "/src/assets/model/table.glb")
})

app.get("/src/assets/model/minif/aie.glb", (req, res) => {
    res.sendFile(__dirname + "/src/assets/model/minif/aie.glb")
})

app.get("/src/assets/model/mini.glb", (req, res) => {
    res.sendFile(__dirname + "/src/assets/model/mini.glb")
})

for (let i = 0; i < 16; i++) {
    app.get(`/src/assets/model/missions/${i}.glb`, (req, res) => {
        res.sendFile(__dirname + `/src/assets/model/missions/${i}.glb`)
    })
}

for (let i = 0; i < 11; i++) {
    app.get(`/src/assets/model/letters/${i}.glb`, (req, res) => {
        res.sendFile(__dirname + `/src/assets/model/letters/${i}.glb`)
    })
}

for (let i = 0; i < 11; i++) {
    app.get(`/src/assets/model/minif/${i}.glb`, (req, res) => {
        res.sendFile(__dirname + `/src/assets/model/minif/${i}.glb`)
    })
}

for (let i = 0; i <= 6; i++) {
    app.get(`/src/assets/img/${i}.png`, (req, res) => {
        res.sendFile(__dirname + `/src/assets/img/${i}.png`)
    })
}

app.listen(8080, () => {
    console.log("App listening on https://localhost:8080/")
})