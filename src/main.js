import * as THREE from "three"
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/+esm'
import WebGL from 'three/addons/capabilities/WebGL.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Pos } from "./assets/js/data.js"
import { robot, cRobot, chasBody } from "./assets/js/robot.js"
import { dirLight, hemiLight } from "./assets/js/lights.js"
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import CannonDebugger from "cannon-es-debugger"

const Ibtn = [
    document.getElementById("Iforward"),
    document.getElementById("Ibackwards"),
    document.getElementById("Ileft"),
    document.getElementById("Iright"),
]

const container = document.getElementById("main")

const scene = new THREE.Scene()

const mNumber = 0, speed = {s: 15, t: 10}, shadow = [4096, 512]

let bPhone = window.innerWidth < 768 ? true : false

function init() {
    if (WebGL.isWebGLAvailable()) {

        const camera = new THREE.PerspectiveCamera(30, container.clientWidth / container.clientHeight, 0.1, 1000)
        camera.position.set(-80, 56, 140)
        camera.near = 5
        camera.far = 500
        camera.updateProjectionMatrix() 

        const renderer = new THREE.WebGLRenderer({ antialias: true})
        renderer.setSize( container.clientWidth, container.clientHeight)
        container.appendChild(renderer.domElement)
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap
        renderer.clearColor("black");

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
            gravity: new CANNON.Vec3(0, -9.806, 0)
        })

        /*let size = 200
        const fllField = new THREE.Mesh(
            new THREE.BoxGeometry(size, 0.01, size/16*9),
            new THREE.MeshStandardMaterial({ 
                map: new THREE.TextureLoader().load("../src/assets/img/0.png"),
                flatShading: true
            })
        )
        fllField.receiveShadow = true
        fllField.position.set(0, 0.01, 0);
        scene.add(fllField)*/

        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(16000, 16000), 
            new THREE.MeshStandardMaterial({color: 0x38A8FF})
        )
        plane.rotation.set(-Math.PI/2, 0, 0)
        plane.position.set(0,0,0)
        plane.receiveShadow = true
        scene.add(plane)

        const cPlane = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Plane(),
        })
        cPlane.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
        world.addBody(cPlane)
        
        const missions = new THREE.Group()

        const loader = new GLTFLoader()

        let cMissArr = [], missArr = []

        for (let i = 0; i < mNumber; i++) {
            let Miss = new THREE.Group()
            loader.load(`../src/assets/model/${i+1}.glb`, (gltf) => {
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
                Miss.add(obj)
                Miss.position.set(Pos[i].p.x, Pos[i].b.y/2, Pos[i].p.z)
                Miss.rotation.y = Pos[i].r
                missArr[i] = Miss
                missions.add(Miss)

                const cMiss = new CANNON.Body({
                    type: Pos[i].s ? CANNON.Body.STATIC : CANNON.Body.DYNAMIC,
                    shape: new CANNON.Box(new CANNON.Vec3(Pos[i].b.x, Pos[i].b.y, Pos[i].b.z)),
                    position: new CANNON.Vec3(Pos[i].p.x, Pos[i].b.y, Pos[i].p.z),
                    material: new CANNON.Material({friction: 0.1}),
                    mass: Pos[i].s ? 0 : .01
                })
                cMiss.quaternion.setFromEuler(0, Pos[i].r, 0)
            
                world.addBody(cMiss)
            
                cMissArr[i] = cMiss
            })
        }

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

                obj.scale.set(12,12*1.4,12)

                let box = new THREE.Box3().setFromObject(obj)
                let size = new THREE.Vector3()
                box.getSize(size)

                obj.position.set(-60+6*i, size.z/2, -10+6*i)
                obj.rotation.set(Math.PI/2, 0, Math.PI/4)
                Letters.add(obj)
                LettArr[i] = obj

                const cLett = new CANNON.Body({
                    shape: new CANNON.Box(new CANNON.Vec3(size.x/2, size.y/2, size.z/2)),
                    position: new CANNON.Vec3(-60+6*i, size.z/2, -10+6*i),
                    mass: .01
                })
                cLett.quaternion.setFromEuler(Math.PI/2, 0, Math.PI/4)
                world.addBody(cLett)
                cLetts[i] = cLett
            })
        }

        scene.add(missions)
        scene.add(Letters)
        scene.add(robot)

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
                case "ArrowUp": {
                    btn.w = 1
                    break 
                }

                case "a":
                case "ArrowLeft": {
                    btn.a = 1
                    break
                }

                case "s":
                case "ArrowDown": {
                    btn.s = 1
                    break
                }

                case "d":
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
                case "ArrowUp": {
                    btn.w = 0
                    break 
                }

                case "a":
                case "ArrowLeft": {
                    btn.a = 0
                    break
                }

                case "s":
                case "ArrowDown": {
                    btn.s = 0
                    break
                }

                case "d":
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

        
        //reset button
        document.addEventListener("keypress", (e) => {
            let k = e.key

            if (k === "r")
            {
                cRobot.position.set(robot.position.x,robot.position.y+10,robot.position.z)
                cRobot.quaternion.setFromEuler(0,robot.rotation.y,0)
            }    
        }) 


        const startPos = camera.position.clone()

        const robotMaterial = new CANNON.Material()
        cRobot.material = robotMaterial
        cPlane.material = robotMaterial

        const cannonDebugger = new CannonDebugger(scene, world, {})

        function animate() {
            if (bPhone) {
                renderer.shadowMap.enabled = false
            } else {
                renderer.shadowMap.enabled = true
            }

            dirBox.position.set(camera.position.x - startPos.x - 80, camera.position.y - startPos.y + 56, camera.position.z - startPos.z + 140);
            dirLight.target.position.set(camera.position.x - startPos.x - 80, camera.position.y - startPos.y + 56, camera.position.z - startPos.z + 140)

            let k1 = 1, k2 = 1

            cRobot.setWheelForce(0, 0)
            cRobot.setWheelForce(0, 1)

            if (btn.shift) {
                k1 *= 2
                k2 *= 2
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
                cRobot.setWheelForce(speed.s*k1, 0)
                cRobot.setWheelForce(speed.s*k2, 1)
            }

            if (!btn.Rcl) {
                camera.position.set(robot.position.x, 70, robot.position.z+100)
                //camera.rotation.set(-0.4636,0,0)
                camera.rotation.set(-0.57,0,0)
            } else {
                controls.update()
                camera.rotation.set(-0.57,0,0)
            }

           
            world.step(0.1)

            robot.position.copy(chasBody.position)
            robot.quaternion.copy(chasBody.quaternion)

            for (let i = 0; i < missions.children.length; i++) {
                try {
                    let obj = missArr[i], cObj = cMissArr[i]
                    obj.position.copy(cObj.position)
                    obj.quaternion.copy(cObj.quaternion)
                } catch (e) {}
            }

            for (let i = 0; i < 11; i++) {
                try {
                    let obj = LettArr[i], cObj = cLetts[i]
                    obj.position.copy(cObj.position)
                    obj.quaternion.copy(cObj.quaternion)
                } catch (e) {}
            }
            
            cannonDebugger.update()
            //camera.position.set(-96.66457673308406, 0.12664596784900795, 64.39896081993017)
            //camera.rotation.set(-0.23905961802462464, -0.5525403285779773, -0.12722594623065786)
            renderer.render(scene, camera)
            requestAnimationFrame( animate )
        }
        animate()
    }
}

init()