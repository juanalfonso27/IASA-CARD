document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const updateForm = document.getElementById('updateForm');
    const sellerInfo = document.getElementById('sellerInfo');
    const userIdSelect = document.getElementById('userId');

    const sellers = [
        'TACITO NORO', 'GILBERTO MAUDUCA', 'EVERTON VALEGUSKI', 'ANTONIO CARVALHO', 
        'CLAITON KLEIN', 'DIEGO ARMOA', 'CESAR MELGAREJO', 'GABRIEL MARIANI', 
        'GUSTAVO ROSTIROLA', 'VOUNEI MEINERS', 'JOILSON SEBHEN', 'IGOR LAZZARETI', 
        'CLEUDIR PAVAN', 'IGOR CHEDID', 'VINICIUS MARTINI', 'LUIS CHIOMENTO', 
        'DOLGLAS VERSARI', 'FABIO LOPEZ', 'MARIO CASCO', 'JUAN PICCO', 
        'RODRIGO DOS SANTOS', 'VAGNER ARIANO', 'BRUNO FILIPO', 'JULIO BERGUER', 
        'MARCIO RAIMONDI', 'RAFAEL JUSTEN', 'RONEI LOPEZ', 'VALBER ARIANO', 'juan'
    ];

    if (registerForm) {
        registerForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;
            let users = JSON.parse(localStorage.getItem('users')) || [];
            users.push({ username, password, role, points: 0, balance: 0 });
            localStorage.setItem('users', JSON.stringify(users));
            alert('Usuario registrado con éxito');
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            let users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                localStorage.setItem('loggedInUser', JSON.stringify(user));
                if (user.role === 'admin') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'profile.html';
                }
            } else {
                alert('Credenciales incorrectas');
            }
        });
    }

    if (sellerInfo) {
        let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (loggedInUser && loggedInUser.role === 'vendedor') {
            sellerInfo.textContent = `Nombre: ${loggedInUser.username}, Puntos: ${loggedInUser.points}, Saldo: ${loggedInUser.balance} U$$`;
        } else {
            window.location.href = 'login.html';
        }
    }

    if (updateForm) {
        sellers.forEach(seller => {
            const option = document.createElement('option');
            option.value = seller;
            option.textContent = seller;
            userIdSelect.appendChild(option);
        });

        updateForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const userId = document.getElementById('userId').value;
            const points = document.getElementById('points').value;
            const balance = document.getElementById('balance').value;
            let users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.username === userId);
            if (user) {
                if (points) user.points = parseInt(points);
                if (balance) user.balance = parseFloat(balance);
                localStorage.setItem('users', JSON.stringify(users));
                alert('Datos actualizados con éxito');
            } else {
                alert('Vendedor no encontrado');
            }
        });
    }
});
var (registerForm) {
    registerForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;

        // Registra el usuario en Firebase Authentication
        firebase.auth().createUserWithEmailAndPassword(username + '@example.com', password)
            .then((userCredential) => {
                let user = userCredential.user;
                // Guarda información adicional del usuario en Firebase Realtime Database
                firebase.database().ref('users/' + user.uid).set({
                    username: username,
                    role: role,
                    points: 0,
                    balance: 0
                });
                alert('Usuario registrado con éxito');
            })
            .catch((error) => {
                console.error(error);
                alert('Error al registrar el usuario: ' + error.message);
            });
    });
}
if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        // Autentica el usuario en Firebase Authentication
        firebase.auth().signInWithEmailAndPassword(username + '@example.com', password)
            .then((userCredential) => {
                let user = userCredential.user;
                // Obtiene información adicional del usuario de Firebase Realtime Database
                firebase.database().ref('users/' + user.uid).once('value').then((snapshot) => {
                    let userData = snapshot.val();
                    localStorage.setItem('loggedInUser', JSON.stringify(userData));
                    if (userData.role === 'admin') {
                        window.location.href = 'admin.html';
                    } else {
                        window.location.href = 'profile.html';
                    }
                });
            })
            .catch((error) => {
                console.error(error);
                alert('Credenciales incorrectas: ' + error.message);
            });
    });
}
if (updateForm) {
    sellers.forEach(seller => {
        const option = document.createElement('option');
        option.value = seller;
        option.textContent = seller;
        userIdSelect.appendChild(option);
    });

    updateForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const userId = document.getElementById('userId').value;
        const points = document.getElementById('points').value;
        const balance = document.getElementById('balance').value;

        // Busca el usuario en Firebase Realtime Database y actualiza los datos
        firebase.database().ref('users').orderByChild('username').equalTo(userId).once('value').then((snapshot) => {
            let userKey;
            snapshot.forEach((userSnapshot) => {
                userKey = userSnapshot.key;
            });
            if (userKey) {
                let updates = {};
                if (points) updates['points'] = parseInt(points);
                if (balance) updates['balance'] = parseFloat(balance);
                firebase.database().ref('users/' + userKey).update(updates)
                    .then(() => {
                        alert('Datos actualizados con éxito');
                    })
                    .catch((error) => {
                        console.error(error);
                        alert('Error al actualizar los datos: ' + error.message);
                    });
            } else {
                alert('Vendedor no encontrado');
            }
        });
    });
}
if (sellerInfo) {
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser && loggedInUser.role === 'vendedor') {
        firebase.database().ref('users').orderByChild('username').equalTo(loggedInUser.username).once('value').then((snapshot) => {
            let userData;
            snapshot.forEach((userSnapshot) => {
                userData = userSnapshot.val();
            });
            if (userData) {
                sellerInfo.textContent = `Nombre: ${userData.username}, Puntos: ${userData.points}, Saldo: ${userData.balance} U$$`;
            } else {
                window.location.href = 'login.html';
            }
        });
    } else {
        window.location.href = 'login.html';
    }
}

