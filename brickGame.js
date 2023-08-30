const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
// document.addEventListener("keydown", keydown);
canvas.addEventListener("mousemove", fareHareketi);


let interval;
let oyunBasladiMi = false;
const height = canvas.height;
const width = canvas.width;
let ballColor= "#0095DD";
let x = width/2;
let y = height-20;
let cap = 6;
let dx = 2;
let dy =-2;
let cubukGenisligi = 80;
let cubukYuksekligi = 10;
let cubukX = (width - cubukGenisligi)/2;
let cubukY = (height - cubukYuksekligi);
let tuglaSatirSayisi = 3;
let tuglaSutunSayisi = 4;
const tuglaGenislik = 75;
const tuglaYukseklik = 20;
const tuglaOffSetTop = 40;
const tuglaOffSetLeft = 40;
const tuglaPadding = 30;
const tuglalar = [];
let dusenSuprizler = [];
let suprizSayisi = 5;
let suprizVerildi =0;
let skor = 0;
let can =3 ;
let tuglaCan = 3;
let isGameOver = false;
let hedefCubukX = cubukX;
const interpolasyonHizi = 0.1;
let tuglaRenk = "green";
let buyut =0;

for(let k =0; k<tuglaSutunSayisi; k++){
    tuglalar[k] = [];
    for (let s = 0; s < tuglaSatirSayisi; s++){
        let supriz = false;
        if(suprizVerildi< suprizSayisi && Math.random()< 0.2){
            //%20 olasılıkla süpriz ver

            supriz = true;
            suprizVerildi++;
        }
        tuglalar[k][s] = {x:0, y:0, status:1, supriz:supriz, tuglaCan:3};
    }}



    
//arrow function
const oyunuCiz = () =>{


    tahtayiTemizle();
    topuCiz(); 
    topuHareketEttir();
    bariCiz();    
    tuglalariCiz();
    cubuguHareketEttir();
    tuglayaCarptiMi();
    suprizleriCiz();
    skoruCiz();
    canCiz();
    if(oyunuBaslatmaYazisiCiz()) return;

    



}

const tahtayiTemizle =()=>{
    ctx.clearRect(0,0,width,height);
}

