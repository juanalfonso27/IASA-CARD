document.addEventListener("DOMContentLoaded", function () {
    var firebaseConfig = {
        apiKey: "AIzaSyBg4uHr_uKYRGmpB3zes1igDf6KyQkSzYc",
        authDomain: "http://iasa-card.firebaseapp.com/",
        databaseURL: "https://iasa-card-default-rtdb.firebaseio.com/",
        projectId: "iasa-card",
        storageBucket: "http://iasa-card.appspot.com/",
        messagingSenderId: "627008706195",
        appId: "1:627008706195:web:ac3fcee336e094903c1f66",
    };

    firebase.initializeApp(firebaseConfig);


    const sellerName = document.getElementById("sellerName");
    const sellerPoints = document.getElementById("sellerPoints");
    const sellerBalance = document.getElementById("sellerBalance");
    const sellerInfo = document.getElementById("sellerInfo");
    const userNameSelect = document.getElementById("username");

    $("#registerForm").submit(function (event) {
        event.preventDefault();
        console.log("enviando datos");

        let username = $("#username").val();
        let password = $("#password").val();
        let role = $("#role").val();

        // Expresión regular para validar al menos 3 números en la contraseña
        let passwordRegex = /(?=(.*\d){3})/;

        if (!passwordRegex.test(password)) {
            alert("La contraseña debe contener al menos 3 números.");
            return;
        }

        firebase
            .auth()
            .createUserWithEmailAndPassword(username + "@example.com", password)
            .then((userCredential) => {
                let user = userCredential.user;
                firebase
                    .database()
                    .ref("usuarios/" + user.uid)
                    .set({
                        username: username,
                        role: role,
                        points: 0,
                        balance: 0,
                    });
                alert("Usuario registrado con éxito");
            })
            .catch((error) => {
                console.error(error);
                alert("Error al registrar el usuario: " + error.message);
            });
    });

    $("#loginForm").submit(function (event) {
        event.preventDefault();
        console.log("enviando datos login");

        let username = $("#loginUsername").val();
        let password = $("#loginPassword").val();

        firebase.auth().signInWithEmailAndPassword(username + "@example.com", password)
            .then((userCredential) => {
                let user = userCredential.user;

                console.log(user.uid)
                firebase
                    .database()
                    .ref("usuarios/" + user.uid)
                    .once("value")
                    .then((snapshot) => {
                        let userData = snapshot.val();
                        console.log("Rol: ", userData.role);

                        if (userData && userData.role === "admin") {
                            window.location.href = "admin.html";
                        } else {
                            window.location.href = "profile.html";
                        }
                    });
            })
            .catch((error) => {
                console.error(error);
                alert("Credenciales incorrectas: " + error.message);
            });
    });

    function getVendedores() {
        firebase
            .database()
            .ref("usuarios/")
            .orderByChild("role")
            .equalTo("vendedor")
            .once("value")
            .then((snapshot) => {
                snapshot.forEach((childSnapshot) => {
                    const userData = childSnapshot.val();
                    console.log(userData)
                    const option = document.createElement("option");
                    option.value = userData.username;
                    option.textContent = userData.username;
                    userNameSelect.appendChild(option);
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    getVendedores();

    $("#updateForm").submit(function (event) {
        event.preventDefault();
        console.log("enviando datos update");

        let username = $("#username").val();
        let points = $("#points").val();
        let balance = $("#balance").val();

        firebase
            .database()
            .ref("usuarios/")
            .orderByChild("username")
            .equalTo(username)
            .once("value")
            .then((snapshot) => {
                let userKey;
                snapshot.forEach((userSnapshot) => {
                    userKey = userSnapshot.key;
                });
                if (userKey) {
                    let updates = {};
                    if (points) updates["points"] = parseInt(points);
                    if (balance) updates["balance"] = parseFloat(balance);
                    firebase
                        .database()
                        .ref("usuarios/" + userKey)
                        .update(updates)
                        .then(() => {
                            alert("Datos actualizados con éxito");
                        })
                        .catch((error) => {
                            console.error(error);
                            alert("Error al actualizar los datos: " + error.message);
                        });
                } else {
                    alert("Vendedor no encontrado");
                }
            });
    });

    if (sellerInfo) {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                firebase
                    .database()
                    .ref("usuarios/" + user.uid)
                    .once("value")
                    .then((snapshot) => {
                        let userData = snapshot.val();
                        if (userData && userData.role === "vendedor") {
                            sellerName.textContent = userData.username;
                            sellerPoints.textContent = userData.points;
                            sellerBalance.textContent = userData.balance;
                        } else {
                            window.location.href = "login.html";
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        alert(
                            "Error al obtener la información del usuario: " +
                                error.message
                        );
                    });
            } else {
                window.location.href = "login.html";
            }
        });
    }
});
