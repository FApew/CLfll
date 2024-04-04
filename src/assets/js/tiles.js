import {Group, Mesh, BoxGeometry, MeshStandardMaterial, Box3, Vector3} from "three"
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/+esm'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

let tileNum = 8
const loader = new GLTFLoader()

export const tiles = new Group()
export let arrTile = []

for (let i = 0; i < tileNum; i++) {
    let obj = new Mesh(new BoxGeometry(2,.4,2), new MeshStandardMaterial())

    obj.scale.set(Math.random() > 0.5 ? 3 : 4.5, 3/2, Math.random() > 0.5 ? 3 : 4.5);
    obj.position.set(-20-10*i+(Math.random()*6-3), 0, 20+10*i+(Math.random()*6-3))
    tiles.add(obj)
    tiles.add(obj)

    let box = new Box3().setFromObject(obj)
    let size = new Vector3()
    box.getSize(size)

    const ctile = new CANNON.Body({
        shape: new CANNON.Box(new CANNON.Vec3(size.x/2, size.y/2, size.z/2)),
        position: new CANNON.Vec3(obj.position.x, obj.position.y, obj.position.z),
        type: CANNON.Body.STATIC
    })
    arrTile[i] = ctile
}