const topuCiz =()=>{

    ctx.beginPath();
    ctx.arc(x, y,cap,0,Math.PI*2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
}

const bariCiz =()=>{
    ctx.fillStyle="red";
    ctx.fillRect(cubukX,cubukY,cubukGenisligi,cubukYuksekligi);

}

const topuHareketEttir=()=>{

    if(x+dx>width-cap || x+dx<cap){///
        dx = -dx;
    }

    if(y+dy <cap){//yukarı çarptığında
        dy = -dy;
    } else if(y + dy > cubukY - cap && y + dy < cubukY + cap && // Y ekseninde çubuğa çarptığında
    x > cubukX && x < cubukX + cubukGenisligi)  // X ekseninde çubuğa çarptığında
    {
        dy = -dy;
    }else if(y + dy > height - cap){ //aşağı çaprtığında
        if(x < cubukX || x > cubukX + cubukGenisligi){
            can--;
            if(can === 0){
                ctx.font = "25px Verdena";
                ctx.fillStyle = "red";
                ctx.fillText("Game Over!",width/2-50,height/2+50);
                clearInterval(interval);
                isGameOver= true; 
                oyunBasladiMi = false;           
            }
        }
        
        dy = -dy;
}
    x += dx;
    y += dy;
}


const tuglalariCiz = () => {
    for(let sutun = 0; sutun < tuglaSutunSayisi; sutun++){        
        for(let satir = 0; satir < tuglaSatirSayisi; satir++){
            if(tuglalar[sutun][satir].status === 1){
                const tuglaX = sutun * (tuglaGenislik + tuglaPadding) + tuglaOffSetLeft;
                const tuglaY = satir * (tuglaYukseklik + tuglaPadding) + tuglaOffSetTop;

                const tugla = tuglalar[sutun][satir];

                if (tugla.tuglaCan === 3) {
                    tuglaRenk = "#0095DD";
                } else if (tugla.tuglaCan === 2) {
                    tuglaRenk = "#FFD700";
                } else if (tugla.tuglaCan === 1) {
                    tuglaRenk = "#FF6347";
                }

                tugla.x = tuglaX;
                tugla.y = tuglaY;

                ctx.beginPath();
                ctx.rect(tuglaX, tuglaY, tuglaGenislik, tuglaYukseklik);
                ctx.fillStyle = tuglaRenk;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}


const tuglayaCarptiMi = () => {
    for(let sutun = 0; sutun < tuglaSutunSayisi; sutun++){
        for(let satir = 0; satir < tuglaSatirSayisi; satir++){
            const tugla = tuglalar[sutun][satir];
            if(tugla.status === 1){
                if (x + cap > tugla.x && x - cap < tugla.x + tuglaGenislik &&
                    y + cap > tugla.y && y - cap < tugla.y + tuglaYukseklik) 
                {
                    dy = -dy;
                    tugla.tuglaCan--;
                    if (tugla.tuglaCan === 0) {
                        tugla.status = 0;
                    }
                    skor++;

                    // Süprizi kontrol et
                    if (tugla.supriz) {
                        dusenSuprizler.push({x: tugla.x + tuglaGenislik / 2, y: tugla.y + tuglaYukseklik / 2, status: 1});
                    }

                    if(skor === tuglaSatirSayisi * tuglaSutunSayisi*3){
                        clearInterval(interval);

                        ctx.font = "25px Verdena";
                        ctx.fillStyle = "black";
                        ctx.fillText("Tebrikler, oyunu kazandın!",width/2 - 120,height/2+50);
                        isGameOver = true;
                        oyunBasladiMi = false;
                    }
                }
            }
        }
    }
}


const suprizleriCiz = () => {
    for (let i = 0; i < dusenSuprizler.length; i++) {
        const supriz = dusenSuprizler[i];
        if (supriz.status === 1) {

            // Süprizi aşağı doğru hareket ettirelim.
            supriz.y += 2;

            

            // Çubuğu ya büyütelim ya da küçültebiliriz. Rastgele bir seçim yapalım.
            if(buyut ===0)
            {
              buyut = Math.random() >= 0.5;  // 0.5'ten büyük ya da eşitse true, küçükse false döner.
            }

            ctx.beginPath();
            ctx.rect(supriz.x, supriz.y, 10, 10);

            if(buyut){
                ctx.fillStyle = "#2596be"; 
                    ctx.fill();
                    ctx.closePath();
            }
            else{
                ctx.fillStyle = "#FF0000"; // Süprizi kırmızı yapalım.
                    ctx.fill();
                    ctx.closePath();
            }
            // Eğer süpriz, çubuğa çarparsa:
            if (supriz.y >= cubukY && supriz.y <= cubukY + cubukYuksekligi &&
                supriz.x >= cubukX && supriz.x <= cubukX + cubukGenisligi) {
            
                supriz.status = 0; // Süprizi devre dışı bırakalım.
            
                // // Çubuğu ya büyütelim ya da küçültebiliriz. Rastgele bir seçim yapalım.
                // const buyut = Math.random() >= 0.5;  // 0.5'ten büyük ya da eşitse true, küçükse false döner.
            
                if (buyut && cubukGenisligi <= 100) {  // Çubuğu büyütmeyi sınırlayalım.
                    cubukGenisligi =  cubukGenisligi * 2;
                    
                    buyut=0;
                } else if (!buyut && cubukGenisligi >= 20) {  // Çubuğu küçültmeyi sınırlayalım.
                    cubukGenisligi = cubukGenisligi /2;
                    
                    buyut=0;
                }
            }
        }
    }
}


const skoruCiz = () => {
    ctx.font = "16px Arial";
    ctx.fillStyle = ballColor;
    ctx.fillText(`Skor: ${skor}`,8,20)
}


const canCiz = () => {
    ctx.font = "16px Arial";
    ctx.fillStyle = "red";
    ctx.fillText(`Can: ${can}`, width-65,20);
}


const oyunuBaslatmaYazisiCiz = () => {
    if(!oyunBasladiMi && !isGameOver){
        ctx.fillStyle = "black";
        ctx.font = "20px Verdena";
        ctx.fillText(`Oyuna başlamak için tıklayın`,width/2 - 100,height/2+50);
        return true; 
    }else{
        return false;
    }
}


oyunuCiz();

const oyunuBaslat = () => {
    if(oyunBasladiMi === false){
        if(isGameOver){
            document.location.reload();
        }else{
            interval = setInterval(oyunuCiz,10);
            oyunBasladiMi = true;
        }        
    }else{
       
        clearInterval(interval);
        oyunBasladiMi = false;

        ctx.fillStyle = "black";
        ctx.font = "20px Verdena";
        ctx.fillText(`Oyun Duraklatıldı`,width/2 - 60,height/2)
    }    
}



// function keydown(e){
//     if(e.key === "Right" || e.key === "ArrowRight"){
//         if(cubukX + 5 > width - cubukGenisligi) return;

//         cubukX += 30;
//     }else if(e.key === "Left" || e.key === "ArrowLeft"){
//         if(cubukX - 5 < 0)
//         return;

//         cubukX -= 30;
//     }}

function fareHareketi(e){

    const fareX = e.clientX - canvas.offsetLeft;

    if (fareX > 0 && fareX < canvas.width - cubukGenisligi) {
        cubukX = fareX;}
    hedefCubukX = e.clientX - canvas.offsetLeft;

}

function cubuguHareketEttir() {
    const hedefMesafe = hedefCubukX - cubukX;
    cubukX += hedefMesafe * interpolasyonHizi;}

