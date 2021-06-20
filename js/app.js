const botones = document.querySelector('#botones')
const nombreUsuario = document.querySelector('#nombreUsuario')
const contenidoProtegido = document.querySelector('#contenidoProtegido')
const formulario = document.querySelector('#formulario')
const inputChat = document.querySelector('#inputChat')

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        var uid = user.uid;
        console.log(user)
        botones.innerHTML = /*html*/ `<button class="btn" id="btnCerrarSesion">Cerrar Sesión</button>`
        nombreUsuario.innerHTML = user.displayName

        cerrarSesion()

        contenidoChat(user)
    } else {
        // User is signed out
        console.log('No existe USER')
        botones.innerHTML = /*html*/ `<button class="btn" id="btnAcceder">Acceder</button>`

        iniciarSesion()
        nombreUsuario.innerHTML = 'CHAT'
        contenidoProtegido.innerHTML = /*html*/ `<p class="text">Debes Iniciar Sesión</p>`
        formulario.innerHTML= ''
        formulario.classList = 'forms d-none'
    }
});
  
const contenidoChat = (user) => {
    formulario.classList = 'forms d-block'

    formulario.addEventListener('submit', (e) => {
        e.preventDefault()
        console.log(inputChat.value)

        if(!inputChat.value.trim()){
            console.log('input vacio')
            return
        }

        firebase.firestore().collection('chat').add({
            texto: inputChat.value,
            uid: user.uid,
            fecha: Date.now()
        })

            .then(res => {console.log('mensaje guardado')})
            .catch(e => console.log(e))
        
        inputChat.value = ''
    })

    firebase.firestore().collection('chat').orderBy('fecha')
        .onSnapshot(query => {
            //console.log(query)
            contenidoProtegido.innerHTML = ''
            query.forEach(doc => {
                console.log(doc.data())
                if(doc.data().uid === user.uid){
                    contenidoProtegido.innerHTML += `
                        <div class="text-right">
                            <span>${doc.data().texto}</span>
                        </div>`
                } else{
                    contenidoProtegido.innerHTML += `
                        <div class="text-left">
                            <span>${doc.data().texto}</span>
                        </div>`
                }
            })
        })
}

const cerrarSesion = () => {
    const btnCerrarSesion = document.querySelector('#btnCerrarSesion')
    btnCerrarSesion.addEventListener('click', async() => {
        firebase.auth().signOut()
    })
}

const iniciarSesion = () => {
    const btnAcceder = document.querySelector('#btnAcceder')
    btnAcceder.addEventListener('click', async() => {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            await firebase.auth().signInWithPopup(provider)
        } catch (error) {
            console.log(error)
        }
        })
}
