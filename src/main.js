//CODED BY AIELLO FEDERICO - CL-ROBOCITY - 2024
import * as THREE from "three"
import * as CANNON from "https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/+esm"
import WebGL from "three/addons/capabilities/WebGL.js"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { misPos, Piles, signPos, pedPos, objPos } from "./assets/js/data.js"
import { robot, cRobot, chasBody } from "./assets/js/robot.js"
import { dirLight, hemiLight } from "./assets/js/lights.js"
import { plane } from "./assets/js/plane.js"
import { tiles } from "./assets/js/tiles.js"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import CannonDebugger from "https://cdn.jsdelivr.net/npm/cannon-es-debugger@1.0.0/+esm"
import Stats from 'three/addons/libs/stats.module.js'

const barEl = document.getElementById("bar")

/*const Amotor = document.getElementById("Amotor")
Amotor.loop = true
Amotor.volume = 0*/
//Amotor.play()

const track = document.getElementById("track")
track.loop = true
track.volume = 0.2

const Ibtn = [
    document.getElementById("Iforward"),
    document.getElementById("Ibackwards"),
    document.getElementById("Ileft"),
    document.getElementById("Iright"),
]

const container = document.getElementById("main")

const scene = new THREE.Scene()
const loader = new GLTFLoader()

const speed = {s: 15, t: 10}, col1 = new THREE.Color(0x38c8ff), col2 = new THREE.Color(0xf2a200), col3 = new THREE.Color(0x404040) 

let bPhone = window.innerWidth < 768 ? true : false, prevDis = 1000, prevDis1 = 1000, prevDis2 = 1000, prevDis3 = 1000, arrCol = [], mainCol

let colOffset = []

for (let i = 0; i < plane.geometry.attributes.position.count; i++) {
    colOffset.push(Math.random() * 0.1 - 0.05)
}

