let mailer=require("nodemailer")

async function mailer(mailoptins){
    return new Promise((resolve,reject)=>{
          
    let transport = mailer.createTransport({
        service:"gmail",
        auth: {
            user: "poolking90zeeshan90@gmail.com",
            pass: "gtoxrouqvimucnpo"
        }
    })

    transport.sendMail(mailoptins,(error,info)=>{
        if(error){
            reject(false)
        }
        else{
            resolve(true)
        }
    })
    })
}

module.exports = mailer