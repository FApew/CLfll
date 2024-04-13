let pi = Math.PI

export let misPos = [   
    {p: {x: -365, z: -153}, r: -pi*5/12, t: 0, n:0, b:0}, 
    {p: {x: -365, z: -170}, r: -pi*1/6, t: 0, n:1, b:0},
    {p: {x: -336, z: -181}, r: -pi*11/12, t: 0, n:2, b:0},
    {p: {x: -280, z: -195}, r: -pi*1/6, t: 0, n:5, b:0},
    {p: {x: -340, z: -155}, r: -pi*1/8, t: 0, n:9, b:0}, 
    {p: {x: -320, z: -160}, r: -pi*11/12, t: 0, n:10, b:0},
    {p: {x: -295, z: -170}, r: pi*1/3, t: 0, n:11, b:0}, 
    //{p: {x: 40, z: -20}, r: -1.1, t: 1, n:9, b:1}, 
]

export let Piles = [
    {n: 4, p : {x: -15, z: -40}, r: .6-pi/2, col: [0.57, 1, 0.7]},
    {n: 3, p : {x: -230, z: -80}, r: pi/4, col: [0.11, 1, 0.5]},
    {n: 4, p : {x: -320, z: -30}, r: pi/2, col: [0.11, 1, 0.5]},
    {n: 3, p : {x: -230, z: 210}, r: pi/4, col: [0.57, 1, 0.7]},
    {n: 3, p : {x: -180, z: 245}, r: pi/3, col: [0.57, 1, 0.7]}
]

export let signPos = [
    {p: {x: -250, z: -110}, r: -pi*1/6, img: "../src/assets/img/7.png", rat: 1/2},
    {p: {x: -140, z: 200}, r: -pi*1/6, img: "../src/assets/img/12.png", rat: 2/3},
    {p: {x: -105, z: 235}, r: -pi/3, img: "../src/assets/img/13.png", rat: 2/3},
    {p: {x: 30, z: -30}, r: -pi*1/6, img: "../src/assets/img/9.png", rat: 1/2},
    {p: {x: -260, z: 140}, r: pi/3, img: "../src/assets/img/10.png", rat: 1/2},
    {p: {x: -228, z: 106}, r: pi/6, img: "../src/assets/img/11.png", rat: 1/2},
]

export let pedPos = [
    {p: {x: -350, z: -90}, r: 0},
    {p: {x: -330, z: -90}, r: 0}
]

export let objPos = [
    {p: {x: -265, y: 23, z: -119}, r: -pi/4, n: 0, b: 0},
    {p: {x: -105, y: 0, z: 245}, r: -pi/3, n: 1, b: 1},
    {p: {x: -260, y: 0, z: 145}, r: pi/3, n: 2, b: 1},
    {p: {x: -150, y: 0, z: 90}, r: -pi*3/4, n: 3, b: 2},
    {p: {x: -90, y: 0, z: 150}, r: pi/4, n: 4, b: 2},
]