function init() {
    if (WebGL.isWebGLAvailable()) {
        let btn = {w: 0, a: 0, s: 0, d: 0, shift: 0, Rcl: 0}

        const camera = new THREE.PerspectiveCamera(30, container.clientWidth / container.clientHeight, 0.1, 1000)
        camera.position.set(-80, 56, 140)
        camera.near = 5
        camera.far = 500
        camera.updateProjectionMatrix() 

        const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance"})
        renderer.setSize( container.clientWidth, container.clientHeight)
        renderer.setPixelRatio(window.devicePixelRatio )
        container.appendChild(renderer.domElement)
        //renderer.shadowMap.enabled = true
        //renderer.shadowMap.type = THREE.PCFSoftShadowMap
        renderer.clearColor("black")

        const controls = new OrbitControls( camera, renderer.domElement)
        controls.enableRotate = false
        controls.screenSpacePanning = false
        controls.enableZoom = false

        const dirBox = new THREE.Group()
        dirBox.add(dirLight)
        scene.add(dirBox)
        scene.add(dirLight.target)

        scene.add(hemiLight)

        const world = new CANNON.World({
            gravity: new CANNON.Vec3(0, -9.806, 0),
        })

        let size = 40
        const arrowTxt = new THREE.Mesh(
            new THREE.BoxGeometry(size, 0.01, size*92/357),
            new THREE.MeshStandardMaterial({ 
                map: new THREE.TextureLoader().load("../src/assets/img/6.png"),
                flatShading: true,
                transparent: true,
                opacity: .8
            })
        )
        arrowTxt.receiveShadow = true
        arrowTxt.position.set(35, 0.01, 25)
        arrowTxt.rotation.set(0, Math.PI*7/4, 0);
        scene.add(arrowTxt)

        scene.add(plane)

        const cPlane = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Plane(),
        })
        cPlane.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
        world.addBody(cPlane)

        let fSize = 107
        const fllField = new THREE.Mesh(
            new THREE.BoxGeometry(fSize, 0.01, fSize/16*9),
            new THREE.MeshStandardMaterial({ 
                map: new THREE.TextureLoader().load("../src/assets/img/0.png"),
                flatShading: true
            })
        )
        fllField.receiveShadow = true
        fllField.position.set(-320, 0.582, -160)
        fllField.rotation.set(0,-Math.PI*23/12,0)
        scene.add(fllField)

        //* ### SMALL ROBOT ###

        const points = [
            new THREE.Vector3(-270, .581, -150),
            new THREE.Vector3(-290, .581, -180),
            new THREE.Vector3(-350, .581, -163),
            new THREE.Vector3(-350, .581, -140),
            new THREE.Vector3(-330, .581, -145),
            new THREE.Vector3(-300, .581, -150),
        ]
        const path = new THREE.CatmullRomCurve3(points, true)
        /*const pathG = new THREE.BufferGeometry().setFromPoints(path.getPoints(50))
        const pathM = new THREE.LineBasicMaterial({color: 0x000000})
        const pathO = new THREE.Line(pathG, pathM)
        scene.add(pathO)*/

        const smallRobot = new THREE.Group()

        loader.load("../src/assets/model/mini.glb", (gltf) => {
            const obj = gltf.scene
            obj.scale.set(.5,.5,.5)

            /*obj.traverse((child) => {
                if (child.isMesh) {
                    const newMaterial = new THREE.MeshStandardMaterial({
                        color: child.material.color,
                        map: child.material.map,
                        side: THREE.DoubleSide
                    })
                    child.material = newMaterial
                    child.geometry.computeVertexNormals()
                }
            })*/

            let box = new THREE.Box3().setFromObject(obj)
            let size = new THREE.Vector3()
            box.getSize(size)

            obj.position.set(0,size.y/2, 0)
            obj.rotation.set(0,Math.PI,0)
            
            smallRobot.add(obj)
        })
        loader.load("../src/assets/model/objs/aie.glb", (gltf) => {
            const obj = gltf.scene
            let sc = 2.5
            obj.scale.set(sc,sc,sc)

            obj.traverse((child) => {
                if (child.isMesh) {
                    const newMaterial = new THREE.MeshStandardMaterial({
                        color: child.material.color,
                        map: child.material.map,
                        side: THREE.DoubleSide
                    })
                    child.material = newMaterial
                    child.castShadow = true
                    child.receiveShadow = true
                    child.geometry.computeVertexNormals()
                }
            })

            let box = new THREE.Box3().setFromObject(obj)
            let size = new THREE.Vector3()
            box.getSize(size)

            //obj.position.set(0,6,-1.6)
            obj.position.set(0,9,1.3)
            
            smallRobot.add(obj)
            smallRobot.position.set(0,-50,0)
        })

        //*####################

        //* ###### KEYS #######
        const keys = new THREE.Group()
        let cKeys = [], keyArr = []
        
        for (let i = 0; i < 4; i++) {
            loader.load("../src/assets/model/key.glb", (gltf) => {
                const obj = gltf.scene
                obj.scale.set(2,2,2)
                obj.traverse((child) => {
                    if (child.isMesh) {
                        const newMaterial = new THREE.MeshStandardMaterial({
                            color: child.material.color,
                            map: child.material.map,
                            side: THREE.DoubleSide
                        })
                        child.material = newMaterial
                        child.castShadow = true
                        child.receiveShadow = true
                        child.geometry.computeVertexNormals()
                    }
                })

                let box = new THREE.Box3().setFromObject(obj)
                let size = new THREE.Vector3()
                box.getSize(size)

                keyArr[i] = obj
                keys.add(obj)

                const cKey = new CANNON.Body({
                    shape: new CANNON.Box(new CANNON.Vec3(size.x/2, size.y/2, size.z/2)),
                    position: new CANNON.Vec3(i == 2 ? 31.5 : i == 0 || i == 1 ? 41.5 : 36.5, size.y/2+.5, i == 1 || i == 2 ? 16.5 : i == 0 ? 26.5 : 21.5),
                    mass: .01
                })
                cKey.quaternion.setFromEuler(0, Math.PI/4+Math.PI*i/2, 0)
                world.addBody(cKey)
            
                cKeys[i] = cKey
            })
        }
        //* #######################

        //* ###### MISSIONS #######
        const missions = new THREE.Group()
        let cMissArr = [], missArr = []

        for (let i = 0; i < misPos.length; i++) {
            let Miss = new THREE.Group()
            loader.load(`../src/assets/model/missions/${misPos[i].n}.glb`, (gltf) => {
                const obj = gltf.scene
                let sc = 0.7
                obj.scale.set(sc, sc, sc)
                /*obj.traverse((child) => {
                    if (child.isMesh) {
                        const newMaterial = new THREE.MeshStandardMaterial({
                            color: child.material.color,
                            map: child.material.map,
                            side: THREE.DoubleSide
                        })
                        child.material = newMaterial
                        child.castShadow = true
                        child.receiveShadow = true
                        child.geometry.computeVertexNormals()
                    }
                })*/
                Miss.add(obj)

                let box = new THREE.Box3().setFromObject(obj)
                let size = new THREE.Vector3()
                box.getSize(size)

                Miss.position.set(misPos[i].p.x, size.y/2, misPos[i].p.z)
                Miss.rotation.y = misPos[i].r
                missArr[i] = Miss
                missions.add(Miss)

                if (misPos[i].b) {
                    const cMiss = new CANNON.Body({
                        type: misPos[i].t ? CANNON.Body.STATIC : CANNON.Body.DYNAMIC,
                        shape: new CANNON.Box(new CANNON.Vec3(size.x/2, size.y/2, size.z/2)),
                        position: new CANNON.Vec3(misPos[i].p.x, size.y/2, misPos[i].p.z),
                        material: new CANNON.Material({friction: 0.1}),
                        mass: misPos[i].t ? 0 : .01
                    })
                    cMiss.quaternion.setFromEuler(0, misPos[i].r, 0)
                
                    world.addBody(cMiss)
                
                    cMissArr[i] = cMiss
                }
            })
        }
        //* #######################

        //* ###### PEDESTALS ######
        const peds = new THREE.Group()

        for (let i = 0; i < pedPos.length; i++) {
            let h, w
            loader.load(`../src/assets/model/pedestal.glb`, (gltf) => {
                const obj = gltf.scene
                let sc = 4
                obj.scale.set(sc, sc, sc)
                obj.traverse((child) => {
                    if (child.isMesh) {
                        const newMaterial = new THREE.MeshStandardMaterial({
                            color: "#141414",
                            map: child.material.map,
                            side: THREE.DoubleSide
                        })
                        child.material = newMaterial
                        child.castShadow = true
                        child.receiveShadow = true
                        child.geometry.computeVertexNormals()
                    }
                })

                let box = new THREE.Box3().setFromObject(obj)
                let size = new THREE.Vector3()
                box.getSize(size)
                h = size.y/2
                w = size.x

                obj.position.set(pedPos[i].p.x, size.y/2, pedPos[i].p.z)
                obj.rotation.y = pedPos[i].r
                peds.add(obj)

                const cPed = new CANNON.Body({
                    type: CANNON.Body.STATIC,
                    shape: new CANNON.Box(new CANNON.Vec3(size.x/2, h, size.z/2)),
                    position: new CANNON.Vec3(pedPos[i].p.x, h, pedPos[i].p.z),
                    material: new CANNON.Material({friction: 0.1}),
                })
                cPed.quaternion.setFromEuler(0, pedPos[i].r, 0)
            
                world.addBody(cPed)
            })
            loader.load(pedPos[i].obj, (gltf) => {
                const obj = gltf.scene
                let sc = .3*pedPos[i].s
                obj.scale.set(sc, sc, sc)
                obj.traverse((child) => {
                    if (child.isMesh) {
                        const newMaterial = new THREE.MeshStandardMaterial({
                            color: child.material.color,
                            map: child.material.map,
                            side: THREE.DoubleSide
                        })
                        child.material = newMaterial
                        child.castShadow = true
                        child.receiveShadow = true
                        child.geometry.computeVertexNormals()
                    }
                })

                let box = new THREE.Box3().setFromObject(obj)
                let size = new THREE.Vector3()
                box.getSize(size)

                obj.position.set(pedPos[i].p.x, 2*h+size.y/2, pedPos[i].p.z)
                obj.rotation.y = pedPos[i].r+Math.PI/4
                peds.add(obj)
            })
        }
        //* #######################

        //* ####### SIGNS #########
        const signs = new THREE.Group()

        for (let i = 0; i < signPos.length; i++) {
            let h, w
            loader.load(`../src/assets/model/sign.glb`, (gltf) => {
                const obj = gltf.scene
                let sc = 4
                obj.scale.set(sc, sc, sc)
                obj.traverse((child) => {
                    if (child.isMesh) {
                        const newMaterial = new THREE.MeshStandardMaterial({
                            color: "#141414",
                            map: child.material.map,
                            side: THREE.DoubleSide
                        })
                        child.material = newMaterial
                        child.castShadow = true
                        child.receiveShadow = true
                        child.geometry.computeVertexNormals()
                    }
                })

                let box = new THREE.Box3().setFromObject(obj)
                let size = new THREE.Vector3()
                box.getSize(size)
                h = size.y/2
                w = size.x

                obj.position.set(signPos[i].p.x, size.y/2, signPos[i].p.z)
                obj.rotation.y = signPos[i].r
                signs.add(obj)

                const cSign = new CANNON.Body({
                    type: CANNON.Body.STATIC,
                    shape: new CANNON.Box(new CANNON.Vec3(size.x/2, h, size.z/2)),
                    position: new CANNON.Vec3(signPos[i].p.x, h, signPos[i].p.z),
                    material: new CANNON.Material({friction: 0.1}),
                })
                cSign.quaternion.setFromEuler(0, signPos[i].r, 0)
            
                world.addBody(cSign)
            })
            const img = new THREE.Mesh(
                new THREE.BoxGeometry(20/signPos[i].rat, 0.01, 20),
                new THREE.MeshBasicMaterial({ 
                    map: new THREE.TextureLoader().load(signPos[i].img)
                })
            )
            img.receiveShadow = true
            img.position.set(signPos[i].p.x, 12, signPos[i].p.z)
            img.rotation.set(Math.PI/2, 0 ,-signPos[i].r)
            scene.add(img)
        }
        //* #######################

        //* ####### LETTERS #######
        let Letters = new THREE.Group(), cLetts = [], LettArr = []

        for (let i = 0; i < 11; i++) {
            let idx = i == 6 ? 4 : i == 7 ? 0 : i
            loader.load(`../src/assets/model/letters/${idx}.glb`, (gltf) => {
                const obj = gltf.scene
                
                obj.traverse((child) => {
                    if (child.isMesh) {
                        const newMaterial = new THREE.MeshStandardMaterial({
                            color: child.material.color,
                            map: child.material.map,
                            side: THREE.DoubleSide
                        })
                        child.material = newMaterial
                        child.castShadow = true
                        child.receiveShadow = true
                        child.geometry.computeVertexNormals()
                    }
                })

                obj.scale.set(12,12,12)

                let box = new THREE.Box3().setFromObject(obj)
                let size = new THREE.Vector3()
                box.getSize(size)

                obj.position.set(-60+6*i, size.z/2, -10+6*i)
                obj.rotation.set(Math.PI/2, 0, Math.PI/4)
                Letters.add(obj)
                LettArr[i] = obj

                const cLett = new CANNON.Body({
                    shape: i == 0 || i == 4 || i == 6 || i == 7 ? new CANNON.Cylinder(size.z/2, size.z/2, size.y, 16) : new CANNON.Box(new CANNON.Vec3(size.x/2, size.y/2, size.z/2)),
                    position: new CANNON.Vec3(-60+6*i, size.z/2+.2, -10+6*i),
                    mass: .01
                })
                cLett.quaternion.setFromEuler(Math.PI/2, 0, Math.PI/4)
                world.addBody(cLett)
                cLett.sleep()
                cLetts[i] = cLett
            })
        }
        //* #######################

        //* ######## PILES ########
        let idx = 0
        let bricks = new THREE.Group()
        let arrBricks = [], cBricks = []

        for (let i = 0; i < Piles.length; i++) {
            for (let j = 0; j < Piles[i].n; j++) {
                for (let k = 0; k < Piles[i].n-j; k++) {
                    loader.load("../src/assets/model/brick.glb", (gltf) => {
                        const obj = gltf.scene
                        let scale = 3
                        obj.scale.set(scale,scale,scale)
        
                        obj.traverse((child) => {
                            if (child.isMesh) {
                                const newMaterial = new THREE.MeshStandardMaterial({
                                    color: new THREE.Color().setHSL(Piles[i].col[0], Piles[i].col[1], Piles[i].col[2]+(Math.random() * 0.1 - 0.05), THREE.SRGBColorSpace),
                                    map: child.material.map,
                                    side: THREE.DoubleSide
                                })
                                child.material = newMaterial
                                child.castShadow = true
                                child.receiveShadow = true
                                child.geometry.computeVertexNormals()
                            }
                        })
        
                        let box = new THREE.Box3().setFromObject(obj)
                        let size = new THREE.Vector3()
                        size.y -= .1
                        box.getSize(size)
                        
                        obj.position.set(Piles[i].p.x+(9.6*k+4.8*j)*Math.sin(Piles[i].r), size.z/2+3*1*j, Piles[i].p.z+(9.6*k+4.8*j)*Math.cos(Piles[i].r))
                        obj.rotation.y = Piles[i].r+Math.PI/2
                        bricks.add(obj)
                        arrBricks[idx] = obj

                        let cBrick = new CANNON.Body({
                            shape: new CANNON.Box(new CANNON.Vec3(size.x/2, size.y/2, size.z/2)),
                            position: new CANNON.Vec3(obj.position.x, obj.position.y, obj.position.z),
                            mass: 0.01
                        })
                        cBrick.quaternion.copy(obj.quaternion)
                        world.addBody(cBrick)
                        cBrick.sleep()
                        cBricks[idx] = cBrick

                        idx++
                    })
                }
            }
        }
        //* #######################

        //* ######## OBJS #########
        let objs = new THREE.Group()
        let objArr = [], cObjs = []

        for (let i = 0; i < objPos.length; i++) {
            loader.load(`../src/assets/model/objs/${objPos[i].n}.glb`, (gltf) => {
                const obj = gltf.scene
                
                obj.traverse((child) => {
                    if (child.isMesh) {
                        const newMaterial = new THREE.MeshStandardMaterial({
                            color: child.material.color,
                            map: child.material.map,
                            side: THREE.DoubleSide
                        })
                        child.material = newMaterial
                        child.castShadow = true
                        child.receiveShadow = true
                        if (objPos[i].n == 5)
                        child.material.transparent = true
                        child.material.opacity = 0.5
                        child.geometry.computeVertexNormals()
                    }
                })

                let sc = objPos[i].s
                obj.scale.set(sc,sc,sc)

                let box = new THREE.Box3().setFromObject(obj)
                let size = new THREE.Vector3()
                box.getSize(size)
                if (objPos[i].n == 26) {
                    size.y = 28.5/2
                }

                obj.position.set(objPos[i].p.x,objPos[i].p.y+size.y/2,objPos[i].p.z)
                obj.rotation.set(0,objPos[i].r,0)
                objs.add(obj)
                objArr[i] = obj

                if (objPos[i].b) {
                    const cObj = new CANNON.Body({
                        shape: new CANNON.Box(new CANNON.Vec3(size.x/2, size.y/2, size.z/2)),
                        position: new CANNON.Vec3(objPos[i].p.x,objPos[i].p.y+size.y/2,objPos[i].p.z),
                        mass: objPos[i].b == 1 ? .01 : 0
                    })
                    cObj.quaternion.setFromEuler(0,objPos[i].r,0)
                    world.addBody(cObj)
                    cObj.sleep()
                    cObjs[i] = cObj
                } else {
                    cObjs[i] = 0
                }
            })
        }
        //* #######################


        //* ####### STATUES #######
        let statue = new THREE.Group()
    
        for (let i = 0; i < 2; i++) {
            loader.load("../src/assets/model/base.glb", (gltf) => {
                const obj = gltf.scene
                
                obj.traverse((child) => {
                    if (child.isMesh) {
                        const newMaterial = new THREE.MeshStandardMaterial({
                            color: child.material.color,
                            map: child.material.map,
                            side: THREE.DoubleSide
                        })
                        child.material = newMaterial
                        child.castShadow = true
                        child.receiveShadow = true
                        child.geometry.computeVertexNormals()
                    }
                })

                obj.scale.set(6,3,6)

                let box = new THREE.Box3().setFromObject(obj)
                let size = new THREE.Vector3()
                box.getSize(size)

                obj.position.set(-110+80*i,0,30+80*i)
                obj.rotation.set(0,-Math.PI/4,0)
                statue.add(obj)

                const cBase = new CANNON.Body({
                    shape: new CANNON.Box(new CANNON.Vec3(size.x/2, size.y/2, size.z/2)),
                    position: new CANNON.Vec3(obj.position.x,size.y/2,obj.position.z),
                    type: CANNON.Body.STATIC
                })
                cBase.quaternion.setFromEuler(0,-Math.PI/4,0)
                world.addBody(cBase)
            })
            loader.load(`../src/assets/model/statue${i+1}.glb`, (gltf) => {
                const obj = gltf.scene
                
                obj.traverse((child) => {
                    if (child.isMesh) {
                        const newMaterial = new THREE.MeshStandardMaterial({
                            color: i == 0 ? `#${col2.getHexString()}` : `#${col3.getHexString()}`,
                            map: child.material.map,
                            side: THREE.DoubleSide
                        })
                        child.material = newMaterial
                        child.castShadow = true
                        child.receiveShadow = true
                        child.geometry.computeVertexNormals()
                    }
                })
                obj.scale.set(1.5,1.5,1.5)

                let box = new THREE.Box3().setFromObject(obj)
                let size = new THREE.Vector3()
                box.getSize(size)

                obj.position.set(-110+80*i,size.y/2+11.48,30+80*i)
                obj.rotation.set(0,-Math.PI/6,0)
                statue.add(obj)
            })
        }

        //* #######################

        //* ####### TABLE #######
        loader.load("../src/assets/model/table.glb", (gltf) => {
            const obj = gltf.scene
            
            obj.traverse((child) => {
                if (child.isMesh) {
                    const newMaterial = new THREE.MeshStandardMaterial({
                        color: child.material.color,
                        map: child.material.map,
                        side: THREE.DoubleSide
                    })
                    child.material = newMaterial
                    child.castShadow = true
                    child.receiveShadow = true
                    child.geometry.computeVertexNormals()
                }
            })

            let sc = 30
            obj.scale.set(sc,sc,sc)

            let box = new THREE.Box3().setFromObject(obj)
            let size = new THREE.Vector3()
            box.getSize(size)

            obj.position.set(-320,-size.y/2,-160)
            obj.rotation.set(0,-Math.PI*5/12,0)
            scene.add(obj)

            const cBase = new CANNON.Body({
                shape: new CANNON.Box(new CANNON.Vec3(size.x/2, size.y/2, size.z/2)),
                position: new CANNON.Vec3(obj.position.x,0,obj.position.z),
                type: CANNON.Body.STATIC
            })
            cBase.quaternion.setFromEuler(0,obj.rotation.y,0)
            world.addBody(cBase)
        })

        //* #######################

        scene.add(bricks)
        scene.add(peds)
        scene.add(signs)
        scene.add(Letters)
        scene.add(robot)
        scene.add(tiles)
        scene.add(keys)
        scene.add(objs)
        scene.add(statue)
        scene.add(smallRobot)

        let temp1 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshBasicMaterial({visible: false})
        )
        temp1.position.set(-290, 1, -90)
        
        let temp2 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshBasicMaterial({visible: false})
        )
        temp2.position.set(90, 1, 290)

        let temp3 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshBasicMaterial({visible: false})
        )
        temp3.position.set(-210, 1, 210)

        scene.add(temp1)
        scene.add(temp2)
        scene.add(temp3)

        cRobot.addToWorld(world)

        camera.lookAt(robot.position)

        window.onresize = () => {
            camera.aspect = container.clientWidth / container.clientHeight
            camera.updateProjectionMatrix()
            renderer.setSize(container.clientWidth, container.clientHeight )
            bPhone = window.innerWidth < 768 ? true : false
        }

        document.addEventListener("keydown", (e) => {
            switch (e.key) {

                case "w":
                    case "W":
                case "ArrowUp": {
                    btn.w = 1
                    break 
                }

                case "a":
                case "A":
                case "ArrowLeft": {
                    btn.a = 1
                    break
                }

                case "s":
                case "S":
                case "ArrowDown": {
                    btn.s = 1
                    break
                }

                case "d":
                case "D":
                case "ArrowRight": {
                    btn.d = 1
                    break
                }

                case "Shift": {
                    btn.shift = 1
                    break
                }
            }
            btn.Rcl = 0
        })

        document.addEventListener("keyup", (e) => {
            switch (e.key) {

                case "w":
                case "W":
                case "ArrowUp": {
                    btn.w = 0
                    break 
                }

                case "a":
                case "A":
                case "ArrowLeft": {
                    btn.a = 0
                    break
                }

                case "s":
                case "S":
                case "ArrowDown": {
                    btn.s = 0
                    break
                }

                case "d":
                case "D":
                case "ArrowRight": {
                    btn.d = 0
                    break
                }

                case "Shift": {
                    btn.shift = 0
                    break
                }
            }
        })

        document.addEventListener("mousedown", (e) => {
            if (e.button == 2) {
                btn.Rcl = 1
            }
        })

        Ibtn[0].addEventListener("touchstart", (e) => {
            btn.w = 1
            e.preventDefault()
        })

        Ibtn[1].addEventListener("touchstart", (e) => {
            btn.s = 1
            e.preventDefault()
        })

        Ibtn[2].addEventListener("touchstart", (e) => {
            btn.a = 1
            e.preventDefault()
        })

        Ibtn[3].addEventListener("touchstart", (e) => {
            btn.d = 1
            e.preventDefault()
        })

        Ibtn[0].addEventListener("touchend", () => {
            btn.w = 0
        })

        Ibtn[1].addEventListener("touchend", () => {
            btn.s = 0
        })

        Ibtn[2].addEventListener("touchend", () => {
            btn.a = 0
        })

        Ibtn[3].addEventListener("touchend", () => {
            btn.d = 0
        })

        const startPos = camera.position.clone()

        const robotMaterial = new CANNON.Material()
        cRobot.material = robotMaterial
        cPlane.material = robotMaterial

        const cannonDebugger = new CannonDebugger(scene, world, {})

        if (bPhone) {
            renderer.shadowMap.enabled = false
            renderer.setPixelRatio(window.devicePixelRatio * 0.6)
            camera.fov = 40
            /*camera.near = 10
            camera.far = 300*/
            camera.updateProjectionMatrix()
        } else {
            renderer.shadowMap.enabled = false
            renderer.setPixelRatio(window.devicePixelRatio * 0.9)
            camera.fov = 30
            camera.updateProjectionMatrix()
            scene.add(missions)
        }

        /*let stats = new Stats()
        stats.domElement.style.position = 'absolute';
		stats.domElement.style.top = '0px';
        container.appendChild( stats.dom )*/

        let pt = Date.now()

        document.addEventListener("click", () => {
            track.play()
        })
        document.addEventListener("keypress", () => {
            track.play()
        })
        
        function animate() {
            dirBox.position.set(camera.position.x - startPos.x - 80, camera.position.y - startPos.y + 56, camera.position.z - startPos.z + 140);
            dirLight.target.position.set(camera.position.x - startPos.x - 80, camera.position.y - startPos.y + 56, camera.position.z - startPos.z + 140)

            let k1 = 1, k2 = 1

            cRobot.setWheelForce(0, 0)
            cRobot.setWheelForce(0, 1)

            if (btn.shift) {
                k1 *= 3
                k2 *= 3
            }
            
            if (btn.d && !btn.shift) {

                cRobot.setWheelForce(speed.t, 0)
                cRobot.setWheelForce(-speed.t, 1)
                k1 *= 0
                k2 *= 1.5
            } else if (btn.a && !btn.shift) {
                cRobot.setWheelForce(-speed.t, 0)
                cRobot.setWheelForce(speed.t, 1)
                k1 *= 1.5
                k2 *= 0
            } 
            
            if (btn.w) {
                cRobot.setWheelForce(-speed.s*k1, 0)
                cRobot.setWheelForce(-speed.s*k2, 1)  
            } else if (btn.s) {
                cRobot.setWheelForce(speed.s*k2, 0)
                cRobot.setWheelForce(speed.s*k1, 1)
            }

            if (!btn.Rcl) {
                camera.position.set(robot.position.x, 70, robot.position.z+100)
                //camera.rotation.set(-0.4636,0,0)
                camera.rotation.set(-0.57,0,0)
            } else {
                controls.update()
                camera.rotation.set(-0.57,0,0)
            }

            /*if (btn.w || btn.a || btn .s || btn.d ) {
                if( Amotor.volume + 0.05 < 0.95) {
                    Amotor.volume += 0.05
                } else {
                    Amotor.volume = 1
                }
            } else {
                if (Amotor.volume / 1.1 > 0.05) {
                    Amotor.volume /= 1.1
                } else {
                    Amotor.volume = 0
                }
            }*/

            let dt = Date.now()
            /*wlet d = Math.abs(pt - dt)
            if (d > 30 || bPhone) {
                world.step(1/60, d)
            } else {*/
                world.step(0.1)
            //}
            
            pt = dt
            
            robot.position.copy(chasBody.position)
            robot.quaternion.copy(chasBody.quaternion)

            /*for (let i = 0; i < missions.children.length; i++) {
                try {
                    let obj = missArr[i], cObj = cMissArr[i]
                    obj.position.copy(cObj.position)
                    obj.quaternion.copy(cObj.quaternion)
                } catch (e) {}
            }*/

            for (let i = 0; i < arrBricks.length; i++) {
                let obj = arrBricks[i], cObj = cBricks[i]
                if (cObj.velocity.length() < 0.01) {
                    cObj.sleep()
                } else {
                    obj.position.copy(cObj.position)
                    obj.quaternion.copy(cObj.quaternion)
                }
            }

            for (let i = 0; i < objArr.length; i++) {
                try {
                    if (cObjs[i] != 0) {
                        let obj = objArr[i], cObj = cObjs[i]
                        if (cObj.velocity.length() < 0.01) {
                            cObj.sleep()
                        } else {
                            obj.position.copy(cObj.position)
                            obj.quaternion.copy(cObj.quaternion) 
                        }
                    }
                } catch (e) {}
            }

            for (let i = 0; i < keyArr.length; i++) {
                let obj = keyArr[i], cObj = cKeys[i]
                if (cObj.velocity.length() < 0.01) {
                    cObj.sleep()
                } else {
                    obj.position.copy(cObj.position)
                    obj.quaternion.copy(cObj.quaternion)
                }
            }

            for (let i = 0; i < LettArr.length; i++) {
                try {
                    let obj = LettArr[i], cObj = cLetts[i]
                    if (cObj.velocity.length() < 0.01) {
                        cObj.sleep()
                    } else {
                        obj.position.copy(cObj.position)
                        obj.quaternion.copy(cObj.quaternion)
                    }
                } catch (e) {}
            }

            /*let t = (Date.now() / 1500 % points.length) / points.length
                    let pos = path.getPointAt(t)
                    smallRobot.position.copy(pos)
                    smallRobot.lookAt(pos.clone().add(path.getTangentAt(t)))*/
            
            let position = plane.geometry.attributes.position
            let dis1 = temp1.position.distanceTo(robot.position)
            let dis2 = temp2.position.distanceTo(robot.position)

            let t = ( Date.now() / 1500 % points.length) / points.length
            let pos = path.getPointAt(t)
            smallRobot.position.copy(pos)
            smallRobot.lookAt(pos.clone().add(path.getTangentAt(t)))

            if (chasBody.velocity.length() > 0.01) {
                if (dis1 < 200) {
                    if (dis1 < 150) {
                        if (prevDis > 150) {
                            arrCol = []
                            mainCol = col2
                            let c = col2.getHSL(col2)
                            for (let i = 0; i < position.count; i++) {
                                let col = new THREE.Color()
                                col.setHSL(c.h, c.s, c.l+colOffset[i], THREE.SRGBColorSpace) //#38A8FF
                                arrCol.push(col.r, col.g, col.b)
                            }
                            plane.geometry.setAttribute('color', new THREE.Float32BufferAttribute(arrCol, 3))
                            barEl.style.backgroundColor = `#${mainCol.getHexString()}`
                        }
                    } else {
                        if (Math.abs(prevDis1 - dis1) > 5) {
                            arrCol = []
                            let p = 1-(dis1-150) / 50
                            let mix = new THREE.Color().lerpColors(col1, col2, p)
                            mix.getHSL(mix)
                            mainCol = mix
                            for (let i = 0; i < position.count; i++) {
                                let col = new THREE.Color()
                                col.setHSL(mix.h, mix.s, mix.l+colOffset[i], THREE.SRGBColorSpace) //#38A8FF
                                arrCol.push(col.r, col.g, col.b)
                            }
                            plane.geometry.setAttribute('color', new THREE.Float32BufferAttribute(arrCol, 3))
                            barEl.style.backgroundColor = `#${mainCol.getHexString()}`
                            prevDis1 = dis1
                        }
                    }
                } else if (dis2 < 200) {
                    if (dis2 < 112.8) {
                        if (prevDis2 > 112.8) {
                            arrCol = []
                            mainCol = col3
                            let c = col3.getHSL(col3)
                            for (let i = 0; i < position.count; i++) {
                                let col = new THREE.Color()
                                col.setHSL(c.h, c.s, c.l+colOffset[i], THREE.SRGBColorSpace) //#38A8FF
                                arrCol.push(col.r, col.g, col.b)
                            }
                            plane.geometry.setAttribute('color', new THREE.Float32BufferAttribute(arrCol, 3))
                            barEl.style.backgroundColor = `#${mainCol.getHexString()}`
                            track.volume = 1
                            scene.fog = new THREE.Fog("#3a9ce7", 1, 700)
                        }
                    } else {
                        if (Math.abs(prevDis3 - dis2) > 5) {
                            arrCol = []
                            let p = 1-(dis2-112.8) / 77.2
                            let mix = new THREE.Color().lerpColors(col1, col3, p)
                            mix.getHSL(mix)
                            mainCol = mix
                            for (let i = 0; i < position.count; i++) {
                                let col = new THREE.Color()
                                col.setHSL(mix.h, mix.s, mix.l+colOffset[i], THREE.SRGBColorSpace) //#38A8FF
                                arrCol.push(col.r, col.g, col.b)
                            }
                            plane.geometry.setAttribute('color', new THREE.Float32BufferAttribute(arrCol, 3))
                            barEl.style.backgroundColor = `#${mainCol.getHexString()}`
                            prevDis3 = dis2
                        }
                        track.volume = 0.2
                        scene.fog = 0
                    }
                } else {
                    if (prevDis2 < 200 || prevDis < 200) {
                        arrCol = []
                        mainCol = col1
                        let c = col1.getHSL(col1)
                        for (let i = 0; i < position.count; i++) {
                            let col = new THREE.Color()
                            col.setHSL(c.h, c.s, c.l+colOffset[i], THREE.SRGBColorSpace) //#38A8FF
                            arrCol.push(col.r, col.g, col.b)
                        }
                        plane.geometry.setAttribute('color', new THREE.Float32BufferAttribute(arrCol, 3))
                        barEl.style.backgroundColor = `#${mainCol.getHexString()}`
                    }
                }
                prevDis = dis1
                prevDis2 = dis2
            }

            /*if (Amotor.currentTime > Amotor.duration - 0.2) {
                Amotor.currentTime = 0.2
            }*/

            //cannonDebugger.update()
            
            //camera.position.set(-13.66457673308406, 0.12664596784900795, 15.39896081993017)
            //camera.rotation.set(-0.23905961802462464, -0.5525403285779773, -0.12722594623065786)
            //stats.update()
            renderer.render(scene, camera)
            requestAnimationFrame( animate )
        }

        animate()
    }
}

init()