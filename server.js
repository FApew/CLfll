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

app.get("/src/assets/model/statue2.glb", (req, res) => {
    res.sendFile(__dirname + "/src/assets/model/statue2.glb")
})

app.get("/src/assets/model/statue3.glb", (req, res) => {
    res.sendFile(__dirname + "/src/assets/model/statue3.glb")
})

app.get("/src/assets/model/statue4.glb", (req, res) => {
    res.sendFile(__dirname + "/src/assets/model/statue4.glb")
})

app.get("/src/assets/model/statue5.glb", (req, res) => {
    res.sendFile(__dirname + "/src/assets/model/statue5.glb")
})

app.get("/src/assets/model/statue6.glb", (req, res) => {
    res.sendFile(__dirname + "/src/assets/model/statue6.glb")
})

app.get("/src/assets/model/table.glb", (req, res) => {
    res.sendFile(__dirname + "/src/assets/model/table.glb")
})

app.get("/src/assets/model/objs/aie.glb", (req, res) => {
    res.sendFile(__dirname + "/src/assets/model/objs/aie.glb")
})

app.get("/src/assets/model/mini.glb", (req, res) => {
    res.sendFile(__dirname + "/src/assets/model/mini.glb")
})

app.get("/src/assets/model/sign.glb", (req, res) => {
    res.sendFile(__dirname + "/src/assets/model/sign.glb")
})

app.get("/src/assets/model/eso6.glb", (req, res) => {
    res.sendFile(__dirname + "/src/assets/model/eso6.glb")
})

app.get("/src/assets/model/pedestal.glb", (req, res) => {
    res.sendFile(__dirname + "/src/assets/model/pedestal.glb")
})

app.get("/src/assets/audio/track.mp3", (req, res) => {
    res.sendFile(__dirname + "/src/assets/audio/track.mp3")
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

for (let i = 0; i <= 27; i++) {
    app.get(`/src/assets/model/objs/${i}.glb`, (req, res) => {
        res.sendFile(__dirname + `/src/assets/model/objs/${i}.glb`)
    })
}

for (let i = 0; i <= 15; i++) {
    app.get(`/src/assets/img/${i}.png`, (req, res) => {
        res.sendFile(__dirname + `/src/assets/img/${i}.png`)
    })
}

app.listen(8080, () => {
    console.log("App listening on https://localhost:8080/")
})