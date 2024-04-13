import { Vector3, Color, PlaneGeometry, Float32BufferAttribute, SRGBColorSpace, Mesh, MeshStandardMaterial } from "three"

const vtx = new Vector3()
const col = new Color()
let gPlane = new PlaneGeometry( 2000, 2000, 80, 80)
gPlane.rotateX(-Math.PI/2)
let position = gPlane.attributes.position

for (let i = 0; i < position.count; i++) {
    vtx.fromBufferAttribute( position, i)
    vtx.x += Math.random() * 8 - 4
    vtx.z += Math.random() * 8 - 4
    position.setXYZ(i, vtx.x*4, vtx.y, vtx.z*4)
}

gPlane = gPlane.toNonIndexed()
position = gPlane.attributes.position
const arrCol = []

for (let i = 0; i < position.count; i++) {
    col.setHSL(0.57, 1, 0.52+(Math.random() * 0.1 - 0.05), SRGBColorSpace) //#38A8FF
    arrCol.push(col.r, col.g, col.b)
}

gPlane.setAttribute('color', new Float32BufferAttribute(arrCol, 3))
const mPlane = new MeshStandardMaterial({ vertexColors: true, transparent: true })
export const plane = new Mesh(gPlane, mPlane)
plane.receiveShadow = true