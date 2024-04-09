import {Group, Mesh, BoxGeometry, MeshStandardMaterial, Box3, Vector3} from "three"
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/+esm'

let tileNum = [8, 30]
let tP = [{x: -20, z: 20, dx: -10, dz: 10}, {x: -250, z: -50, dx: 10, dz: 10}]

export const tiles = new Group()

for (let i = 0; i < tileNum.length; i++) {
    for (let j = 0; j < tileNum[i]; j++) {
        let obj = new Mesh(new BoxGeometry(2,0.3,2), new MeshStandardMaterial())
    
        obj.scale.set(Math.random() > 0.5 ? 3 : 4.5, 3/2, Math.random() > 0.5 ? 3 : 4.5);
        obj.position.set(tP[i].x+tP[i].dx*j+(Math.random()*6-3), 0, tP[i].z+tP[i].dz*j+(Math.random()*6-3))
        tiles.add(obj)
    
        let box = new Box3().setFromObject(obj)
        let size = new Vector3()
        box.getSize(size)
    }
}
