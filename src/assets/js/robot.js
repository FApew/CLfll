import {Group, MeshStandardMaterial, DoubleSide} from "three"
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/+esm'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

const loader = new GLTFLoader()

export let robot = new Group()
loader.load("../src/assets/model/robot.glb", (gltf) => {
    let obj = gltf.scene;
    obj.scale.set(1, 1, 1);
    obj.traverse((child) => {
        if (child.isMesh) {
            if (child.material) {
                child.material = new MeshStandardMaterial({ color: child.material.color, map: child.material.map })
                child.material.side = DoubleSide
            }
            child.geometry.computeVertexNormals()
            child.castShadow = true
            child.receiveShadow = true
        }
    })
    robot.add(obj)
})

//robot.position.set(-80, 50, 40)
robot.position.set(0, 50, 0)

export let chasBody = new CANNON.Body({
    mass: 1.5,
    position: new CANNON.Vec3(robot.position.x,robot.position.y,robot.position.z),
    rotation: new CANNON.Quaternion()
})
chasBody.addShape(new CANNON.Box( new CANNON.Vec3(10, 4.45, 9.225)), new CANNON.Vec3(0,-.7,0))
chasBody.addShape(new CANNON.Box(new CANNON.Vec3(4.35, 1.16 , 3.6)), new CANNON.Vec3(0,4.84,3.995))

export const cRobot = new CANNON.RigidVehicle({
    chassisBody: chasBody,
})
let mat = new CANNON.Material("wheel")

let sh = new CANNON.Sphere(2.78)//CANNON.Cylinder(2.8, 2.8, 1.5, 16)
let wheel1 = new CANNON.Body({
    mass: .2,
    material: mat
})

wheel1.addShape(sh, new CANNON.Vec3(0, 0, 0), new CANNON.Quaternion().setFromEuler(0, 0, Math.PI/2))
wheel1.angularDamping = .999

let wheel2 = new CANNON.Body({
    mass: .2,
    material: mat
})
wheel2.addShape(sh, new CANNON.Vec3(0, 0, 0), new CANNON.Quaternion().setFromEuler(0, 0, Math.PI/2))
wheel2.angularDamping = .999

sh = new CANNON.Sphere(1.25)
mat = new CANNON.Material("wheel")
mat.friction = 0

let wheel3 = new CANNON.Body({
    mass: .1,
    material: mat
})
wheel3.addShape(sh, new CANNON.Vec3(0, 0, 0), new CANNON.Quaternion().setFromEuler(0, 0, Math.PI/2))
wheel3.angularDamping = 0

let wheel4 = new CANNON.Body({
    mass: .1,
    material: mat
})
wheel4.addShape(sh, new CANNON.Vec3(0, 0, 0), new CANNON.Quaternion().setFromEuler(0, 0, Math.PI/2))
wheel4.angularDamping = 0

cRobot.addWheel({
    body: wheel1,
    position: new CANNON.Vec3(7.975, -3.22, 4.775),
    axis: new CANNON.Vec3(1,0,0),
    direction: new CANNON.Vec3(0,-1,0),
})

cRobot.addWheel({
    body: wheel2,
    position: new CANNON.Vec3(-7.975, -3.22, 4.775),
    axis: new CANNON.Vec3(1,0,0),
    direction: new CANNON.Vec3(0,-1,0),
})

cRobot.addWheel({
    body: wheel3,
    position: new CANNON.Vec3(6.375, -4.75, -5.625),
    axis: new CANNON.Vec3(0,0,0),
    direction: new CANNON.Vec3(0,-1,0),
})

cRobot.addWheel({
    body: wheel4,
    position: new CANNON.Vec3(-6.375, -4.75, -5.625),
    axis: new CANNON.Vec3(0,0,0),
    direction: new CANNON.Vec3(0,-1,0),
})

cRobot.chassisBody.quaternion = new CANNON.Quaternion().setFromAxisAngle(new CANNON.Vec3(0,1,0), 1)
