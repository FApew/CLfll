const ButtonImgSX = document.getElementById("SXimgButton")
const ButtonImgDX = document.getElementById("DXimgButton")
const arrCrewName = ["PERU", "AIELLO", "COACH GRIGOLI"]
const arrCrewDesc = ["peru", "programmatore molto POCO capace", "the info expert"]
const arrCrewImg = ["./img/peru.jpg", "./img/aiello.jpg", "./img/grigoli.JPG"]
const arrIGspam = ["https://www.instagram.com/fr_peru/", "https://www.instagram.com/_aiello.f/", "#"]



let currentMember = 0

const Name = document.getElementById("TEAMtitle")
const Desc = document.getElementById("TEAMdesc")
const Img = document.getElementById("TEAMimg")   



function changedesc()
{
    Name.innerHTML = arrCrewName[currentMember]
    Desc.innerHTML = arrCrewDesc[currentMember]
    Img.src = arrCrewImg[currentMember]

}

ButtonImgDX.addEventListener("mousedown", () => {
    currentMember = (currentMember + 1)%arrCrewName.length
    changedesc()
})

ButtonImgSX.addEventListener("mousedown", () => {
    currentMember = (currentMember - 1)%arrCrewName.length   
    changedesc()
})

Name.addEventListener("mousedown", () => {
    window.open(arrIGspam[currentMember])
})



    
    



